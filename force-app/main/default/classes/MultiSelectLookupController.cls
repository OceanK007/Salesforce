public class MultiSelectLookupController 
{
    // MultiSelectLookupController.searchLinkedRecords('Account', 'New', 'Name', 'Name', null, 'MultiSelectLookupImplementation');
	@AuraEnabled
    public static Map<String,Object> searchLinkedRecords(String lookupObjectAPIName, String searchKeyword, String searchFieldAPINames, String filterFieldAPIName, String excludedIds, String multiSelectLookupClass)
    {
    	Map<String,Object> details = new Map<String,Object>{'multiselectResults' => new Map<Id,String>()};
        try
        {
            Type classType = Type.forName(multiSelectLookupClass);
            MultiSelectLookup multiSelectLookupInstance = (MultiSelectLookup) classType.newInstance();
            
            details.put('multiselectResults',multiSelectLookupInstance.searchRecords(lookupObjectAPIName, searchKeyword, searchFieldAPINames, filterFieldAPIName, excludedIds));
        }
        catch(Exception e) 
        {
            System.debug(e.getMessage());
        }  
        
        System.debug('MultiSelectLookupController -> searchLinkedRecords: '+JSON.serialize(details));
        return details;
	}
    
    //MultiSelectLookupController.getMultiSelectLookupConfigurationDetails();
    @AuraEnabled
	public static List<MultiSelect_Lookup_Configuration__mdt> getMultiSelectLookupConfigurationDetails()
    {
        List<MultiSelect_Lookup_Configuration__mdt> result = [SELECT Id, Filter_Field_API_Name__c, Linked_Records_API_Name__c, Lookup_Object_API_Name__c, MultiSelect_Lookup_Class__c, Object_API_Name__c, Search_Field_API_Names__c FROM MultiSelect_Lookup_Configuration__mdt];
		System.debug('MultiSelectLookupController -> getMultiSelectLookupConfigurationDetails: '+ JSON.serialize(result));        
        return result;
    }
    
    //MultiSelectLookupController.getSelectedRecords('Contact', 'Account', '0030o00002i6UmRAAU', 'Account_Numbers__c', 'Name', 'MultiSelectLookupImplementation');
    @AuraEnabled
    public static Map<String,Object> getSelectedRecords(String objectAPIName, String lookupObjectAPIName, Id recordId, String linkedRecordsAPIName, String filterFieldAPIName, String multiSelectLookupClass)
    {
        Map<String,Object> details = new Map<String,Object>{'multiselectResults' => new Map<Id,String>()};
        try
        {
            Type classType = Type.forName(multiSelectLookupClass);
            MultiSelectLookup multiSelectLookupInstance = (MultiSelectLookup) classType.newInstance();
            
            details.put('multiselectResults',multiSelectLookupInstance.selectedRecords(objectAPIName, lookupObjectAPIName, recordId, linkedRecordsAPIName, filterFieldAPIName));
        }
        catch(Exception e) 
        {
            System.debug(e.getMessage());
        }  
        
        System.debug('MultiSelectLookupController -> searchLinkedRecords: '+JSON.serialize(details));
        return details;
    }
}