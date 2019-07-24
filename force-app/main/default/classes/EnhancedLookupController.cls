public class EnhancedLookupController 
{
	@AuraEnabled
    public static Map<String, Map<String, Object>> getEnhancedLookupDetails(String objectAPI, String lookupFieldAPI, String lookupObjectAPI, String lookupObjectFieldAPI, String recordId)
    {
		Map<String,Map<String,Object>> detailsMap = new Map<String,Map<String,Object>>();
		
        if(!String.isEmpty(objectAPI) && 
           !String.isEmpty(lookupObjectAPI) && 
           !String.isEmpty(lookupFieldAPI))
        {
            /* Fetching Lookup Field Selected Value */
            sObject record = getLookupSelectedValue(objectAPI, lookupFieldAPI, recordId);
            
            /* START: Fetching Lookup Field Details */
            Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
            Schema.SObjectType leadSchema = schemaMap.get(objectAPI);
            Map<String, Schema.SObjectField> fieldMap = leadSchema.getDescribe().fields.getMap();	
            
            for (String fieldName: fieldMap.keySet()) 
            {
                //System.debug('fieldName: '+fieldName);
                if(fieldName.equalsIgnoreCase(lookupFieldAPI))
                {
                    Schema.DescribeFieldResult fieldDetails = fieldMap.get(fieldName).getDescribe(); 
                    
                    Map<String,Object> description = new Map<String,Object>();
                    description.put('label', fieldDetails.getLabel());
                    description.put('helptext', fieldDetails.getInlineHelpText());
                    description.put('required', (fieldDetails.isNillable() == false ? 'true' : 'false'));
                    description.put('type', String.valueOf(fieldDetails.getType()));                
                    
                    if(record != null)
                    {
                        //System.debug('record.get(fieldName): '+record.get(fieldName));
                    	description.put('value', record.get(fieldName));
                    }
                    
                    if(fieldName.equalsIgnoreCase(lookupFieldAPI))
                    {
                        //List<Object> valueList = getLookupValues(lookupObjectAPI, 'Name');
                        List<Object> valueList = getLookupValues(lookupObjectAPI, lookupObjectFieldAPI);
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
    
    public static sObject getLookupSelectedValue(String objectAPI, String lookupFieldAPI, String recordId)
    {        
        List<sObject> records = Database.query('SELECT '+lookupFieldAPI+' FROM '+objectAPI+' WHERE Id = :recordId');
        System.debug('records: '+JSON.serialize(records));
        if(records.size() > 0) 
        {
           	return records[0];
       	}
        return null;
    }   
    
    public static List<Object> getLookupValues(String lookupObjectAPI, String lookupFieldAPI)
    {
        List<Object> valueList = new List<Object>();
        
        List<sObject> records = Database.query('SELECT Id, '+lookupFieldAPI+' FROM '+lookupObjectAPI);
        if(records.size() > 0) 
        {
            for(sObject record : records)
            {
                Map<String,Object> valueMap = new Map<String,Object>();
                valueMap.put('id', record.get('Id'));
                valueMap.put('value', record.get(lookupFieldAPI));
                valueList.add(valueMap);
            }
        }
        
        return valueList;
    } 
}