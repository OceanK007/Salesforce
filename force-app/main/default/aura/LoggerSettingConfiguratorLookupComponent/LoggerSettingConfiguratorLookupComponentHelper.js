({
	setupInitialValues : function(component) {
		component.set("v.displayRecentFiveRecordsDiv", false);
        component.set("v.displayTypeHeadDiv", false);
	},
    
    inputBoxFocus: function(component) {
        let recentFiveRecords = component.get("v.recentFiveRecords");
        console.log("Component: "+JSON.stringify(recentFiveRecords));
        //component.set("v.displayRecentFiveRecordsDiv", true);
        this.displayRecentFiveRecordsDiv(component);
        this.displayTypeHeadDiv(component);
    },
    
    inputBoxBlur: function(component) {
        component.set("v.displayRecentFiveRecordsDiv", false);
        component.set("v.displayTypeHeadDiv", false);
    },
    
    onRecordSelect: function(component, event) {
        //console.log("Component: "+event.currentTarget.id);
        //console.log("Component: "+event.currentTarget.title);
        var selectedRecord = {"Id": event.currentTarget.id, "Name": event.currentTarget.title};
        component.set("v.selectedRecord", selectedRecord);
        var isModalOpen = component.get("v.isModalOpen");
        if(isModalOpen == true)
        {
            component.find("overlayLib2").notifyClose();
        }
        component.set("v.isModalOpen", false);
    },
    
    inputOnChange: function(component) {
        this.displayTypeHeadDiv(component);
        this.findFromRecentRecords(component);
    },
    
    displayRecentFiveRecordsDiv: function(component) {
        var recentFiveRecords = component.get("v.recentFiveRecords");
        console.log("recentFiveRecords: "+JSON.stringify(recentFiveRecords));
    	if(recentFiveRecords != undefined && recentFiveRecords.length > 0)    
        {
            component.set("v.displayRecentFiveRecordsDiv", true);
        }
        else
        {
            component.set("v.displayRecentFiveRecordsDiv", false);
        }
    },
    
    displayTypeHeadDiv: function(component) {
        var inputValue = component.get("v.searchKeyword");
  		if(inputValue != undefined && inputValue.trim().length >=2)
        {
            component.set("v.displayTypeHeadDiv", true);
        }
        else
        {
            component.set("v.displayTypeHeadDiv", false);
        }
    },
    
    findFromRecentRecords: function(component) {
        var inputValue = component.get("v.searchKeyword");
        if(inputValue != undefined && inputValue.trim().length >=1)
        {
         	let objectAPIDetails = component.get("v.objectAPIDetails");
            let recentFiveRecords = [];
            let recentRecords = objectAPIDetails.recentRecords;
            
            for (var key in recentRecords)
            {
                //console.log("Name: "+recentRecords[key].Name+" | inputValue: "+inputValue);
                if(recentRecords[key].Name.toLowerCase().includes(inputValue.toLowerCase()))
                {
                    if(recentFiveRecords.length < 5)
                    {
                        recentFiveRecords.push(recentRecords[key]);
                    }                    
                }
            }   
            
            this.reRenderRecentFiveRecords(component, recentFiveRecords, null);
            
            if(recentFiveRecords.length < 5) 
            {
            	this.getRecordsBySearchKeyword(component);
            }
        }
        else /* When user removes all characters from input field */
        {
            var objectAPIDetails = component.get("v.objectAPIDetails");
        	component.set("v.recentFiveRecords", objectAPIDetails.recentRecords.slice(0,5));
        }
        
        this.displayRecentFiveRecordsDiv(component);
    },
    
    reRenderRecentFiveRecords: function(component, targetList, sourceList) {
        if(sourceList != null && sourceList.length > 0)
        {
            //console.log("sourceList: "+JSON.stringify(sourceList));
            var existingRecordsIds = targetList.map(function (record) {
              return record.Id;
            });
                       
            //console.log("existingRecordsIds: "+JSON.stringify(existingRecordsIds));
            for (var key in sourceList)
            {
                //console.log("Check: "+(existingRecordsIds.indexOf(sourceList[key].Id)) > -1);
                if(targetList.length < 5)
                {
                    // Adding those which doesn't exist in recentFiveRecords
                    if(existingRecordsIds.indexOf(sourceList[key].Id) == -1)  
                    {
                        targetList.push(sourceList[key]);
                    }
                } 
            }  
        }
        
        console.log("targetList: "+JSON.stringify(targetList));
        if(targetList != null && targetList.length > 0)
        {
            component.set("v.recentFiveRecords", targetList);
        }
        else
        {
            component.set("v.recentFiveRecords", []);
        }
        
        this.displayRecentFiveRecordsDiv(component);
    },
    
    removeSelectedRecord: function(component) {
        var selectedRecord = {"Id": "", "Name": ""};
        component.set("v.selectedRecord", selectedRecord);
        component.set("v.searchKeyword", "");
        this.findFromRecentRecords(component);
        this.focusComponent(component, 'inputbox');
    },
    
    getRecordsBySearchKeyword: function(component) {
        var inputValue = component.get("v.searchKeyword");
            
        var action = component.get("c.getLoggerRecordsBySearchParameters"); 
        var inputParameters =  {
                                   "objectAPIName" : component.get("v.objectAPIName"),
                                   "searchFieldAPIName" : component.get("v.searchFieldAPIName"),
                                   "displayColumnsAPINames" : component.get("v.displayColumnsAPINames"),
            					   "searchKeyword" : ((inputValue != undefined && inputValue.trim().length >=1) ? inputValue.trim() : null),
                                   "searchOrder" : "Desc",
                                   "queryOffset" : 0 ,
                                   "queryLimit" : 10 ,
                                   "orderByFieldAPI": "CreatedDate"
                              };
        action.setParams({
            "inputParameters": JSON.stringify(inputParameters)
        });
        action.setCallback(this, function(response) {	
            var state = response.getState();
            if (state === "SUCCESS") {
                let result = response.getReturnValue();
                console.log("Component: "+JSON.stringify(result)); 
                this.reRenderRecentFiveRecords(component, component.get("v.recentFiveRecords"), result.recordList);
            }
            else {
            }
        });
        $A.enqueueAction(action);	
	},
    
    handleModalDisplay: function(component) 
    {
        var isModalOpen = component.get("v.isModalOpen");

        console.log(isModalOpen);
        if(isModalOpen == false)
        {
            this.createLookupModal(component);
        }
        else
        {
            // Firing event to refresh modal data table with new search keyword
            var compEvent = component.getEvent("refreshModalDataTable");
            //var searchKeyword = component.get('v.searchKeyword');
            //compEvent.setParam("searchKeyword", searchKeyword); 
            //console.log("params");
            //console.log(compEvent.getParam("searchKeyword"));
            //console.log(compEvent.getParams());
            compEvent.fire();
        }
    },
    
    createLookupModal: function(component) 
    {
        $A.createComponents(
        [
            [
                "c:LoggerSettingConfiguratorLookupDataTable", 
                { 
                    iconName : component.getReference("v.iconName"),
                    objectAPIName : component.getReference("v.objectAPIName"),
                    searchFieldAPIName : component.getReference("v.searchFieldAPIName"),
                    displayColumnsAPINames : component.getReference("v.displayColumnsAPINames"),
                    objectAPIDetails : component.getReference("v.objectAPIDetails"),
                    selectedRecord : component.getReference("v.selectedRecord"),
                    isRecordSelected : component.getReference("v.isRecordSelected"),
                    searchKeyword : component.getReference("v.searchKeyword"),
                    isModalOpen : component.getReference("v.isModalOpen"),
                    recentFiveRecords: component.getReference("v.recentFiveRecords")
                }
            ],
            [
                "c:LoggerSettingConfiguratorLookupFooter",{}
            ]
		],
        function(content, status) 
        { 
            if (status === "SUCCESS") 
            {
                var modalBody = content[0];
                var modalFooter = content[1];
                component.find('overlayLib2').showCustomModal({
                    header: component.get("v.objectAPIDetails").objectModalLabel,
                    body: modalBody,                                        
                    showCloseButton: true,
                    footer: modalFooter,
                    cssClass: "slds-modal_large",
                    closeCallback: function() 
                    {
                        component.set("v.isModalOpen", false);
                        console.log('Overlay closed');
                    }
                })
                .then(function(overlay)
                {
                    component.set("v.isModalOpen", true);
                    console.log("Overlay created");
                });
            }  
            else
            {
                component.set("v.isModalOpen", false);
            }
        }); 
    },
    
    focusComponent: function(component, componentAuraId)
    {
        window.setTimeout($A.getCallback(function () 
		{
            component.find(componentAuraId).focus();
            }), 1
        );
    }
})