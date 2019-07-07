({
	getSteps : function(component) 
    {
        console.log('2');
		var objectAPIName = component.get("v.objectAPIName");
        var fieldAPIName = component.get("v.fieldAPIName");
        var recordId = component.get("v.recordId");
        
        console.log('objectAPIName: '+objectAPIName);
        console.log('fieldAPIName: '+fieldAPIName);
        console.log('recordId: '+recordId);
        
        console.log('3');
        var action = component.get("c.getProgressSteps");        
        action.setParams({
            "objectAPIName" : objectAPIName,
            "fieldAPIName" : fieldAPIName,
            "recordId": recordId
        });
        console.log('4');
        action.setCallback(this, function(response) 
		{	
            console.log('1');
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                let result = response.getReturnValue();
                console.log("JSON: "+JSON.stringify(result));
                var values = [];
                
                for(var key in result.values)
                {
                    values.push({value: key, label: result.values[key]});
                }
                
                console.log(values);
                component.set('v.steps', values);
                
                component.set('v.currentStep', result.activeValue);
            }
            else
            {
                console.log('FAILED');
            }
        });
        
        $A.enqueueAction(action);
	}
})