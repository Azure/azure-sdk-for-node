import * as msRest from 'ms-rest';

export interface AzureServiceClientOptions extends msRest.ServiceClientOptions {
  /**
   * @property {number} [longRunningOperationRetryTimeout] - The retry timeout in seconds for 
   * Long Running Operations. Default value is 30 seconds.
   */
  longRunningOperationRetryTimeout?: number;

  /**
   * @property {number} [rpRegistrationRetryTimeout] - Gets or sets the retry timeout in seconds for 
   * AutomaticRPRegistration. Default value is 30 seconds.
   */
  rpRegistrationRetryTimeout?: number;

  /**
   * @property {string} [acceptLanguage] - Gets or sets the preferred language for the response. 
   * Default value is: 'en-US'.
   */
  acceptLanguage?: string;
  /**
   * @property {boolean} [generateClientRequestId] - When set to true a unique x-ms-client-request-id value 
   * is generated and included in each request. Default is true.
   */
  generateClientRequestId?: boolean;
}

export interface LongRunningPathTemplateBasedRequestPrepareOptions extends msRest.PathTemplateBasedRequestPrepareOptions {
  deserializationMapperForTerminalResponse?: msRest.Mapper;
}

export interface LongRunningUrlBasedRequestPrepareOptions extends msRest.UrlBasedRequestPrepareOptions {
  deserializationMapperForTerminalResponse?: msRest.Mapper;
}

export class AzureServiceClient extends msRest.ServiceClient {
  /**
   * @class
   * Initializes a new instance of the AzureServiceClient class.
   * @constructor
   * @param {ServiceClientCredentials} credentials - ApplicationTokenCredentials or 
   * UserTokenCredentials object used for authentication.  
   * 
   * @param {object} options - The parameter options used by ServiceClient
   * 
   * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response. 
   * Default value is: 'en-US'.
   *  
   * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value 
   * is generated and included in each request. Default is true.
   * 
   * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for 
   * Long Running Operations. Default value is 30 seconds.
   * 
   * @param {number} [options.rpRegistrationRetryTimeout] - Gets or sets the retry timeout in seconds for 
   * AutomaticRPRegistration. Default value is 30 seconds.
   */
  constructor(credentials: msRest.ServiceClientCredentials, options: AzureServiceClientOptions)
  getLongRunningOperationResult<TResult>(resultOfInitialRequest: msRest.HttpOperationResponse<TResult>, options: msRest.RequestOptions, callback: msRest.ServiceCallback<TResult>): void;
  getLongRunningOperationResult<TResult>(resultOfInitialRequest: msRest.HttpOperationResponse<TResult>, callback: msRest.ServiceCallback<TResult>): void;
  getLongRunningOperationResult<TResult>(resultOfInitialRequest: msRest.HttpOperationResponse<TResult>, options?: msRest.RequestOptions): Promise<TResult>;

  sendLongRunningRequest<TResult>(options: LongRunningUrlBasedRequestPrepareOptions | LongRunningPathTemplateBasedRequestPrepareOptions, callback: msRest.ServiceCallback<TResult>): void;
  sendLongRunningRequest<TResult>(options: LongRunningUrlBasedRequestPrepareOptions | LongRunningPathTemplateBasedRequestPrepareOptions): Promise<TResult>;

  sendLongRunningRequestWithHttpOperationResponse<TResult>(options: LongRunningUrlBasedRequestPrepareOptions | LongRunningPathTemplateBasedRequestPrepareOptions): Promise<msRest.HttpOperationResponse<TResult>>;
}

export type CloudErrorParameters = {
  code: string;
  message: string;
  target?: string;
  details?: Array<CloudError>;
};

export class CloudError extends Error {
  constructor(parameters: CloudErrorParameters);
}

