({
	/* Function to fetch field descriptions like label, helptext, required */ 
	getLabels: function(component)
    {
        component.set("v.showSpinner", true);
        var action = component.get("c.getLabels");
        action.setCallback(this, function(response) {	
            var state = response.getState();
            if (state === "SUCCESS") {
                let dataMap = response.getReturnValue();
                component.set("v.descriptionObject", dataMap);
                component.set("v.showSpinner", false);
            }
            else {
                component.set("v.showSpinner", false);
            }
        });
        
        $A.enqueueAction(action);
	},
})