({
	/* Function to fetch Logger field descriptions (label, helptext, required), Logger Setting record */
    doInit: function(component, event, helper) {	
        helper.getLoggerSettingsForProfileAndUser(component); 
        helper.setLoggerDataForDataTable(component);
        helper.getProfiles(component);
        helper.getUsers(component);
    },   
    
    handleNewLoggerRecord: function(component, event, helper) {
        var loggerRecord = 
        {
            "Id":"",
            "SetupOwnerId":"",
            "Name":"",
            "ivpcc__Buffer_Heap_For_Log_Content_Creation__c":"",
            "ivpcc__Log_Levels__c":"NONE",
            "ivpcc__Max_Heap_Allocated_For_Logger__c":"",
            "ivpcc__Max_Log_Capture_Size__c":"",
            "SetupOwner":""
        }
        helper.viewEditLoggerSettingRecord(component, loggerRecord, 'new');
    },
    
    handleRowAction: function (component, event, helper) {
        var action = event.getParam('action');
        var row = event.getParam('row');

        switch (action.name) {
            case 'show_details':
                //alert('Showing Details: ' + JSON.stringify(row));
                //console.log(JSON.stringify(row));
                helper.viewEditLoggerSettingRecord(component, row, 'view');
                break;
            case 'edit_details':
                helper.viewEditLoggerSettingRecord(component, row, 'edit');
                break;
            case 'delete':
                 if(confirm('Are you sure to delete this record?')) 
                 {
                     helper.removeLoggerRecordFromDatabase(component, row);
                 }                
                break;
        }
    }
})