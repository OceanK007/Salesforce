public interface MultiSelectLookup 
{
	Map<Id, String> selectedRecords(String objectAPIName, String lookupObjectAPIName, Id recordId, String linkedRecordsAPIName, String filterFieldAPIName);
   	Map<Id, String> searchRecords(String lookupObjectAPIName,String searchKeyword, String searchFieldAPINames, String filterFieldAPIName, String excludedIds);
}