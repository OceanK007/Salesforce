({
    /* http://peterknolle.com/lightning-record-edit-form/ */
    
	doInit : function(component, event, helper) {
		helper.initializeComponent(component, event);
	},
    
    handleOnChange : function(component, event, helper) {
        helper.handleOnChange(component, event);
    },
    
    handleCreateComponent : function(component, event, helper) 
    {
        helper.handleCreateComponent(component);
    },
    
    handleSubmit: function(component, event, helper) 
    {
        helper.handleSubmit(component, event);
    }
})