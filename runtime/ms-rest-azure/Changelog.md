### 3.0.1 (11/10/2021)
- Change the dependencies of adal-node from 0.1.28 to 0.2.2. for issue [issue #5215](https://github.com/Azure/azure-sdk-for-node/issues/5212)  
- Remove unused dependency on `moment`. For issue [issue #5157](https://github.com/Azure/azure-sdk-for-node/issues/5157)

### 3.0.0 (07/11/2019)
- Remove leading dot from azure environment settings. This fixes [issue #4706](https://github.com/Azure/azure-sdk-for-node/issues/4706) via the [PR 5101](https://github.com/Azure/azure-sdk-for-node/pull/5101)

### 2.6.0 (01/09/2019)
- Add support for custom MSI endpoint & api version when creating `MSIVmTokenCredentials`. This fixes [issue #2836](https://github.com/Azure/azure-sdk-for-node/issues/2836) via the [PR 4528](https://github.com/Azure/azure-sdk-for-node/pull/4528)

### 2.5.9 (09/26/2018)
- Add `request` as a dependency since `MSIVmTokenCredentials` and `MSIAppServiceTokenCredentials` use it directly.
- Update `ms-rest` version dependency to 2.3.7

### 2.5.7 (06/12/2018)
- Added `validateAuthority` to AzureEnvironment type definitions

### 2.5.6 (06/12/2018)
- Updated vulnerable dependencies

### 2.5.5 (03/12/2018)
- Added an `interface TokenResponse` that extends `adal.TokenResponse`. This interface would be the return type of `getToken()` method on the credential classes.
- Added `getToken()` method on `DeviceTokenCredentials` to make it consistent with other credential classes.
- Improved the parsing logic for `MSITokenCredentials` there by standardizing the property names of the `TokenResponse` that is received from MSI or adal (sp, interactive, user) authentication.
- Ensured tokenAudience option is used when provided, while acquiring the userCode and token with deviceCode in interactive login.

### 2.5.4 (02/22/2018)
- Moved `RpRegistrationFilter` from `ms-rest-azure` to `ms-rest`. This fixes #2367.

### 2.5.3 (01/31/2018)
- Opened up the optional parameter `tokenAudience` for several login methods to accept `'graph'`, `'batch'` or any other resource uri like `'https://vault.azure.net/'`.
- Added `batchResourceId` in all the supported AzureEnvironments.

### 2.5.2 (01/31/2018)
- Migrated `KeyVaultCredentials` from keyvault data-plane and added support for various auth consumption.

### 2.5.1 (01/30/2018)
- Added support for EventGrid TopicCredentials object.

### 2.5.0 (12/28/2017)
- Convert underscore_seperated properties in MSI tokenResponses to CamelCase.

### 2.4.5 (11/17/2017)
- Added `innererror` field to `CloudError` class. #2328

### 2.4.4 (11/07/2017)
- Fixed a bug in the request url creation for AppService MSI.

### 2.4.3 (11/07/2017)
- Fixed a bug (about initializing the resource property in MSITokenCrentials class) in the index.d.ts file.

### 2.4.2 (11/06/2017)
 - Relaxed check for the value of provisioningState property by making it case insensitive.
 - Updated the activeDirectoryEndpointUrl for the `AzureUSGovernment` Azure Environment from `login-us.microsoftonline.com` to `login.microsoftonline.us`
 - Added support for `CognitiveServicesCredentials`.
 - Added support for `MSIAppServiceTokenCredentials` and `loginWithAppServiceMSI()` #2292.

### 2.4.1 (10/11/2017)
- Restricted dependency on "moment" from "^2.18.1" to "~2.18.1" due to bugs in 2.19.0

### 2.4.0 (10/03/2017)
- Bug fix: Renamed `loginwithAuthFile` to `loginWithAuthFile`.

### 2.3.5 (09/29/2017)
- Added retry logic for interactiveLogin if 'authorization_pending' error is received as pointed in issue #2002.

### 2.3.4 (09/29/2017)
- Updated version of dependencies like async, uuid and moment.

### 2.3.3 (09/22/2017)
- With latest changes in the service code, domain is no more a required parameter for MSITokenCredentials.

### 2.3.2 (09/21/2017)
- Fixed bugs in index.d.ts related to MSITokenCredentials and loginWithMSI method
- Fixed bugs in the MSITokenCredentials class

### 2.3.1 (09/11/2017)
- Fixed endpoint information for Azure environments
- Added typings for authfile and msi auth

### 2.3.0 (08/25/2017)
- Added support to authenticate using service principal from auth file. #2225
- Added support for polling PATCH operation with 201 initial response.
- Added support for authenticating via MSI on an Azure VM with managed identity #2224
- Fixed issues #2245, #2247

### 2.2.3 (7/14/2017)
- Hot fix for RP Registration Filter for new subscription scenario.
- Return the original response with 409 status code if auto RP registration failed.

### 2.2.1 (6/29/2017)
- Updated AzureServiceClientOptions type definitions.
- Updated dependency of ms-rest to ^2.2.1.

### 2.2.0 (6/23/2017)
- Added support for automatic RP registration by adding a filter in the request pipeline.

### 2.1.2 (4/29/2017)
- Updated minimum dependency on `"ms-rest"` to `"^2.2.0"` to ensure the new fixes in ms-rest are consumed.

### 2.1.1 (4/14/2017)
- Updated minimum dependency on `"ms-rest"` to `"^2.1.0"` to ensure the new fixes in ms-rest are consumed.

### 2.1.0 (4/5/2017)
- Removed the dependency on azure-arm-resource and made subscription client local to ms-rest-azure
- Added WithAuthResponse flavor login methods so that the user can get credentials and subscriptions when the Promise is resolved. These flavors look as follows:
```javascript
function interactiveLoginWithAuthResponse(options?: InteractiveLoginOptions): Promise<AuthResponse>;
function loginWithServicePrincipalSecretWithAuthResponse(clientId: string, secret: string, domain: string, options?: AzureTokenCredentialsOptions): Promise<AuthResponse>;
function loginWithUsernamePasswordWithAuthResponse(username: string, password: string, options?: LoginWithUsernamePasswordOptions): Promise<AuthResponse>;
```
where AuthResponse looks like this:
```javascript
export interface AuthResponse {
  credentials: DeviceTokenCredentials | ApplicationTokenCredentials | UserTokenCredentials;
  subscriptions: Array<LinkedSubscription>;
}
```
- Note: Moving forward, the login functionality will be moved out of ms-rest-azure into a different package. This needs to be done for us to move towards supporting an isomorphic javascript library.

### 2.0.1 (4/3/2017)
- Updated the azure-arm-resource dependency to "^2.0.0-preview".

### 2.0.0 (3/28/2017)
- Minimum required node.js version is 6.10
- Added support for generic request and generic long running operation request
- Added support for sending ms-rest and ms-rest-azure versions in the user-agent header for telemetry
- Added Promise support and made callback as an optional last parameter to the signature of the exposed methods in the runtime.
- Moved to ES6 syntax.
- Updated type definition (.d.ts) files that are compatible with 2.2.1 version of TypeScript.
