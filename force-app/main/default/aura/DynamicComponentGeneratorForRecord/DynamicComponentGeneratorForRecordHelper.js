({
	initializeComponent : function(component, event) {
        var self = this;
        window.setTimeout($A.getCallback(function() 
		{
            self.handleOnChange(component, event);
        }), 1000);
	},
    
    handleOnChange : function(component, event) {
        console.log("handleOnChange");
        var decisionCheckbox=component.find("decisionCheckbox").get("v.value");
        component.set("v.chkboxvalue", decisionCheckbox);
        console.log('decisionCheckbox: '+decisionCheckbox);   
        //console.log('event decisionCheckbox: '+event.getSource().get("v.value"));
                
        if(decisionCheckbox)
        {
        	var dynamicComponents = component.get("v.dynamicComponents");
            if(dynamicComponents == null || dynamicComponents == "" || dynamicComponents.size == 0)
            {
                this.handleCreateComponent(component);
            }	    
        }
    },
    
    handleCreateComponent : function(component) 
    {
        var parentRecordId = component.get("v.recordId");
        $A.createComponent
        (
            "c:DynamicComponentForRecord",
            {
                "parentRecordId": parentRecordId
            },
            function(newInp, status, errorMessage)
            {
                if (status === "SUCCESS") 
                {
                    var dynamicComponents = component.get("v.dynamicComponents");
                    dynamicComponents.push(newInp);
                    component.set("v.dynamicComponents", dynamicComponents);
                }
                else if (status === "INCOMPLETE") 
                {
                    console.log("No response from server or client is offline.")
                }
                else if (status === "ERROR") 
                {
                    console.log("Error: " + errorMessage);
                }
            }
        );
    },
    
    handleSubmit: function(component, event) 
    {
		var decisionCheckbox=component.find("decisionCheckbox").get("v.value");
        console.log(decisionCheckbox);
        
        if(decisionCheckbox)
        {
            var dynamicComponents = component.get("v.dynamicComponents");
            dynamicComponents.forEach(function (item, index)                       
            {
                //console.log("index: "+index);
                //console.log("item: "+item);
                //console.log("FirstName: "+item.get("v.firstName")+" | LastName: "+item.get("v.lastName"));
                //console.log("childEditForm: "+item.find("childEditForm"));
                var childEditForm = item.find("childEditForm");
                childEditForm.submit();
            });
        }
        
        component.find("parentEditForm").submit();
    }
})