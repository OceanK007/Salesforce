({
	searchWithKeyword : function(component,event,searchKeyword) 
    {   
        var multiSelectSetupConfiguration = component.get("v.multiSelectSetupConfiguration");
        
        var selectedRecords = component.get("v.selectedRecords");
        var selectedRecordIds = '';
        selectedRecords.forEach(function(arrayItem) 
		{
        	selectedRecordIds = selectedRecordIds + arrayItem.key + ',';
        });
        //console.log('selectedRecordIds: '+selectedRecordIds.substring(0,selectedRecordIds.length-1));
        if(selectedRecordIds != '')
            selectedRecordIds = selectedRecordIds.substring(0,selectedRecordIds.length-1);
        
        var action = component.get("c.searchLinkedRecords");
        var params = 
        {
            'lookupObjectAPIName': multiSelectSetupConfiguration.Lookup_Object_API_Name__c,
            'searchKeyword': searchKeyword,
            'searchFieldAPINames': multiSelectSetupConfiguration.Search_Field_API_Names__c,
            'filterFieldAPIName': multiSelectSetupConfiguration.Filter_Field_API_Name__c,
            //'excludedIds' : selectedRecordIds,	// In case you don't want any selected icon. Use this.
            'excludedIds' : '',		// To add selected icons on already selected records
            'multiSelectLookupClass': multiSelectSetupConfiguration.MultiSelect_Lookup_Class__c
        }
        console.log("Params: "+JSON.stringify(params));
        action.setParams(params);  
        action.setCallback(this, function(response) 
		{
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var storeResponse = response.getReturnValue();
                //console.log("storeResponse: "+JSON.stringify(storeResponse));
                var searchedRecords = [];
                var sObjectAsString = JSON.stringify(component.get("v.sObject"));	// Required to add selected icons
                
                for (var key in storeResponse.multiselectResults) 
                {
                    if (storeResponse.multiselectResults.hasOwnProperty(key)) 
                    {           
                        //console.log(key, storeResponse.multiselectResults[key]);
                        var obj = 
                        {
                            "key": key,
                            "value": storeResponse.multiselectResults[key],
                            "selected": sObjectAsString.includes(key) ? 'true' : 'false'
                        }
                        searchedRecords.push(obj);
                    }
                }
                console.log("searchedRecords: "+JSON.stringify(searchedRecords));
                if (storeResponse.length == 0) 
                {
                    component.set("v.message", 'No Records Found...');
                } 
                else 
                {
                    component.set("v.message", '');
                }
                component.set("v.searchedRecords", searchedRecords);                 
                if(!this.isObjectEmpty(searchedRecords))
                {
                    this.openContainerDiv(component);
                }
                this.hideSpinner(component);
            }
        });
        // enqueue the Action  
        $A.enqueueAction(action);
    },
        
    isObjectEmpty: function(obj)
    {
        for(var prop in obj) 
        {
            if(obj.hasOwnProperty(prop))
                return false;
        }
        
        return true;
    },
    
    closeContainerDiv: function(component)
    {
     	var forclose = component.find("containerDiv");
        $A.util.addClass(forclose, 'slds-is-close');
        $A.util.removeClass(forclose, 'slds-is-open');   
    },
    
    openContainerDiv: function(component)
    {
    	var forOpen = component.find("containerDiv");
        $A.util.addClass(forOpen, 'slds-is-open');
        $A.util.removeClass(forOpen, 'slds-is-close');
	},
    
    showLookupPillsDiv: function(component)
    {
        var forOpen = component.find("lookup-pill");
        $A.util.addClass(forOpen, 'slds-show');
        $A.util.removeClass(forOpen, 'slds-hide');
    },
    
    hideSpinner: function(component)
    {
        var forClose = component.find("searchSpinner");
        $A.util.addClass(forClose, 'slds-hide');
        $A.util.removeClass(forClose, 'slds-show');
	},
    
    showSpinner: function(component)
    {
        var forOpen = component.find("searchSpinner");
        $A.util.addClass(forOpen, 'slds-show');
        $A.util.removeClass(forOpen, 'slds-hide');
    }
})