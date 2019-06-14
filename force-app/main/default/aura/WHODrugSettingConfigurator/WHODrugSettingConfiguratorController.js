({
	/* Function to fetch WHODrug field descriptions (label, helptext, required, value) for WHODrug Setting record */
    doInit: function(component, event, helper) {	
        helper.getWhoDrugSettingsData(component);
    },   
    
    /* Function to validate and upsert WHODrug Settings record to database */
    handleUpsertWhoDrugSettingsRecord: function(component, event, helper) {
        helper.validateWhoDrugSettingsRecord(component);
    },
    
    /* Function to display WHODrug Setting record for editing */
    handleEditWhoDrugRecord: function(component, event, helper) {
        component.set("v.editWhoDrugRecord", true);
    },
    
    /* Function to display WHODrug Settting record for viewing */
    handleViewWhoDrugRecord: function(component, event, helper) {
        component.set("v.editWhoDrugRecord", false);
    }
})