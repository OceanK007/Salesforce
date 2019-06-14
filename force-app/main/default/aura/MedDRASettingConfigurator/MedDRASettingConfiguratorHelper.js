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
        // Send action off to be executed
        $A.enqueueAction(action);	
	},
    
    /* Function to fetch MedDRA Settings record and render it on UI */
    getMedDRASettingsRecord: function(component)
    {
        component.set("v.showSpinner", true);
        var action = component.get("c.getMedDRASettingsRecord");
        action.setCallback(this, function(response) {	
            var state = response.getState();
            if (state === "SUCCESS") {                
                component.set("v.meddraRecord", response.getReturnValue());                
                component.set("v.showSpinner", false);
            }
            else {
                component.set("v.showSpinner", false);
            }
        });
        
        $A.enqueueAction(action);	
    },
    
    /* Function to Validate the MedDRA Settings record before upserting to Database */
    validateMedDRASettingRecord: function(component) {
      	component.set("v.showSpinner", true);
        var validItem = component.find('recordform').reduce(function (validSoFar, inputCmp) {
            inputCmp.showHelpMessageIfInvalid();
            return validSoFar && inputCmp.get('v.validity').valid;
        }, true);
        
        /* If all validations has passed */ 
        if(validItem){
            var record = component.get("v.meddraRecord");            
            this.upsertMedDRASettingsRecord(component, record);
        }
        else
        {
            component.set("v.showSpinner", false);
        }  
    },    
    
    /* Function to Upsert medDRA Settings record to Database */ 
	upsertMedDRASettingsRecord : function(component, record) {        
        var action = component.get("c.upsertMedDRASettingsRecord");
        action.setParams({
            "record": record
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {        
                component.set("v.meddraRecord", response.getReturnValue());	
                component.set("v.showSpinner", false);
                this.showToast('Success Message', 'MedDRA setting has been '+(record.Id == null ? 'created' : 'updated'), 'success', 'pester');
                component.set("v.editMeddraRecord", false);
            }
            else {
                component.set("v.showSpinner", false);
                this.showToast('Error Message', $A.get("$Label.c.MedDRA_Settings_Configurator_Upsert_Error"), 'error', 'pester');
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