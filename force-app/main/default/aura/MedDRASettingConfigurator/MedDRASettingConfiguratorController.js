({
    /* Function to fetch MedDRA field descriptions (label, helptext, required), MedDRA Settings record */
    doInit: function(component, event, helper) {	
        helper.getMedDRASettingsRecord(component);  
        helper.getLabels(component);
    },   
    
    /* Function to validate and upsert MedDRA Settings record to database */
    handleUpsertMedDRARecord: function(component, event, helper) {
        helper.validateMedDRASettingRecord(component);
    },
    
    /* Function to display MedDRA Setting record for editing */
    handleEditMedDRARecord: function(component, event, helper) {
        component.set("v.editMeddraRecord", true);
    },
    
    /* Function to display MedDRA Setting record for viewing */
    handleViewMedDRARecord: function(component, event, helper) {
        component.set("v.editMeddraRecord", false);
    }
})