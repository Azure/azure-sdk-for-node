
# Creating a ServicePrincipal for scripting scenarios
One does not want to login interactively all the time. Azure provides service principal authentication as a secure way for silent login.

## Via Portal
[This article](https://azure.microsoft.com/en-us/documentation/articles/resource-group-create-service-principal-portal/) provides detailed steps on creating a service principal via portal.

## Via XplatCLI
Pre-requisite:
- Install the latest version of cli from the [latest github release](https://github.com/Azure/azure-xplat-cli/releases) or from [npm](https://npmjs.com/package/azure-cli).

```bash
npm uninstall azure-cli -g
npm cache clear -g
npm install azure-cli -g
```
- Login to the azure-cli via azure login command to create a service principal for future use.
  - For 2FA enabled user accounts  `azure login`
  - For non 2FA enabled user accounts `azure login -u user1@constosocorp.com`

After successful login, please follow the steps mentioned below to create a serviceprincipal:

#### Step 1. Create an aplication

Let us create an application with a password. The default start-date witll be the day of application creation and the default end-date will be 1 year from the day of creation.
```
D:\sdk>azure ad app create -n testap908 home-page http://www.bing.com --identifier-uris https://testap674.com/home -p P@ssw0rd
info:    Executing command ad app create
+ Creating application testap674
data:    AppId:                   56894bd4-0fde-41d8-a0d7-5bsslccety2
data:    ObjectId:                g565675e8-7c30-908t-8548-87r98ew7rej
data:    DisplayName:             testap674
data:    IdentifierUris:          0=https://testap674.com/home
data:    ReplyUrls:
data:    AvailableToOtherTenants:  False
data:    AppPermissions:
data:                             claimValue:  user_impersonation
data:                             description:  Allow the application to access testap674 on behalf of the signed-in user.
data:                             directAccessGrantTypes:
data:                             displayName:  Access testap674
data:                             impersonationAccessGrantTypes:  impersonated=User, impersonator=Application
data:                             isDisabled:
data:                             origin:  Application
data:                             permissionId:  12345698ui-fa71-4ab0-b647-fdajfhdakfh789
data:                             resourceScopeType:  Personal
data:                             userConsentDescription:  Allow the application to access testap674 on your behalf.
data:                             userConsentDisplayName:  Access testap674
data:                             lang:
info:    ad app create command OK
```

#### Step 2. Create a ServicePrincipal with the applicationId

Let us create a serviceprincipal using the applicationId from the previous step.
```
D:\sdk>node bin/azure ad sp create --aplicationId 56894bd4-0fde-41d8-a0d7-5bsslccety2
info:    Executing command ad sp create
+ Creating service principal for application 56894bd4-0fde-41d8-a0d7-5bsslccety2
data:    Object Id:               weewrerer-e329-4e9b-98c6-7878787
data:    Display Name:            testap674
data:    Service Principal Names:
data:                             56894bd4-0fde-41d8-a0d7-5bsslccety2
data:                             https://testap674.com/home
info:    ad sp create command OK
```

#### Step 3. Assigning a role to a ServicePrincipal by using the spn

- You can get a list of available roles by ```azure role list```
- In this example we are creating the serviceprincipal as a Contributor at the subscription level.
  - Definition of a Contributor
```
data:    Name             : Contributor
data:    Actions          : 0=*
data:    NotActions       : 0=Microsoft.Authorization/*/Delete, 1=Microsoft.Authorization/*/Write
data:    IsCustom         : false
```
This will associate the serviceprincipal to your current subscription
```
D:\sdk>node bin/azure role assignment create --spn 56894bd4-0fde-41d8-a0d7-5bsslccety2 -o Contributor
info:    Executing command role assignment create
+ Finding role with specified name
/data:    RoleAssignmentId     : /subscriptions/abcdefgh-1234-4cc9-89b5-12345678/providers/Microsoft.Authorization/roleAssignments/987654-ea85-40a5-80c2-abcdferghtt
data:    RoleDefinitionName   : Contributor
data:    RoleDefinitionId     : jhfskjf-6180-42a0-ab88-5656eiu677e23e
data:    Scope                : /subscriptions/abcdefgh-1234-4cc9-89b5-12345678
data:    Display Name         : testap674
data:    SignInName           :
data:    ObjectId             : weewrerer-e329-4e9b-98c6-7878787
data:    ObjectType           : ServicePrincipal
data:
+
info:    role assignment create command OK
```

#### Step 4. Login as a serviceprincipal
```
D:\sdk>node bin/azure login -u 56894bd4-0fde-41d8-a0d7-5bsslccety2 -p P@ssw0rd --tenant <a guid OR your domain(contosocorp.com) --service-principal
info:    Executing command login
\info:    Added subscription TestSubscription
+
info:    login command OK
```

## Using serviceprincipal authentication in your node.js script
```javascript
 var msrestAzure = require('ms-rest-azure');
 //service principal authentication
 'your-client-id' - is the spn ('56894bd4-0fde-41d8-a0d7-5bsslccety2')
 'your-domain' - is the tenant id (a guid) or the part **after @** in your username (user1@**contosocorp.com**) ('contosocorp.com')
 'your-secret' - is the password you created for the serviceprincipal ('P@ssw0rd')
 var credentials = new msRestAzure.ApplicationTokenCredentials('your-client-id', 'your-domain', 'your-secret');
 ```

## Using user authentitcation in your node.js script
Currently, the node sdk only supports users with org-id (organizational account) and have 2FA disabled.
 ```javascript
 var msrestAzure = require('ms-rest-azure');
 //user authentication
 'your-client-id' - is the id provided by Azure Active Directory for your application
 'your-domain' - is the tenant id (a guid) or the part **after @** in your username (user1@**contosocorp.com**) ('contosocorp.com')
 'your-username' - is your username ('user1@contosocorp.com')
 'your-password' - password associated with the username
 'your-redirect-uri' - is the redirect uri for your application. Providing 'http://localhost:8080' should also be fine.
 var credentials = new msRestAzure.UserTokenCredentials('your-client-id', 'your-domain', 'your-username', 'your-password', 'your-redirect-uri');
 ```
