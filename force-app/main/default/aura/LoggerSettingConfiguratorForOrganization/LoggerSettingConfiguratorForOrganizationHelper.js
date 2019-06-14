({
	/* Function to fetch Logger Settings record and render it on UI */
    getLoggerSettingsForOrganization: function(component)
    {
        component.set("v.showSpinner", true);
        var action = component.get("c.getLoggerSettingsForOrganization");
        action.setCallback(this, function(response) {	
            var state = response.getState();
            if (state === "SUCCESS") {           
                var fetchedRecord = response.getReturnValue();
                if(response.getReturnValue().Id)
                {
                    component.set("v.loggerRecord", fetchedRecord); 
                }
                else
                {
                    var loggerRecord = component.get("v.loggerRecord");
                    loggerRecord.SetupOwnerId = fetchedRecord.SetupOwnerId;
                    loggerRecord.ivpcc__Log_Levels__c = fetchedRecord.ivpcc__Log_Levels__c;
                }
                  
                component.set("v.showSpinner", false);
            }
            else {
                component.set("v.showSpinner", false);
            }
        });
       
        $A.enqueueAction(action);
    },
    
     /* Function to Validate the Logger Settings record before upserting to Database */
    validateLoggerSettingsRecord: function(component) {
        component.set("v.showSpinner", true);
        var validItem = component.find('recordform').reduce(function (validSoFar, inputCmp) {
            inputCmp.showHelpMessageIfInvalid();
            return validSoFar && inputCmp.get('v.validity').valid;
        }, true);
        if(validItem){
            var record = component.get("v.loggerRecord");
            this.upsertLoggerSettingsRecord(component, record);
        }
        else
        {
            component.set("v.showSpinner", false);
        }
    },
        
    /* Function to Upsert Logger Settings record to Database */ 
	upsertLoggerSettingsRecord: function(component, record) {    
        var action = component.get("c.upsertLoggerSettingsRecord");
        action.setParams({
            "record": record
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {        
                component.set("v.loggerRecord", response.getReturnValue());	
                component.set("v.showSpinner", false);
                this.showToast('Success Message', 'Successfully '+(record.Id == null ? 'Created' : 'Updated'), 'success', 'pester');
                component.set("v.editLoggerRecord", false);
            }
            else {
                component.set("v.showSpinner", false);
                this.showToast('Error Message', $A.get("$Label.c.Logger_Setting_Configurator_Upsert_Error"), 'error', 'pester');
            }
        });
        $A.enqueueAction(action);
    },
    
    /* Function to display toast for success|error messages */
    showToast: function(title, message, type, mode) {
    	var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title : title,
            message: message,
            duration:' 5000',
            key: 'info_alt',
            type: type,
            mode: mode
        });
        toastEvent.fire();
	}
})