export type AzureEnvironmentParameters = {
  /**
   * The Environment name.
   */
  name: string;

  /**
   * The management portal URL.
   */
  portalUrl: string;

  /**
   * The management service endpoint.
   */
  managementEndpointUrl: string;

  /**
   * The resource management endpoint.
   */
  resourceManagerEndpointUrl: string;

  /**
   * The Active Directory login endpoint.
   */
  activeDirectoryEndpointUrl: string;

  /**
   * The resource ID to obtain AD tokens for (token audience).
   */
  activeDirectoryResourceId: string;

  /**
   * The publish settings file URL.
   */
  publishingProfileUrl: string;

  /**
   * The sql server management endpoint for mobile commands.
   */
  sqlManagementEndpointUrl: string;

  /**
   * The dns suffix for sql servers.
   */
  sqlServerHostnameSuffix: string;

  /**
   * The template gallery endpoint.
   */
  galleryEndpointUrl: string;

  /**
   * The Active Directory resource ID.
   */
  activeDirectoryGraphResourceId: string;

  /**
   * The Active Directory api version.
   */
  activeDirectoryGraphApiVersion: string;

  /**
   * The endpoint suffix for storage accounts.
   */
  storageEndpointSuffix: string;

  /**
   * The keyvault service dns suffix.
   */
  keyVaultDnsSuffix: string;

  /**
   * The data lake store filesystem service dns suffix.
   */
  azureDataLakeStoreFileSystemEndpointSuffix: string;

  /**
   * The data lake analytics job and catalog service dns suffix.
   */
  azureDataLakeAnalyticsCatalogAndJobEndpointSuffix: string;

  /**
   * Determines whether the authentication endpoint should be validated with Azure AD. Default value is true.
   */
  validateAuthority: boolean;
};

export class AzureEnvironment {
  /**
   * The Environment name.
   */
  name: string;

  /**
   * The management portal URL.
   */
  portalUrl: string;

  /**
   * The management service endpoint.
   */
  managementEndpointUrl: string;

  /**
   * The resource management endpoint.
   */
  resourceManagerEndpointUrl: string;

  /**
   * The Active Directory login endpoint.
   */
  activeDirectoryEndpointUrl: string;

  /**
   * The resource ID to obtain AD tokens for (token audience).
   */
  activeDirectoryResourceId: string;

  /**
   * The publish settings file URL.
   */
  publishingProfileUrl: string;

  /**
   * The sql server management endpoint for mobile commands.
   */
  sqlManagementEndpointUrl: string;

  /**
   * The dns suffix for sql servers.
   */
  sqlServerHostnameSuffix: string;

  /**
   * The template gallery endpoint.
   */
  galleryEndpointUrl: string;

  /**
   * The Active Directory resource ID.
   */
  activeDirectoryGraphResourceId: string;

  /**
   * The Active Directory api version.
   */
  activeDirectoryGraphApiVersion: string;

  /**
   * The endpoint suffix for storage accounts.
   */
  storageEndpointSuffix: string;

  /**
   * The keyvault service dns suffix.
   */
  keyVaultDnsSuffix: string;

  /**
   * The data lake store filesystem service dns suffix.
   */
  azureDataLakeStoreFileSystemEndpointSuffix: string;

  /**
   * The data lake analytics job and catalog service dns suffix.
   */
  azureDataLakeAnalyticsCatalogAndJobEndpointSuffix: string;

  /**
   * Determines whether the authentication endpoint should be validated with Azure AD. Default value is true.
   */
  validateAuthority: boolean;

  /**
   * Initializes a new instance of the AzureEnvironment class.
   * @param {string} parameters.name - The Environment name
   * @param {string} parameters.portalUrl - The management portal URL
   * @param {string} parameters.managementEndpointUrl - The management service endpoint
   * @param {string} parameters.resourceManagerEndpointUrl - The resource management endpoint
   * @param {string} parameters.activeDirectoryEndpointUrl - The Active Directory login endpoint
   * @param {string} parameters.activeDirectoryResourceId - The resource ID to obtain AD tokens for (token audience)
   * @param {string} [parameters.publishingProfileUrl] - The publish settings file URL
   * @param {string} [parameters.sqlManagementEndpointUrl] - The sql server management endpoint for mobile commands
   * @param {string} [parameters.sqlServerHostnameSuffix] - The dns suffix for sql servers
   * @param {string} [parameters.galleryEndpointUrl] - The template gallery endpoint
   * @param {string} [parameters.activeDirectoryGraphResourceId] - The Active Directory resource ID
   * @param {string} [parameters.activeDirectoryGraphApiVersion] - The Active Directory api version
   * @param {string} [parameters.storageEndpointSuffix] - The endpoint suffix for storage accounts
   * @param {string} [parameters.keyVaultDnsSuffix] - The keyvault service dns suffix
   * @param {string} [parameters.azureDataLakeStoreFileSystemEndpointSuffix] - The data lake store filesystem service dns suffix
   * @param {string} [parameters.azureDataLakeAnalyticsCatalogAndJobEndpointSuffix] - The data lake analytics job and catalog service dns suffix
   * @param {bool} [parameters.validateAuthority] - Determines whether the authentication endpoint should 
   * be validated with Azure AD. Default value is true.
   */
  constructor(parameters: AzureEnvironmentParameters);

