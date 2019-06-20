({
	getCombinationUnitDetails : function(component) 
    {
        var combinationUnitInputObjectAPI = component.get("v.combinationUnitInputObjectAPI");
        var combinationUnitInputFieldAPI = component.get("v.combinationUnitInputFieldAPI");
        var combinationUnitLookupFieldAPI = component.get("v.combinationUnitLookupFieldAPI");
        var combinationUnitLookupObjectAPI = component.get("v.combinationUnitLookupObjectAPI");
        var recordId = component.get("v.recordId");
        var sObject = component.get("v.sObject");
        if(sObject == null)
        {
            sObject = {};
        }
        
        //console.log(combinationUnitInputObjectAPI);
        //console.log(combinationUnitInputFieldAPI);
        //console.log(combinationUnitLookupFieldAPI);
        //console.log(combinationUnitLookupObjectAPI);
        //console.log(recordId);
                
        var action = component.get("c.getCombinationUnitDetails");        
        action.setParams({
            "combinationUnitInputObjectAPI" : combinationUnitInputObjectAPI,
            "combinationUnitInputFieldAPI" : combinationUnitInputFieldAPI,
            "combinationUnitLookupFieldAPI" : combinationUnitLookupFieldAPI,
            "combinationUnitLookupObjectAPI": combinationUnitLookupObjectAPI,
            "recordId": recordId
        });
        action.setCallback(this, function(response) {	
            var state = response.getState();
            if (state === "SUCCESS") {
                let result = response.getReturnValue();
                console.log("JSON: "+JSON.stringify(result));
                
                //let data = [];
                for(var key in result)
                {
                    //data.push({key:key, value:result[key]});
                    console.log('key: '+key+' | value: '+result[key]);
                    if(key.toLowerCase() === combinationUnitInputFieldAPI.toLowerCase())
                    {
                        component.set("v.combinationUnitLabel", result[key].label);
                        component.set("v.combinationUnitInputFieldType", result[key].type);
                        
                        /* Setting sObject value for combinationUnitInputFieldValue */
                        sObject[combinationUnitInputFieldAPI] = result[key].value;
        				component.set('v.sObject', sObject);
                    }
                    if(key.toLowerCase() === combinationUnitLookupFieldAPI.toLowerCase())
                    {
                        component.set("v.combinationUnitLookupFieldAvailableValues", result[key].availableValues);
                        component.set("v.searchKeyWordResults", result[key].availableValues.sort());
                        component.set("v.combinationUnitLookupFieldValue", result[key].value);
                        
                        var combinationUnitLookupFieldValue = result[key].value;
                        //console.log("combinationUnitLookupFieldValue: "+combinationUnitLookupFieldValue);
                        //console.log("result[key]: "+JSON.stringify(result[key]));
                        if(combinationUnitLookupFieldValue != undefined & combinationUnitLookupFieldValue != '')
                        {
                            for (var i = 0; i < result[key].availableValues.length; i++) 
                            { 
                                var obj = result[key].availableValues[i];
                                //console.log("Testing...."+obj.id+" | combinationUnitLookupFieldValue: "+combinationUnitLookupFieldValue);
                                if(obj.id == combinationUnitLookupFieldValue)
                                {
                                    console.log('set');
                                    component.set("v.searchKeyWord", obj.value);
                                }
                                //console.log("Testing...."+JSON.stringify(obj.id));
                            }
                            /* Setting sObject value for combinationUnitLookupFieldValue */
                            sObject[combinationUnitLookupFieldAPI] = combinationUnitLookupFieldValue;
                            component.set('v.sObject', sObject);       
                            this.displayResultsBySearchKeyWord(component);
                            component.set("v.showDropDown", false);
                            component.set("v.isDropdownFocused", false);
     						this.displayDropDown(component);
                        }
                    }
                }
                
                console.log("Updated Object: "+JSON.stringify(component.get("v.sObject")));
            }
            else 
            {
            }
        });
        $A.enqueueAction(action);	
	},
        
    displayResultsBySearchKeyWord: function(component) 
    {
    	let searchKeyWord = component.get("v.searchKeyWord");
		let combinationUnitLookupFieldAvailableValues = component.get("v.combinationUnitLookupFieldAvailableValues");
        
        if(searchKeyWord != undefined && searchKeyWord != '')
        {
            var searchResults = [];
            for(var key in combinationUnitLookupFieldAvailableValues)
            {
                var record = combinationUnitLookupFieldAvailableValues[key];
                //console.log(record.id+' | '+record.value);
                if(record.value.toLowerCase().includes(searchKeyWord.toLowerCase()))
                {
                    searchResults.push({"id":record.id, "value":record.value});
                }
            }
            
            component.set("v.searchKeyWordResults", searchResults);
            if(searchResults.length == 0)
            {
                component.set("v.showDropDown", false);
            }
            else
            {
                component.set("v.showDropDown", true);
            }
        }
        else
        {
            component.set("v.showDropDown", true);
            component.set("v.searchKeyWordResults", combinationUnitLookupFieldAvailableValues);
        }
        
        this.displayDropDown(component);
    },
    
    setCombinationUnitInputFieldValue: function(component) 
    {
        var sObject = component.get("v.sObject");
        var combinationUnitInputFieldAPI = component.get("v.combinationUnitInputFieldAPI");
        sObject[combinationUnitInputFieldAPI] = component.find("combinationUnitInputField").get("v.value");
        component.set('v.sObject', sObject);
        
        console.log("Updated Object: "+JSON.stringify(component.get("v.sObject")));
    },
    
    displayDropDown: function(component) 
    {
        var dropdownItems = component.find('dropdownItems');
          
        //console.log("showDropDown: "+component.get('v.showDropDown')+" | isDropdownFocused: "+component.get('v.isDropdownFocused'))
        if(component.get('v.showDropDown') == true)
        {
            $A.util.addClass(dropdownItems, 'slds-is-open');
        }
        else //if(component.get('v.showDropDown') == false || component.get('v.isDropdownFocused') == false)
        {
            $A.util.removeClass(dropdownItems, 'slds-is-open');
        } 
    },
    
    selectItem: function(component, event) 
    {
        console.log("Component: "+event.currentTarget.id);
        console.log("Component: "+event.currentTarget.title);
        
        component.set("v.searchKeyWord", event.currentTarget.title);  
        component.set("v.combinationUnitLookupFieldValue", event.currentTarget.id);
        
        var sObject = component.get("v.sObject");
        var combinationUnitLookupFieldAPI = component.get("v.combinationUnitLookupFieldAPI");        
        sObject[combinationUnitLookupFieldAPI] = event.currentTarget.id;    
        component.set('v.sObject', sObject);
        console.log("Updated Object: "+JSON.stringify(component.get("v.sObject")));
        
        this.displayResultsBySearchKeyWord(component);
        
        component.set("v.showDropDown", false);
        component.set("v.isDropdownFocused", false);
    },
    
    searchInputFocus: function(component) {
        //console.log('searchInputFocus');
        component.set("v.showDropDown", true);
     	this.displayDropDown(component);
    },
    
    searchInputBlur: function(component) {
        //console.log('searchInputBlur');
        if(component.get("v.isDropdownFocused") == true)
        {
			component.set("v.showDropDown", true);            
        }
        else
        {
            component.set("v.showDropDown", false);  
        }
        this.displayDropDown(component);
    },
     
    focusDropdown: function(component) {  
        //console.log('focusDropDown');
        if(component.get("v.showDropDown") == true)
        {
            component.set("v.isDropdownFocused", true);
        }
        else
        {
            component.set("v.isDropdownFocused", false);
        }
        
        this.displayDropDown(component);
    },
    
    blurDropdown: function(component) {
        //console.log('blurDropdown');
        component.set("v.showDropDown", false);
        component.set("v.isDropdownFocused", false);
        this.displayDropDown(component);
    }
})