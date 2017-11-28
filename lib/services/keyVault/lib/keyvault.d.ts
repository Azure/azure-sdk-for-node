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
