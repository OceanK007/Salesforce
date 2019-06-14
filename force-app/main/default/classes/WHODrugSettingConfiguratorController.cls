/**
* @author Sapient
* @date 5/17/2019
* @description Contains all services required for the WHODrug Setting Configurator
* @group WHODrug Service
*/
public with sharing class WHODrugSettingConfiguratorController {
    
     /*******************************************************************************************************
     * @description Fetch WHODrug Custom Settings labels, helptext, required and value of fields    
     * @return Label, helptext, required and value fields from MedDRA custom settings        
     * @example    
     * WhoDrugSettingConfiguratorController.getDetails();
     */
	@AuraEnabled
    public static Map<String,Map<String,String>> getDetails() 
    {
        Map<String,Map<String,String>> detailsMap = new Map<String,Map<String,String>>();
        String labelText = null;
        String helpText = null;
        Boolean isNillable = true;
        List<String> fieldsList = new List<String>();
        String fieldsString = null;
        ivpcc__WHODrug_Settings__c whoDrugRecord = new ivpcc__WHODrug_Settings__c();

        /* START: Fetching WHODrug Setting Field Details */
        Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
        Schema.SObjectType leadSchema = schemaMap.get('ivpcc__WHODrug_Settings__c');
        Map<String, Schema.SObjectField> fieldMap = leadSchema.getDescribe().fields.getMap();	

        for (String fieldName: fieldMap.keySet()) 
        {
            if(fieldName.equalsIgnoreCase('id') || fieldName.equalsIgnoreCase('name') || fieldName.contains('__c'))
            {
                Schema.DescribeFieldResult fieldDetails = fieldMap.get(fieldName).getDescribe(); 
                labelText = fieldDetails.getLabel();
                helpText = fieldDetails.getInlineHelpText();
                isNillable = fieldDetails.isNillable();
                Map<String,String> description = new Map<String,String>();
                description.put('label', labelText);
                description.put('helptext', helpText);
                description.put('required', (isNillable == false ? 'true' : 'false'));
                detailsMap.put(fieldName, description);
                
                /* Adding field names in List */
                fieldsList.add(fieldName);
            }            
        }
        
        /* END: Fetching WHODrug Setting Field Details */
        
        /* START: Creating Field Query to fetch data and Updating detailsMap with field value */
        fieldsString = String.join(fieldsList,',');        
        List<ivpcc__WHODrug_Settings__c> records = Database.query('SELECT '+fieldsString+' FROM ivpcc__WHODrug_Settings__c');
        if(records.size() != 0)
            whoDrugRecord = records[0];
        
        for(String fieldAPI : fieldsList)
        {
            Map<String,String> updatedValue = detailsMap.get(fieldAPI);
            
            switch on fieldAPI.toLowerCase()
            {
             	when 'id' 
                {
                	updatedValue.put('value', whoDrugRecord.id);
                    updatedValue.put('type', 'text');
                }
            	when 'name'
                {
                    updatedValue.put('value', whoDrugRecord.name);
                    updatedValue.put('type', 'text');
                }
                when 'ivpcc__products_types_api_path__c'
                {
                    updatedValue.put('value', whoDrugRecord.ivpcc__products_types_api_path__c);
                    updatedValue.put('type', 'text');
                }
                when 'ivpcc__search_products_api_path__c'
                {
                    updatedValue.put('value', whoDrugRecord.ivpcc__search_products_api_path__c);
                    updatedValue.put('type', 'text');
                }
                when 'ivpcc__typeaheads_api_path__c'
                {
                    updatedValue.put('value', whoDrugRecord.ivpcc__typeaheads_api_path__c);
                    updatedValue.put('type', 'text');
                }
				when 'ivpcc__page_group_size__c'
                {
                    updatedValue.put('value', String.valueOf(whoDrugRecord.ivpcc__page_group_size__c));
                    updatedValue.put('type', 'number');
                }
                when 'ivpcc__rows_per_page__c'
                {
                    updatedValue.put('value', String.valueOf(whoDrugRecord.ivpcc__rows_per_page__c));
                    updatedValue.put('type', 'number');
                }
            }
            
            detailsMap.put(fieldAPI, updatedValue);
        }
        /* END: Creating Field Query to fetch data and Updating detailsMap with field value */
                
        return detailsMap;
    }
        
     /*******************************************************************************************************
     * @description Fetch WHODrug custom setting Record    
     * @return Updated WHODrug custom setting record
     * @param record WHODrug custom setting record
     * @example    
	 * WhoDrugSettingConfiguratorController.upsertWhoDrugSettingsRecord({Id: "a080r0000006lCKAAY", Name: "TestWhoDrug", ivpcc__Products_Types_API_Path__c: "Path1", ivpcc__Search_Products_API_Path__c: "Path2", ivpcc__Typeaheads_API_Path__c: "Path4"});
     */
    @AuraEnabled
    public static ivpcc__WHODrug_Settings__c upsertWhoDrugSettingsRecord(ivpcc__WHODrug_Settings__c record) 
    {
       	try
        {                
            upsert record;
            return record;
        }
        catch(Exception ex)
        {            
            throw ex;
        }
    }
}