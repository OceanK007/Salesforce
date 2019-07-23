({
	doInit : function(component, event, helper) {
        helper.getLookupDetails(component);
    },
    
    displayResultsBySearchKeyWord: function(component, event, helper) {
        helper.displayResultsBySearchKeyWord(component);
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