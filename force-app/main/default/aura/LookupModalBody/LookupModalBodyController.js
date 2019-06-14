({
	doInit : function(component, event, helper) 
    {
        helper.loadDataBySearchKeyword(component);
	},
    
    loadMoreData: function (component, event, helper) 
    {
		helper.loadMoreData(component, event);
    },
    
    handleSearchKeywordChange: function(component, event, helper) 
    {
        helper.handleSearchKeywordChange(component, event);
    },
    
    updateSelectedRecord: function(component, event, helper) 
    {
        helper.updateSelectedRecord(component, event);
    },
    
    updateColumnSorting: function(component, event, helper) 
    {
        helper.updateColumnSorting(component, event);
    }
})