### 2.4.1 (10/11/2017)
- Restricting dependency on "moment" from "^2.18.1" to "~2.18.1" due to bugs in 2.19.0 

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
