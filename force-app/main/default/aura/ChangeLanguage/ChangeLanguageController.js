({
    /* Function to fetch the default language */
	init : function(component, event, helper) {
        var utilityAPI = component.find("utilitybar");
        utilityAPI.getAllUtilityInfo().then(function (response) {
            if (typeof response !== 'undefined') {                   
                utilityAPI.setUtilityLabel({label: $A.get("$Label.c.Change_Language")});
                utilityAPI.setPanelHeaderLabel({label: $A.get("$Label.c.Change_Language")});
                
            } 
        });
        
		helper.getLanguages(component);
	},
    
    /* Function to handle the onChange event on selecting different language from dropdown */
    handlerOnChangeLanguage: function(component, event, helper) {
        let languageLocale = component.find('language').get('v.value');
        helper.changeLanguage(component, languageLocale);
    }
})