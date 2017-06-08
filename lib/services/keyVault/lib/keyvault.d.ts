/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 */

import * as msRest from 'ms-rest';
import * as msRestAzure from 'ms-rest-azure';
import * as Models from './models';
import InternalClient = require('./keyVaultClient');
export { Models };

/**
 * An object that performs authentication for Key Vault.
 * @class
 * @param {KeyVaultCredentials~authRequest} authenticator  A callback that receives a challenge and returns an authentication token.
 */
export class KeyVaultCredentials implements msRest.ServiceClientCredentials {
  constructor( authenticator:  (challenge: any, callback: any) => any );
  signRequest(webResource: msRest.WebResource, callback: { (err: Error): void }): void;
}

export interface KeyAttributes {
  /**
   *  Determines whether the object is enabled
   */
  enabled?: boolean;
  /**
   * Not before date in UTC
   */
  notBefore?: Date;
  /**
   * Expiry date in UTC
   */
  expires?: Date;
  /**
   * Application-specific metadata in the form of key-value pairs
   */
  tags?: { [propertyName: string]: string };
}

/**
 * @property {object} [options] Optional Parameters.
 * 
 * @property {number} [keySize] The key size in bytes. e.g. 1024 or 2048.
 * 
 * @property {array} [keyOps] Array of key operations e.g. ['encrypt', 'decrypt', 'sign', 'verify', 'wrapKey', 'unwrapKey']
 * 
 * @property {object} [keyAttributes]
 * 
 * @property {boolean} [keyAttributes.enabled] Determines whether the object is enabled
 * 
 * @property {date} [options.keyAttributes.notBefore] Not before date in UTC
 * 
 * @property {date} [keyAttributes.expires] Expiry date in UTC
 * 
 * @property {object} [tags] Application-specific metadata in the form of key-value pairs
 * 
 * @property {object} [customHeaders] Headers that will be added to the request
 */
export interface CreateKeyOptions {
  keySize?: number;
  keyOps?: Array<string>;
  keyAttributes?: KeyAttributes;
}

/**
 * @class
 * Initializes a new instance of the KeyVaultClient class.
 * @constructor
 *
 * @param {credentials} credentials - Credentials needed for the client to connect to Azure.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 * @param {string} [options.apiVersion] - Client Api Version.
 *
 * @param {string} [options.acceptLanguage] - Gets or sets the preferred language for the response.
 *
 * @param {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for Long Running Operations. Default value is 30.
 *
 * @param {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value is generated and included in each request. Default is true.
 *
 */
export class KeyVaultClient {
  constructor(credentials: KeyVaultCredentials, options?: msRestAzure.AzureServiceClientOptions);

