({
	handleCreateComponent : function(component, event, helper) 
    {
        $A.createComponents
        (
            [
                [
                    "lightning:select",
                    {
                        "aura:id": "dropdownId",
                        "label": "Select List", 
                        "name": "dropdown"
                    }
                ],
                [
                	"option", { value: "option1", label: "Option 1" }
                ],
                [
                    "option", { value: "option2", label: "Option 2" }
                ]
            ],            
            function(dropComponents, status, errorMessage)
            {
                if (status === "SUCCESS") 
                {
                    var dynamicComponents = component.get("v.dynamicComponents");
                    console.log("hi");
                    dropComponents[0].set("v.body", [dropComponents[1], dropComponents[2]]);                    
                    dynamicComponents.push(dropComponents[0]);
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
    
    handleDeleteComponent : function(component, event, helper) 
    {
        var dynamicComponents = component.get("v.dynamicComponents");
        dynamicComponents.pop();
        component.set("v.dynamicComponents", dynamicComponents);
    }
})