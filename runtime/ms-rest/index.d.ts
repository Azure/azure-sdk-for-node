import * as stream from 'stream';
import * as http from 'http';

/**
 * REST request options
 *  
 * @property {object.<string, string>} customHeaders - Any additional HTTP headers to be added to the request
 * @proprerty {boolean} [jar] - If true, remember cookies for future use
 */
export interface RequestOptions {
  customHeaders?: { [headerName: string]: string; };
}

export interface ClientRequestOptions extends RequestOptions {
  jar?: boolean;
}

/**
 * HttpOperationResponse wrapper that provides the raw request, raw response and the deserialized response body.
 * 
 * @property {WebResource} request  - The raw request object
 * @property {stream} response - The response stream
 * @property {T} body - The deserialized response body of the expected type.
 */
export interface HttpOperationResponse<T> {
  request: WebResource;
  response: stream;
  body: T;
}

/**
 * Service client options, used for all REST requests initiated by the service client.
 * 
 * @property {Array} [filters]                  - Filters to be added to the request pipeline
 * @property {ClientRequestOptions} requestOptions    - Default ClientRequestOptions to use for requests 
 * @property {boolean}  noRetryPolicy           - If set to true, turn off default retry policy
 */
export interface ServiceClientOptions {
  filters?: any[];
  requestOptions?: ClientRequestOptions;
  noRetryPolicy?: boolean;
}

export class ServiceClient {
  /**
   * Initializes a new instance of the ServiceClient class.
   *
   * @param {ServiceClientCredentials} [credentials]    - BasicAuthenticationCredentials or 
   * TokenCredentials object used for authentication. 
   * @param {ServiceClientOptions} [options] The parameter options
   */
  constructor(credentials?: ServiceClientCredentials, options?: ServiceClientOptions);

  /**
   * Attempts to find package.json for the given azure nodejs package.
   * If found, returns the name and version of the package by reading the package.json
   * If package.json is not found, returns a default value.
   * @param {string} managementClientDir - pass the directory of the specific azure management client.
   * @returns {object} packageJsonInfo - "name" and "version" of the desired package.
   */
  getPackageJsonInfo(managementClientDir: string): { name: string, version: string };

  /**
   * Adds custom information to user agent header
   * @param {any} additionalUserAgentInfo - information to be added to user agent header, as string.
   */
  addUserAgentInfo(additionalUserAgentInfo: any): void;

  sendRequest<TResult>(options: PathTemplateBasedRequestPrepareOptions | UrlBasedRequestPrepareOptions, callback: ServiceCallback<TResult>): void;
  sendRequest<TResult>(options: PathTemplateBasedRequestPrepareOptions | UrlBasedRequestPrepareOptions): Promise<TResult>;
  sendRequestWithHttpOperationResponse<TResult>(options: PathTemplateBasedRequestPrepareOptions | UrlBasedRequestPrepareOptions): Promise<HttpOperationResponse<TResult>>;
}

/**
 * Service Error that is returned when an error occurrs in executing the REST request initiated by the service client.
 * 
 * @property {number} [statusCode]             - The response status code received from the server as a result of making the request.
 * @property {WebResource} request             - The raw/actual request sent to the server.
 * @property {http.IncomingMessage}  response  - The raw/actual response from the server.
 * @property {any}  body                       - The response body.
 */
export interface ServiceError extends Error {
  statusCode: number;
  request: WebResource;
  response: http.IncomingMessage;
  body: any;
}

/**
 * Service callback that is returned for REST requests initiated by the service client.
 * 
 * @property {Error|ServiceError} err         - The error occurred if any, while executing the request; otherwise null
 * @property {TResult} result                 - The deserialized response body if an error did not occur.
 * @property {WebResource}  request           - The raw/actual request sent to the server if an error did not occur.
 * @property {http.IncomingMessage} response  - The raw/actual response from the server if an error did not occur.
 */
export interface ServiceCallback<TResult> { (err: Error | ServiceError, result?: TResult, request?: WebResource, response?: http.IncomingMessage): void }

