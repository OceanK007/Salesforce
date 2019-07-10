({
	initializeComponent : function(component, event) 
    {
        /*var self = this;
        window.setTimeout($A.getCallback(function() 
		{
            self.handleOnChange(component, event);
        }), 2000);*/
        
        this.fetchCusDetails(component);
	},
    
    fetchCusDetails : function(component) 
    {
        console.log("fetchCustomSettingDetails");
        component.set("v.showSpinner", true);
    	var action = component.get("c.getCustomSettingDetails");
        action.setCallback(this, function(response) 
		{	
            var state = response.getState();
            if (state === "SUCCESS") 
            {           
                var fetchedRecord = response.getReturnValue();
                
                console.log("fetchedRecord: "+JSON.stringify(fetchedRecord));
                
                component.set("v.customSettingDetails", fetchedRecord);
                
                component.set("v.showSpinner", false);
            }
            else 
            {
                component.set("v.showSpinner", false);
            }
        });
       
        $A.enqueueAction(action);    
    },
    
    handleOnChange : function(component, event) {
        console.log("handleOnChange");
        var ShowChildEditForm__c=component.find("ShowChildEditForm__c").get("v.value");
        component.set("v.chkboxvalue", ShowChildEditForm__c);
        //console.log('ShowChildEditForm__c: '+ShowChildEditForm__c);   
        //console.log('event ShowChildEditForm__c: '+event.getSource().get("v.value"));
          
        var customSettingDetails = component.get("v.customSettingDetails");
        console.log("customSettingDetails.TriggerValue__c: "+customSettingDetails.TriggerValue__c);
        
        if(ShowChildEditForm__c == customSettingDetails.TriggerValue__c)
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
            "c:DynamicComponentWithCusSetting",
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
		var ShowChildEditForm__c=component.find("ShowChildEditForm__c").get("v.value");
        console.log(ShowChildEditForm__c);
        
        if(ShowChildEditForm__c)
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