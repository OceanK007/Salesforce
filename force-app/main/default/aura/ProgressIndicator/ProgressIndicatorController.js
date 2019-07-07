({
    init: function (component, event, helper) 
    {
        /*component.set('v.steps', 
		[
            { label: 'Contacted', value: 'step-1' },
            { label: 'Open', value: 'step-2' },
            { label: 'Unqualified', value: 'step-3' },
            { label: 'Nurturing', value: 'step-4' },
            { label: 'Closed', value: 'step-5' }
        ]);*/
        
        helper.getSteps(component);
    },
    
    handleClick: function(component, event, helper)
    {
        console.log('hi');
    }
});