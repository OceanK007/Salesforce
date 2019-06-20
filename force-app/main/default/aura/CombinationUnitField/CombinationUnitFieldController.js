({
	doInit : function(component, event, helper) {
        helper.getCombinationUnitDetails(component);
    },
    
    displayResultsBySearchKeyWord: function(component, event, helper) {
        helper.displayResultsBySearchKeyWord(component);
    },
    
    setCombinationUnitInputFieldValue: function(component, event, helper) {
        helper.setCombinationUnitInputFieldValue(component);
    },
    
    searchInputFocus: function(component, event, helper) {
     	helper.searchInputFocus(component);
    },
    
    searchInputBlur: function(component, event, helper) {
     	helper.searchInputBlur(component);
    },
    
    selectItem: function(component, event, helper) {
        helper.selectItem(component, event);
    },
    
    focusDropdown: function(component, event, helper) {
        helper.focusDropdown(component);
    },
    
    blurDropdown: function(component, event, helper) {
        helper.blurDropdown(component);
    }

})