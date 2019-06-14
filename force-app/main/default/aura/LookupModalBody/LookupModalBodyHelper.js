({
	loadDataBySearchKeyword : function(component) 
    {
		//document.getElementById('dataTableDiv').focus();  // Not working and not allowing to display modal
        
        var searchKeyword = component.get("v.searchKeyword");
        if(searchKeyword != undefined)
        {
            if(searchKeyword.length > 0) 
            {
                this.getRecordsBySearchKeyword(component);
            }
        }
	},
    
    fetchRecordsFromDatabase: function(component) 
    {
        return new Promise($A.getCallback(function(resolve)
        {
            var inputValue = component.get("v.searchKeyword");
            
            var action = component.get("c.getRecords"); 
            var inputParameters =  {
                                       "objectAPIName" : component.get("v.objectAPIName"),
                                       "searchFieldAPIName" : component.get("v.searchFieldAPIName"),
                                       "displayColumnsAPINames" : component.get("v.displayColumnsAPINames"),
                                       "searchKeyword" : ((inputValue != undefined && inputValue.trim().length >=1) ? inputValue.trim() : null),
                                       "searchOrder" : component.get("v.sortedDirection"),
                                       "queryOffset" : component.get("v.queryOffset") ,
                                       "queryLimit" : component.get("v.queryLimit") ,
                                       "orderByFieldAPI": component.get("v.sortedBy")
                                   };
            action.setParams({
                "inputParameters": JSON.stringify(inputParameters)
            });
            action.setCallback(this, function(response) {	
                var state = response.getState();
                if (state === "SUCCESS") {
                    let dataObject = response.getReturnValue();
                    resolve(dataObject);
                    console.log("Modal: "+JSON.stringify(dataObject)); 
                }
                else {
                }
            });
            $A.enqueueAction(action);                                
		}));
    },
    
    getRecordsBySearchKeyword: function(component) {
        var self = this;
        
        component.set("v.enableInfiniteLoading", false);
       	self.fetchRecordsFromDatabase(component).then(function(dataObject)
        {
            self.setDataTableConfiguration(component, dataObject);
            component.set("v.enableInfiniteLoading", true);
        });
	},
    
    setDataTableConfiguration: function(component, dataObject) {        
        var totalNumberOfRows = dataObject.totalRecords;
        var recordList = dataObject.recordList;
        
        this.setDataTableColumns(component);
        component.set("v.totalNumberOfRows", totalNumberOfRows);
        component.set("v.data", component.get("v.data").concat(recordList)); 
        component.set("v.queryOffset", component.get("v.data").length);
        console.log("data: "+JSON.stringify(component.get("v.data")));
        console.log("queryOffset: "+component.get("v.queryOffset"));
    },
    
    setDataTableColumns: function(component) {
        var columns = [];
        var fields = component.get("v.objectAPIDetails").fields;
        
        for (var key in fields)
        {
            if(key != 'Id')
            {
            	columns.push({ label: fields[key], fieldName: key, type: 'text', sortable: true });   
            }
        }
        component.set('v.columns', columns);	
    },
    
    handleSearchKeywordChange: function(component, event) 
    {
        //console.log("handler");
        //console.log(event.getParams());
        //var searchKeyWord = event.getParam("searchKeyword");
        //console.log("searchKeyword: "+searchKeyword);
        
        component.set("v.queryOffset", "0");
        component.set("v.data", []); 
        component.set("v.sortedBy", component.get("v.orderByFieldAPI"));
        component.set("v.sortedDirection", component.get("v.searchOrder"));
        console.log("test");
        this.loadDataBySearchKeyword(component);
    },
    
    updateSelectedRecord: function(component, event) 
    {
        var selectedRows = event.getParam('selectedRows');
        //console.log("SelectedRows: "+JSON.stringify(selectedRows));
        component.set('v.selectedRecord', selectedRows[0]);
        component.set('v.isModalOpen', false);
        
        component.find("overlayLib").notifyClose();
    },
    
    loadMoreData: function (component, event) 
    {
		console.log("Loading More Data");
        var totalNumberOfRows = component.get("v.totalNumberOfRows");
        var queryLimit = component.get("v.queryLimit");
        var queryOffset = component.get("v.queryOffset");
        
        if(queryOffset < totalNumberOfRows)
        {
            var self = this;
            
            event.getSource().set("v.isLoading", true);
        	component.set('v.loadMoreStatus', 'Loading');
            
            self.fetchRecordsFromDatabase(component).then(function(dataObject)
            {
                component.set('v.loadMoreStatus', '');
                event.getSource().set("v.isLoading", false);
                self.setDataTableConfiguration(component, dataObject);
            });
        }
        else
        {
            console.log("Not Loading Anymore | totalNumberOfRows : "+totalNumberOfRows+" | queryOffset: "+queryOffset);
            component.set('v.loadMoreStatus', 'No more data to load');
        }
    },
    
    updateColumnSorting: function(component, event)
    {
        var self = this;
        
        console.log("Sorting");
        
        component.set("v.queryOffset", "0");
        component.set("v.data", []);
        
        component.set('v.loadMoreStatus', 'Loading');
        
        var fieldName = event.getParam('fieldName');
        var sortDirection = event.getParam('sortDirection');
        
        component.set("v.sortedBy", fieldName);
        component.set("v.sortedDirection", sortDirection);
        
        component.set("v.enableInfiniteLoading", false);
        self.fetchRecordsFromDatabase(component).then(function(dataObject)
        {
            self.setDataTableConfiguration(component, dataObject);
            component.set("v.enableInfiniteLoading", true);
        });
    }
})