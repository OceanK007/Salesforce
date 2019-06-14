({    
    /* Function to setValues for Logger Setting modal */
    setValuesInLoggerSettingModal: function(component) {
        var loggerRecord = component.get("v.loggerRecord");
        
        // Setting objectAPIName value
        component.set("v.locationValue", (loggerRecord.Name == '' ? 'profile' : (loggerRecord.Name == 'Profile' ? 'profile' : 'user')));
        
        // Setting readOnly value
        let modalMode = component.get("v.modalMode");
        component.set("v.isReadOnly", ((modalMode == 'edit' || modalMode == 'new') ? false : true));
        
        // Setting Selected Recorded Value
        var selectedRecord = {"Id":loggerRecord.SetupOwnerId,"Name":loggerRecord.SetupOwner};
        component.set("v.selectedRecord", selectedRecord);
        console.log("modal: "+JSON.stringify(component.get("v.selectedRecord")));
    },
    
    /* Function to Validate the Logger Settings record before upserting to Database */
    validateLoggerSettingsRecord: function(component) {
        component.set("v.showSpinner", true);
        var selectedRecord = component.get("v.selectedRecord");
        
        
        //console.log("selectedRecordselectedRecord: "+(JSON.stringify(component.get("v.selectedRecord"))));
        var validItem = component.find('recordform').reduce(function (validSoFar, inputCmp) {
            inputCmp.showHelpMessageIfInvalid();
            return validSoFar && inputCmp.get('v.validity').valid;
        }, true);
        if(validItem){
            var record = component.get("v.loggerRecord");
            record.SetupOwnerId = selectedRecord.Id;
            console.log("record: "+JSON.stringify(record));
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
                console.log("Message: "+JSON.stringify(response.getReturnValue()));
                this.updateLoggerRecords(component, record, response.getReturnValue());
                component.find("overlayLib").notifyClose();
            }
            else {
                component.set("v.showSpinner", false);
                this.showToast('Error Message', $A.get("$Label.c.Logger_Setting_Configurator_Upsert_Error"), 'error', 'pester');
                component.find("overlayLib").notifyClose();
            }
        });
        $A.enqueueAction(action);
    },

    updateLoggerRecords: function(component, previousRecord, currentRecord)    
    {
        var loggerRecords = component.get("v.loggerRecords");
        console.log("loggerRecords: "+JSON.stringify(loggerRecords));
        console.log("PreviousRecord: "+JSON.stringify(previousRecord));
        console.log("currentRecord: "+JSON.stringify(currentRecord));
    	if(previousRecord.Id == null || previousRecord.Id == '')    
        {
            loggerRecords.push(currentRecord);
            component.set("v.loggerRecords", loggerRecords);
        }
        else
        {
            for(var key in loggerRecords) 
            { 
                if(loggerRecords[key].Id == currentRecord.Id)
                {
                    loggerRecords[key] = currentRecord;  // Or loggerRecords[key] = previousRecord;
                }
            }
            component.set("v.loggerRecords", loggerRecords);
        }
        
        console.log("loggerRecords: "+JSON.stringify(loggerRecords));
    },
    
    /* Function to display toast for success|error messages */
    showToast: function(title, message, type, mode) {
    	var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title : title,
            message: message,
            duration:'5000',
            key: 'info_alt',
            type: type,
            mode: mode
        });
        toastEvent.fire();
	},
    
     handleOnChangeLocation: function(component) {
        let locationValue = component.find("location").get("v.value");
        console.log("Demo: "+locationValue);
        component.set("v.objectAPIName", (locationValue == 'profile' ? 'Profile' : 'User'));
        let selectedRecord = {"Id":"","Name":""};
        component.set("v.selectedRecord", selectedRecord);
        console.log("Demo: "+JSON.stringify(component.get("v.selectedRecord")));
    }
})