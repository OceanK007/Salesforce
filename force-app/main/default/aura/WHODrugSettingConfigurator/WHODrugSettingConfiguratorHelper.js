({
	/* Function to fetch field descriptions like label, helptext, required, value */ 
	getWhoDrugSettingsData: function(component)
    {
        component.set("v.showSpinner", true);
        var action = component.get("c.getDetails");
        action.setCallback(this, function(response) {	
            var state = response.getState();
            if (state === "SUCCESS") {
                var dataList = [];
                let dataMap = response.getReturnValue();
                for(var key in dataMap)
                {
                    dataList.push({key: key, value: dataMap[key]});
                }
                component.set("v.detailsObject", dataList);
                component.set("v.showSpinner", false);
                component.set("v.whoDrugRecordId", dataMap['id'].value);
            }
            else {
                component.set("v.showSpinner", false);
            }
        });
        
        $A.enqueueAction(action);
	},
    
    /* Function to Validate the WHODrug Settings record before upserting to Database */
    validateWhoDrugSettingsRecord: function(component) {
        var whoDrugRecord = {};
        
        component.set("v.showSpinner", true);
        
        var validItem = component.find('recordform').reduce(function (validSoFar, inputCmp) {
            inputCmp.showHelpMessageIfInvalid();            
            
            /* START: Creating WHODrug record to upsert in database */
            whoDrugRecord.Id = component.get("v.whoDrugRecordId");
            switch(inputCmp.get('v.name').toLowerCase())
            {
                case 'name':
                    whoDrugRecord.Name = inputCmp.get('v.value');
                    break;
                case 'ivpcc__products_types_api_path__c':
                    whoDrugRecord.ivpcc__Products_Types_API_Path__c = inputCmp.get('v.value');
                    break;
                case 'ivpcc__search_products_api_path__c':
                    whoDrugRecord.ivpcc__Search_Products_API_Path__c = inputCmp.get('v.value');
                    break;
                case 'ivpcc__typeaheads_api_path__c':
                    whoDrugRecord.ivpcc__Typeaheads_API_Path__c = inputCmp.get('v.value');
                    break;
                case 'ivpcc__page_group_size__c':
                    whoDrugRecord.ivpcc__Page_Group_Size__c = inputCmp.get('v.value');
                    break;
                case 'ivpcc__rows_per_page__c':
                    whoDrugRecord.ivpcc__Rows_Per_Page__c = inputCmp.get('v.value');
                    break;
            }
            /* START: Creating WHODrug record to upsert in database */
            
            return validSoFar && inputCmp.get('v.validity').valid;
        }, true);
        if(validItem) {
            this.upsertWhoDrugSettingsRecord(component, whoDrugRecord);
        }
        else
        {
            component.set("v.showSpinner", false);
        }
    },
        
    /* Function to Upsert WHODrug Settings record to Database */ 
	upsertWhoDrugSettingsRecord: function(component, record) {  
        var action = component.get("c.upsertWhoDrugSettingsRecord");
        action.setParams({
            "record": record
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") { 
                component.set("v.whoDrugRecordId", response.getReturnValue().Id);	
                component.set("v.showSpinner", false);
                this.showToast('Success Message', 'WHODrug setting has been '+(record.Id == null ? 'created' : 'updated'), 'success', 'pester');
                component.set("v.editWhoDrugRecord", false);
            }
            else {                
                component.set("v.showSpinner", false);
                this.showToast('Error Message', $A.get("$Label.c.WHODrug_Setting_Configurator_Upsert_Error"), 'error', 'pester');
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