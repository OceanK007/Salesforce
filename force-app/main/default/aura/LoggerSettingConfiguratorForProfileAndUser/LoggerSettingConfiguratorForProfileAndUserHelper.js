({
	/* Function to fetch Logger Settings record and render it on UI */
    getLoggerSettingsForProfileAndUser: function(component)
    {
        component.set("v.showSpinner", true);
        var action = component.get("c.getLoggerSettingsForProfileAndUser");
        action.setCallback(this, function(response) {	
            var state = response.getState();
            if (state === "SUCCESS") {            
                 
                var dataList = [];
                let dataMap = response.getReturnValue();
                for(var key in dataMap)
                {
                    dataList.push(dataMap[key]);
                }
                
                component.set("v.loggerRecords", dataList); 
                console.log(dataList);
                
                component.set("v.showSpinner", false);
            }
            else {
                component.set("v.showSpinner", false);
            }
        });
       
        $A.enqueueAction(action);
    },
    
    setLoggerDataForDataTable: function(component) {
        let actions = [
            { label: 'Show details', name: 'show_details' },
            { label: 'Edit details', name: 'edit_details' },
            { label: 'Delete', name: 'delete' }
        ];

        component.set('v.loggerColumns', [
            { label: 'Setup Owner', fieldName: 'SetupOwner', type: 'text' },
            { label: 'Location', fieldName: 'Name', type: 'text' },
            { type: 'action', typeAttributes: { rowActions: actions } }
        ]);
    },
    
    viewEditLoggerSettingRecord: function(component, row, modalMode) {
        $A.createComponent("c:LoggerSettingConfiguratorForProfileAndUserModal",
                           {
                               "loggerRecord" : row,
                               "modalMode" : modalMode,
                               "descriptionObject": component.get("v.descriptionObject"),
                               "profiles": component.get("v.profiles"),
                               "users": component.get("v.users"),
                               "loggerRecords": component.getReference("v.loggerRecords")
                           },
                           function(content, status) 
                           {
                               if (status === "SUCCESS") 
                               {
                                   var modalBody = content;
                                   component.find('overlayLib').showCustomModal({
                                       header: "Logger Settings",
                                       body: modalBody, 
                                       showCloseButton: true,
                                       closeCallback: function(ovl) {
                                           console.log('Inner Overlay is closing');
                                       }
                                   }).then(function(overlay){
                                       console.log("Inner Overlay is made");
                                   });
                               }
                           });

    },
    
    removeLoggerRecordFromDataTable: function (component, row) {
        var rows = component.get('v.loggerRecords');
        var rowIndex = rows.indexOf(row);

        rows.splice(rowIndex, 1);
        component.set('v.loggerRecords', rows);
    },
    
    removeLoggerRecordFromDatabase: function(component, row) {
        console.log("logger Id: "+row.Id);
        component.set("v.showSpinner", true);
        var action = component.get("c.deleteLoggerSettingRecordById");
        action.setParams({  loggerRecordId : row.Id  });
        action.setCallback(this, function(response) {	
            var state = response.getState();
            if (state === "SUCCESS") {                            
                this.removeLoggerRecordFromDataTable(component, row);
                component.set("v.showSpinner", false);
            }
            else {
                component.set("v.showSpinner", false);
            }
        });
       
        $A.enqueueAction(action);
    },
    
    /* Function to fetch profiles from database */
    getProfiles: function(component)
    {
        component.set("v.showSpinner", true);
        var action = component.get("c.getProfiles");
        action.setCallback(this, function(response) {	
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.profiles", response.getReturnValue());
                component.set("v.showSpinner", false);
            }
            else {
                component.set("v.showSpinner", false);
            }
        });
        
        $A.enqueueAction(action);
    },
    
    /* Function to fetch users from database */
    getUsers: function(component)
    {
        component.set("v.showSpinner", true);
        var action = component.get("c.getUsers");
        action.setCallback(this, function(response) {	
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.users", response.getReturnValue());
                component.set("v.showSpinner", false);
            }
            else {
                component.set("v.showSpinner", false);
            }
        });
        
        $A.enqueueAction(action);
    },
})