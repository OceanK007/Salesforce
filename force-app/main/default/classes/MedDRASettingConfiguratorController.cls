/**
* @author Sapient
* @date 5/16/2019
* @description Contains all services required for the MedDRA Setting Configurator
* @group MedDRA Service
*/
public with sharing class MedDRASettingConfiguratorController {
	
    /*******************************************************************************************************
     * @description Fetch MedDRA Custom Settings Labels    
     * @return Label, helptext and required fields from MedDRA custom settings     
     * @example    
     * MeddraSettingConfiguratorController.getLabels();
     */
    @AuraEnabled
    public static Map<String,Map<String,String>> getLabels() 
    {
        Map<String,Map<String,String>> descriptionMap = new Map<String,Map<String,String>>();
        String labelText = null;
        String helpText = null;
        Boolean isNillable = true;

        Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
        Schema.SObjectType leadSchema = schemaMap.get('ivpcc__Meddra_Settings__c');
        Map<String, Schema.SObjectField> fieldMap = leadSchema.getDescribe().fields.getMap();	// returns all fields    

        for (String fieldName: fieldMap.keySet()) 
        {
            Schema.DescribeFieldResult fieldDetails = fieldMap.get(fieldName).getDescribe(); 
            labelText = fieldDetails.getLabel();
            helpText = fieldDetails.getInlineHelpText();
            isNillable = fieldDetails.isNillable();            
            Map<String,String> description = new Map<String,String>();
            description.put('label', labelText);
            description.put('helptext', helpText);
            description.put('required', (isNillable == false ? 'true' : 'false'));
			descriptionMap.put(fieldName, description);
        }

        return descriptionMap;
    }
    
     /*******************************************************************************************************
     * @description Fetch MedDRA Settings Record    
     * @return MedDRA custom settings record     
     * @example    
     * MeddraSettingConfiguratorController.getMedDRASettingsRecord();
     */
    @AuraEnabled
    public static ivpcc__Meddra_Settings__c getMedDRASettingsRecord()
    {   
        List<ivpcc__Meddra_Settings__c> records = new List<ivpcc__Meddra_Settings__c>([SELECT   Id,
                                                                                                Name,
                                                                                                ivpcc__Event_Hierarchy_API_Path__c,
                                                                                                ivpcc__Event_Terms_By_Hierarchy_Name_API_Path__c,
                                                                                                ivpcc__Include_Synonymn__c,
                                                                                                ivpcc__Japanese_Language_Family__c,
                                                                                                ivpcc__Languages__c,
                                                                                                ivpcc__Levels__c,
                                                                                                ivpcc__MedDRA_terms_from_SMQ_API_Path__c,
                                                                                                ivpcc__SMQ_List_API_Path__c,
                                                                                                ivpcc__Versions__c
                                                                                                FROM ivpcc__Meddra_Settings__c]);
        if(records.size() != 0)
        	return records[0];
        else
            return new ivpcc__Meddra_Settings__c();
    }
    
     /*******************************************************************************************************
     * @description Fetch MedDRA custom setting Record    
     * @return Updated MedDRA custom setting record
     * @param record MedDRA custom setting record
     * @example    
	 * MeddraSettingConfiguratorController.upsertMedDRASettingsRecord({ivpcc__Japanese_Language_Family__c=JA, ivpcc__Languages__c=JA,EN, ivpcc__Include_Synonymn__c=true, ivpcc__SMQ_List_API_Path__c=/v1.0/api/smq-list, ivpcc__Levels__c=MedDRA_PT, MedDRA_LLT, MedDRA_SOC , MedDRA_HLGT, MedDRA_HLT, MedDRA_All_Level, ivpcc__Event_Terms_By_Hierarchy_Name_API_Path__c=/v1.0/api/medra-terms, Id=a010r000000MLUKAA4, ivpcc__MedDRA_terms_from_SMQ_API_Path__c=/v1.0/api/pt-list-by-smq-terms, ivpcc__Event_Hierarchy_API_Path__c=/v1.0/api/medra-event-hierarchy});
     */
    @AuraEnabled
    public static ivpcc__Meddra_Settings__c upsertMedDRASettingsRecord(ivpcc__Meddra_Settings__c record) 
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