  static readonly Azure: {
    name: 'Azure',
    portalUrl: 'https://portal.azure.com',
    publishingProfileUrl: 'https://go.microsoft.com/fwlink/?LinkId=254432',
    managementEndpointUrl: 'https://management.core.windows.net',
    resourceManagerEndpointUrl: 'https://management.azure.com/',
    sqlManagementEndpointUrl: 'https://management.core.windows.net:8443/',
    sqlServerHostnameSuffix: '.database.windows.net',
    galleryEndpointUrl: 'https://gallery.azure.com/',
    activeDirectoryEndpointUrl: 'https://login.microsoftonline.com/',
    activeDirectoryResourceId: 'https://management.core.windows.net/',
    activeDirectoryGraphResourceId: 'https://graph.windows.net/',
    activeDirectoryGraphApiVersion: '2013-04-05',
    storageEndpointSuffix: '.core.windows.net',
    keyVaultDnsSuffix: '.vault.azure.net',
    azureDataLakeStoreFileSystemEndpointSuffix: 'azuredatalakestore.net',
    azureDataLakeAnalyticsCatalogAndJobEndpointSuffix: 'azuredatalakeanalytics.net'
  };

  static readonly AzureChina: {
    name: 'AzureChina',
    portalUrl: 'https://portal.azure.cn',
    publishingProfileUrl: 'https://go.microsoft.com/fwlink/?LinkID=301774',
    managementEndpointUrl: 'https://management.core.chinacloudapi.cn',
    resourceManagerEndpointUrl: 'https://management.chinacloudapi.cn',
    sqlManagementEndpointUrl: 'https://management.core.chinacloudapi.cn:8443/',
    sqlServerHostnameSuffix: '.database.chinacloudapi.cn',
    galleryEndpointUrl: 'https://gallery.chinacloudapi.cn/',
    activeDirectoryEndpointUrl: 'https://login.chinacloudapi.cn/',
    activeDirectoryResourceId: 'https://management.core.chinacloudapi.cn/',
    activeDirectoryGraphResourceId: 'https://graph.chinacloudapi.cn/',
    activeDirectoryGraphApiVersion: '2013-04-05',
    storageEndpointSuffix: '.core.chinacloudapi.cn',
    keyVaultDnsSuffix: '.vault.azure.cn',
    // TODO: add dns suffixes for the china cloud for datalake store and datalake analytics once they are defined.
    azureDataLakeStoreFileSystemEndpointSuffix: 'N/A',
    azureDataLakeAnalyticsCatalogAndJobEndpointSuffix: 'N/A'
  };

  static readonly AzureUSGovernment: {
    name: 'AzureUSGovernment',
    portalUrl: 'https://portal.azure.us',
    publishingProfileUrl: 'https://manage.windowsazure.us/publishsettings/index',
    managementEndpointUrl: 'https://management.core.usgovcloudapi.net',
    resourceManagerEndpointUrl: 'https://management.usgovcloudapi.net',
    sqlManagementEndpointUrl: 'https://management.core.usgovcloudapi.net:8443/',
    sqlServerHostnameSuffix: '.database.usgovcloudapi.net',
    galleryEndpointUrl: 'https://gallery.usgovcloudapi.net/',
    activeDirectoryEndpointUrl: 'https://login-us.microsoftonline.com/',
    activeDirectoryResourceId: 'https://management.core.usgovcloudapi.net/',
    activeDirectoryGraphResourceId: 'https://graph.windows.net/',
    activeDirectoryGraphApiVersion: '2013-04-05',
    storageEndpointSuffix: '.core.usgovcloudapi.net',
    keyVaultDnsSuffix: '.vault.usgovcloudapi.net',
    azureDataLakeStoreFileSystemEndpointSuffix: 'N/A',
    azureDataLakeAnalyticsCatalogAndJobEndpointSuffix: 'N/A'
  };

