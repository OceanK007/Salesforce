({
	setValues: function(component) {
        component.set("v.modalMode", "edit");
        
        // Setting objectAPIName value
        let locationValue = component.find("location").get("v.value");
        component.set("v.objectAPIName", locationValue);
        
        // Setting readOnly value
        let modalMode = component.get("v.modalMode");
        component.set("v.isReadOnly", (modalMode == 'edit' ? false : true));
		
        // Setting Selected Recorded Value
        let selectedRecord = {"Id":"00003424258","Name":"System Administrator"};
        component.set("v.selectedRecord", selectedRecord);
        console.log("Demo: "+JSON.stringify(component.get("v.selectedRecord")));
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