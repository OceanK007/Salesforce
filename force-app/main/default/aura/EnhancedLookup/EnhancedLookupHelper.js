({
	getLookupDetails : function(component) 
    {
        console.log("getLookupDetails");
        component.set("v.searchKeyWord","");
        
        var setupObject = component.get("v.setupObject");
        if(setupObject == null) return ;
        
        var recordId = component.get("v.recordId");
        var sObject = component.get("v.sObject");
        var objectAPI = setupObject.objectAPI;
        var lookupFieldAPI = setupObject.lookupFieldAPI;
        var lookupObjectAPI = setupObject.lookupObjectAPI;
        var lookupObjectFieldAPI = setupObject.lookupObjectFieldAPI;
        
        if(sObject == null)
        {
            sObject = {};
        }
        
        component.set('v.sObject', sObject);
        
        //console.log(objectAPI);
        //console.log(lookupFieldAPI);
        //console.log(lookupObjectAPI);
        //console.log(recordId);
                
        var action = component.get("c.getEnhancedLookupDetails");        
        action.setParams({
            "objectAPI" : objectAPI,
            "lookupFieldAPI" : lookupFieldAPI,
            "lookupObjectAPI" : lookupObjectAPI,
            "lookupObjectFieldAPI": lookupObjectFieldAPI,
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
                    if(key.toLowerCase() === lookupFieldAPI.toLowerCase())
                    {
                        component.set("v.lookupLabel", result[key].label);
                        component.set("v.lookupAvailableValues", result[key].availableValues);
                        component.set("v.searchKeyWordResults", result[key].availableValues.sort());
                        component.set("v.lookupFieldDetails", result[key].value);
                        
                        var lookupFieldDetails = result[key].value;
                        console.log("lookupFieldDetails: "+lookupFieldDetails);
                        console.log("result[key]: "+JSON.stringify(result[key]));
                        if(lookupFieldDetails != undefined & lookupFieldDetails != '')
                        {
                            for (var i = 0; i < result[key].availableValues.length; i++) 
                            { 
                                var obj = result[key].availableValues[i];
                                console.log("Testing...."+obj.id+" | lookupFieldDetails: "+lookupFieldDetails);
                                if(obj.id == lookupFieldDetails)
                                {
                                    console.log('set');
                                    component.set("v.searchKeyWord", obj.value);
                                }
                                //console.log("Testing...."+JSON.stringify(obj.id));
                            }
                            /* Setting sObject value for lookupFieldDetails */
                            sObject[lookupFieldAPI] = lookupFieldDetails;
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
		let lookupAvailableValues = component.get("v.lookupAvailableValues");
        
        if(searchKeyWord != undefined && searchKeyWord != '')
        {
            var searchResults = [];
            for(var key in lookupAvailableValues)
            {
                var record = lookupAvailableValues[key];
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
            component.set("v.searchKeyWordResults", lookupAvailableValues);
        }
        
        this.displayDropDown(component);
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
        component.set("v.lookupFieldDetails", event.currentTarget.id);
        
        var sObject = {};//component.get("v.sObject");
        var lookupFieldAPI = component.get("v.setupObject").lookupFieldAPI;        
        sObject[lookupFieldAPI] = event.currentTarget.id;    
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