  static readonly AzureGermanCloud: {
    name: 'AzureGermanCloud',
    portalUrl: 'https://portal.microsoftazure.de/',
    publishingProfileUrl: 'https://manage.microsoftazure.de/publishsettings/index',
    managementEndpointUrl: 'https://management.core.cloudapi.de',
    resourceManagerEndpointUrl: 'https://management.microsoftazure.de',
    sqlManagementEndpointUrl: 'https://management.core.cloudapi.de:8443/',
    sqlServerHostnameSuffix: '.database.cloudapi.de',
    galleryEndpointUrl: 'https://gallery.cloudapi.de/',
    activeDirectoryEndpointUrl: 'https://login.microsoftonline.de/',
    activeDirectoryResourceId: 'https://management.core.cloudapi.de/',
    activeDirectoryGraphResourceId: 'https://graph.cloudapi.de/',
    activeDirectoryGraphApiVersion: '2013-04-05',
    storageEndpointSuffix: '.core.cloudapi.de',
    keyVaultDnsSuffix: '.vault.microsoftazure.de',
    azureDataLakeStoreFileSystemEndpointSuffix: 'N/A',
    azureDataLakeAnalyticsCatalogAndJobEndpointSuffix: 'N/A'
  };
}

export interface AzureTokenCredentialsOptions {
  /**
   * The Azure environment to authenticate with.
   */
  environment?: AzureEnvironment;

  /**
   * The authorization scheme. Default value is 'Bearer'.
   */
  authorizationScheme?: string;

  /**
   * The token cache. Default value is MemoryCache from adal.
   */
  tokenCache?: any;
  /**
   * The audience for which the token is requested. Valid value is 'graph'. If tokenAudience is provided
   * then domain should also be provided and its value should not be the default 'common' tenant.
   * It must be a string (preferrably in a guid format).
   */
  tokenAudience?: string;
}

export interface LoginWithUsernamePasswordOptions extends AzureTokenCredentialsOptions {
  /**
   * The domain or tenant id containing this application. Default value is 'common'.
   */
  domain?: string;

  /** 
   * The active directory application client id. 
   * See {@link https://azure.microsoft.com/en-us/documentation/articles/active-directory-devquickstarts-dotnet/ Active Directory Quickstart for .Net} 
   * for an example.
   */
  clientId?: string
}

export interface DeviceTokenCredentialsOptions extends LoginWithUsernamePasswordOptions {
  /**
   * The user name for account in the form: 'user@example.com'. Default value is 'user@example.com'.
   */
  username?: string;
}

export interface InteractiveLoginOptions extends DeviceTokenCredentialsOptions {
  /**
   * The language code specifying how the message should be localized to. Default value 'en-us'.
   */
  language?: string;
}

/**
 * The user type associated to a subscription in Azure.
 */
export enum UserType {
  user,
  servicePrincipal
}

/**
 * The user associated to a subscription in Azure.
 */
export interface LinkedUser {
  /**
   * The user name. This could be a display name or a GUID.
   */
  name: string;
  /**
   * The user type: 'user', 'servicePrincipal'.
   */
  type: UserType
}

export interface LinkedSubscription {
  /**
   * The tenant that the subscription belongs to.
   */
  tenantId: string;
  /**
   * The user associated with the subscription. This could be a user or a serviceprincipal.
   */
  user: LinkedUser;
  /**
   * The environment name For example: AzureCloud, AzureChina, USGovernment, GermanCloud, or your own Dogfood environment
   */
  environmentName: string;
  /**
   * Display name of the subscription.
   */
  name: string;
  /**
   * The subscriptionId (usually a GUID).
   */
  id: string;
  /**
   * The authorization source of the subscription: 'RoleBased' , 'Legacy', 'Bypassed',' Direct', 'Management'. 
   * It could also be a comma separated string containing more values 'Bypassed, Direct, Management'.
   */
  authorizationSource: string;
  /**
   * The state of the subscription. Example values: 'Enabled', 'Disabled', 'Warned', 'PastDue', 'Deleted'.
   */
  state: string;
}

export interface AuthResponse {
  credentials: DeviceTokenCredentials | ApplicationTokenCredentials | UserTokenCredentials;
  subscriptions: Array<LinkedSubscription>;
}