  /**
   * Creates a new key, stores it, then returns key parameters and attributes to
   * the client. The create key operation can be used to create any key type in
   * Azure Key Vault. If the named key already exists, Azure Key Vault creates a
   * new version of the key. Authorization: Requires the keys/create permission.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} keyName The name for the new key. The system will generate
   * the version name for the new key.
   *
   * @param {string} keyType The type of key to create. For valid key types, see
   * JsonWebKeyType. Supported JsonWebKey key types (kty) for Elliptic Curve,
   * RSA, HSM, Octet. Possible values include: 'EC', 'RSA', 'RSA-HSM', 'oct'
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {number} [options.keySize] The key size in bytes. For example, 1024
   * or 2048.
   *
   * @param {array} [options.keyOps]
   *
   * @param {object} [options.keyAttributes]
   *
   * @param {boolean} [options.keyAttributes.enabled] Determines whether the
   * object is enabled.
   *
   * @param {date} [options.keyAttributes.notBefore] Not before date in UTC.
   *
   * @param {date} [options.keyAttributes.expires] Expiry date in UTC.
   *
   * @param {object} [options.tags] Application specific metadata in the form of
   * key-value pairs.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<KeyBundle>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  createKeyWithHttpOperationResponse(vaultBaseUrl: string, keyName: string, keyType: string, options?: { keySize? : number, keyOps? : string[], keyAttributes? : Models.KeyAttributes, tags? : { [propertyName: string]: string }, customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.KeyBundle>>;

  /**
   * Creates a new key, stores it, then returns key parameters and attributes to
   * the client. The create key operation can be used to create any key type in
   * Azure Key Vault. If the named key already exists, Azure Key Vault creates a
   * new version of the key. Authorization: Requires the keys/create permission.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} keyName The name for the new key. The system will generate
   * the version name for the new key.
   *
   * @param {string} keyType The type of key to create. For valid key types, see
   * JsonWebKeyType. Supported JsonWebKey key types (kty) for Elliptic Curve,
   * RSA, HSM, Octet. Possible values include: 'EC', 'RSA', 'RSA-HSM', 'oct'
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {number} [options.keySize] The key size in bytes. For example, 1024
   * or 2048.
   *
   * @param {array} [options.keyOps]
   *
   * @param {object} [options.keyAttributes]
   *
   * @param {boolean} [options.keyAttributes.enabled] Determines whether the
   * object is enabled.
   *
   * @param {date} [options.keyAttributes.notBefore] Not before date in UTC.
   *
   * @param {date} [options.keyAttributes.expires] Expiry date in UTC.
   *
   * @param {object} [options.tags] Application specific metadata in the form of
   * key-value pairs.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {KeyBundle} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {KeyBundle} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link KeyBundle} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  createKey(vaultBaseUrl: string, keyName: string, keyType: string, options?: CreateKeyOptions): Promise<Models.KeyBundle>;
  createKey(vaultBaseUrl: string, keyName: string, keyType: string, callback: msRest.ServiceCallback<Models.KeyBundle>): void;
  createKey(vaultBaseUrl: string, keyName: string, keyType: string, options : CreateKeyOptions, callback: msRest.ServiceCallback<Models.KeyBundle>): void;
  
  /**
   * Imports an externally created key, stores it, and returns key parameters and
   * attributes to the client. The import key operation may be used to import any
   * key type into an Azure Key Vault. If the named key already exists, Azure Key
   * Vault creates a new version of the key. Authorization: requires the
   * keys/import permission.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} keyName Name for the imported key.
   *
   * @param {object} key The Json web key
   *
   * @param {string} [key.kid] Key identifier.
   *
   * @param {string} [key.kty] Supported JsonWebKey key types (kty) for Elliptic
   * Curve, RSA, HSM, Octet. Kty is usually set to RSA. Possible values include:
   * 'EC', 'RSA', 'RSA-HSM', 'oct'
   *
   * @param {array} [key.keyOps]
   *
   * @param {buffer} [key.n] RSA modulus.
   *
   * @param {buffer} [key.e] RSA public exponent.
   *
   * @param {buffer} [key.d] RSA private exponent.
   *
   * @param {buffer} [key.dp] RSA private key parameter.
   *
   * @param {buffer} [key.dq] RSA private key parameter.
   *
   * @param {buffer} [key.qi] RSA private key parameter.
   *
   * @param {buffer} [key.p] RSA secret prime.
   *
   * @param {buffer} [key.q] RSA secret prime, with p < q.
   *
   * @param {buffer} [key.k] Symmetric key.
   *
   * @param {buffer} [key.t] HSM Token, used with 'Bring Your Own Key'.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {boolean} [options.hsm] Whether to import as a hardware key (HSM) or
   * software key.
   *
   * @param {object} [options.keyAttributes] The key management attributes.
   *
   * @param {boolean} [options.keyAttributes.enabled] Determines whether the
   * object is enabled.
   *
   * @param {date} [options.keyAttributes.notBefore] Not before date in UTC.
   *
   * @param {date} [options.keyAttributes.expires] Expiry date in UTC.
   *
   * @param {object} [options.tags] Application specific metadata in the form of
   * key-value pairs.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<KeyBundle>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  importKeyWithHttpOperationResponse(vaultBaseUrl: string, keyName: string, key: Models.JsonWebKey, options?: { hsm? : boolean, keyAttributes? : Models.KeyAttributes, tags? : { [propertyName: string]: string }, customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.KeyBundle>>;

  /**
   * Imports an externally created key, stores it, and returns key parameters and
   * attributes to the client. The import key operation may be used to import any
   * key type into an Azure Key Vault. If the named key already exists, Azure Key
   * Vault creates a new version of the key. Authorization: requires the
   * keys/import permission.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} keyName Name for the imported key.
   *
   * @param {object} key The Json web key
   *
   * @param {string} [key.kid] Key identifier.
   *
   * @param {string} [key.kty] Supported JsonWebKey key types (kty) for Elliptic
   * Curve, RSA, HSM, Octet. Kty is usually set to RSA. Possible values include:
   * 'EC', 'RSA', 'RSA-HSM', 'oct'
   *
   * @param {array} [key.keyOps]
   *
   * @param {buffer} [key.n] RSA modulus.
   *
   * @param {buffer} [key.e] RSA public exponent.
   *
   * @param {buffer} [key.d] RSA private exponent.
   *
   * @param {buffer} [key.dp] RSA private key parameter.
   *
   * @param {buffer} [key.dq] RSA private key parameter.
   *
   * @param {buffer} [key.qi] RSA private key parameter.
   *
   * @param {buffer} [key.p] RSA secret prime.
   *
   * @param {buffer} [key.q] RSA secret prime, with p < q.
   *
   * @param {buffer} [key.k] Symmetric key.
   *
   * @param {buffer} [key.t] HSM Token, used with 'Bring Your Own Key'.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {boolean} [options.hsm] Whether to import as a hardware key (HSM) or
   * software key.
   *
   * @param {object} [options.keyAttributes] The key management attributes.
   *
   * @param {boolean} [options.keyAttributes.enabled] Determines whether the
   * object is enabled.
   *
   * @param {date} [options.keyAttributes.notBefore] Not before date in UTC.
   *
   * @param {date} [options.keyAttributes.expires] Expiry date in UTC.
   *
   * @param {object} [options.tags] Application specific metadata in the form of
   * key-value pairs.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {KeyBundle} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {KeyBundle} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link KeyBundle} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  importKey(vaultBaseUrl: string, keyName: string, key: Models.JsonWebKey, options?: { hsm? : boolean, keyAttributes? : Models.KeyAttributes, tags? : { [propertyName: string]: string }, customHeaders? : { [headerName: string]: string; } }): Promise<Models.KeyBundle>;
  importKey(vaultBaseUrl: string, keyName: string, key: Models.JsonWebKey, callback: msRest.ServiceCallback<Models.KeyBundle>): void;
  importKey(vaultBaseUrl: string, keyName: string, key: Models.JsonWebKey, options: { hsm? : boolean, keyAttributes? : Models.KeyAttributes, tags? : { [propertyName: string]: string }, customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.KeyBundle>): void;

  /**
   * Deletes a key of any type from storage in Azure Key Vault. The delete key
   * operation cannot be used to remove individual versions of a key. This
   * operation removes the cryptographic material associated with the key, which
   * means the key is not usable for Sign/Verify, Wrap/Unwrap or Encrypt/Decrypt
   * operations. Authorization: Requires the keys/delete permission.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} keyName The name of the key to delete.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<KeyBundle>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  deleteKeyWithHttpOperationResponse(vaultBaseUrl: string, keyName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.KeyBundle>>;

  /**
   * Deletes a key of any type from storage in Azure Key Vault. The delete key
   * operation cannot be used to remove individual versions of a key. This
   * operation removes the cryptographic material associated with the key, which
   * means the key is not usable for Sign/Verify, Wrap/Unwrap or Encrypt/Decrypt
   * operations. Authorization: Requires the keys/delete permission.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} keyName The name of the key to delete.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {KeyBundle} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {KeyBundle} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link KeyBundle} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  deleteKey(vaultBaseUrl: string, keyName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<Models.KeyBundle>;
  deleteKey(vaultBaseUrl: string, keyName: string, callback: msRest.ServiceCallback<Models.KeyBundle>): void;
  deleteKey(vaultBaseUrl: string, keyName: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.KeyBundle>): void;

  /**
   * The update key operation changes specified attributes of a stored key and
   * can be applied to any key type and key version stored in Azure Key Vault.
   * The cryptographic material of a key itself cannot be changed. In order to
   * perform this operation, the key must already exist in the Key Vault.
   * Authorization: requires the keys/update permission.
   *
   * @param {string} keyIdentifier The key identifier. It may or may not contain a version path. If a version is not provided, the latest key version is used.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {array} [options.keyOps] Json web key operations. For more
   * information on possible key operations, see JsonWebKeyOperation.
   *
   * @param {object} [options.keyAttributes]
   *
   * @param {boolean} [options.keyAttributes.enabled] Determines whether the
   * object is enabled.
   *
   * @param {date} [options.keyAttributes.notBefore] Not before date in UTC.
   *
   * @param {date} [options.keyAttributes.expires] Expiry date in UTC.
   *
   * @param {object} [options.tags] Application specific metadata in the form of
   * key-value pairs.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<KeyBundle>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  updateKeyWithHttpOperationResponse(keyIdentifier: string, options?: { keyOps? : string[], keyAttributes? : Models.KeyAttributes, tags? : { [propertyName: string]: string }, customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.KeyBundle>>;

  /**
   * The update key operation changes specified attributes of a stored key and
   * can be applied to any key type and key version stored in Azure Key Vault.
   * The cryptographic material of a key itself cannot be changed. In order to
   * perform this operation, the key must already exist in the Key Vault.
   * Authorization: requires the keys/update permission.
   *
   * @param {string} keyIdentifier The key identifier. It may or may not contain a version path. If a version is not provided, the latest key version is used.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {array} [options.keyOps] Json web key operations. For more
   * information on possible key operations, see JsonWebKeyOperation.
   *
   * @param {object} [options.keyAttributes]
   *
   * @param {boolean} [options.keyAttributes.enabled] Determines whether the
   * object is enabled.
   *
   * @param {date} [options.keyAttributes.notBefore] Not before date in UTC.
   *
   * @param {date} [options.keyAttributes.expires] Expiry date in UTC.
   *
   * @param {object} [options.tags] Application specific metadata in the form of
   * key-value pairs.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {KeyBundle} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {KeyBundle} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link KeyBundle} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  updateKey(keyIdentifier: string, options?: { keyOps? : string[], keyAttributes? : Models.KeyAttributes, tags? : { [propertyName: string]: string }, customHeaders? : { [headerName: string]: string; } }): Promise<Models.KeyBundle>;
  updateKey(keyIdentifier: string, callback: msRest.ServiceCallback<Models.KeyBundle>): void;
  updateKey(keyIdentifier: string, options: { keyOps? : string[], keyAttributes? : Models.KeyAttributes, tags? : { [propertyName: string]: string }, customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.KeyBundle>): void;

  /**
   * Gets the public part of a stored key. The get key operation is applicable to
   * all key types. If the requested key is symmetric, then no key material is
   * released in the response. Authorization: Requires the keys/get permission.
   *
   * @param {string} keyIdentifier The key identifier. It may or may not contain a version path. If a version is not provided, the latest key version is used.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<KeyBundle>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  getKeyWithHttpOperationResponse(keyIdentifier: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.KeyBundle>>;

  /**
   * Gets the public part of a stored key. The get key operation is applicable to
   * all key types. If the requested key is symmetric, then no key material is
   * released in the response. Authorization: Requires the keys/get permission.
   *
   * @param {string} keyIdentifier The key identifier. It may or may not contain a version path. If a version is not provided, the latest key version is used.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {KeyBundle} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {KeyBundle} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link KeyBundle} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  getKey(keyIdentifier: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<Models.KeyBundle>;
  getKey(keyIdentifier: string, callback: msRest.ServiceCallback<Models.KeyBundle>): void;
  getKey(keyIdentifier: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.KeyBundle>): void;

  /**
   * Retrieves a list of individual key versions with the same key name. The full
   * key identifier, attributes, and tags are provided in the response.
   * Authorization: Requires the keys/list permission.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} keyName The name of the key.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {number} [options.maxresults] Maximum number of results to return in
   * a page. If not specified the service will return up to 25 results.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<KeyListResult>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  getKeyVersionsWithHttpOperationResponse(vaultBaseUrl: string, keyName: string, options?: { maxresults? : number, customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.KeyListResult>>;

   /**
    * Retrieves a list of individual key versions with the same key name. The full
    * key identifier, attributes, and tags are provided in the response.
    * Authorization: Requires the keys/list permission.
    *
    * @param {string} vaultBaseUrl The vault name, for example
    * https://myvault.vault.azure.net.
    *
    * @param {string} keyName The name of the key.
    *
    * @param {object} [options] Optional Parameters.
    *
    * @param {number} [options.maxresults] Maximum number of results to return in
    * a page. If not specified the service will return up to 25 results.
    *
    * @param {object} [options.customHeaders] Headers that will be added to the
    * request
    *
    * @param {ServiceCallback} [optionalCallback] - The optional callback.
    *
    * @returns {ServiceCallback|Promise} If a callback was passed as the last
    * parameter then it returns the callback else returns a Promise.
    *
    * {Promise} A promise is returned.
    *
    *                      @resolve {KeyListResult} - The deserialized result object.
    *
    *                      @reject {Error|ServiceError} - The error object.
    *
    * {ServiceCallback} optionalCallback(err, result, request, response)
    *
    *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
    *
    *                      {KeyListResult} [result]   - The deserialized result object if an error did not occur.
    *                      See {@link KeyListResult} for more information.
    *
    *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
    *
    *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
    */
  getKeyVersions(vaultBaseUrl: string, keyName: string, options?: { maxresults? : number, customHeaders? : { [headerName: string]: string; } }): Promise<Models.KeyListResult>;
  getKeyVersions(vaultBaseUrl: string, keyName: string, callback: msRest.ServiceCallback<Models.KeyListResult>): void;
  getKeyVersions(vaultBaseUrl: string, keyName: string, options: { maxresults? : number, customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.KeyListResult>): void;

  /**
   * List keys in the specified vault.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {number} [options.maxresults] Maximum number of results to return in
   * a page. If not specified the service will return up to 25 results.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<KeyListResult>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  getKeysWithHttpOperationResponse(vaultBaseUrl: string, options?: { maxresults? : number, customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.KeyListResult>>;

  /**
   * List keys in the specified vault.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {number} [options.maxresults] Maximum number of results to return in
   * a page. If not specified the service will return up to 25 results.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {KeyListResult} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {KeyListResult} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link KeyListResult} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  getKeys(vaultBaseUrl: string, options?: { maxresults? : number, customHeaders? : { [headerName: string]: string; } }): Promise<Models.KeyListResult>;
  getKeys(vaultBaseUrl: string, callback: msRest.ServiceCallback<Models.KeyListResult>): void;
  getKeys(vaultBaseUrl: string, options: { maxresults? : number, customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.KeyListResult>): void;

  /**
   * Requests that a backup of the specified key be downloaded to the client.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} keyName The name of the key.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<BackupKeyResult>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  backupKeyWithHttpOperationResponse(vaultBaseUrl: string, keyName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.BackupKeyResult>>;

  /**
   * Requests that a backup of the specified key be downloaded to the client.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} keyName The name of the key.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {BackupKeyResult} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {BackupKeyResult} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link BackupKeyResult} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  backupKey(vaultBaseUrl: string, keyName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<Models.BackupKeyResult>;
  backupKey(vaultBaseUrl: string, keyName: string, callback: msRest.ServiceCallback<Models.BackupKeyResult>): void;
  backupKey(vaultBaseUrl: string, keyName: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.BackupKeyResult>): void;

  /**
   * Restores a backed up key to a vault.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {buffer} keyBundleBackup The backup blob associated with a key
   * bundle.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<KeyBundle>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  restoreKeyWithHttpOperationResponse(vaultBaseUrl: string, keyBundleBackup: Buffer, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.KeyBundle>>;

  /**
   * Restores a backed up key to a vault.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {buffer} keyBundleBackup The backup blob associated with a key
   * bundle.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {KeyBundle} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {KeyBundle} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link KeyBundle} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  restoreKey(vaultBaseUrl: string, keyBundleBackup: Buffer, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<Models.KeyBundle>;
  restoreKey(vaultBaseUrl: string, keyBundleBackup: Buffer, callback: msRest.ServiceCallback<Models.KeyBundle>): void;
  restoreKey(vaultBaseUrl: string, keyBundleBackup: Buffer, options: { customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.KeyBundle>): void;

  /**
   * Encrypts an arbitrary sequence of bytes using an encryption key that is
   * stored in a key vault.
   *
   * @param {string} keyIdentifier The key identifier. It may or may not contain a version path. If a version is not provided, the latest key version is used.
   *
   * @param {string} algorithm algorithm identifier. Possible values include:
   * 'RSA-OAEP', 'RSA1_5'
   *
   * @param {buffer} value
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<KeyOperationResult>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  encryptWithHttpOperationResponse(keyIdentifier: string, algorithm: string, value: Buffer, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.KeyOperationResult>>;

  /**
   * Encrypts an arbitrary sequence of bytes using an encryption key that is
   * stored in Azure Key Vault.
   *
   * @param {string} keyIdentifier The key identifier. It may or may not contain a version path. If a version is not provided, the latest key version is used.
   * 
   * @param {string} algorithm algorithm identifier. Possible values include:
   * 'RSA-OAEP', 'RSA1_5'
   * 
   * @param {buffer} value
   * 
   * @param {object} [options] Optional Parameters.
   * 
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   * 
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {KeyOperationResult} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {KeyOperationResult} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link KeyOperationResult} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  encrypt(keyIdentifier: string, algorithm: string, value: Buffer, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<Models.KeyOperationResult>;
  encrypt(keyIdentifier: string, algorithm: string, value: Buffer, callback: msRest.ServiceCallback<Models.KeyOperationResult>): void;
  encrypt(keyIdentifier: string, algorithm: string, value: Buffer, options: { customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.KeyOperationResult>): void;

  /**
   * Decrypts a single block of encrypted data.
   *
   * @param {string} keyIdentifier The key identifier. It may or may not contain a version path. If a version is not provided, the latest key version is used.
   *
   * @param {string} algorithm algorithm identifier. Possible values include:
   * 'RSA-OAEP', 'RSA1_5'
   *
   * @param {buffer} value
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<KeyOperationResult>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  decryptWithHttpOperationResponse(keyIdentifier: string, algorithm: string, value: Buffer, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.KeyOperationResult>>;

  /**
   * Decrypts a single block of encrypted data
   *
   * @param {string} keyIdentifier The key identifier. It may or may not contain a version path. If a version is not provided, the latest key version is used.
   * 
   * @param {string} algorithm algorithm identifier. Possible values include:
   * 'RSA-OAEP', 'RSA1_5'
   * 
   * @param {buffer} value
   * 
   * @param {object} [options] Optional Parameters.
   * 
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   * 
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {KeyOperationResult} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {KeyOperationResult} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link KeyOperationResult} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  decrypt(keyIdentifier: string, algorithm: string, value: Buffer, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<Models.KeyOperationResult>;
  decrypt(keyIdentifier: string, algorithm: string, value: Buffer, callback: msRest.ServiceCallback<Models.KeyOperationResult>): void;
  decrypt(keyIdentifier: string, algorithm: string, value: Buffer, options: { customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.KeyOperationResult>): void;

   /**
   * Creates a signature from a digest using the specified key.
   *
   * @param {string} keyIdentifier The key identifier. It may or may not contain a version path. If a version is not provided, the latest key version is used.
   *
   * @param {string} algorithm The signing/verification algorithm identifier. For
   * more information on possible algorithm types, see
   * JsonWebKeySignatureAlgorithm. Possible values include: 'RS256', 'RS384',
   * 'RS512', 'RSNULL'
   *
   * @param {buffer} value
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<KeyOperationResult>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  signWithHttpOperationResponse(vaultBaseUrl: string, keyName: string, keyVersion: string, algorithm: string, value: Buffer, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.KeyOperationResult>>;

  /**
   * Creates a signature from a digest using the specified key.
   *
   * @param {string} keyIdentifier The key identifier. It may or may not contain a version path. If a version is not provided, the latest key version is used.
   *
   * @param {string} algorithm The signing/verification algorithm identifier. For
   * more information on possible algorithm types, see
   * JsonWebKeySignatureAlgorithm. Possible values include: 'RS256', 'RS384',
   * 'RS512', 'RSNULL'
   *
   * @param {buffer} value
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {KeyOperationResult} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {KeyOperationResult} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link KeyOperationResult} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  sign(keyIdentifier: string, algorithm: string, value: Buffer, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<Models.KeyOperationResult>;
  sign(keyIdentifier: string, algorithm: string, value: Buffer, callback: msRest.ServiceCallback<Models.KeyOperationResult>): void;
  sign(keyIdentifier: string, algorithm: string, value: Buffer, options: { customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.KeyOperationResult>): void;

  /**
   * Verifies a signature using a specified key.
   *
   * @param {string} keyIdentifier The key identifier. It may or may not contain a version path. If a version is not provided, the latest key version is used.
   *
   * @param {string} algorithm The signing/verification algorithm. For more
   * information on possible algorithm types, see JsonWebKeySignatureAlgorithm.
   * Possible values include: 'RS256', 'RS384', 'RS512', 'RSNULL'
   *
   * @param {buffer} digest The digest used for signing.
   *
   * @param {buffer} signature The signature to be verified.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<KeyVerifyResult>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  verifyWithHttpOperationResponse(keyIdentifier: string, algorithm: string, digest: Buffer, signature: Buffer, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.KeyVerifyResult>>;

  /**
   * Verifies a signature using a specified key.
   *
   * @param {string} keyIdentifier The key identifier. It may or may not contain a version path. If a version is not provided, the latest key version is used.
   *
   * @param {string} algorithm The signing/verification algorithm. For more
   * information on possible algorithm types, see JsonWebKeySignatureAlgorithm.
   * Possible values include: 'RS256', 'RS384', 'RS512', 'RSNULL'
   *
   * @param {buffer} digest The digest used for signing.
   *
   * @param {buffer} signature The signature to be verified.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {KeyVerifyResult} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {KeyVerifyResult} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link KeyVerifyResult} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  verify(keyIdentifier: string, algorithm: string, digest: Buffer, signature: Buffer, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<Models.KeyVerifyResult>;
  verify(keyIdentifier: string, algorithm: string, digest: Buffer, signature: Buffer, callback: msRest.ServiceCallback<Models.KeyVerifyResult>): void;
  verify(keyIdentifier: string, algorithm: string, digest: Buffer, signature: Buffer, options: { customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.KeyVerifyResult>): void;

  /**
   * Wraps a symmetric key using a specified key.
   *
   * @param {string} keyIdentifier The key identifier. It may or may not contain a version path. If a version is not provided, the latest key version is used.
   *
   * @param {string} algorithm algorithm identifier. Possible values include:
   * 'RSA-OAEP', 'RSA1_5'
   *
   * @param {buffer} value
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<KeyOperationResult>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  wrapKeyWithHttpOperationResponse(keyIdentifier: string, algorithm: string, value: Buffer, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.KeyOperationResult>>;

  /**
   * Wraps a symmetric key using a specified key.
   *
   * @param {string} keyIdentifier The key identifier. It may or may not contain a version path. If a version is not provided, the latest key version is used.
   * 
   * @param {string} algorithm algorithm identifier. Possible values include:
   * 'RSA-OAEP', 'RSA1_5'
   *
   * @param {buffer} value
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {KeyOperationResult} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {KeyOperationResult} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link KeyOperationResult} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  wrapKey(keyIdentifier: string, algorithm: string, value: Buffer, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<Models.KeyOperationResult>;
  wrapKey(keyIdentifier: string, algorithm: string, value: Buffer, callback: msRest.ServiceCallback<Models.KeyOperationResult>): void;
  wrapKey(keyIdentifier: string, algorithm: string, value: Buffer, options: { customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.KeyOperationResult>): void;

  /**
   * Unwraps a symmetric key using the specified key that was initially used for
   * wrapping that key.
   *
   * @param {string} keyIdentifier The key identifier. It may or may not contain a version path. If a version is not provided, the latest key version is used.
   *
   * @param {string} algorithm algorithm identifier. Possible values include:
   * 'RSA-OAEP', 'RSA1_5'
   *
   * @param {buffer} value
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<KeyOperationResult>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  unwrapKeyWithHttpOperationResponse(keyIdentifier: string, algorithm: string, value: Buffer, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.KeyOperationResult>>;

  /**
   * Unwraps a symmetric key using the specified key that was initially used for
   * wrapping that key.
   *
   * @param {string} keyIdentifier The key identifier. It may or may not contain a version path. If a version is not provided, the latest key version is used.
   *
   * @param {string} algorithm algorithm identifier. Possible values include:
   * 'RSA-OAEP', 'RSA1_5'
   *
   * @param {buffer} value
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {KeyOperationResult} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {KeyOperationResult} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link KeyOperationResult} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  unwrapKey(keyIdentifier: string, algorithm: string, value: Buffer, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<Models.KeyOperationResult>;
  unwrapKey(keyIdentifier: string, algorithm: string, value: Buffer, callback: msRest.ServiceCallback<Models.KeyOperationResult>): void;
  unwrapKey(keyIdentifier: string, algorithm: string, value: Buffer, options: { customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.KeyOperationResult>): void;

  /**
   * Sets a secret in a specified key vault.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} secretName The name of the secret.
   *
   * @param {string} value The value of the secret.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.tags] Application specific metadata in the form of
   * key-value pairs.
   *
   * @param {string} [options.contentType] Type of the secret value such as a
   * password.
   *
   * @param {object} [options.secretAttributes] The secret management attributes.
   *
   * @param {boolean} [options.secretAttributes.enabled] Determines whether the
   * object is enabled.
   *
   * @param {date} [options.secretAttributes.notBefore] Not before date in UTC.
   *
   * @param {date} [options.secretAttributes.expires] Expiry date in UTC.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<SecretBundle>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  setSecretWithHttpOperationResponse(vaultBaseUrl: string, secretName: string, value: string, options?: { tags? : { [propertyName: string]: string }, contentType? : string, secretAttributes? : Models.SecretAttributes, customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.SecretBundle>>;

  /**
   * Sets a secret in a specified key vault.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} secretName The name of the secret.
   *
   * @param {string} value The value of the secret.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.tags] Application specific metadata in the form of
   * key-value pairs.
   *
   * @param {string} [options.contentType] Type of the secret value such as a
   * password.
   *
   * @param {object} [options.secretAttributes] The secret management attributes.
   *
   * @param {boolean} [options.secretAttributes.enabled] Determines whether the
   * object is enabled.
   *
   * @param {date} [options.secretAttributes.notBefore] Not before date in UTC.
   *
   * @param {date} [options.secretAttributes.expires] Expiry date in UTC.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {SecretBundle} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {SecretBundle} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link SecretBundle} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  setSecret(vaultBaseUrl: string, secretName: string, value: string, options?: { tags? : { [propertyName: string]: string }, contentType? : string, secretAttributes? : Models.SecretAttributes, customHeaders? : { [headerName: string]: string; } }): Promise<Models.SecretBundle>;
  setSecret(vaultBaseUrl: string, secretName: string, value: string, callback: msRest.ServiceCallback<Models.SecretBundle>): void;
  setSecret(vaultBaseUrl: string, secretName: string, value: string, options: { tags? : { [propertyName: string]: string }, contentType? : string, secretAttributes? : Models.SecretAttributes, customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.SecretBundle>): void;


  /**
   * Deletes a secret from a specified key vault.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} secretName The name of the secret.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<SecretBundle>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  deleteSecretWithHttpOperationResponse(vaultBaseUrl: string, secretName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.SecretBundle>>;

  /**
   * Deletes a secret from a specified key vault.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} secretName The name of the secret.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {SecretBundle} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {SecretBundle} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link SecretBundle} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  deleteSecret(vaultBaseUrl: string, secretName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<Models.SecretBundle>;
  deleteSecret(vaultBaseUrl: string, secretName: string, callback: msRest.ServiceCallback<Models.SecretBundle>): void;
  deleteSecret(vaultBaseUrl: string, secretName: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.SecretBundle>): void;


  /**
   * Updates the attributes associated with a specified secret in a given key
   * vault.
   *
   * @param {string} secretIdentifier The secret identifier. It may or may not contain a version path. If a version is not provided, the latest secret version is used.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {string} [options.contentType] Type of the secret value such as a
   * password.
   *
   * @param {object} [options.secretAttributes] The secret management attributes.
   *
   * @param {boolean} [options.secretAttributes.enabled] Determines whether the
   * object is enabled.
   *
   * @param {date} [options.secretAttributes.notBefore] Not before date in UTC.
   *
   * @param {date} [options.secretAttributes.expires] Expiry date in UTC.
   *
   * @param {object} [options.tags] Application specific metadata in the form of
   * key-value pairs.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<SecretBundle>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  updateSecretWithHttpOperationResponse(secretIdentifier: string, secretName: string, secretVersion: string, options?: { contentType? : string, secretAttributes? : Models.SecretAttributes, tags? : { [propertyName: string]: string }, customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.SecretBundle>>;

  /**
   * Updates the attributes associated with a specified secret in a given key
   * vault.
   *
   * @param {string} secretIdentifier The secret identifier. It may or may not contain a version path. If a version is not provided, the latest secret version is used.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {string} [options.contentType] Type of the secret value such as a
   * password.
   *
   * @param {object} [options.secretAttributes] The secret management attributes.
   *
   * @param {boolean} [options.secretAttributes.enabled] Determines whether the
   * object is enabled.
   *
   * @param {date} [options.secretAttributes.notBefore] Not before date in UTC.
   *
   * @param {date} [options.secretAttributes.expires] Expiry date in UTC.
   *
   * @param {object} [options.tags] Application specific metadata in the form of
   * key-value pairs.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {SecretBundle} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {SecretBundle} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link SecretBundle} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  updateSecret(secretIdentifier: string, options?: { contentType? : string, secretAttributes? : Models.SecretAttributes, tags? : { [propertyName: string]: string }, customHeaders? : { [headerName: string]: string; } }): Promise<Models.SecretBundle>;
  updateSecret(secretIdentifier: string, callback: msRest.ServiceCallback<Models.SecretBundle>): void;
  updateSecret(secretIdentifier: string, options: { contentType? : string, secretAttributes? : Models.SecretAttributes, tags? : { [propertyName: string]: string }, customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.SecretBundle>): void;


  /**
   * Get a specified secret from a given key vault.
   *
   * @param {string} secretIdentifier The secret identifier. It may or may not contain a version path. If a version is not provided, the latest secret version is used.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<SecretBundle>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  getSecretWithHttpOperationResponse(secretIdentifier: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.SecretBundle>>;

  /**
   * Get a specified secret from a given key vault.
   *
   * @param {string} secretIdentifier The secret identifier. It may or may not contain a version path. If a version is not provided, the latest secret version is used.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {SecretBundle} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {SecretBundle} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link SecretBundle} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  getSecret(secretIdentifier: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<Models.SecretBundle>;
  getSecret(secretIdentifier: string, callback: msRest.ServiceCallback<Models.SecretBundle>): void;
  getSecret(secretIdentifier: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.SecretBundle>): void;


  /**
   * List secrets in a specified key vault
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {number} [options.maxresults] Maximum number of results to return in
   * a page. If not specified the service will return up to 25 results.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<SecretListResult>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  getSecretsWithHttpOperationResponse(vaultBaseUrl: string, options?: { maxresults? : number, customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.SecretListResult>>;

  /**
   * List secrets in a specified key vault
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {number} [options.maxresults] Maximum number of results to return in
   * a page. If not specified the service will return up to 25 results.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {SecretListResult} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {SecretListResult} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link SecretListResult} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  getSecrets(vaultBaseUrl: string, options?: { maxresults? : number, customHeaders? : { [headerName: string]: string; } }): Promise<Models.SecretListResult>;
  getSecrets(vaultBaseUrl: string, callback: msRest.ServiceCallback<Models.SecretListResult>): void;
  getSecrets(vaultBaseUrl: string, options: { maxresults? : number, customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.SecretListResult>): void;


  /**
   * List the versions of the specified secret.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} secretName The name of the secret.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {number} [options.maxresults] Maximum number of results to return in
   * a page. If not specified the service will return up to 25 results.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<SecretListResult>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  getSecretVersionsWithHttpOperationResponse(vaultBaseUrl: string, secretName: string, options?: { maxresults? : number, customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.SecretListResult>>;

  /**
   * List the versions of the specified secret.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} secretName The name of the secret.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {number} [options.maxresults] Maximum number of results to return in
   * a page. If not specified the service will return up to 25 results.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {SecretListResult} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {SecretListResult} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link SecretListResult} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  getSecretVersions(vaultBaseUrl: string, secretName: string, options?: { maxresults? : number, customHeaders? : { [headerName: string]: string; } }): Promise<Models.SecretListResult>;
  getSecretVersions(vaultBaseUrl: string, secretName: string, callback: msRest.ServiceCallback<Models.SecretListResult>): void;
  getSecretVersions(vaultBaseUrl: string, secretName: string, options: { maxresults? : number, customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.SecretListResult>): void;

  /**
   * List certificates in a specified key vault
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {number} [options.maxresults] Maximum number of results to return in
   * a page. If not specified the service will return up to 25 results.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<CertificateListResult>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  getCertificatesWithHttpOperationResponse(vaultBaseUrl: string, options?: { maxresults? : number, customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.CertificateListResult>>;

  /**
   * List certificates in a specified key vault
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {number} [options.maxresults] Maximum number of results to return in
   * a page. If not specified the service will return up to 25 results.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {CertificateListResult} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {CertificateListResult} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link CertificateListResult} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  getCertificates(vaultBaseUrl: string, options?: { maxresults? : number, customHeaders? : { [headerName: string]: string; } }): Promise<Models.CertificateListResult>;
  getCertificates(vaultBaseUrl: string, callback: msRest.ServiceCallback<Models.CertificateListResult>): void;
  getCertificates(vaultBaseUrl: string, options: { maxresults? : number, customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.CertificateListResult>): void;

  /**
   * Deletes a certificate from a specified key vault.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} certificateName The name of the certificate.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<CertificateBundle>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  deleteCertificateWithHttpOperationResponse(vaultBaseUrl: string, certificateName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.CertificateBundle>>;

  /**
   * Deletes a certificate from a specified key vault.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} certificateName The name of the certificate.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {CertificateBundle} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {CertificateBundle} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link CertificateBundle} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  deleteCertificate(vaultBaseUrl: string, certificateName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<Models.CertificateBundle>;
  deleteCertificate(vaultBaseUrl: string, certificateName: string, callback: msRest.ServiceCallback<Models.CertificateBundle>): void;
  deleteCertificate(vaultBaseUrl: string, certificateName: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.CertificateBundle>): void;

  /**
   * Sets the certificate contacts for the specified key vault.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {object} contacts The contacts for the key vault certificate.
   *
   * @param {array} [contacts.contactList] The contact list for the vault
   * certificates.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<Contacts>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  setCertificateContactsWithHttpOperationResponse(vaultBaseUrl: string, contacts: Models.Contacts, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.Contacts>>;

  /**
   * Sets the certificate contacts for the specified key vault.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {object} contacts The contacts for the key vault certificate.
   *
   * @param {array} [contacts.contactList] The contact list for the vault
   * certificates.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {Contacts} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {Contacts} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link Contacts} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  setCertificateContacts(vaultBaseUrl: string, contacts: Models.Contacts, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<Models.Contacts>;
  setCertificateContacts(vaultBaseUrl: string, contacts: Models.Contacts, callback: msRest.ServiceCallback<Models.Contacts>): void;
  setCertificateContacts(vaultBaseUrl: string, contacts: Models.Contacts, options: { customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.Contacts>): void;

  /**
   * Lists the certificate contacts for a specified key vault.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<Contacts>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  getCertificateContactsWithHttpOperationResponse(vaultBaseUrl: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.Contacts>>;

  /**
   * Lists the certificate contacts for a specified key vault.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {Contacts} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {Contacts} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link Contacts} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  getCertificateContacts(vaultBaseUrl: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<Models.Contacts>;
  getCertificateContacts(vaultBaseUrl: string, callback: msRest.ServiceCallback<Models.Contacts>): void;
  getCertificateContacts(vaultBaseUrl: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.Contacts>): void;

  /**
   * Deletes the certificate contacts for a specified key vault.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<Contacts>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  deleteCertificateContactsWithHttpOperationResponse(vaultBaseUrl: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.Contacts>>;

  /**
   * Deletes the certificate contacts for a specified key vault.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {Contacts} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {Contacts} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link Contacts} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  deleteCertificateContacts(vaultBaseUrl: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<Models.Contacts>;
  deleteCertificateContacts(vaultBaseUrl: string, callback: msRest.ServiceCallback<Models.Contacts>): void;
  deleteCertificateContacts(vaultBaseUrl: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.Contacts>): void;

  /**
   * List certificate issuers for a specified key vault.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {number} [options.maxresults] Maximum number of results to return in
   * a page. If not specified the service will return up to 25 results.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<CertificateIssuerListResult>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  getCertificateIssuersWithHttpOperationResponse(vaultBaseUrl: string, options?: { maxresults? : number, customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.CertificateIssuerListResult>>;

  /**
   * List certificate issuers for a specified key vault.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {number} [options.maxresults] Maximum number of results to return in
   * a page. If not specified the service will return up to 25 results.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {CertificateIssuerListResult} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {CertificateIssuerListResult} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link CertificateIssuerListResult} for more
   *                      information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  getCertificateIssuers(vaultBaseUrl: string, options?: { maxresults? : number, customHeaders? : { [headerName: string]: string; } }): Promise<Models.CertificateIssuerListResult>;
  getCertificateIssuers(vaultBaseUrl: string, callback: msRest.ServiceCallback<Models.CertificateIssuerListResult>): void;
  getCertificateIssuers(vaultBaseUrl: string, options: { maxresults? : number, customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.CertificateIssuerListResult>): void;

  /**
   * Sets the specified certificate issuer.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} issuerName The name of the issuer.
   *
   * @param {string} provider The issuer provider.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.credentials] The credentials to be used for the
   * issuer.
   *
   * @param {string} [options.credentials.accountId] The user name/account
   * name/account id.
   *
   * @param {string} [options.credentials.password] The password/secret/account
   * key.
   *
   * @param {object} [options.organizationDetails] Details of the organization as
   * provided to the issuer.
   *
   * @param {string} [options.organizationDetails.id] Id of the organization.
   *
   * @param {array} [options.organizationDetails.adminDetails] Details of the
   * organization administrator.
   *
   * @param {object} [options.attributes] Attributes of the issuer object.
   *
   * @param {boolean} [options.attributes.enabled] Determines whether the issuer
   * is enabled.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<IssuerBundle>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  setCertificateIssuerWithHttpOperationResponse(vaultBaseUrl: string, issuerName: string, provider: string, options?: { credentials? : Models.IssuerCredentials, organizationDetails? : Models.OrganizationDetails, attributes? : Models.IssuerAttributes, customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.IssuerBundle>>;

  /**
   * Sets the specified certificate issuer.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} issuerName The name of the issuer.
   *
   * @param {string} provider The issuer provider.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.credentials] The credentials to be used for the
   * issuer.
   *
   * @param {string} [options.credentials.accountId] The user name/account
   * name/account id.
   *
   * @param {string} [options.credentials.password] The password/secret/account
   * key.
   *
   * @param {object} [options.organizationDetails] Details of the organization as
   * provided to the issuer.
   *
   * @param {string} [options.organizationDetails.id] Id of the organization.
   *
   * @param {array} [options.organizationDetails.adminDetails] Details of the
   * organization administrator.
   *
   * @param {object} [options.attributes] Attributes of the issuer object.
   *
   * @param {boolean} [options.attributes.enabled] Determines whether the issuer
   * is enabled.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {IssuerBundle} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {IssuerBundle} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link IssuerBundle} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  setCertificateIssuer(vaultBaseUrl: string, issuerName: string, provider: string, options?: { credentials? : Models.IssuerCredentials, organizationDetails? : Models.OrganizationDetails, attributes? : Models.IssuerAttributes, customHeaders? : { [headerName: string]: string; } }): Promise<Models.IssuerBundle>;
  setCertificateIssuer(vaultBaseUrl: string, issuerName: string, provider: string, callback: msRest.ServiceCallback<Models.IssuerBundle>): void;
  setCertificateIssuer(vaultBaseUrl: string, issuerName: string, provider: string, options: { credentials? : Models.IssuerCredentials, organizationDetails? : Models.OrganizationDetails, attributes? : Models.IssuerAttributes, customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.IssuerBundle>): void;

  /**
   * Updates the specified certificate issuer.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} issuerName The name of the issuer.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {string} [options.provider] The issuer provider.
   *
   * @param {object} [options.credentials] The credentials to be used for the
   * issuer.
   *
   * @param {string} [options.credentials.accountId] The user name/account
   * name/account id.
   *
   * @param {string} [options.credentials.password] The password/secret/account
   * key.
   *
   * @param {object} [options.organizationDetails] Details of the organization as
   * provided to the issuer.
   *
   * @param {string} [options.organizationDetails.id] Id of the organization.
   *
   * @param {array} [options.organizationDetails.adminDetails] Details of the
   * organization administrator.
   *
   * @param {object} [options.attributes] Attributes of the issuer object.
   *
   * @param {boolean} [options.attributes.enabled] Determines whether the issuer
   * is enabled.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<IssuerBundle>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  updateCertificateIssuerWithHttpOperationResponse(vaultBaseUrl: string, issuerName: string, options?: { provider? : string, credentials? : Models.IssuerCredentials, organizationDetails? : Models.OrganizationDetails, attributes? : Models.IssuerAttributes, customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.IssuerBundle>>;

  /**
   * Updates the specified certificate issuer.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} issuerName The name of the issuer.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {string} [options.provider] The issuer provider.
   *
   * @param {object} [options.credentials] The credentials to be used for the
   * issuer.
   *
   * @param {string} [options.credentials.accountId] The user name/account
   * name/account id.
   *
   * @param {string} [options.credentials.password] The password/secret/account
   * key.
   *
   * @param {object} [options.organizationDetails] Details of the organization as
   * provided to the issuer.
   *
   * @param {string} [options.organizationDetails.id] Id of the organization.
   *
   * @param {array} [options.organizationDetails.adminDetails] Details of the
   * organization administrator.
   *
   * @param {object} [options.attributes] Attributes of the issuer object.
   *
   * @param {boolean} [options.attributes.enabled] Determines whether the issuer
   * is enabled.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {IssuerBundle} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {IssuerBundle} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link IssuerBundle} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  updateCertificateIssuer(vaultBaseUrl: string, issuerName: string, options?: { provider? : string, credentials? : Models.IssuerCredentials, organizationDetails? : Models.OrganizationDetails, attributes? : Models.IssuerAttributes, customHeaders? : { [headerName: string]: string; } }): Promise<Models.IssuerBundle>;
  updateCertificateIssuer(vaultBaseUrl: string, issuerName: string, callback: msRest.ServiceCallback<Models.IssuerBundle>): void;
  updateCertificateIssuer(vaultBaseUrl: string, issuerName: string, options: { provider? : string, credentials? : Models.IssuerCredentials, organizationDetails? : Models.OrganizationDetails, attributes? : Models.IssuerAttributes, customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.IssuerBundle>): void;

  /**
   * Lists the specified certificate issuer.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} issuerName The name of the issuer.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<IssuerBundle>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  getCertificateIssuerWithHttpOperationResponse(vaultBaseUrl: string, issuerName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.IssuerBundle>>;
  
  /**
   * Lists the specified certificate issuer.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} issuerName The name of the issuer.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {IssuerBundle} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {IssuerBundle} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link IssuerBundle} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  getCertificateIssuer(vaultBaseUrl: string, issuerName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<Models.IssuerBundle>;
  getCertificateIssuer(vaultBaseUrl: string, issuerName: string, callback: msRest.ServiceCallback<Models.IssuerBundle>): void;
  getCertificateIssuer(vaultBaseUrl: string, issuerName: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.IssuerBundle>): void;

  /**
   * Deletes the specified certificate issuer.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} issuerName The name of the issuer.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<IssuerBundle>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  deleteCertificateIssuerWithHttpOperationResponse(vaultBaseUrl: string, issuerName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.IssuerBundle>>;

  /**
   * Deletes the specified certificate issuer.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} issuerName The name of the issuer.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {IssuerBundle} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {IssuerBundle} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link IssuerBundle} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  deleteCertificateIssuer(vaultBaseUrl: string, issuerName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<Models.IssuerBundle>;
  deleteCertificateIssuer(vaultBaseUrl: string, issuerName: string, callback: msRest.ServiceCallback<Models.IssuerBundle>): void;
  deleteCertificateIssuer(vaultBaseUrl: string, issuerName: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.IssuerBundle>): void;

  /**
   * Creates a new certificate. If this is the first version, the certificate
   * resource is created.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} certificateName The name of the certificate.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.certificatePolicy] The management policy for the
   * certificate.
   *
   * @param {object} [options.certificatePolicy.keyProperties] Properties of the
   * key backing a certificate.
   *
   * @param {boolean} [options.certificatePolicy.keyProperties.exportable]
   * Indicates if the private key can be exported.
   *
   * @param {string} [options.certificatePolicy.keyProperties.keyType] The key
   * type.
   *
   * @param {number} [options.certificatePolicy.keyProperties.keySize] The key
   * size in bytes. For example;  1024 or 2048.
   *
   * @param {boolean} [options.certificatePolicy.keyProperties.reuseKey]
   * Indicates if the same key pair will be used on certificate renewal.
   *
   * @param {object} [options.certificatePolicy.secretProperties] Properties of
   * the secret backing a certificate.
   *
   * @param {string} [options.certificatePolicy.secretProperties.contentType] The
   * media type (MIME type).
   *
   * @param {object} [options.certificatePolicy.x509CertificateProperties]
   * Properties of the X509 component of a certificate.
   *
   * @param {string}
   * [options.certificatePolicy.x509CertificateProperties.subject] The subject
   * name. Should be a valid X509 distinguished Name.
   *
   * @param {array} [options.certificatePolicy.x509CertificateProperties.ekus]
   * The enhanced key usage.
   *
   * @param {object}
   * [options.certificatePolicy.x509CertificateProperties.subjectAlternativeNames]
   * The subject alternative names.
   *
   * @param {array}
   * [options.certificatePolicy.x509CertificateProperties.subjectAlternativeNames.emails]
   * Email addresses.
   *
   * @param {array}
   * [options.certificatePolicy.x509CertificateProperties.subjectAlternativeNames.dnsNames]
   * Domain names.
   *
   * @param {array}
   * [options.certificatePolicy.x509CertificateProperties.subjectAlternativeNames.upns]
   * User principal names.
   *
   * @param {array}
   * [options.certificatePolicy.x509CertificateProperties.keyUsage] List of key
   * usages.
   *
   * @param {number}
   * [options.certificatePolicy.x509CertificateProperties.validityInMonths] The
   * duration that the ceritifcate is valid in months.
   *
   * @param {array} [options.certificatePolicy.lifetimeActions] Actions that will
   * be performed by Key Vault over the lifetime of a certificate.
   *
   * @param {object} [options.certificatePolicy.issuerParameters] Parameters for
   * the issuer of the X509 component of a certificate.
   *
   * @param {string} [options.certificatePolicy.issuerParameters.name] Name of
   * the referenced issuer object or reserved names; for example, 'Self' or
   * 'Unknown'.
   *
   * @param {string} [options.certificatePolicy.issuerParameters.certificateType]
   * Type of certificate to be requested from the issuer provider.
   *
   * @param {object} [options.certificatePolicy.attributes] The certificate
   * attributes.
   *
   * @param {object} [options.certificateAttributes] The attributes of the
   * certificate (optional).
   *
   * @param {boolean} [options.certificateAttributes.enabled] Determines whether
   * the object is enabled.
   *
   * @param {date} [options.certificateAttributes.notBefore] Not before date in
   * UTC.
   *
   * @param {date} [options.certificateAttributes.expires] Expiry date in UTC.
   *
   * @param {object} [options.tags] Application specific metadata in the form of
   * key-value pairs.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<CertificateOperation>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  createCertificateWithHttpOperationResponse(vaultBaseUrl: string, certificateName: string, options?: { certificatePolicy? : Models.CertificatePolicy, certificateAttributes? : Models.CertificateAttributes, tags? : { [propertyName: string]: string }, customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.CertificateOperation>>;

  /**
   * Creates a new certificate. If this is the first version, the certificate
   * resource is created.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} certificateName The name of the certificate.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.certificatePolicy] The management policy for the
   * certificate.
   *
   * @param {object} [options.certificatePolicy.keyProperties] Properties of the
   * key backing a certificate.
   *
   * @param {boolean} [options.certificatePolicy.keyProperties.exportable]
   * Indicates if the private key can be exported.
   *
   * @param {string} [options.certificatePolicy.keyProperties.keyType] The key
   * type.
   *
   * @param {number} [options.certificatePolicy.keyProperties.keySize] The key
   * size in bytes. For example;  1024 or 2048.
   *
   * @param {boolean} [options.certificatePolicy.keyProperties.reuseKey]
   * Indicates if the same key pair will be used on certificate renewal.
   *
   * @param {object} [options.certificatePolicy.secretProperties] Properties of
   * the secret backing a certificate.
   *
   * @param {string} [options.certificatePolicy.secretProperties.contentType] The
   * media type (MIME type).
   *
   * @param {object} [options.certificatePolicy.x509CertificateProperties]
   * Properties of the X509 component of a certificate.
   *
   * @param {string}
   * [options.certificatePolicy.x509CertificateProperties.subject] The subject
   * name. Should be a valid X509 distinguished Name.
   *
   * @param {array} [options.certificatePolicy.x509CertificateProperties.ekus]
   * The enhanced key usage.
   *
   * @param {object}
   * [options.certificatePolicy.x509CertificateProperties.subjectAlternativeNames]
   * The subject alternative names.
   *
   * @param {array}
   * [options.certificatePolicy.x509CertificateProperties.subjectAlternativeNames.emails]
   * Email addresses.
   *
   * @param {array}
   * [options.certificatePolicy.x509CertificateProperties.subjectAlternativeNames.dnsNames]
   * Domain names.
   *
   * @param {array}
   * [options.certificatePolicy.x509CertificateProperties.subjectAlternativeNames.upns]
   * User principal names.
   *
   * @param {array}
   * [options.certificatePolicy.x509CertificateProperties.keyUsage] List of key
   * usages.
   *
   * @param {number}
   * [options.certificatePolicy.x509CertificateProperties.validityInMonths] The
   * duration that the ceritifcate is valid in months.
   *
   * @param {array} [options.certificatePolicy.lifetimeActions] Actions that will
   * be performed by Key Vault over the lifetime of a certificate.
   *
   * @param {object} [options.certificatePolicy.issuerParameters] Parameters for
   * the issuer of the X509 component of a certificate.
   *
   * @param {string} [options.certificatePolicy.issuerParameters.name] Name of
   * the referenced issuer object or reserved names; for example, 'Self' or
   * 'Unknown'.
   *
   * @param {string} [options.certificatePolicy.issuerParameters.certificateType]
   * Type of certificate to be requested from the issuer provider.
   *
   * @param {object} [options.certificatePolicy.attributes] The certificate
   * attributes.
   *
   * @param {object} [options.certificateAttributes] The attributes of the
   * certificate (optional).
   *
   * @param {boolean} [options.certificateAttributes.enabled] Determines whether
   * the object is enabled.
   *
   * @param {date} [options.certificateAttributes.notBefore] Not before date in
   * UTC.
   *
   * @param {date} [options.certificateAttributes.expires] Expiry date in UTC.
   *
   * @param {object} [options.tags] Application specific metadata in the form of
   * key-value pairs.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {CertificateOperation} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {CertificateOperation} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link CertificateOperation} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  createCertificate(vaultBaseUrl: string, certificateName: string, options?: { certificatePolicy? : Models.CertificatePolicy, certificateAttributes? : Models.CertificateAttributes, tags? : { [propertyName: string]: string }, customHeaders? : { [headerName: string]: string; } }): Promise<Models.CertificateOperation>;
  createCertificate(vaultBaseUrl: string, certificateName: string, callback: msRest.ServiceCallback<Models.CertificateOperation>): void;
  createCertificate(vaultBaseUrl: string, certificateName: string, options: { certificatePolicy? : Models.CertificatePolicy, certificateAttributes? : Models.CertificateAttributes, tags? : { [propertyName: string]: string }, customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.CertificateOperation>): void;


  /**
   * Imports a certificate into a specified key vault.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} certificateName The name of the certificate.
   *
   * @param {string} base64EncodedCertificate Base64 encoded representation of
   * the certificate object to import. This certificate needs to contain the
   * private key.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {string} [options.password] If the private key in
   * base64EncodedCertificate is encrypted, the password used for encryption.
   *
   * @param {object} [options.certificatePolicy] The management policy for the
   * certificate.
   *
   * @param {object} [options.certificatePolicy.keyProperties] Properties of the
   * key backing a certificate.
   *
   * @param {boolean} [options.certificatePolicy.keyProperties.exportable]
   * Indicates if the private key can be exported.
   *
   * @param {string} [options.certificatePolicy.keyProperties.keyType] The key
   * type.
   *
   * @param {number} [options.certificatePolicy.keyProperties.keySize] The key
   * size in bytes. For example;  1024 or 2048.
   *
   * @param {boolean} [options.certificatePolicy.keyProperties.reuseKey]
   * Indicates if the same key pair will be used on certificate renewal.
   *
   * @param {object} [options.certificatePolicy.secretProperties] Properties of
   * the secret backing a certificate.
   *
   * @param {string} [options.certificatePolicy.secretProperties.contentType] The
   * media type (MIME type).
   *
   * @param {object} [options.certificatePolicy.x509CertificateProperties]
   * Properties of the X509 component of a certificate.
   *
   * @param {string}
   * [options.certificatePolicy.x509CertificateProperties.subject] The subject
   * name. Should be a valid X509 distinguished Name.
   *
   * @param {array} [options.certificatePolicy.x509CertificateProperties.ekus]
   * The enhanced key usage.
   *
   * @param {object}
   * [options.certificatePolicy.x509CertificateProperties.subjectAlternativeNames]
   * The subject alternative names.
   *
   * @param {array}
   * [options.certificatePolicy.x509CertificateProperties.subjectAlternativeNames.emails]
   * Email addresses.
   *
   * @param {array}
   * [options.certificatePolicy.x509CertificateProperties.subjectAlternativeNames.dnsNames]
   * Domain names.
   *
   * @param {array}
   * [options.certificatePolicy.x509CertificateProperties.subjectAlternativeNames.upns]
   * User principal names.
   *
   * @param {array}
   * [options.certificatePolicy.x509CertificateProperties.keyUsage] List of key
   * usages.
   *
   * @param {number}
   * [options.certificatePolicy.x509CertificateProperties.validityInMonths] The
   * duration that the ceritifcate is valid in months.
   *
   * @param {array} [options.certificatePolicy.lifetimeActions] Actions that will
   * be performed by Key Vault over the lifetime of a certificate.
   *
   * @param {object} [options.certificatePolicy.issuerParameters] Parameters for
   * the issuer of the X509 component of a certificate.
   *
   * @param {string} [options.certificatePolicy.issuerParameters.name] Name of
   * the referenced issuer object or reserved names; for example, 'Self' or
   * 'Unknown'.
   *
   * @param {string} [options.certificatePolicy.issuerParameters.certificateType]
   * Type of certificate to be requested from the issuer provider.
   *
   * @param {object} [options.certificatePolicy.attributes] The certificate
   * attributes.
   *
   * @param {object} [options.certificateAttributes] The attributes of the
   * certificate (optional).
   *
   * @param {boolean} [options.certificateAttributes.enabled] Determines whether
   * the object is enabled.
   *
   * @param {date} [options.certificateAttributes.notBefore] Not before date in
   * UTC.
   *
   * @param {date} [options.certificateAttributes.expires] Expiry date in UTC.
   *
   * @param {object} [options.tags] Application specific metadata in the form of
   * key-value pairs.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<CertificateBundle>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  importCertificateWithHttpOperationResponse(vaultBaseUrl: string, certificateName: string, base64EncodedCertificate: string, options?: { password? : string, certificatePolicy? : Models.CertificatePolicy, certificateAttributes? : Models.CertificateAttributes, tags? : { [propertyName: string]: string }, customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.CertificateBundle>>;

  /**
   * Imports a certificate into a specified key vault.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} certificateName The name of the certificate.
   *
   * @param {string} base64EncodedCertificate Base64 encoded representation of
   * the certificate object to import. This certificate needs to contain the
   * private key.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {string} [options.password] If the private key in
   * base64EncodedCertificate is encrypted, the password used for encryption.
   *
   * @param {object} [options.certificatePolicy] The management policy for the
   * certificate.
   *
   * @param {object} [options.certificatePolicy.keyProperties] Properties of the
   * key backing a certificate.
   *
   * @param {boolean} [options.certificatePolicy.keyProperties.exportable]
   * Indicates if the private key can be exported.
   *
   * @param {string} [options.certificatePolicy.keyProperties.keyType] The key
   * type.
   *
   * @param {number} [options.certificatePolicy.keyProperties.keySize] The key
   * size in bytes. For example;  1024 or 2048.
   *
   * @param {boolean} [options.certificatePolicy.keyProperties.reuseKey]
   * Indicates if the same key pair will be used on certificate renewal.
   *
   * @param {object} [options.certificatePolicy.secretProperties] Properties of
   * the secret backing a certificate.
   *
   * @param {string} [options.certificatePolicy.secretProperties.contentType] The
   * media type (MIME type).
   *
   * @param {object} [options.certificatePolicy.x509CertificateProperties]
   * Properties of the X509 component of a certificate.
   *
   * @param {string}
   * [options.certificatePolicy.x509CertificateProperties.subject] The subject
   * name. Should be a valid X509 distinguished Name.
   *
   * @param {array} [options.certificatePolicy.x509CertificateProperties.ekus]
   * The enhanced key usage.
   *
   * @param {object}
   * [options.certificatePolicy.x509CertificateProperties.subjectAlternativeNames]
   * The subject alternative names.
   *
   * @param {array}
   * [options.certificatePolicy.x509CertificateProperties.subjectAlternativeNames.emails]
   * Email addresses.
   *
   * @param {array}
   * [options.certificatePolicy.x509CertificateProperties.subjectAlternativeNames.dnsNames]
   * Domain names.
   *
   * @param {array}
   * [options.certificatePolicy.x509CertificateProperties.subjectAlternativeNames.upns]
   * User principal names.
   *
   * @param {array}
   * [options.certificatePolicy.x509CertificateProperties.keyUsage] List of key
   * usages.
   *
   * @param {number}
   * [options.certificatePolicy.x509CertificateProperties.validityInMonths] The
   * duration that the ceritifcate is valid in months.
   *
   * @param {array} [options.certificatePolicy.lifetimeActions] Actions that will
   * be performed by Key Vault over the lifetime of a certificate.
   *
   * @param {object} [options.certificatePolicy.issuerParameters] Parameters for
   * the issuer of the X509 component of a certificate.
   *
   * @param {string} [options.certificatePolicy.issuerParameters.name] Name of
   * the referenced issuer object or reserved names; for example, 'Self' or
   * 'Unknown'.
   *
   * @param {string} [options.certificatePolicy.issuerParameters.certificateType]
   * Type of certificate to be requested from the issuer provider.
   *
   * @param {object} [options.certificatePolicy.attributes] The certificate
   * attributes.
   *
   * @param {object} [options.certificateAttributes] The attributes of the
   * certificate (optional).
   *
   * @param {boolean} [options.certificateAttributes.enabled] Determines whether
   * the object is enabled.
   *
   * @param {date} [options.certificateAttributes.notBefore] Not before date in
   * UTC.
   *
   * @param {date} [options.certificateAttributes.expires] Expiry date in UTC.
   *
   * @param {object} [options.tags] Application specific metadata in the form of
   * key-value pairs.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {CertificateBundle} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {CertificateBundle} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link CertificateBundle} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  importCertificate(vaultBaseUrl: string, certificateName: string, base64EncodedCertificate: string, options?: { password? : string, certificatePolicy? : Models.CertificatePolicy, certificateAttributes? : Models.CertificateAttributes, tags? : { [propertyName: string]: string }, customHeaders? : { [headerName: string]: string; } }): Promise<Models.CertificateBundle>;
  importCertificate(vaultBaseUrl: string, certificateName: string, base64EncodedCertificate: string, callback: msRest.ServiceCallback<Models.CertificateBundle>): void;
  importCertificate(vaultBaseUrl: string, certificateName: string, base64EncodedCertificate: string, options: { password? : string, certificatePolicy? : Models.CertificatePolicy, certificateAttributes? : Models.CertificateAttributes, tags? : { [propertyName: string]: string }, customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.CertificateBundle>): void;


  /**
   * List the versions of a certificate.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} certificateName The name of the certificate.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {number} [options.maxresults] Maximum number of results to return in
   * a page. If not specified the service will return up to 25 results.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<CertificateListResult>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  getCertificateVersionsWithHttpOperationResponse(vaultBaseUrl: string, certificateName: string, options?: { maxresults? : number, customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.CertificateListResult>>;

  /**
   * List the versions of a certificate.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} certificateName The name of the certificate.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {number} [options.maxresults] Maximum number of results to return in
   * a page. If not specified the service will return up to 25 results.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {CertificateListResult} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {CertificateListResult} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link CertificateListResult} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  getCertificateVersions(vaultBaseUrl: string, certificateName: string, options?: { maxresults? : number, customHeaders? : { [headerName: string]: string; } }): Promise<Models.CertificateListResult>;
  getCertificateVersions(vaultBaseUrl: string, certificateName: string, callback: msRest.ServiceCallback<Models.CertificateListResult>): void;
  getCertificateVersions(vaultBaseUrl: string, certificateName: string, options: { maxresults? : number, customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.CertificateListResult>): void;


  /**
   * Lists the policy for a certificate.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} certificateName The name of the certificate in a given key
   * vault.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<CertificatePolicy>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  getCertificatePolicyWithHttpOperationResponse(vaultBaseUrl: string, certificateName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.CertificatePolicy>>;

  /**
   * Lists the policy for a certificate.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} certificateName The name of the certificate in a given key
   * vault.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {CertificatePolicy} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {CertificatePolicy} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link CertificatePolicy} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  getCertificatePolicy(vaultBaseUrl: string, certificateName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<Models.CertificatePolicy>;
  getCertificatePolicy(vaultBaseUrl: string, certificateName: string, callback: msRest.ServiceCallback<Models.CertificatePolicy>): void;
  getCertificatePolicy(vaultBaseUrl: string, certificateName: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.CertificatePolicy>): void;


  /**
   * Updates the policy for a certificate. Set specified members in the
   * certificate policy. Leave others as null.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} certificateName The name of the certificate in the given
   * vault.
   *
   * @param {object} certificatePolicy The policy for the certificate.
   *
   * @param {object} [certificatePolicy.keyProperties] Properties of the key
   * backing a certificate.
   *
   * @param {boolean} [certificatePolicy.keyProperties.exportable] Indicates if
   * the private key can be exported.
   *
   * @param {string} [certificatePolicy.keyProperties.keyType] The key type.
   *
   * @param {number} [certificatePolicy.keyProperties.keySize] The key size in
   * bytes. For example;  1024 or 2048.
   *
   * @param {boolean} [certificatePolicy.keyProperties.reuseKey] Indicates if the
   * same key pair will be used on certificate renewal.
   *
   * @param {object} [certificatePolicy.secretProperties] Properties of the
   * secret backing a certificate.
   *
   * @param {string} [certificatePolicy.secretProperties.contentType] The media
   * type (MIME type).
   *
   * @param {object} [certificatePolicy.x509CertificateProperties] Properties of
   * the X509 component of a certificate.
   *
   * @param {string} [certificatePolicy.x509CertificateProperties.subject] The
   * subject name. Should be a valid X509 distinguished Name.
   *
   * @param {array} [certificatePolicy.x509CertificateProperties.ekus] The
   * enhanced key usage.
   *
   * @param {object}
   * [certificatePolicy.x509CertificateProperties.subjectAlternativeNames] The
   * subject alternative names.
   *
   * @param {array}
   * [certificatePolicy.x509CertificateProperties.subjectAlternativeNames.emails]
   * Email addresses.
   *
   * @param {array}
   * [certificatePolicy.x509CertificateProperties.subjectAlternativeNames.dnsNames]
   * Domain names.
   *
   * @param {array}
   * [certificatePolicy.x509CertificateProperties.subjectAlternativeNames.upns]
   * User principal names.
   *
   * @param {array} [certificatePolicy.x509CertificateProperties.keyUsage] List
   * of key usages.
   *
   * @param {number}
   * [certificatePolicy.x509CertificateProperties.validityInMonths] The duration
   * that the ceritifcate is valid in months.
   *
   * @param {array} [certificatePolicy.lifetimeActions] Actions that will be
   * performed by Key Vault over the lifetime of a certificate.
   *
   * @param {object} [certificatePolicy.issuerParameters] Parameters for the
   * issuer of the X509 component of a certificate.
   *
   * @param {string} [certificatePolicy.issuerParameters.name] Name of the
   * referenced issuer object or reserved names; for example, 'Self' or
   * 'Unknown'.
   *
   * @param {string} [certificatePolicy.issuerParameters.certificateType] Type of
   * certificate to be requested from the issuer provider.
   *
   * @param {object} [certificatePolicy.attributes] The certificate attributes.
   *
   * @param {boolean} [certificatePolicy.attributes.enabled] Determines whether
   * the object is enabled.
   *
   * @param {date} [certificatePolicy.attributes.notBefore] Not before date in
   * UTC.
   *
   * @param {date} [certificatePolicy.attributes.expires] Expiry date in UTC.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<CertificatePolicy>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  updateCertificatePolicyWithHttpOperationResponse(vaultBaseUrl: string, certificateName: string, certificatePolicy: Models.CertificatePolicy, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.CertificatePolicy>>;

  /**
   * Updates the policy for a certificate. Set specified members in the
   * certificate policy. Leave others as null.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} certificateName The name of the certificate in the given
   * vault.
   *
   * @param {object} certificatePolicy The policy for the certificate.
   *
   * @param {object} [certificatePolicy.keyProperties] Properties of the key
   * backing a certificate.
   *
   * @param {boolean} [certificatePolicy.keyProperties.exportable] Indicates if
   * the private key can be exported.
   *
   * @param {string} [certificatePolicy.keyProperties.keyType] The key type.
   *
   * @param {number} [certificatePolicy.keyProperties.keySize] The key size in
   * bytes. For example;  1024 or 2048.
   *
   * @param {boolean} [certificatePolicy.keyProperties.reuseKey] Indicates if the
   * same key pair will be used on certificate renewal.
   *
   * @param {object} [certificatePolicy.secretProperties] Properties of the
   * secret backing a certificate.
   *
   * @param {string} [certificatePolicy.secretProperties.contentType] The media
   * type (MIME type).
   *
   * @param {object} [certificatePolicy.x509CertificateProperties] Properties of
   * the X509 component of a certificate.
   *
   * @param {string} [certificatePolicy.x509CertificateProperties.subject] The
   * subject name. Should be a valid X509 distinguished Name.
   *
   * @param {array} [certificatePolicy.x509CertificateProperties.ekus] The
   * enhanced key usage.
   *
   * @param {object}
   * [certificatePolicy.x509CertificateProperties.subjectAlternativeNames] The
   * subject alternative names.
   *
   * @param {array}
   * [certificatePolicy.x509CertificateProperties.subjectAlternativeNames.emails]
   * Email addresses.
   *
   * @param {array}
   * [certificatePolicy.x509CertificateProperties.subjectAlternativeNames.dnsNames]
   * Domain names.
   *
   * @param {array}
   * [certificatePolicy.x509CertificateProperties.subjectAlternativeNames.upns]
   * User principal names.
   *
   * @param {array} [certificatePolicy.x509CertificateProperties.keyUsage] List
   * of key usages.
   *
   * @param {number}
   * [certificatePolicy.x509CertificateProperties.validityInMonths] The duration
   * that the ceritifcate is valid in months.
   *
   * @param {array} [certificatePolicy.lifetimeActions] Actions that will be
   * performed by Key Vault over the lifetime of a certificate.
   *
   * @param {object} [certificatePolicy.issuerParameters] Parameters for the
   * issuer of the X509 component of a certificate.
   *
   * @param {string} [certificatePolicy.issuerParameters.name] Name of the
   * referenced issuer object or reserved names; for example, 'Self' or
   * 'Unknown'.
   *
   * @param {string} [certificatePolicy.issuerParameters.certificateType] Type of
   * certificate to be requested from the issuer provider.
   *
   * @param {object} [certificatePolicy.attributes] The certificate attributes.
   *
   * @param {boolean} [certificatePolicy.attributes.enabled] Determines whether
   * the object is enabled.
   *
   * @param {date} [certificatePolicy.attributes.notBefore] Not before date in
   * UTC.
   *
   * @param {date} [certificatePolicy.attributes.expires] Expiry date in UTC.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {CertificatePolicy} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {CertificatePolicy} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link CertificatePolicy} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  updateCertificatePolicy(vaultBaseUrl: string, certificateName: string, certificatePolicy: Models.CertificatePolicy, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<Models.CertificatePolicy>;
  updateCertificatePolicy(vaultBaseUrl: string, certificateName: string, certificatePolicy: Models.CertificatePolicy, callback: msRest.ServiceCallback<Models.CertificatePolicy>): void;
  updateCertificatePolicy(vaultBaseUrl: string, certificateName: string, certificatePolicy: Models.CertificatePolicy, options: { customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.CertificatePolicy>): void;


  /**
   * Updates the specified attributes associated with the given certificate.
   *
   * @param {string} certificateIdentifier The certificate identifier. It may or may not contain a version path. If a version is not provided, the latest certificate version is used.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.certificatePolicy] The management policy for the
   * certificate.
   *
   * @param {object} [options.certificatePolicy.keyProperties] Properties of the
   * key backing a certificate.
   *
   * @param {boolean} [options.certificatePolicy.keyProperties.exportable]
   * Indicates if the private key can be exported.
   *
   * @param {string} [options.certificatePolicy.keyProperties.keyType] The key
   * type.
   *
   * @param {number} [options.certificatePolicy.keyProperties.keySize] The key
   * size in bytes. For example;  1024 or 2048.
   *
   * @param {boolean} [options.certificatePolicy.keyProperties.reuseKey]
   * Indicates if the same key pair will be used on certificate renewal.
   *
   * @param {object} [options.certificatePolicy.secretProperties] Properties of
   * the secret backing a certificate.
   *
   * @param {string} [options.certificatePolicy.secretProperties.contentType] The
   * media type (MIME type).
   *
   * @param {object} [options.certificatePolicy.x509CertificateProperties]
   * Properties of the X509 component of a certificate.
   *
   * @param {string}
   * [options.certificatePolicy.x509CertificateProperties.subject] The subject
   * name. Should be a valid X509 distinguished Name.
   *
   * @param {array} [options.certificatePolicy.x509CertificateProperties.ekus]
   * The enhanced key usage.
   *
   * @param {object}
   * [options.certificatePolicy.x509CertificateProperties.subjectAlternativeNames]
   * The subject alternative names.
   *
   * @param {array}
   * [options.certificatePolicy.x509CertificateProperties.subjectAlternativeNames.emails]
   * Email addresses.
   *
   * @param {array}
   * [options.certificatePolicy.x509CertificateProperties.subjectAlternativeNames.dnsNames]
   * Domain names.
   *
   * @param {array}
   * [options.certificatePolicy.x509CertificateProperties.subjectAlternativeNames.upns]
   * User principal names.
   *
   * @param {array}
   * [options.certificatePolicy.x509CertificateProperties.keyUsage] List of key
   * usages.
   *
   * @param {number}
   * [options.certificatePolicy.x509CertificateProperties.validityInMonths] The
   * duration that the ceritifcate is valid in months.
   *
   * @param {array} [options.certificatePolicy.lifetimeActions] Actions that will
   * be performed by Key Vault over the lifetime of a certificate.
   *
   * @param {object} [options.certificatePolicy.issuerParameters] Parameters for
   * the issuer of the X509 component of a certificate.
   *
   * @param {string} [options.certificatePolicy.issuerParameters.name] Name of
   * the referenced issuer object or reserved names; for example, 'Self' or
   * 'Unknown'.
   *
   * @param {string} [options.certificatePolicy.issuerParameters.certificateType]
   * Type of certificate to be requested from the issuer provider.
   *
   * @param {object} [options.certificatePolicy.attributes] The certificate
   * attributes.
   *
   * @param {object} [options.certificateAttributes] The attributes of the
   * certificate (optional).
   *
   * @param {boolean} [options.certificateAttributes.enabled] Determines whether
   * the object is enabled.
   *
   * @param {date} [options.certificateAttributes.notBefore] Not before date in
   * UTC.
   *
   * @param {date} [options.certificateAttributes.expires] Expiry date in UTC.
   *
   * @param {object} [options.tags] Application specific metadata in the form of
   * key-value pairs.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<CertificateBundle>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  updateCertificateWithHttpOperationResponse(certificateIdentifier: string, options?: { certificatePolicy? : Models.CertificatePolicy, certificateAttributes? : Models.CertificateAttributes, tags? : { [propertyName: string]: string }, customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.CertificateBundle>>;

  /**
   * Updates the specified attributes associated with the given certificate.
   *
   * @param {string} certificateIdentifier The certificate identifier. It may or may not contain a version path. If a version is not provided, the latest certificate version is used.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.certificatePolicy] The management policy for the
   * certificate.
   *
   * @param {object} [options.certificatePolicy.keyProperties] Properties of the
   * key backing a certificate.
   *
   * @param {boolean} [options.certificatePolicy.keyProperties.exportable]
   * Indicates if the private key can be exported.
   *
   * @param {string} [options.certificatePolicy.keyProperties.keyType] The key
   * type.
   *
   * @param {number} [options.certificatePolicy.keyProperties.keySize] The key
   * size in bytes. For example;  1024 or 2048.
   *
   * @param {boolean} [options.certificatePolicy.keyProperties.reuseKey]
   * Indicates if the same key pair will be used on certificate renewal.
   *
   * @param {object} [options.certificatePolicy.secretProperties] Properties of
   * the secret backing a certificate.
   *
   * @param {string} [options.certificatePolicy.secretProperties.contentType] The
   * media type (MIME type).
   *
   * @param {object} [options.certificatePolicy.x509CertificateProperties]
   * Properties of the X509 component of a certificate.
   *
   * @param {string}
   * [options.certificatePolicy.x509CertificateProperties.subject] The subject
   * name. Should be a valid X509 distinguished Name.
   *
   * @param {array} [options.certificatePolicy.x509CertificateProperties.ekus]
   * The enhanced key usage.
   *
   * @param {object}
   * [options.certificatePolicy.x509CertificateProperties.subjectAlternativeNames]
   * The subject alternative names.
   *
   * @param {array}
   * [options.certificatePolicy.x509CertificateProperties.subjectAlternativeNames.emails]
   * Email addresses.
   *
   * @param {array}
   * [options.certificatePolicy.x509CertificateProperties.subjectAlternativeNames.dnsNames]
   * Domain names.
   *
   * @param {array}
   * [options.certificatePolicy.x509CertificateProperties.subjectAlternativeNames.upns]
   * User principal names.
   *
   * @param {array}
   * [options.certificatePolicy.x509CertificateProperties.keyUsage] List of key
   * usages.
   *
   * @param {number}
   * [options.certificatePolicy.x509CertificateProperties.validityInMonths] The
   * duration that the ceritifcate is valid in months.
   *
   * @param {array} [options.certificatePolicy.lifetimeActions] Actions that will
   * be performed by Key Vault over the lifetime of a certificate.
   *
   * @param {object} [options.certificatePolicy.issuerParameters] Parameters for
   * the issuer of the X509 component of a certificate.
   *
   * @param {string} [options.certificatePolicy.issuerParameters.name] Name of
   * the referenced issuer object or reserved names; for example, 'Self' or
   * 'Unknown'.
   *
   * @param {string} [options.certificatePolicy.issuerParameters.certificateType]
   * Type of certificate to be requested from the issuer provider.
   *
   * @param {object} [options.certificatePolicy.attributes] The certificate
   * attributes.
   *
   * @param {object} [options.certificateAttributes] The attributes of the
   * certificate (optional).
   *
   * @param {boolean} [options.certificateAttributes.enabled] Determines whether
   * the object is enabled.
   *
   * @param {date} [options.certificateAttributes.notBefore] Not before date in
   * UTC.
   *
   * @param {date} [options.certificateAttributes.expires] Expiry date in UTC.
   *
   * @param {object} [options.tags] Application specific metadata in the form of
   * key-value pairs.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {CertificateBundle} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {CertificateBundle} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link CertificateBundle} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  updateCertificate(certificateIdentifier: string, options?: { certificatePolicy? : Models.CertificatePolicy, certificateAttributes? : Models.CertificateAttributes, tags? : { [propertyName: string]: string }, customHeaders? : { [headerName: string]: string; } }): Promise<Models.CertificateBundle>;
  updateCertificate(certificateIdentifier: string, callback: msRest.ServiceCallback<Models.CertificateBundle>): void;
  updateCertificate(certificateIdentifier: string, options: { certificatePolicy? : Models.CertificatePolicy, certificateAttributes? : Models.CertificateAttributes, tags? : { [propertyName: string]: string }, customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.CertificateBundle>): void;


  /**
   * Gets information about a specified certificate.
   *
   * @param {string} certificateIdentifier The certificate identifier. It may or may not contain a version path. If a version is not provided, the latest certificate version is used.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<CertificateBundle>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  getCertificateWithHttpOperationResponse(certificateIdentifier: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.CertificateBundle>>;

  /**
   * Gets information about a specified certificate.
   *
   * @param {string} certificateIdentifier The certificate identifier. It may or may not contain a version path. If a version is not provided, the latest certificate version is used.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {CertificateBundle} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {CertificateBundle} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link CertificateBundle} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  getCertificate(certificateIdentifier: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<Models.CertificateBundle>;
  getCertificate(certificateIdentifier: string, callback: msRest.ServiceCallback<Models.CertificateBundle>): void;
  getCertificate(certificateIdentifier: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.CertificateBundle>): void;


  /**
   * Updates a certificate operation.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} certificateName The name of the certificate.
   *
   * @param {boolean} cancellationRequested Indicates if cancellation was
   * requested on the certificate operation.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<CertificateOperation>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  updateCertificateOperationWithHttpOperationResponse(vaultBaseUrl: string, certificateName: string, cancellationRequested: boolean, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.CertificateOperation>>;

  /**
   * Updates a certificate operation.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} certificateName The name of the certificate.
   *
   * @param {boolean} cancellationRequested Indicates if cancellation was
   * requested on the certificate operation.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {CertificateOperation} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {CertificateOperation} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link CertificateOperation} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  updateCertificateOperation(vaultBaseUrl: string, certificateName: string, cancellationRequested: boolean, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<Models.CertificateOperation>;
  updateCertificateOperation(vaultBaseUrl: string, certificateName: string, cancellationRequested: boolean, callback: msRest.ServiceCallback<Models.CertificateOperation>): void;
  updateCertificateOperation(vaultBaseUrl: string, certificateName: string, cancellationRequested: boolean, options: { customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.CertificateOperation>): void;


  /**
   * Gets the operation associated with a specified certificate.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} certificateName The name of the certificate.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<CertificateOperation>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  getCertificateOperationWithHttpOperationResponse(vaultBaseUrl: string, certificateName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.CertificateOperation>>;

  /**
   * Gets the operation associated with a specified certificate.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} certificateName The name of the certificate.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {CertificateOperation} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {CertificateOperation} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link CertificateOperation} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  getCertificateOperation(vaultBaseUrl: string, certificateName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<Models.CertificateOperation>;
  getCertificateOperation(vaultBaseUrl: string, certificateName: string, callback: msRest.ServiceCallback<Models.CertificateOperation>): void;
  getCertificateOperation(vaultBaseUrl: string, certificateName: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.CertificateOperation>): void;


  /**
   * Deletes the operation for a specified certificate.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} certificateName The name of the certificate.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<CertificateOperation>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  deleteCertificateOperationWithHttpOperationResponse(vaultBaseUrl: string, certificateName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.CertificateOperation>>;

  /**
   * Deletes the operation for a specified certificate.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} certificateName The name of the certificate.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {CertificateOperation} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {CertificateOperation} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link CertificateOperation} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  deleteCertificateOperation(vaultBaseUrl: string, certificateName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<Models.CertificateOperation>;
  deleteCertificateOperation(vaultBaseUrl: string, certificateName: string, callback: msRest.ServiceCallback<Models.CertificateOperation>): void;
  deleteCertificateOperation(vaultBaseUrl: string, certificateName: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.CertificateOperation>): void;


  /**
   * Merges a certificate or a certificate chain with a key pair existing on the
   * server.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} certificateName The name of the certificate.
   *
   * @param {array} x509Certificates The certificate or the certificate chain to
   * merge.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.certificateAttributes] The attributes of the
   * certificate (optional).
   *
   * @param {boolean} [options.certificateAttributes.enabled] Determines whether
   * the object is enabled.
   *
   * @param {date} [options.certificateAttributes.notBefore] Not before date in
   * UTC.
   *
   * @param {date} [options.certificateAttributes.expires] Expiry date in UTC.
   *
   * @param {object} [options.tags] Application specific metadata in the form of
   * key-value pairs.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<CertificateBundle>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  mergeCertificateWithHttpOperationResponse(vaultBaseUrl: string, certificateName: string, x509Certificates: Buffer[], options?: { certificateAttributes? : Models.CertificateAttributes, tags? : { [propertyName: string]: string }, customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.CertificateBundle>>;

  /**
   * Merges a certificate or a certificate chain with a key pair existing on the
   * server.
   *
   * @param {string} vaultBaseUrl The vault name, for example
   * https://myvault.vault.azure.net.
   *
   * @param {string} certificateName The name of the certificate.
   *
   * @param {array} x509Certificates The certificate or the certificate chain to
   * merge.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.certificateAttributes] The attributes of the
   * certificate (optional).
   *
   * @param {boolean} [options.certificateAttributes.enabled] Determines whether
   * the object is enabled.
   *
   * @param {date} [options.certificateAttributes.notBefore] Not before date in
   * UTC.
   *
   * @param {date} [options.certificateAttributes.expires] Expiry date in UTC.
   *
   * @param {object} [options.tags] Application specific metadata in the form of
   * key-value pairs.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {CertificateBundle} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {CertificateBundle} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link CertificateBundle} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  mergeCertificate(vaultBaseUrl: string, certificateName: string, x509Certificates: Buffer[], options?: { certificateAttributes? : Models.CertificateAttributes, tags? : { [propertyName: string]: string }, customHeaders? : { [headerName: string]: string; } }): Promise<Models.CertificateBundle>;
  mergeCertificate(vaultBaseUrl: string, certificateName: string, x509Certificates: Buffer[], callback: msRest.ServiceCallback<Models.CertificateBundle>): void;
  mergeCertificate(vaultBaseUrl: string, certificateName: string, x509Certificates: Buffer[], options: { certificateAttributes? : Models.CertificateAttributes, tags? : { [propertyName: string]: string }, customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.CertificateBundle>): void;


  /**
   * Retrieves a list of individual key versions with the same key name. The full
   * key identifier, attributes, and tags are provided in the response.
   * Authorization: Requires the keys/list permission.
   *
   * @param {string} nextPageLink The NextLink from the previous successful call
   * to List operation.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<KeyListResult>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  getKeyVersionsNextWithHttpOperationResponse(nextPageLink: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.KeyListResult>>;

  /**
   * Retrieves a list of individual key versions with the same key name. The full
   * key identifier, attributes, and tags are provided in the response.
   * Authorization: Requires the keys/list permission.
   *
   * @param {string} nextPageLink The NextLink from the previous successful call
   * to List operation.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {KeyListResult} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {KeyListResult} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link KeyListResult} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  getKeyVersionsNext(nextPageLink: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<Models.KeyListResult>;
  getKeyVersionsNext(nextPageLink: string, callback: msRest.ServiceCallback<Models.KeyListResult>): void;
  getKeyVersionsNext(nextPageLink: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.KeyListResult>): void;


  /**
   * List keys in the specified vault.
   *
   * @param {string} nextPageLink The NextLink from the previous successful call
   * to List operation.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<KeyListResult>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  getKeysNextWithHttpOperationResponse(nextPageLink: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.KeyListResult>>;

  /**
   * List keys in the specified vault.
   *
   * @param {string} nextPageLink The NextLink from the previous successful call
   * to List operation.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {KeyListResult} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {KeyListResult} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link KeyListResult} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  getKeysNext(nextPageLink: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<Models.KeyListResult>;
  getKeysNext(nextPageLink: string, callback: msRest.ServiceCallback<Models.KeyListResult>): void;
  getKeysNext(nextPageLink: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.KeyListResult>): void;


  /**
   * List secrets in a specified key vault
   *
   * @param {string} nextPageLink The NextLink from the previous successful call
   * to List operation.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<SecretListResult>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  getSecretsNextWithHttpOperationResponse(nextPageLink: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.SecretListResult>>;

  /**
   * List secrets in a specified key vault
   *
   * @param {string} nextPageLink The NextLink from the previous successful call
   * to List operation.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {SecretListResult} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {SecretListResult} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link SecretListResult} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  getSecretsNext(nextPageLink: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<Models.SecretListResult>;
  getSecretsNext(nextPageLink: string, callback: msRest.ServiceCallback<Models.SecretListResult>): void;
  getSecretsNext(nextPageLink: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.SecretListResult>): void;


  /**
   * List the versions of the specified secret.
   *
   * @param {string} nextPageLink The NextLink from the previous successful call
   * to List operation.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<SecretListResult>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  getSecretVersionsNextWithHttpOperationResponse(nextPageLink: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.SecretListResult>>;

  /**
   * List the versions of the specified secret.
   *
   * @param {string} nextPageLink The NextLink from the previous successful call
   * to List operation.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {SecretListResult} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {SecretListResult} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link SecretListResult} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  getSecretVersionsNext(nextPageLink: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<Models.SecretListResult>;
  getSecretVersionsNext(nextPageLink: string, callback: msRest.ServiceCallback<Models.SecretListResult>): void;
  getSecretVersionsNext(nextPageLink: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.SecretListResult>): void;


  /**
   * List certificates in a specified key vault
   *
   * @param {string} nextPageLink The NextLink from the previous successful call
   * to List operation.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<CertificateListResult>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  getCertificatesNextWithHttpOperationResponse(nextPageLink: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.CertificateListResult>>;

  /**
   * List certificates in a specified key vault
   *
   * @param {string} nextPageLink The NextLink from the previous successful call
   * to List operation.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {CertificateListResult} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {CertificateListResult} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link CertificateListResult} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  getCertificatesNext(nextPageLink: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<Models.CertificateListResult>;
  getCertificatesNext(nextPageLink: string, callback: msRest.ServiceCallback<Models.CertificateListResult>): void;
  getCertificatesNext(nextPageLink: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.CertificateListResult>): void;


  /**
   * List certificate issuers for a specified key vault.
   *
   * @param {string} nextPageLink The NextLink from the previous successful call
   * to List operation.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<CertificateIssuerListResult>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  getCertificateIssuersNextWithHttpOperationResponse(nextPageLink: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.CertificateIssuerListResult>>;

  /**
   * List certificate issuers for a specified key vault.
   *
   * @param {string} nextPageLink The NextLink from the previous successful call
   * to List operation.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {CertificateIssuerListResult} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {CertificateIssuerListResult} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link CertificateIssuerListResult} for more
   *                      information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  getCertificateIssuersNext(nextPageLink: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<Models.CertificateIssuerListResult>;
  getCertificateIssuersNext(nextPageLink: string, callback: msRest.ServiceCallback<Models.CertificateIssuerListResult>): void;
  getCertificateIssuersNext(nextPageLink: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.CertificateIssuerListResult>): void;


  /**
   * List the versions of a certificate.
   *
   * @param {string} nextPageLink The NextLink from the previous successful call
   * to List operation.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<CertificateListResult>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  getCertificateVersionsNextWithHttpOperationResponse(nextPageLink: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.CertificateListResult>>;

  /**
   * List the versions of a certificate.
   *
   * @param {string} nextPageLink The NextLink from the previous successful call
   * to List operation.
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {CertificateListResult} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {CertificateListResult} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link CertificateListResult} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  getCertificateVersionsNext(nextPageLink: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<Models.CertificateListResult>;
  getCertificateVersionsNext(nextPageLink: string, callback: msRest.ServiceCallback<Models.CertificateListResult>): void;
  getCertificateVersionsNext(nextPageLink: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.CertificateListResult>): void;

  /**
   * Gets the certificate operation response.
   *
   * @param {string} vaultBaseUrl The vault name, e.g.
   * https://myvault.vault.azure.net
   * 
   * @param {string} certificateName The name of the certificate
   *
   * @param {object} [options] Optional Parameters.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse<CertificateOperation>} - The deserialized result object.
   *
   * @reject {Error|ServiceError} - The error object.
   */
  getPendingCertificateSigningRequestWithHttpOperationResponse(vaultBaseUrl: string, certificateName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<msRest.HttpOperationResponse<Models.CertificateOperation>>;

  /**
   * Gets the certificate operation response.
   *
   * @param {string} vaultBaseUrl The vault name, e.g.
   * https://myvault.vault.azure.net
   * 
   * @param {string} certificateName The name of the certificate
   * 
   * @param {object} [options] Optional Parameters.
   * 
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   * 
   * @param {ServiceCallback} [optionalCallback] - The optional callback.
   *
   * @returns {ServiceCallback|Promise} If a callback was passed as the last
   * parameter then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned.
   *
   *                      @resolve {CertificateOperation} - The deserialized result object.
   *
   *                      @reject {Error|ServiceError} - The error object.
   *
   * {ServiceCallback} optionalCallback(err, result, request, response)
   *
   *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {CertificateOperation} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link CertificateOperation} for more information.
   *
   *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
   */
  getPendingCertificateSigningRequest(vaultBaseUrl: string, certificateName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<Models.CertificateOperation>;
  getPendingCertificateSigningRequest(vaultBaseUrl: string, certificateName: string, callback: msRest.ServiceCallback<Models.CertificateOperation>): void;
  getPendingCertificateSigningRequest(vaultBaseUrl: string, certificateName: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: msRest.ServiceCallback<Models.CertificateOperation>): void;
}

export function createKeyVaultClient(credentials: KeyVaultCredentials, options: msRestAzure.AzureServiceClientOptions): KeyVaultClient;

export namespace JsonWebKeyEncryptionAlgorithms {
  const RSAOAEP = 'RSA-OAEP';
  const RSA15 = 'RSA1_5';
}

export namespace JsonWebKeySignatureAlgorithms {
  const RS256 = 'RS256';
  const RS384 = 'RS384';
  const RS512 = 'RS512';
  const RSNULL = 'RSNULL';
}

export namespace JsonWebKeyType {
  const EC = 'EC';
  const RSA = 'RSA';
  const RSAHSM = 'RSAHSM';
  const OCT = 'OCT';
}

/** 
 * @typedef An identifier for an Azure Key Vault resource.
 */
export interface ObjectIdentifier {
  /**
   * The collection.
   */
  collection: string;
  /** The vault URI.
   * @member {string}
   */
  vault: string;
  /** The key name.
   * @member {string}
   */
  name: string;
  /** The key version. May be null.
   * @member {string}
   */
  version: string;
   /** The base identifier (i.e. without the version).
    * @member {string}
    */
  baseIdentifier: string;
  /** The full identifier if a version was informed; otherwise is the same value of baseIdentifier.
   * @member {string}
   */
  indentifier: string;
}

/** Creates an ObjectIdentifier object for a key.
 * @param {string} vault The vault URI.
 * @param {string} name The key name.
 * @param {string} [version=null] The object version.
 * @return {ObjectIdentifier} An object that represents the key identifier.
 */
export function createKeyIdentifier(vault:string, name: string, version: string): ObjectIdentifier;

/** Parses a string containing a key identifier and returns the ObjectIdentifier object.
 * @param {string} identifier The key identifier (an URI).
 * @return {ObjectIdentifier} An object that represents the key identifier.
 */
export function parseKeyIdentifier(identifier: string): ObjectIdentifier;

/** Creates an ObjectIdentifier object for a secret.
 * @param {string} vault The vault URI.
 * @param {string} name The secret name.
 * @param {string} [version=null] The object version.
 * @return {ObjectIdentifier} An object that represents the secret identifier.
 */
export function createSecretIdentifier(vault:string, name: string, version: string): ObjectIdentifier;

/** Parses a string containing a secret identifier and returns the ObjectIdentifier object.
 * @param {string} identifier The secret identifier (an URI).
 * @return {ObjectIdentifier} An object that represents the secret identifier.
 */
export function parseSecretIdentifier(identifier: string): ObjectIdentifier;

/** Creates an ObjectIdentifier object for a certificate.
 * @param {string} vault The vault URI.
 * @param {string} name The certificate name.
 * @param {string} [version=null] The object version.
 * @return {ObjectIdentifier} An object that represents the certificate identifier.
 */
export function createCertificateIdentifier(vault: string, name: string, version: string): ObjectIdentifier;

/** Parses a string containing a certificate identifier and returns the ObjectIdentifier object.
 * @param {string} identifier The certificate identifier (an URI).
 * @return {ObjectIdentifier} An object that represents the certificate identifier.
 */
export function parseCertificateIdentifier(identifier: string): ObjectIdentifier;

/** Creates an ObjectIdentifier object for a certificate operation.
 * @param {string} vault The vault URI.
 * @param {string} name The certificate name.
 * @return {ObjectIdentifier} An object that represents the certificate identifier.
 */
export function createCertificateOperationIdentifier(vault: string, name: string) : ObjectIdentifier;

/** Parses a string containing a certificate identifier and returns the ObjectIdentifier object.
 * @param {string} identifier The certificate identifier (an URI).
 * @return {ObjectIdentifier} An object that represents the certificate identifier.
 */
export function parseCertificateOperationIdentifier(identifier: string) : ObjectIdentifier;

/** Creates an ObjectIdentifier object for a certificate issuer.
 * @param {string} vault The vault URI.
 * @param {string} name The certificate issuer name.
 * @return {ObjectIdentifier} An object that represents the certificate issuer identifier.
 */
export function createIssuerIdentifier(vault: string, name: string): ObjectIdentifier;

/** Parses a string containing a certificate issuer identifier and returns the ObjectIdentifier object.
 * @param {string} identifier The certificate issuer identifier (an URI).
 * @return {ObjectIdentifier} An object that represents the certificate issuer identifier.
 */
export function parseIssuerIdentifier(identifier: string): ObjectIdentifier;