/**
 * Creates a new 'ExponentialRetryPolicyFilter' instance.
 *
 * @constructor
 * @param {number} retryCount        The client retry count.
 * @param {number} retryInterval     The client retry interval, in milliseconds.
 * @param {number} minRetryInterval  The minimum retry interval, in milliseconds.
 * @param {number} maxRetryInterval  The maximum retry interval, in milliseconds.
 */
export class ExponentialRetryPolicyFilter {
  constructor(retryCount: number, retryInterval: number, minRetryInterval: number, maxRetryInterval: number);
}

export enum MapperType {
  Base64Url,
  Boolean,
  ByteArray,
  Composite,
  Date,
  DateTime,
  DateTimeRfc1123,
  Dictionary,
  Enum,
  Number,
  Object,
  Sequence,
  String,
  Stream,
  TimeSpan,
  UnixTime
}

export interface BaseMapperType {
  name: MapperType
}

export interface DictionaryType extends BaseMapperType {
  type: {
    name: MapperType;
    value: Mapper;
  }
}

export interface Mapper extends BaseMapperType {
  readOnly?: boolean;
  isConstant?: boolean;
  required: boolean;
  serializedName: string;
  type: BaseMapperType;
}

export interface CompositeType extends Mapper {
  type: {
    name: MapperType;
    className: string;
    modelProperties?: { [propertyName: string]: Mapper };
  }
}

export interface SequenceType extends Mapper {
  type: {
    name: MapperType;
    element: Mapper;
  }
}

export interface UrlParameterValue {
  value: string,
  skipUrlEncoding: boolean;
}

/**
 * Defines the options that can be specified for preparing the Request (WebResource) that is given to the request pipeline.
 *
 * @property {string} method The HTTP request method. Valid values are 'GET', 'PUT', 'HEAD', 'DELETE', 'OPTIONS', 'POST', 'PATCH'.
 *
 * @property {string} [url] The request url. It may or may not have query parameters in it. 
 * Either provide the 'url' or provide the 'pathTemplate' in the options object. Both the options are mutually exclusive.
 *
 * @property {object} [queryParameters] A dictionary of query parameters to be appended to the url, where 
 * the 'key' is the 'query-parameter-name' and the 'value' is the 'query-parameter-value'. 
 * The 'query-parameter-value' can be of type 'string' or it can be of type 'object'. 
 * The 'object' format should be used when you want to skip url encoding. While using the object format, 
 * the object must have a property named value which provides the 'query-parameter-value'.
 * Example: 
 *    - query-parameter-value in 'object' format: { 'query-parameter-name': { value: 'query-parameter-value', skipUrlEncoding: true } }
 *    - query-parameter-value in 'string' format: { 'query-parameter-name': 'query-parameter-value'}.
 * Note: 'If url already has some query parameters, then the value provided in queryParameters will be appended to the url.
 *
 * @property {string} [pathTemplate] The path template of the request url. Either provide the 'url' or provide the 'pathTemplate' 
 * in the options object. Both the options are mutually exclusive.
 * Example: '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{accountName}'
 *
 * @property {string} [baseUrl] The base url of the request. Default value is: 'https://management.azure.com'. This is applicable only with 
 * pathTemplate. If you are providing url then it is expected that you provide the complete url.
 *
 * @property {object} [pathParameters] A dictionary of path parameters that need to be replaced with actual values in the pathTemplate.
 * Here the key is the 'path-parameter-name' and the value is the 'path-parameter-value'. 
 * The 'path-parameter-value' can be of type 'string'  or it can be of type 'object'.
 * The 'object' format should be used when you want to skip url encoding. While using the object format, 
 * the object must have a property named value which provides the 'path-parameter-value'.
 * Example: 
 *    - path-parameter-value in 'object' format: { 'path-parameter-name': { value: 'path-parameter-value', skipUrlEncoding: true } }
 *    - path-parameter-value in 'string' format: { 'path-parameter-name': 'path-parameter-value' }.
 *
 * @property {object} [headers] A dictionary of request headers that need to be applied to the request.
 * Here the key is the 'header-name' and the value is the 'header-value'. The header-value MUST be of type string.
 *  - ContentType must be provided with the key name as 'Content-Type'. Default value 'application/json; charset=utf-8'.
 *  - 'Transfer-Encoding' is set to 'chunked' by default if 'bodyIsStream' is set to true.
 *  - 'Content-Type' is set to 'application/octet-stream' by default if 'bodyIsStream' is set to true.
 *  - 'accept-language' by default is set to 'en-US'
 *  - 'x-ms-client-request-id' by default is set to a new Guid. To not generate a guid for the request, please set disableClientRequestId to true
 *
 * @property {boolean} [disableClientRequestId] When set to true, instructs the client to not set 'x-ms-client-request-id' header to a new Guid().
 *
 * @property {object|string|boolean|array|number|null|undefined} [body] - The request body. It can be of any type. This method will JSON.stringify() the request body.
 *
 * @property {object|string|boolean|array|number|null|undefined} [options.body] - The request body. It can be of any type. This method will JSON.stringify() the request body.
 *
 * @property {object} [options.serializationMapper] - Provides information on how to serialize the request body.
 * 
 * @property {object} [options.deserializationMapper] - Provides information on how to deserialize the response body.
 * 
 * @property {boolean} [disableJsonStringifyOnBody] - Indicates whether this method should JSON.stringify() the request body. Default value: false.
 *
 * @property {boolean} [bodyIsStream] - Indicates whether the request body is a stream (useful for file upload scenarios).
 */
