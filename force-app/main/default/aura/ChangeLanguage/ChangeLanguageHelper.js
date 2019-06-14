({
    /* Function to fetch the default language from database */
	getLanguages : function(component) {
        var action = component.get("c.getLanguage");             
        action.setCallback(this, function(response) {	
            var state = response.getState();
            if (state === "SUCCESS") {
                var data = response.getReturnValue();
                console.log("Data: "+JSON.stringify(data));
                component.set("v.availableLanguages", data.languages);
                component.set("v.selectedLanguage", userLanguage);
            }
        });
        $A.enqueueAction(action);
	},
    
    /* Function to change language and save it in database */
    changeLanguage: function(component, languageLocale) {
    	var action = component.get("c.updateLanguage");
        action.setParams({
            "languageLocale": languageLocale
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {   
                let data = response.getReturnValue();
                component.set("v.selectedLanguage", data);
                //$A.get('e.force:refreshView').fire();
                window.location.reload(true);
            }
            else {
                this.showToast('Error Message', 'Unable to change language', 'error', 'pester');
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