/**
 * Creates a new ApplicationTokenCredentials object.
 * See {@link https://azure.microsoft.com/en-us/documentation/articles/active-directory-devquickstarts-dotnet/ Active Directory Quickstart for .Net} 
 * for detailed instructions on creating an Azure Active Directory application.
 * @param {string} clientId The active directory application client id. 
 * @param {string} domain The domain or tenant id containing this application.
 * @param {string} secret The authentication secret for the application.
 * @param {AzureTokenCredentialsOptions} options Object representing optional parameters.
 */
export class ApplicationTokenCredentials implements msRest.ServiceClientCredentials {
  constructor(clientId: string, domain: string, secret: string, options?: AzureTokenCredentialsOptions);
  signRequest(webResource: msRest.WebResource, callback: { (err: Error): void }): void;
}

/**
 * Creates a new UserTokenCredentials object.
 * See {@link https://azure.microsoft.com/en-us/documentation/articles/active-directory-devquickstarts-dotnet/ Active Directory Quickstart for .Net} 
 * for an example.
 * @param {string} clientId The active directory application client id. 
 * @param {string} domain The domain or tenant id containing this application.
 * @param {string} username The user name for the Organization Id account.
 * @param {string} password The password for the Organization Id account.
 * @param {AzureTokenCredentialsOptions} options Object representing optional parameters.
 */
export class UserTokenCredentials implements msRest.ServiceClientCredentials {
  constructor(clientId: string, domain: string, username: string, password: string, options: AzureTokenCredentialsOptions);
  signRequest(webResource: msRest.WebResource, callback: { (err: Error): void }): void;
}

/**
 * Creates a new DeviceTokenCredentials object.
 * @param {DeviceTokenCredentialsOptions} options Object representing optional parameters.
 */
export class DeviceTokenCredentials implements msRest.ServiceClientCredentials {
  constructor(options?: DeviceTokenCredentialsOptions);
  signRequest(webResource: msRest.WebResource, callback: { (err: Error): void }): void;
}

/**
 * @class MSITokenCredentials
 */
export class MSITokenCredentials {
  /**
   * Authenticates using the identity service running on an Azure virtual machine.
   * This method makes a request to the authentication service hosted on the VM
   * and gets back an access token.
   * 
   * @param {MSIOptions} [options] - Optional parameters.
   */
  constructor(options?: MSIOptions);
  /**
   * Prepares and sends a POST request to a service endpoint hosted on the Azure VM, which responds with the access token.
   * @param  {function} callback  The callback in the form (err, result)
   * @return {function} callback
   *                       {Error} [err]  The error if any
   *                       {object} [tokenResponse] The tokenResponse (token_type and access_token are the two important properties). 
   */
  getToken(callback: { (error: Error, result: { token_type: string, access_token: string }): void }): void;
  signRequest(webResource: msRest.WebResource, callback: { (err: Error): void }): void;
}

/**
 * Defines the base class for a Resource in Azure. It is an empty class.
 */
export class BaseResource { }

/**
 * Provides a url and code that needs to be copy and pasted in a browser and authenticated over there. If successful, the user will get a 
 * DeviceTokenCredentials object
 *
 * @param {InteractiveLoginOptions} [options] The parameter options.
 *
 * @param {function} [optionalCallback] The optional callback.
 *
 * @returns {function|Promise<DeviceTokenCredentials>} If a callback was passed as the last parameter then it returns the callback else returns a Promise.
 *
 * optionalCallback(err, credentials)
 *                      {Error}  [err]                           - The Error object if an error occurred, null otherwise.
 *                      {DeviceTokenCredentials} [credentials]   - The DeviceTokenCredentials object
 *     {Promise<DeviceTokenCredentials>} A promise is returned.
 *             @resolve {DeviceTokenCredentials} The DeviceTokenCredentials object.
 *             @reject {Error} - The error object.
 */
export function interactiveLogin(options: InteractiveLoginOptions, optionalCallback: { (err: Error, credentials: DeviceTokenCredentials, subscriptions: Array<LinkedSubscription>): void }): void;
export function interactiveLogin(optionalCallback: { (err: Error, credentials: DeviceTokenCredentials, subscriptions: Array<LinkedSubscription>): void }): void;
export function interactiveLogin(options?: InteractiveLoginOptions): Promise<DeviceTokenCredentials>;

