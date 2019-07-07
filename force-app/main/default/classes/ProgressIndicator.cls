public class ProgressIndicator 
{
    @AuraEnabled
	public static Map<String, Object> getProgressSteps(String objectAPIName, String fieldAPIName, String recordId)
    {
        System.debug('Hi');
        Map<String, Object> result = new Map<String, Object>();
        Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
        Schema.SObjectType objectSchema = schemaMap.get(objectAPIName);
        //Schema.DescribeSObjectResult objectDescribe = objectSchema.getDescribe();
        //Map<Id,Schema.RecordTypeInfo> recordTypeInfo = objectDescribe.getRecordTypeInfosById();
		//Schema.RecordTypeInfo recordById =  recordTypeInfo.get(recordId);
        
        Map<String, Schema.SObjectField> fieldMap = objectSchema.getDescribe().fields.getMap();	
        Map<String, String> pickListValueMap = new Map<String, String>();
        String activeRecordValue = '';
        
        for (String fieldName: fieldMap.keySet()) 
        {
            //System.debug('fieldName: '+fieldName);
            if(fieldName.equalsIgnoreCase(fieldAPIName))
            {
                Schema.DescribeFieldResult fieldDetails = fieldMap.get(fieldName).getDescribe();
                List<Schema.PicklistEntry> ple = fieldDetails.getPicklistValues();
                for( Schema.PicklistEntry pickListVal : ple)
                {
                    pickListValueMap.put(pickListVal.getValue(), pickListVal.getLabel());
                }    
            }
        }
        
        System.debug('pickListValueMap: '+JSON.serialize(pickListValueMap));
        
        List<sObject> records = Database.query('SELECT '+fieldAPIName+' FROM '+objectAPIName+' WHERE Id = :recordId');
        if(records.size() > 0) 
        {
            sObject record = records[0];
            activeRecordValue = (String)record.get(fieldAPIName);
            System.debug('Record: '+JSON.serialize(record));
            System.debug('activeRecordValue: '+activeRecordValue);
        }
        
        result.put('values', pickListValueMap);
        result.put('activeValue', activeRecordValue);
        
        return result;
    }
    
}