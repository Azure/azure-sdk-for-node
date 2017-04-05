import * as msRest from 'ms-rest';

export interface AzureServiceClientOptions extends msRest.ServiceClientOptions {
  /**
   * @param {number} [options.longRunningOperationRetryTimeout] - The retry timeout in seconds for 
   * Long Running Operations.
   */
  longRunningOperationRetryTimeout?: number;
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
   * Long Running Operations. Default value is 30.
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