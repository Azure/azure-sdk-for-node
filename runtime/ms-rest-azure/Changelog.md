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
