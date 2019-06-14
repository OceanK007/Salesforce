@isTest()
private class ChangeLanguageControllerTest 
{
	@testSetup static void setupTestData() 
    {
        
    }
    
    @isTest()
    private static void testgetLanguage()
    {
        Profile p = [SELECT Id FROM Profile WHERE Name='Standard User']; 
        User jaUser = new User(Alias = 'standtja', Email='standarduserja@testorg.com', 
            EmailEncodingKey='UTF-8', LastName='Testing', LanguageLocaleKey='ja', 
            LocaleSidKey='ja', ProfileId = p.Id, 
            TimeZoneSidKey='America/Los_Angeles', UserName='standarduserja@testorg.com');
        
        User en_USUser = new User(Alias = 'stden_US', Email='standarduseren_US@testorg.com', 
            EmailEncodingKey='UTF-8', LastName='Testing', LanguageLocaleKey='en_US', 
            LocaleSidKey='en_US', ProfileId = p.Id, 
            TimeZoneSidKey='America/Los_Angeles', UserName='standarduseren_US@testorg.com');
        
        User zh_TWUser = new User(Alias = 'stdzh_TW', Email='standarduserzh_TW@testorg.com', 
            EmailEncodingKey='UTF-8', LastName='Testing', LanguageLocaleKey='zh_TW', 
            LocaleSidKey='zh_TW', ProfileId = p.Id, 
            TimeZoneSidKey='America/Los_Angeles', UserName='standarduserzh_TW@testorg.com');
        
        User zh_CNUser = new User(Alias = 'stdzh_CN', Email='standarduserzh_CN@testorg.com', 
            EmailEncodingKey='UTF-8', LastName='Testingzh_CN', LanguageLocaleKey='zh_CN', 
            LocaleSidKey='zh_CN', ProfileId = p.Id, 
            TimeZoneSidKey='America/Los_Angeles', UserName='standarduserzh_CN@testorg.com');
        
        User es_MXUser = new User(Alias = 'stdes_MX', Email='standarduseres_MX@testorg.com', 
            EmailEncodingKey='UTF-8', LastName='Testing', LanguageLocaleKey='es_MX', 
            LocaleSidKey='es_MX', ProfileId = p.Id, 
            TimeZoneSidKey='America/Los_Angeles', UserName='standarduseres_MX@testorg.com');
        
        Map<String,Object> languages = new Map<String,Object>();
        
        languages = ChangeLanguageController.getLanguage();
        
        Test.startTest();
        
        System.runAs(jaUser) 
        {
        	languages = ChangeLanguageController.getLanguage();
            System.assertEquals(languages.size() > 1 , true);
            System.assertEquals(languages.get('userLanguage'), jaUser.LanguageLocaleKey);
        }
        
        System.runAs(en_USUser) 
        {
        	languages = ChangeLanguageController.getLanguage();
            System.assertEquals(languages.size() > 1 , true);
            System.assertEquals(languages.get('userLanguage'), en_USUser.LanguageLocaleKey);
        }
        
        System.runAs(zh_TWUser) 
        {
        	languages = ChangeLanguageController.getLanguage();
            System.assertEquals(languages.size() > 1 , true);
            System.assertEquals(languages.get('userLanguage'), zh_CNUser.LanguageLocaleKey);
        }
        
        System.runAs(zh_CNUser) 
        {
        	languages = ChangeLanguageController.getLanguage();
            System.assertEquals(languages.size() > 1 , true);
            System.assertEquals(languages.get('userLanguage'), zh_CNUser.LanguageLocaleKey);
        }
        
        System.runAs(es_MXUser) 
        {
        	languages = ChangeLanguageController.getLanguage();
            System.assertEquals(languages.size() > 1 , true);
            System.assertEquals(languages.get('userLanguage'), en_USUser.LanguageLocaleKey);
        }
        
        Test.stopTest();
    }
    
    @isTest()
    private static void testupdateLanguage()
    {
        Profile p = [SELECT Id FROM Profile WHERE Name='Standard User']; 
        
        User jaUser = new User(Alias = 'standtja', Email='standarduserja@testorg.com', 
                               EmailEncodingKey='UTF-8', LastName='Testing', LanguageLocaleKey='ja', 
                               LocaleSidKey='ja', ProfileId = p.Id, 
                               TimeZoneSidKey='America/Los_Angeles', UserName='standarduserja@testorg.com');
        insert jaUser;
        
        Test.startTest();
        System.runAs(jaUser) 
        {      
            String language = ChangeLanguageController.updateLanguage('en_US');
            System.assertEquals('en_US', language);
            
            try 
            {
                String language2 = ChangeLanguageController.updateLanguage(null);
            } 
            catch(Exception e) 
            {
                System.assert(e instanceof DmlException);
            }
        }
        Test.stopTest();
    }
}