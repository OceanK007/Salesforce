/**
* @author Sapient
* @date 5/20/2019
* @description Contains all services required to Change Language
* @group Change Language Service
*/
public with sharing class ChangeLanguageController 
{
     /*******************************************************************************************************
     * @description Fetch available Languages and user language
     * @return Map with available languages and user language 
     * @example    
     * ChangeLanguageController.getLanguage();
     */
    @AuraEnabled
    public static Map<String, Object> getLanguage()
    {  
		Map<String, Object> result = new Map<String, Object>();
        
        List<Languages__mdt> languages = new List<Languages__mdt>();
        List<Languages__mdt> nonCurrentlanguages = new List<Languages__mdt>();                    
        String userLanguage = UserInfo.getLanguage();

        if(userLanguage == 'zh_TW'){
            userLanguage = 'zh_CN';
        }

        if(userLanguage != 'ja' && userLanguage != 'en_US' && userLanguage != 'zh_CN'){
            userLanguage = 'en_US';         
        }

        for (Languages__mdt languageMapping : [SELECT MasterLabel, DeveloperName,ivpcc__ISO2CharCode__c FROM Languages__mdt]) 
        {
            if(languageMapping.DeveloperName == userLanguage)
                languages.add(languageMapping);
            else
                nonCurrentlanguages.add(languageMapping);
        }        

        if(!languages.isEmpty() || !nonCurrentlanguages.isEmpty()){
            languages.addAll(nonCurrentlanguages);       
        }

        result.put('languages', languages);
        result.put('userLanguage', userLanguage);
        
        return result;
    }
    
     /*******************************************************************************************************
     * @description Update the default language for user 
     * @return Update Language LocaleKey for user
     * @param LanguageLocale as string
     * @example    
	 * ChangeLanguageController.updateLanguage('en_US');
     */
    @AuraEnabled
    public static String updateLanguage(String languageLocale) 
    {
       	try
        {                
            String currentuserId = UserInfo.getUserId();
        	User currentUserInfo = [select LanguageLocaleKey from User where Id = :UserInfo.getUserId()];
            currentUserInfo.LanguageLocaleKey = languageLocale;
			update currentUserInfo;
            return currentUserInfo.LanguageLocaleKey;
        }
        catch(Exception ex)
        {            
            throw ex;
        }
    }
}