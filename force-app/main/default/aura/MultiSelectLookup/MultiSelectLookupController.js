({
    sObjectChangeHandler : function(component, event, helper) 
    {
        // Setting already selected records in selecteRecords attribute
        var sObject = component.get("v.sObject");
        //console.log('sObject: '+sObject);
        if(!helper.isObjectEmpty(sObject))
        {
        	component.set("v.selectedRecords", sObject);   
            helper.showLookupPillsDiv(component);
        }
	},
    
	onblur : function(component,event,helper)
    {
        //component.set("v.searchedRecords", null );
        //component.set("v.searchKeyword", '');
        helper.closeContainerDiv(component);
    },
    
    onfocus : function(component,event,helper)
    {
        //helper.showSpinner(component);
        //component.set("v.searchedRecords", null ); 
        helper.searchWithKeyword(component,event,'');	// Calling with blank searchKeyword
        /*if(!helper.isObjectEmpty(component.get("v.searchedRecords")))
        {
            helper.openContainerDiv(component);
        }*/
    },
    
    keyup : function(component, event, helper) 
    {
        //$A.util.addClass(component.find("searchSpinner"), "slds-show");
        helper.showSpinner(component);
        var searchKeyword = component.get("v.searchKeyword");
        //console.log("searchKeyword: "+searchKeyword);
        // check if getInputKeyWord size id more then 0 then open the lookup result List and call the helper else close the lookup result List part.   
        if(searchKeyword.length > 0)
        {
            helper.openContainerDiv(component);
            helper.searchWithKeyword(component,event,searchKeyword);
        }
        else
        {  
            component.set("v.searchedRecords", null ); 
            helper.closeContainerDiv(component);
        }
    },
    
    // function for remove the selected record
    remove :function(component,event,helper)
    {
        var selectedPillId = event.getSource().get("v.name");
        //console.log("selectedPillId: "+selectedPillId);
        var allPills = component.get("v.selectedRecords"); 
        
        // Updating selectedRecords and sObject
        for(var i = 0; i < allPills.length; i++)
        {
            if(allPills[i].key === selectedPillId)
            {
                allPills.splice(i, 1);
                component.set("v.selectedRecords", allPills);
                component.set("v.sObject", allPills);	// Updating sObject
                break;
            }  
        }
        
        // Removing selected icon from searched records
        var searchedRecords = component.get("v.searchedRecords");
        for(var i=0;i<searchedRecords.length;i++)
        {
            if(searchedRecords[i].key === selectedPillId)
            {
				searchedRecords[i].selected = 'false';
                break;
            }
        }
        component.set("v.searchedRecords", searchedRecords);
        
        //component.set("v.searchKeyword",null);
        //component.set("v.searchedRecords", null );      
    },
        
    selectRecord : function(component, event, helper)
    {      
        //component.set("v.searchKeyword",null);
        
        // Adding selected attribute value in searched record
        var selectedAttribute = event.currentTarget.attributes.getNamedItem('data-selected').value;
        //console.log("selected: "+selectedAttribute);
        //console.log("!selected: "+(selectedAttribute == 'true' ? 'false' : (selectedAttribute == 'false' ? 'true' : 'false')));
        var searchedRecords = component.get("v.searchedRecords");
        var selectedRecords =  component.get("v.selectedRecords");
        for(var i=0;i<searchedRecords.length;i++)
        {
            if(searchedRecords[i].key === event.currentTarget.id)
            {
                searchedRecords[i].selected = (selectedAttribute == 'true' ? 'false' : (selectedAttribute == 'false' ? 'true' : 'false'));
                console.log("searchedRecords[i]: "+JSON.stringify(searchedRecords[i]));
                
                if(searchedRecords[i].selected == 'true')
                {   
                    // START: Adding records which are not selected yet i.e. selected = 'false' //
                    if(!JSON.stringify(selectedRecords).includes(event.currentTarget.id))	
                    {
                        var selectedRecord = 
                        {
                            "key": event.currentTarget.id,
                            "value": event.currentTarget.title
                        }
                        selectedRecords.push(selectedRecord);
                    }
                    // END: Adding records which are not selected yet i.e. selected = 'false' //
                }
                else
                {
                    // START: Removing selected = 'false' record from selected records //
                    for(var i=0;i<selectedRecords.length;i++)
                    {
                        if(selectedRecords[i].key === event.currentTarget.id)
                        {
                            selectedRecords.splice(i,1);
                            break;
                        }
                    }
                    // END: Removing selected = 'false' record from selected records //
                }
                
                component.set("v.selectedRecords" , selectedRecords);
                component.set("v.sObject", selectedRecords);	// Updating sObject
                break;
            }
        }
        component.set("v.searchedRecords", searchedRecords);
           
        // Removing selected record from searched records
        /*var searchedRecords = component.get("v.searchedRecords");
        for(var i=0;i<searchedRecords.length;i++)
        {
            if(searchedRecords[i].key === event.currentTarget.id)
            {
                searchedRecords.splice(i,1);
                break;
            }
        }
        component.set("v.searchedRecords",searchedRecords);*/       
        
        // To show lookup-pill div
        helper.showLookupPillsDiv(component);
        
        // To hide searchResult div
        /*helper.closeContainerDiv(component);*/
    }
})