/**
 * Provides a url and code that needs to be copy and pasted in a browser and authenticated over there. If successful, the user will get a 
 * DeviceTokenCredentials object
 *
 * @param {InteractiveLoginOptions} [options] The parameter options.
 *
 * @returns {Promise<AuthResponse>} A promise is returned.
 *             @resolve {DeviceTokenCredentials} The DeviceTokenCredentials object.
 *             @reject {Error} - The error object.
 */
export function interactiveLoginWithAuthResponse(options?: InteractiveLoginOptions): Promise<AuthResponse>;

/**
 * Provides a UserTokenCredentials object. This method is applicable only for organizational ids that are not 2FA enabled.
 * Otherwise please use interactive login.
 *
 * @param {string} username The user name for the Organization Id account.
 *
 * @param {string} password The password for the Organization Id account.
 *
 * @param {LoginWithUsernamePasswordOptions} [options] The parameter options.
 *
 * @param {function} [optionalCallback] The optional callback.
 *
 * @returns {function|Promise<UserTokenCredentials>} If a callback was passed as the last parameter then it returns the callback else returns a Promise.
 *
 *     optionalCallback(err, credentials)
 *                      {Error}  [err]                         - The Error object if an error occurred, null otherwise.
 *                      {UserTokenCredentials} [credentials]   - The UserTokenCredentials object
 *     {Promise<UserTokenCredentials>} A promise is returned.
 *             @resolve {UserTokenCredentials} The UserTokenCredentials object.
 *             @reject {Error} - The error object.
 */
export function loginWithUsernamePassword(username: string, password: string, options: LoginWithUsernamePasswordOptions, callback: { (err: Error, credentials: UserTokenCredentials, subscriptions: Array<LinkedSubscription>): void }): void;
export function loginWithUsernamePassword(username: string, password: string, callback: { (err: Error, credentials: UserTokenCredentials, subscriptions: Array<LinkedSubscription>): void }): void;
export function loginWithUsernamePassword(username: string, password: string, options?: LoginWithUsernamePasswordOptions): Promise<UserTokenCredentials>;

/**
 * Provides a UserTokenCredentials object. This method is applicable only for organizational ids that are not 2FA enabled.
 * Otherwise please use interactive login.
 *
 * @param {string} username The user name for the Organization Id account.
 *
 * @param {string} password The password for the Organization Id account.
 *
 * @param {LoginWithUsernamePasswordOptions} [options] The parameter options.
 *
 * @returns {Promise<AuthResponse>} A promise is returned.
 *             @resolve {UserTokenCredentials} The UserTokenCredentials object.
 *             @reject {Error} - The error object.
 */
export function loginWithUsernamePasswordWithAuthResponse(username: string, password: string, options?: LoginWithUsernamePasswordOptions): Promise<AuthResponse>;

/**
 * Provides an ApplicationTokenCredentials object.
 *
 * @param {string} clientId The active directory application client id also known as the SPN (ServicePrincipal Name). 
 * See {@link https://azure.microsoft.com/en-us/documentation/articles/active-directory-devquickstarts-dotnet/ Active Directory Quickstart for .Net} 
 * for an example.
 *
 * @param {string} secret The application secret for the service principal.
 *
 * @param {string} domain The domain or tenant id containing this application.
 *
 * @param {AzureTokenCredentialsOptions} [options] The parameter options.
 *
 * @param {function} [optionalCallback] The optional callback.
 *
 * @returns {function|Promise<ApplicationTokenCredentials>} optionalCallback(err, credentials) | Promise<ApplicationTokenCredentials> If a callback was passed as the last parameter then it returns the callback else returns a Promise.
 *
 * optionalCallback(err, credentials)
 *                      {Error}  [err]                                - The Error object if an error occurred, null otherwise.
 *                      {ApplicationTokenCredentials} [credentials]   - The ApplicationTokenCredentials object
 *     {Promise<ApplicationTokenCredentials>} A promise is returned.
 *             @resolve {ApplicationTokenCredentials} The ApplicationTokenCredentials object.
 *             @reject {Error} - The error object.
 */
