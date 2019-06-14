({
	/* Function to fetch Logger field descriptions (label, helptext, required), Logger Setting record */
    doInit: function(component, event, helper) {	
        helper.getLoggerSettingsForOrganization(component);  
    },   
    
    /* Function to validate and upsert Logger Settings record to database */
    handleUpsertLoggerSettingsRecord: function(component, event, helper) {
        helper.validateLoggerSettingsRecord(component);
    },
    
    /* Function to display Logger Setting record for editing */
    handleEditLoggerRecord: function(component, event, helper) {
        component.set("v.editLoggerRecord", true);
    },
    
    /* Function to display Logger Settting record for viewing */
    handleViewLoggerRecord: function(component, event, helper) {
        component.set("v.editLoggerRecord", false);
    }
})