public class MultiSelectLookupImplementation implements MultiSelectLookup 
{
	public Map<Id, String> selectedRecords(String objectAPIName, String lookupObjectAPIName, Id recordId, String linkedRecordsAPIName, String filterFieldAPIName)
    {
     	Map<Id,String> result = new Map<Id,String>();
        String sQuery = 'SELECT '+ linkedRecordsAPIName + ' FROM '+ objectAPIName + ' WHERE Id = :recordId';
        List<sObject> records = Database.query(sQuery);
        
        List<String> recordIdList = new List<string>();
        String recordIds = (String) records[0].get(linkedRecordsAPIName);
        if(!String.isEmpty(recordIds))
        for(String s : recordIds.split(','))
        {
            recordIdList.add(s.trim());
        }
        
        String query = 'SELECT Id, '+filterFieldAPIName + ' FROM ' + lookupObjectAPIName + ' WHERE id IN :recordIdList';
        List <sObject> lstOfRecords = Database.query(query);
       
        for(sObject sobj :lstOfRecords)
        {
           result.put((Id)sobj.get('Id') ,(String)sobj.get(filterFieldAPIName));
        }
       	
        System.debug('MultiSelectLookupImplementation -> selectedRecords: '+JSON.serialize(result));
    	return result; 
    }
    
   	public Map<Id, String> searchRecords(String lookupObjectAPIName, String searchKeyword, String searchFieldAPINames, String filterFieldAPIName, String excludedIds)
    {
		List<String> lstExcludeitems = new List<string>();
        
       	if(!String.isEmpty(excludedIds))
        for(String s : excludedIds.split(','))
        {
            lstExcludeitems.add(s.trim());
        }
       
        // Why we need searchFieldAPINames?
        // It's just because in case you have duplicate records and you are unable to fetch unique records using SOQL, 
        // then you can use searchFieldAPINames to filter unique records in apex code.
        Map<Id,String> searchResults = new Map<Id,String>();
       	String sQuery='SELECT Id, ' + searchFieldAPINames + ' FROM ' + lookupObjectAPIName + ' WHERE '+ filterFieldAPIName +' Like ' + '\'%' +searchKeyword + '%\'' + ' AND Id NOT IN :lstExcludeitems';
       	List <sObject> lstOfRecords = Database.query(sQuery);
       
        for(sObject sobj :lstOfRecords )
        {
           searchResults.put((Id)sobj.get('Id') ,(String)sobj.get(filterFieldAPIName));
        }
       	
        System.debug('MultiSelectLookupImplementation -> searchRecords: '+JSON.serialize(searchResults));
       	return searchResults; 
    }
}