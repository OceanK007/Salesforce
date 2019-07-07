({
	handleCreateComponent : function(component, event, helper) 
    {
        $A.createComponent
        (
            "c:DynamicComponent",
            {
                "aura:id": "inpId",
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
        
        /*$A.createComponent
        (
            "ui:inputText",
            {
                "aura:id": "inpId",
                "labelClass":"slds-form-element__label",
                "placeholder":"Enter Some Text",
                "label": "Enter some text",
                "class": "slds-input"
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
        );*/
    },
    
    handleDeleteComponent : function(component, event, helper) 
    {
        var dynamicComponents = component.get("v.dynamicComponents");
        dynamicComponents.pop();
        component.set("v.dynamicComponents", dynamicComponents);
    },
    
    saveComponentsData: function(component, event, helper) 
    {
        var isChecked = component.find("toggleSaveAllContacts").get("v.checked");
        console.log(isChecked);
        
        if(isChecked)
        {
            var dynamicComponents = component.get("v.dynamicComponents");
            dynamicComponents.forEach(function (item, index)                       
            {
                //console.log("index: "+index);
                //console.log("item: "+item);
                console.log("FirstName: "+item.get("v.firstName")+" | LastName: "+item.get("v.lastName"));
            });
        }
    }
})