export function loginWithServicePrincipalSecret(clientId: string, secret: string, domain: string, options: AzureTokenCredentialsOptions, callback: { (err: Error, credentials: ApplicationTokenCredentials, subscriptions: Array<LinkedSubscription>): void }): void;
export function loginWithServicePrincipalSecret(clientId: string, secret: string, domain: string, callback: { (err: Error, credentials: ApplicationTokenCredentials, subscriptions: Array<LinkedSubscription>): void }): void;
export function loginWithServicePrincipalSecret(clientId: string, secret: string, domain: string, options?: AzureTokenCredentialsOptions): Promise<ApplicationTokenCredentials>;

/**
 * Provides an ApplicationTokenCredentials object.
 *
 * @param {string} clientId The active directory application client id also known as the SPN (ServicePrincipal Name). 
 * See {@link https://azure.microsoft.com/en-us/documentation/articles/active-directory-devquickstarts-dotnet/ Active Directory Quickstart for .Net} 
 * for an example.
 *
 * @param {string} secret The application secret for the service principal.
 *
 * @param {string} domain The domain or tenant id containing this application.
 *
 * @param {AzureTokenCredentialsOptions} [options] The parameter options.
 *
 * @returns {Promise<AuthResponse>} A promise is returned.
 *             @resolve {ApplicationTokenCredentials} The ApplicationTokenCredentials object.
 *             @reject {Error} - The error object.
 */
export function loginWithServicePrincipalSecretWithAuthResponse(clientId: string, secret: string, domain: string, options?: AzureTokenCredentialsOptions): Promise<AuthResponse>;

/**
 * @interface AuthFileOptions - Describes optional parameters for authentication with auth file. 
 */
export interface AuthFileOptions {
  /**
   * @prop {string} [filePath] Absolute file path to the auth file. If not provided 
   * then please set the environment variable 'AZURE_AUTH_LOCATION'.
   */
  filePath?: string;
  /**
   * @prop {string} [subscriptionEnvVariableName] The subscriptionId environment variable 
   * name. Default is 'AZURE_SUBSCRIPTION_ID'.
   */
  subscriptionEnvVariableName?: string;
}

/**
 * Before using this method please install az cli from https://github.com/Azure/azure-cli/releases. Then execute `az ad sp create-for-rbac --sdk-auth > ${yourFilename.json}`.
 * If you want to create the sp for a different cloud/environment then please execute:
 * 1. az cloud list
 * 2. az cloud set –n <name of the environment>
 * 3. az ad sp create-for-rbac --sdk-auth > auth.json
 * 
 * If the service principal is already created then login with service principal info:
 * 3. az login --service-principal -u <clientId> -p <clientSecret> -t <tenantId>
 * 4. az account show --sdk-auth > auth.json 
 * 
 * Authenticates using the service principal information provided in the auth file. This method will set 
 * the subscriptionId from the auth file to the user provided environment variable in the options 
 * parameter or the default 'AZURE_SUBSCRIPTION_ID'.
 * 
 * @param {object} [options] - Optional parameters
 * @param {string} [options.filePath] - Absolute file path to the auth file. If not provided 
 * then please set the environment variable AZURE_AUTH_LOCATION.
 * @param {string} [options.subscriptionEnvVariableName] - The subscriptionId environment variable 
 * name. Default is 'AZURE_SUBSCRIPTION_ID'.
 * @param {function} [optionalCallback] The optional callback.
 * 
 * @returns {function | Promise} If a callback was passed as the last parameter then it returns the callback else returns a Promise.
 * 
 *    {function} callback(err, credentials)
 *                 {Error}  [err]                               - The Error object if an error occurred, null otherwise.
 *                 {ApplicationTokenCredentials} [credentials]  - The ApplicationTokenCredentials object.
 *                 {Array}                [subscriptions]       - List of associated subscriptions across all the applicable tenants.
 *    {Promise} A promise is returned.
 *             @resolve {ApplicationTokenCredentials} The ApplicationTokenCredentials object.
 *             @reject {Error} - The error object.
 */
export function loginWithAuthFile(options?: AuthFileOptions): Promise<ApplicationTokenCredentials>;
export function loginWithAuthFile(callback: { (err: Error, credentials: ApplicationTokenCredentials, subscriptions: Array<LinkedSubscription>): void }): void;
export function loginWithAuthFile(options: AuthFileOptions, callback: { (err: Error, credentials: ApplicationTokenCredentials, subscriptions: Array<LinkedSubscription>): void }): void;

