({
	doInit : function(component, event, helper) 
    {
        helper.fetchSetupConfiguration(component, event);	
	},
    
    sObjectChangeHandler: function(component, event, helper)
    {
        console.log("sObjectChangeHandler: "+JSON.stringify(component.get("v.sObject")));
    }
})