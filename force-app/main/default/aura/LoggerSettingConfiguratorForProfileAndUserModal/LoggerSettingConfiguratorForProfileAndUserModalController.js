({
	/* Function to fetch Logger field descriptions (label, helptext, required), Logger Setting record */
    doInit: function(component, event, helper) {
        helper.setValuesInLoggerSettingModal(component);
    },   
    
    /* Function to validate and upsert Logger Settings record to database */
    handleUpsertLoggerSettingsRecord: function(component, event, helper) {
        helper.validateLoggerSettingsRecord(component);
    },
    
    /* Function to display Logger Setting record for editing */
    handleEditLoggerRecord: function(component, event, helper) {
        component.set("v.modalMode", "edit");
        component.set("v.isReadOnly", false);
    },
    
    /* Function to display Logger Settting record for viewing */
    handleViewLoggerRecord: function(component, event, helper) {
        component.set("v.modalMode", "view");
        component.find("overlayLib").notifyClose();
    },
    
    handleOnChangeLocation: function(component, event, helper) {
        helper.handleOnChangeLocation(component);
    }
})