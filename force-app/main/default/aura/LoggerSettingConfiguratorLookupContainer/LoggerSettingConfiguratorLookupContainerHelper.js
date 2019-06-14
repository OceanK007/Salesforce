({
	getLookupDetailsForObject: function(component)
    {
        var action = component.get("c.getLookupDetailsForObject");
        
        var inputParameters =  {
                                   "objectAPIName" : component.get("v.objectAPIName"),
                                   "searchFieldAPIName" : component.get("v.searchFieldAPIName"),
                                   "displayColumnsAPINames" : component.get("v.displayColumnsAPINames"),
                                   "searchKeyword" : null,
                                   "searchOrder" : "Desc",
                                   "queryOffset" : 0 ,
                                   "queryLimit" : 10 ,
                                   "orderByFieldAPI": "CreatedDate"
                              };
        action.setParams({
            "inputParameters": JSON.stringify(inputParameters)
        });
        action.setCallback(this, function(response) {	
            var state = response.getState();
            if (state === "SUCCESS") {
                let dataMap = response.getReturnValue();
                console.log("Container: "+JSON.stringify(dataMap));            
                component.set("v.objectAPIDetails", dataMap);
            }
            else {
            }
        });
        $A.enqueueAction(action);	
	},
})