public with sharing class LoggerSettingConfiguratorController
{
	 /*******************************************************************************************************
     * @description Fetch Logger Custom Settings Labels    
     * @return Label, helptext and required fields from MedDRA custom settings        
     * @example    
     * LoggerSettingConfiguratorController.getLabels();
     */
    @AuraEnabled
    public static Map<String,Map<String,String>> getLabels() 
    {
        Map<String,Map<String,String>> descriptionMap = new Map<String,Map<String,String>>();
        String labelText = null;
        String helpText = null;
        Boolean isNillable = true;

        Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
        Schema.SObjectType leadSchema = schemaMap.get('ivpcc__Logger_Settings__c');
        Map<String, Schema.SObjectField> fieldMap = leadSchema.getDescribe().fields.getMap();	// returns all fields    

        for (String fieldName: fieldMap.keySet()) 
        {
            Schema.DescribeFieldResult fieldDetails = fieldMap.get(fieldName).getDescribe(); 
            labelText = fieldDetails.getLabel();
            helpText = fieldDetails.getInlineHelpText();
            isNillable = fieldDetails.isNillable();
            Map<String,String> description = new Map<String,String>();
            description.put('label', labelText);
            description.put('helptext', helpText);
            description.put('required', (isNillable == false ? 'true' : 'false'));
			descriptionMap.put(fieldName, description);
        }

        return descriptionMap;
    }
    
    /*******************************************************************************************************
     * @description Fetch Logger Custom Setting Data For Organization Hierarchy 
     * @return Logger Setting Object    
     * @example    
     * LoggerSettingConfiguratorController.getLoggerSettingsForOrganization();
     */    
    @AuraEnabled
    public static ivpcc__Logger_Settings__c getLoggerSettingsForOrganization()
    {   
		ivpcc__Logger_Settings__c record = ivpcc__Logger_Settings__c.getValues(UserInfo.getOrganizationId());
        
        if(record != null)
        {
        	return record;
        }
        else
        {
            return new ivpcc__Logger_Settings__c(SetupOwnerId= UserInfo.getOrganizationId(),
                                                 ivpcc__Log_Levels__c= 'NONE');          
        }
    }
    
     /*******************************************************************************************************
     * @description Fetch Logger Custom Setting Data For Profile and User Hierarchy 
     * @return Logger Setting Object    
     * @example    
     * LoggerSettingConfiguratorController.getLoggerSettingsForProfileAndUser();
     */  
    @AuraEnabled
    public static Map<String, Map<String, String>> getLoggerSettingsForProfileAndUser()
    {   
        Map<String, Profile> profileMap = new Map<String, Profile>();
        Map<String, User> userMap = new Map<String, User>();
        Map<String, Map<String, String>> records = new Map<String, Map<String, String>>();
       
        
		List<ivpcc__Logger_Settings__c> loggers = new List<ivpcc__Logger_Settings__c>([SELECT  Id, 
                		SetupOwnerId,
                        Name,
                        ivpcc__Buffer_Heap_For_Log_Content_Creation__c, 
                		ivpcc__Log_Levels__c, 
                		ivpcc__Max_Heap_Allocated_For_Logger__c, 
                		ivpcc__Max_Log_Capture_Size__c 
                		FROM ivpcc__Logger_Settings__c WHERE SetupOwnerId != :UserInfo.getOrganizationId()]);
        
        List<Profile> profiles = getProfiles();
        List<User> users = getUsers();
        
        for(Profile profile : profiles)
        {
            profileMap.put(profile.Id, profile);
        }
        
        for(User user : users) 
        {
            userMap.put(user.Id, user);
        }
        
        for(ivpcc__Logger_Settings__c logger : loggers)
        {
            Map<String, String> loggerData = setLoggerSettingDetails(logger, profileMap, userMap);
            
            records.put(logger.Id, loggerData);
        }
        
		return records;
    }
    
    /*******************************************************************************************************
     * @description Fetching All available Profiles
     * @return List of Profile   
     * @example    
     * LoggerSettingConfiguratorController.getProfiles();
     */  
    @AuraEnabled
    public static List<Profile> getProfiles()
    {
        List<Profile> profileList = new List<Profile>([Select Id, Name from Profile]);
        return profileList;
    }
    
    /*******************************************************************************************************
     * @description Fetching All available Users
     * @return List of User   
     * @example    
     * LoggerSettingConfiguratorController.getUsers();
     */  
    @AuraEnabled
    public static List<User> getUsers()
    {
        List<User> userList = new List<User>([Select Id, Name from User]);
        return userList;
    }
    
     /*******************************************************************************************************
     * @description Fetch Logger custom setting Record    
     * @return Updated Logger custom setting record
     * @param record Logger custom setting record
     * @example    
	 * LoggerSettingConfiguratorController.upsertLoggerSettingsRecord({"Id":"a071F000002OPbSQAW","SetupOwnerId":"00D1F000000EQEfUAO","ivpcc__Buffer_Heap_For_Log_Content_Creation__c":1,"ivpcc__Log_Levels__c":"NONE","ivpcc__Max_Heap_Allocated_For_Logger__c":1,"ivpcc__Max_Log_Capture_Size__c":1});
     */
    @AuraEnabled
    public static Object upsertLoggerSettingsRecord(ivpcc__Logger_Settings__c record) 
    {
       	try
        {
            Map<String, Profile> profileMap = new Map<String, Profile>();
            Map<String, User> userMap = new Map<String, User>();
            
            List<Profile> profiles = getProfiles();
            List<User> users = getUsers();
            
            for(Profile profile : profiles)
            {
                profileMap.put(profile.Id, profile);
            }
            
            for(User user : users) 
            {
                userMap.put(user.Id, user);
            }
             
            System.debug('SetupOwnerId: '+String.escapeSingleQuotes(record.SetupOwnerId));
            if(record.SetupOwnerId != null && String.escapeSingleQuotes(record.SetupOwnerId) != '')
            {
                System.debug('Record: '+JSON.serialize(record));           
                
                ivpcc__Logger_Settings__c newRecord = new ivpcc__Logger_Settings__c();
                if(String.escapeSingleQuotes(record.Id) != '')
                {
                    System.debug('if(record.Id != null) == true');
					newRecord.Id = record.Id;
                }
                else
                {
                    List<ivpcc__Logger_Settings__c> existingRecords = new List<ivpcc__Logger_Settings__c>([SELECT  Id
                												  FROM ivpcc__Logger_Settings__c WHERE SetupOwnerId = :record.SetupOwnerId]);
                    if(existingRecords.size() != 0)
                    {
                        throw new DmlException('Duplicate record found: SetupOwnerId duplicates value');
                    }   
                }
                
			    newRecord.SetupOwnerId = record.SetupOwnerId;
                newRecord.ivpcc__Buffer_Heap_For_Log_Content_Creation__c = record.ivpcc__Buffer_Heap_For_Log_Content_Creation__c;
                newRecord.ivpcc__Log_Levels__c = record.ivpcc__Log_Levels__c;
                newRecord.ivpcc__Max_Heap_Allocated_For_Logger__c = record.ivpcc__Max_Heap_Allocated_For_Logger__c;
                newRecord.ivpcc__Max_Log_Capture_Size__c = record.ivpcc__Max_Log_Capture_Size__c;
                
                upsert newRecord;
                System.debug('newRecord.Id: '+newRecord.Id);
                System.debug('newRecord: '+JSON.serialize(newRecord));
                ivpcc__Logger_Settings__c loggerInstance = ivpcc__Logger_Settings__c.getInstance(record.SetupOwnerId);
                System.debug(JSON.serialize(loggerInstance));
                Map<String, String> loggerDataMap = setLoggerSettingDetails(loggerInstance, profileMap, userMap);                
                return loggerDataMap; 
            }
            else
            {                
                upsert record;                   
                return record;    
            }
        }
        catch(Exception ex)
        {            
            throw ex;
        }
    }
    
    /*******************************************************************************************************
     * @description Fetch Logger custom setting Record    
     * @return Updated Logger custom setting record
     * @param record Logger custom setting record
     * @example    
	 * LoggerSettingConfiguratorController.setLoggerSettingDetails({"Id":"a071F000002OPbSQAW","SetupOwnerId":"00D1F000000EQEfUAO","ivpcc__Buffer_Heap_For_Log_Content_Creation__c":1,"ivpcc__Log_Levels__c":"NONE","ivpcc__Max_Heap_Allocated_For_Logger__c":1,"ivpcc__Max_Log_Capture_Size__c":1});
     */
    private static Map<String, String> setLoggerSettingDetails(ivpcc__Logger_Settings__c logger, Map<String, Profile> profileMap, Map<String, User> userMap)
    {
        Map<String, String> loggerData = new Map<String, String>();
        loggerData.put('Id', logger.Id);
        loggerData.put('SetupOwnerId', logger.SetupOwnerId);
        loggerData.put('Name', (logger.Name.containsIgnoreCase('profile') ? 'Profile' : 'User'));
        loggerData.put('ivpcc__Buffer_Heap_For_Log_Content_Creation__c', String.valueOf(logger.ivpcc__Buffer_Heap_For_Log_Content_Creation__c));
        loggerData.put('ivpcc__Log_Levels__c', logger.ivpcc__Log_Levels__c);
        loggerData.put('ivpcc__Max_Heap_Allocated_For_Logger__c', String.valueOf(logger.ivpcc__Max_Heap_Allocated_For_Logger__c));
        loggerData.put('ivpcc__Max_Log_Capture_Size__c', String.valueOf(logger.ivpcc__Max_Log_Capture_Size__c));
        if(logger.Name.containsIgnoreCase('profile'))
        {
            loggerData.put('SetupOwner',profileMap.get(logger.SetupOwnerId).Name);
        } 
        else if (logger.Name.containsIgnoreCase('user'))
        {
            loggerData.put('SetupOwner',userMap.get(logger.SetupOwnerId).Name);
        }
                
        return loggerData;
    }
    
    /*******************************************************************************************************
     * @description Delete Logger custom setting Record    
     * @param Logger custom setting record Id
     * @example    
	 * LoggerSettingConfiguratorController.deleteLoggerSettingRecordById("a071F000002OPbSQAW");
     */
    @AuraEnabled
    public static void deleteLoggerSettingRecordById(String loggerRecordId)
    {
        try
        {
            ivpcc__Logger_Settings__c recordWithId = new ivpcc__Logger_Settings__c(Id= loggerRecordId);
            delete recordWithId;
        }
        catch(Exception ex)
        {
            throw ex;
        }
    }
    
    /*******************************************************************************************************
     * @description Delete Logger custom setting Record  
     * @return Map containing details of Lookup Record  
     * @param Logger custom setting record Id
     * @example    
	 * LookupController.getLookupDetailsForObject('{"objectAPIName" : "Profile", "searchFieldAPIName" : "Name","displayColumnsAPINames" : "Name","searchKeyword" : null, "searchOrder" : "Desc", "queryOffset" : 0 , "queryLimit" : 10 , "orderByFieldAPI": "CreatedDate"}');
     */
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
                ResponseWrapper responseWrapper = getLoggerRecordsBySearchParameters(inputParameters);
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
    
    /*******************************************************************************************************
     * @description Fetch Logger custom setting Record    
     * @return Updated Logger custom setting record
     * @param record Logger custom setting record
     * @example    
	 * LoggerSettingConfiguratorController.getLoggerRecordsBySearchParameters({"Id":"a071F000002OPbSQAW","SetupOwnerId":"00D1F000000EQEfUAO","ivpcc__Buffer_Heap_For_Log_Content_Creation__c":1,"ivpcc__Log_Levels__c":"NONE","ivpcc__Max_Heap_Allocated_For_Logger__c":1,"ivpcc__Max_Log_Capture_Size__c":1});
     */
    @AuraEnabled
    public static ResponseWrapper getLoggerRecordsBySearchParameters(String inputParameters)
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