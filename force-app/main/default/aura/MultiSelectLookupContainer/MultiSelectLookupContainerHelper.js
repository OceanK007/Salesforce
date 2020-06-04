({
	fetchSetupConfiguration : function(component, event) 
    {
		var action = component.get("c.getMultiSelectLookupConfigurationDetails"); 
        action.setCallback(this, function(response) 
		{	
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                let result = response.getReturnValue();
                console.log("MultiSelectLookupContainer -> fetchSetupConfiguration: "+JSON.stringify(result));
                component.set("v.multiSelectSetupConfiguration", result[0]);
                
                this.fetchSelectedRecords(component, event);
            }
            else 
            {
                console.log("Error in fetching data from getMultiSelectLookupConfigurationDetails");
            }
        });
        $A.enqueueAction(action);
	},
    
    fetchSelectedRecords: function(component, event)
    {
        var multiSelectSetupConfiguration = component.get("v.multiSelectSetupConfiguration");
        var action = component.get("c.getSelectedRecords"); 
        var params = 
        {
            'objectAPIName': multiSelectSetupConfiguration.Object_API_Name__c,
            'lookupObjectAPIName': multiSelectSetupConfiguration.Lookup_Object_API_Name__c,
            'recordId': component.get("v.recordId"),
            'linkedRecordsAPIName': multiSelectSetupConfiguration.Linked_Records_API_Name__c,
            'filterFieldAPIName': multiSelectSetupConfiguration.Filter_Field_API_Name__c,
            'multiSelectLookupClass': multiSelectSetupConfiguration.MultiSelect_Lookup_Class__c
        }
        console.log("Params: "+JSON.stringify(params));
        action.setParams(params); 
        action.setCallback(this, function(response) 
		{	
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                let result = response.getReturnValue();
                console.log("MultiSelectLookupContainer -> fetchSelectedRecords: "+JSON.stringify(result));
                var selectedRecords = [];
                for (var key in result.multiselectResults) 
                {
                    if (result.multiselectResults.hasOwnProperty(key)) 
                    {           
                        //console.log(key, result.multiselectResults[key]);
                        var obj = 
                        {
                            "key": key,
                            "value": result.multiselectResults[key]
                        }
                        selectedRecords.push(obj);
                    }
                }
                component.set("v.sObject", selectedRecords);
                console.log("v.sObject: "+component.get("v.sObject"));
            }
            else 
            {
                console.log("Error in fetching data from getSelectedRecords");
            }
        });
        $A.enqueueAction(action);
    }
})