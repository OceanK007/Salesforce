public with sharing class LookupController 
{
    // LookupController.getLookupDetailsForObject('{"objectAPIName" : "Profile", "searchFieldAPIName" : "Name","displayColumnsAPINames" : "Name","searchKeyword" : null, "searchOrder" : "Desc", "queryOffset" : 0 , "queryLimit" : 10 , "orderByFieldAPI": "CreatedDate"}');
	@AuraEnabled
    public static Map<String, Object> getLookupDetailsForObject(String inputParameters)
    {
        try
        {
            Object requestObj = (Object) JSON.deserializeUntyped(inputParameters);
            Map<String, Object> queryParameters = (Map<String, Object>) requestObj;
            
            Map<String, Object> result = new Map<String, Object>();
            Map<String, String> fieldAPIMap = new Map<String, String>();
            
            Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
            Schema.SObjectType leadSchema = schemaMap.get((String)queryParameters.get('objectAPIName'));
            Map<String, Schema.SObjectField> fieldMap = leadSchema.getDescribe().fields.getMap(); 
            
            result.put('objectName', leadSchema.getDescribe().getLabel());
            result.put('objectLabel', leadSchema.getDescribe().getLabel() + ' Name');
            result.put('objectModalLabel', leadSchema.getDescribe().getLabel()+ ' Results');
            
            if((queryParameters.containsKey('objectAPIName')) && 
               (queryParameters.containsKey('searchFieldAPIName')) && 
               (queryParameters.containsKey('displayColumnsAPINames')))
            {
                // Adding field-api as key and field-label as value
                fieldAPIMap.put('Id', fieldMap.get('Id').getDescribe().getLabel());
                List<String> fieldAPIList = ((String)queryParameters.get('displayColumnsAPINames')).split(',');
                for(String fieldAPI : fieldAPIList)
                {
                    Schema.SObjectField mapValue = fieldMap.get(fieldAPI);
                    if(mapValue != null)
                    {
                        Schema.DescribeFieldResult fieldDetails = mapValue.getDescribe();
                        fieldAPIMap.put(fieldAPI, fieldDetails.getLabel());
                    }  
                }
                result.put('fields', fieldAPIMap);
                
                // Adding 10 recently created records of objects   
                ResponseWrapper responseWrapper = getRecords(inputParameters);
                result.put('recentRecords', responseWrapper.recordList);
            }        
            
            System.debug('Result: '+JSON.serialize(result));
            
            return result;
        }
        catch(Exception ex)
        {
            throw ex;
        }
    }
    
    @AuraEnabled
    public static ResponseWrapper getRecords(String inputParameters)
    {        
        Object requestObj = (Object)JSON.deserializeUntyped(inputParameters);
        Map<String,Object> queryParameters = (Map<String,Object>) requestObj;
        ResponseWrapper response = new ResponseWrapper ();
        List <SObject> lstOfRecords = new list<SObject>();
        String queryStr='';
        String countQueryStr='';
        // Can't use SOSL : reason search will happen on all fields or group by name fields.
        try
        {
            if((queryParameters.containsKey('objectAPIName')) && 
               (queryParameters.containsKey('searchFieldAPIName')) && 
               (queryParameters.containsKey('displayColumnsAPINames')))
            {
                String searchKey = (queryParameters.get('searchKeyword') != null) ? String.escapeSingleQuotes(((string)queryParameters.get('searchKeyword')).trim()) : '' ;
                String searchOrder = (queryParameters.get('searchOrder') != null) ? (string)queryParameters.get('searchOrder') : 'DESC' ;
                string orderByFieldAPI = (queryParameters.get('orderByFieldAPI') != null) ? (string)queryParameters.get('orderByFieldAPI') : 'CreatedDate' ;
                
                queryStr = 'select id '+ ','+ (queryParameters.get('displayColumnsAPINames')) + ' from ' + queryParameters.get('objectAPIName') + ' where ' + queryParameters.get('searchFieldAPIName') +' LIKE \'%'+String.escapeSingleQuotes(searchKey)+'%\' order by '+ orderByFieldAPI + ' ' +searchorder +' limit ' +  queryParameters.get('queryLimit') +' OFFSET '+ queryParameters.get('queryOffset') ;
                countQueryStr = 'select COUNT() from ' + queryParameters.get('objectAPIName') + ' where ' + queryParameters.get('searchFieldAPIName') +' LIKE \'%'+String.escapeSingleQuotes(searchKey)+'%\'';
                  
                System.debug('queryStr: '+queryStr);
                                       
                response.totalRecords = Database.countQuery(countQueryStr);
                
                if(response.totalRecords > 0)
                {
                    lstOfRecords = Database.query(queryStr); 
                    
                    if(!lstOfRecords.isEmpty())
                    {
                        response.recordList= lstOfRecords;    
                    } 
                    else 
                    {
                        response.isNoResults = true;   
                        response.errorMessage = 'No data to display' ; 
                    } 
                }                           
            }
            else
            {
                response.isError = true;
                response.errorMessage = 'Error: '+'Parameters Issue objectAPIName, searchFieldAPIName, and displayColumnsAPINames';
                response.isNoResults = true;
            }
        }
        catch(system.Exception ex)
        {
            response.isError = true;
            response.errorMessage = 'Error: '+ex.getMessage() + ' -- ' + ex.getStackTraceString() ; 
            response.isNoResults = true;
        }
               
        return response;
    }   
    

    public class ResponseWrapper 
    { 
        @AuraEnabled
        public List <sObject> recordList;
        @AuraEnabled
        public Boolean isNoResults;
        @AuraEnabled
        public Boolean isError;
        @AuraEnabled
        public String errorMessage;
         @AuraEnabled
        public Integer totalRecords = 0;

        public responseWrapper()
        {
            this.recordList= new List <sObject>();
            this.isNoResults = false;
            this.isError = false;
        }
    }  
}