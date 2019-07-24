({
	doInit : function(component, event, helper) 
    {
        window.setTimeout($A.getCallback(function() 
		{
            var setupObject = 
            {
                "objectAPI": "Account",
                "lookupFieldAPI": "Measurement_Unit_Lookup__c",
                "lookupObjectAPI": "Measurement_Unit__c",
                "lookupObjectFieldAPI": "Name"
            }
            
            component.set("v.setupObject", setupObject);
        }), 2000);	
	}
})