/**
 * Before using this method please install az cli from https://github.com/Azure/azure-cli/releases. Then execute `az ad sp create-for-rbac --sdk-auth > ${yourFilename.json}`.
 * If you want to create the sp for a different cloud/environment then please execute:
 * 1. az cloud list
 * 2. az cloud set –n <name of the environment>
 * 3. az ad sp create-for-rbac --sdk-auth > auth.json
 * 
 * If the service principal is already created then login with service principal info:
 * 3. az login --service-principal -u <clientId> -p <clientSecret> -t <tenantId>
 * 4. az account show --sdk-auth > auth.json 
 * 
 * Authenticates using the service principal information provided in the auth file. This method will set 
 * the subscriptionId from the auth file to the user provided environment variable in the options 
 * parameter or the default 'AZURE_SUBSCRIPTION_ID'.
 * 
 * @param {object} [options] - Optional parameters
 * @param {string} [options.filePath] - Absolute file path to the auth file. If not provided 
 * then please set the environment variable AZURE_AUTH_LOCATION.
 * @param {string} [options.subscriptionEnvVariableName] - The subscriptionId environment variable 
 * name. Default is 'AZURE_SUBSCRIPTION_ID'.
 * 
 * @returns {Promise} A promise is returned.
 *   @resolve {{credentials: ApplicationTokenCredentials, subscriptions: subscriptions[]}} An object with credentials and associated subscription info.
 *   @reject {Error} - The error object.
 */
export function loginWithAuthFileWithAuthResponse(options?: AuthFileOptions): Promise<AuthResponse>;

/**
 * @interface MSIOptions Defines the optional parameters for authentication with MSI.
 */
export interface MSIOptions {
  /**
   * @prop {number} [port] - port on which the MSI service is running on the host VM. Default port is 50342
   */
  port?: number;
  /**
   * @prop {string} [resource] -  The resource uri or token audience for which the token is needed.
   * For e.g. it can be:
   * - resourcemanagement endpoint "https://management.azure.com"(default) 
   * - management endpoint "https://management.core.windows.net/"
   */
  resource?: string;
}

/**
 * Before using this method please install az cli from https://github.com/Azure/azure-cli/releases.
 * If you have an Azure virtual machine provisioned with az cli and has MSI enabled,
 * you can then use this method to get auth tokens from the VM.
 * 
 * To create a new VM, enable MSI, please execute this command:
 * az vm create -g <resource_group_name> -n <vm_name> --assign-identity --image <os_image_name>
 * Note: the above command enables a service endpoint on the host, with a default port 50342
 * 
 * To enable MSI on a already provisioned VM, execute the following command:
 * az vm --assign-identity -g <resource_group_name> -n <vm_name> --port <custom_port_number>
 * 
 * To know more about this command, please execute:
 * az vm --assign-identity -h
 * 
 * Authenticates using the identity service running on an Azure virtual machine.
 * This method makes a request to the authentication service hosted on the VM
 * and gets back an access token.
 * 
 * @param {object} [options] - Optional parameters
 * @param {string} [options.port] - port on which the MSI service is running on the host VM. Default port is 50342
 * @param {string} [options.resource] - The resource uri or token audience for which the token is needed.
 * For e.g. it can be:
 * - resourcemanagement endpoint "https://management.azure.com"(default) 
 * - management endpoint "https://management.core.windows.net/"
 * @param {function} [optionalCallback] The optional callback.
 * 
 * @returns {function | Promise} If a callback was passed as the last parameter then it returns the callback else returns a Promise.
 * 
 *    {function} optionalCallback(err, credentials)
 *                 {Error}  [err]                               - The Error object if an error occurred, null otherwise.
 *                 {object} [tokenResponse]                     - The tokenResponse (token_type and access_token are the two important properties)
 *    {Promise} A promise is returned.
 *             @resolve {object} - tokenResponse.
 *             @reject {Error} - error object.
 */
export function loginWithMSI(callback: { (err: Error, credentials: MSITokenCredentials): void }): void;
export function loginWithMSI(options: MSIOptions, callback: { (err: Error, credentials: MSITokenCredentials): void }): void;
export function loginWithMSI(options?: MSIOptions): Promise<MSITokenCredentials>;