({
	doInit : function(component, event, helper) {
        //console.log("Component: "+JSON.stringify(component.get("v.objectAPIDetails")));
        helper.setupInitialValues(component);
    },
    
    handleObjectAPIDetailsChange: function(component, event, helper) {
        component.set("v.displayRecentFiveRecordsDiv", false);
        console.log("Component: "+JSON.stringify(component.get("v.objectAPIDetails")));
        var objectAPIDetails = component.get("v.objectAPIDetails");
        component.set("v.recentFiveRecords", objectAPIDetails.recentRecords.slice(0,5));
    },
    
    handleSelectedRecordChange: function(component, event, helper) {
        
    },
    
    inputBoxFocus: function(component, event, helper) {
        helper.inputBoxFocus(component);
    },
    
    inputBoxBlur: function(component, event, helper) {
        helper.inputBoxBlur(component);
    },
    
    onRecordSelect: function(component, event, helper) {
        helper.onRecordSelect(component, event);
    },
    
    inputOnChange: function(component, event, helper) {
        helper.inputOnChange(component);
    },
    
    removeSelectedRecord: function(component, event, helper) {
        helper.removeSelectedRecord(component);
    },
    
    handleModalDisplay: function(component, event, helper) {
        helper.handleModalDisplay(component);
    }
})