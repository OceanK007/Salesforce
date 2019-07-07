({
    onRender: function (component, event, helper) 
    {
       	var steps = component.get("v.steps");
       	var currentStep = component.get("v.currentStep");
        
        //console.log("steps: "+steps);
        for (var i = 0; i<steps.length; i++) 
        {
            var obj = steps[i];
            //console.log("obj: "+obj);
            //console.log("value: "+obj["value"]+" | currentStep: "+currentStep);
            if(obj['value'] === currentStep)
            {
                component.set("v.currentStepIndex", i);
            }
        }
        
        //console.log("currentStepIndex: "+component.get("v.currentStepIndex"));
    },
    
	handleMouseOver: function (component, event, helper) 
    {
        //console.log("var selectedItem = event.currentTarget: "+event.currentTarget);
        var currentTarget = event.currentTarget;
        //console.log("currentTarget.getAttribute('data-popovertext'): "+currentTarget.getAttribute('data-popovertext'));
        //var element = document.getElementById("test");
        var rect = currentTarget.getBoundingClientRect();
		//console.log(rect.top, rect.right, rect.bottom, rect.left);
        var elementWidth = rect.right - rect.left;
        
        var toolTipDiv = document.getElementById("pa-tooltip");
        $A.util.removeClass(toolTipDiv, 'tooltip-hidden');
        //toolTipDiv.classList.remove("tooltip-hidden");
        toolTipDiv.style.left = (rect.left+ (elementWidth/2))+"px";
        
        var toolTipTextElement = toolTipDiv.firstChild.firstChild;
        toolTipTextElement.innerHTML = currentTarget.getAttribute('data-popovertext');
    },
    
    handleMouseOut: function (component, event, helper) 
    {
        var toolTipDiv = document.getElementById("pa-tooltip");
        $A.util.addClass(toolTipDiv, 'tooltip-hidden');
        //toolTipDiv.classList.add("tooltip-hidden");
    }
})