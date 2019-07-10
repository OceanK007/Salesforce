public with sharing class DynamicComponentGeneratorWithCusSetting 
{
    @AuraEnabled
	public static TriggerCustomSetting__c getCustomSettingDetails()
    {
        TriggerCustomSetting__c finalCustomSetting = null;
        TriggerCustomSetting__c orgRecord = TriggerCustomSetting__c.getValues(UserInfo.getOrganizationId());
        TriggerCustomSetting__c profileRecord = TriggerCustomSetting__c.getValues(UserInfo.getProfileId());
        TriggerCustomSetting__c userRecord = TriggerCustomSetting__c.getValues(UserInfo.getUserId());
        System.debug('orgRecord: '+orgRecord);
        System.debug('profileRecord: '+profileRecord);
        System.debug('userRecord: '+userRecord);
        
        if(userRecord != null)
        {
            finalCustomSetting = userRecord;
        }
        else
        {
            if(profileRecord != null)
            {
                finalCustomSetting = profileRecord;
            }
            else
            {
                finalCustomSetting = orgRecord;
            }
        }
        
        return finalCustomSetting;
    }
}