export interface RequestPrepareOptions {
  method: string;
  queryParameters?: { [propertyName: string]: string | UrlParameterValue };
  baseUrl?: string;
  pathParameters?: { [propertyName: string]: string | UrlParameterValue };
  headers?: { [propertyName: string]: string };
  disableClientRequestId?: boolean;
  body?: any;
  disableJsonStringifyOnBody?: boolean;
  serializationMapper: Mapper;
  deserializationMapper: Mapper;
  bodyIsStream?: boolean;
}

export interface PathTemplateBasedRequestPrepareOptions extends RequestPrepareOptions {
  pathTemplate: string;
}

export interface UrlBasedRequestPrepareOptions extends RequestPrepareOptions {
  url: string;
}

/**
 * This class provides an abstraction over a REST call by being library / implementation agnostic and wrapping the necessary
 * properties to initiate a request.
 */
export class WebResource {
  /**
   * Hook up the given input stream to a destination output stream if the WebResource method
   * requires a request body and a body is not already set.
   *
   * @param {Stream} inputStream the stream to pipe from
   * @param {Stream} outputStream the stream to pipe to
   *
   * @return destStream
   */
  pipeInput(inputStream: stream.Readable, destStream: stream.Writable): stream.Writable;
  /**
   * Validates that the required properties such as method, url, headers['Content-Type'], 
   * headers['accept-language'] are defined. It will throw an error if one of the above
   * mentioned properties are not defined.
   */
  validateRequestProperties(): void;

