/**
* @author Sapient
* @date 6/17/2019
* @description Contains all services required for the ComboBox
* @group ComboBox Service
*/
public with sharing class CombinationUnitFieldController 
{
    @AuraEnabled
    public static Map<String, Map<String, Object>> getCombinationUnitDetails(String combinationUnitInputObjectAPI, String combinationUnitInputFieldAPI, String combinationUnitLookupFieldAPI, String combinationUnitLookupObjectAPI, String recordId)
    {
		Map<String,Map<String,Object>> detailsMap = new Map<String,Map<String,Object>>();
		
        if(!String.isEmpty(combinationUnitInputObjectAPI) && 
           !String.isEmpty(combinationUnitInputFieldAPI) && 
           !String.isEmpty(combinationUnitLookupObjectAPI) && 
           !String.isEmpty(combinationUnitLookupFieldAPI))
        {
            /* Fetching ComboBox Object Field Values */
            sObject record = getCombinationUnitObjectFieldValues(combinationUnitInputObjectAPI, combinationUnitInputFieldAPI, combinationUnitLookupFieldAPI, recordId);
            
            /* START: Fetching ComboBox Fields Details */
            Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
            Schema.SObjectType leadSchema = schemaMap.get(combinationUnitInputObjectAPI);
            Map<String, Schema.SObjectField> fieldMap = leadSchema.getDescribe().fields.getMap();	
            
            for (String fieldName: fieldMap.keySet()) 
            {
                System.debug('fieldName: '+fieldName);
                if(fieldName.equalsIgnoreCase(combinationUnitInputFieldAPI) || fieldName.equalsIgnoreCase(combinationUnitLookupFieldAPI))
                {
                    Schema.DescribeFieldResult fieldDetails = fieldMap.get(fieldName).getDescribe(); 
                    
                    Map<String,Object> description = new Map<String,Object>();
                    description.put('label', fieldDetails.getLabel());
                    description.put('helptext', fieldDetails.getInlineHelpText());
                    description.put('required', (fieldDetails.isNillable() == false ? 'true' : 'false'));
                    description.put('type', String.valueOf(fieldDetails.getType()));                
                    
                    if(record != null)
                    {
                    	description.put('value', record.get(fieldName));
                    }
                    
                    if(fieldName.equalsIgnoreCase(combinationUnitLookupFieldAPI))
                    {
                        List<Object> valueList = getCombinationUnitLookupFieldValues(combinationUnitLookupObjectAPI, 'Name');
                        description.put('availableValues', valueList);
                    }
                    
                    detailsMap.put(fieldName, description);
                }
            }         
            /* END: Fetching ComboBox Field Details */ 
        } 
        
        System.debug('Data: '+JSON.serialize(detailsMap));
        return detailsMap;
    }
    
    public static sObject getCombinationUnitObjectFieldValues(String combinationUnitInputObjectAPI, String combinationUnitInputFieldAPI, String combinationUnitLookupFieldAPI, String recordId)
    {        
        List<sObject> records = Database.query('SELECT '+combinationUnitInputFieldAPI+','+combinationUnitLookupFieldAPI+' FROM '+combinationUnitInputObjectAPI+' WHERE Id = :recordId');
        if(records.size() > 0) 
        {
           	return records[0];
       	}
        return null;
    }   
    
    public static List<Object> getCombinationUnitLookupFieldValues(String combinationUnitLookupObjectAPI, String combinationUnitLookupFieldAPI)
    {
        List<Object> valueList = new List<Object>();
        
        List<sObject> records = Database.query('SELECT Id, '+combinationUnitLookupFieldAPI+' FROM '+combinationUnitLookupObjectAPI);
        if(records.size() > 0) 
        {
            for(sObject record : records)
            {
                Map<String,Object> valueMap = new Map<String,Object>();
                valueMap.put('id', record.get('Id'));
                valueMap.put('value', record.get(combinationUnitLookupFieldAPI));
                valueList.add(valueMap);
            }
        }
        
        return valueList;
    } 
}