  /**
   * Prepares the request.
   *
   * @param {object} options The request options that should be provided to send a request successfully
   *
   * @param {string} options.method The HTTP request method. Valid values are 'GET', 'PUT', 'HEAD', 'DELETE', 'OPTIONS', 'POST', 'PATCH'.
   *
   * @param {string} [options.url] The request url. It may or may not have query parameters in it. 
   * Either provide the 'url' or provide the 'pathTemplate' in the options object. Both the options are mutually exclusive.
   *
   * @param {object} [options.queryParameters] A dictionary of query parameters to be appended to the url, where 
   * the 'key' is the 'query-parameter-name' and the 'value' is the 'query-parameter-value'. 
   * The 'query-parameter-value' can be of type 'string' or it can be of type 'object'. 
   * The 'object' format should be used when you want to skip url encoding. While using the object format, 
   * the object must have a property named value which provides the 'query-parameter-value'.
   * Example: 
   *    - query-parameter-value in 'object' format: { 'query-parameter-name': { value: 'query-parameter-value', skipUrlEncoding: true } }
   *    - query-parameter-value in 'string' format: { 'query-parameter-name': 'query-parameter-value'}.
   * Note: 'If options.url already has some query parameters, then the value provided in options.queryParameters will be appended to the url.
   *
   * @param {string} [options.pathTemplate] The path template of the request url. Either provide the 'url' or provide the 'pathTemplate' 
   * in the options object. Both the options are mutually exclusive.
   * Example: '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{accountName}'
   *
   * @param {string} [options.baseUrl] The base url of the request. Default value is: 'https://management.azure.com'. This is applicable only with 
   * options.pathTemplate. If you are providing options.url then it is expected that you provide the complete url.
   *
   * @param {object} [options.pathParameters] A dictionary of path parameters that need to be replaced with actual values in the pathTemplate.
   * Here the key is the 'path-parameter-name' and the value is the 'path-parameter-value'. 
   * The 'path-parameter-value' can be of type 'string'  or it can be of type 'object'.
   * The 'object' format should be used when you want to skip url encoding. While using the object format, 
   * the object must have a property named value which provides the 'path-parameter-value'.
   * Example: 
   *    - path-parameter-value in 'object' format: { 'path-parameter-name': { value: 'path-parameter-value', skipUrlEncoding: true } }
   *    - path-parameter-value in 'string' format: { 'path-parameter-name': 'path-parameter-value' }.
   *
   * @param {object} [options.headers] A dictionary of request headers that need to be applied to the request.
   * Here the key is the 'header-name' and the value is the 'header-value'. The header-value MUST be of type string.
   *  - ContentType must be provided with the key name as 'Content-Type'. Default value 'application/json; charset=utf-8'.
   *  - 'Transfer-Encoding' is set to 'chunked' by default if 'options.bodyIsStream' is set to true.
   *  - 'Content-Type' is set to 'application/octet-stream' by default if 'options.bodyIsStream' is set to true.
   *  - 'accept-language' by default is set to 'en-US'
   *  - 'x-ms-client-request-id' by default is set to a new Guid. To not generate a guid for the request, please set options.disableClientRequestId to true
   *
   * @param {boolean} [options.disableClientRequestId] When set to true, instructs the client to not set 'x-ms-client-request-id' header to a new Guid().
   *
   * @param {object|string|boolean|array|number|null|undefined} [options.body] - The request body. It can be of any type. This method will JSON.stringify() the request body.
   *
   * @param {boolean} [options.disableJsonStringifyOnBody] - Indicates whether this method should JSON.stringify() the request body. Default value: false.
   *
   * @param {boolean} [options.bodyIsStream] - Indicates whether the request body is a stream (useful for file upload scenarios).
   *
   * @returns {object} WebResource Returns the prepared WebResource (HTTP Request) object that needs to be given to the request pipeline.
   */
  prepare(options?: PathTemplateBasedRequestPrepareOptions | UrlBasedRequestPrepareOptions): WebResource;
}

/**
 * Defines the ServiceClientCredentials. It is the base interface which enforces that the signRequest method needs to be implemented.
 *
 * @property {string} token               The token.
 * @property {string} [authorizationScheme] The authorization scheme. If not specified, the default of 'Bearer" is used.
 */
export interface ServiceClientCredentials {
  /**
   * Signs a request with the Authentication header.
   *
   * @param {WebResource} The WebResource to be signed.
   * @param {function(error)}  callback  The callback function.
   */
  signRequest(webResource: WebResource, callback: { (err: Error): void }): void;
}

/**
 * Defines the TokenCredentials.
 *
 * @property {string} token               The token.
 * @property {string} [authorizationScheme] The authorization scheme. If not specified, the default of 'Bearer" is used.
 */
export class TokenCredentials implements ServiceClientCredentials {
  constructor(token: string, authorizationScheme?: string);
  signRequest(webResource: WebResource, callback: { (err: Error): void }): void;
}

/**
 * Defines the BasicAuthenticationCredentials.
 *
 * @property {string} userName                 User name.
 * @property {string} password                 Password.
 * @property {string} [authorizationScheme]    The authorization scheme. Default ('Basic')
 */
export class BasicAuthenticationCredentials implements ServiceClientCredentials {
  constructor(userName: string, password: string, authorizationScheme?: string);
  signRequest(webResource: WebResource, callback: { (err: Error): void }): void;
}