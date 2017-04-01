/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 */

/* jshint latedef:false */
/* jshint forin:false */
/* jshint noempty:false */

'use strict';
const msRest = require('ms-rest');
const msRestAzure = require('ms-rest-azure');

const ServiceClient = msRestAzure.AzureServiceClient;
const WebResource = msRest.WebResource;

const models = require('./models');
const jwk = require('./jwk');
const kvcreds = require('./keyVaultCredentials');
const objId = require('./objectIdentifier');

/** Identifier of the resource on which Key Vault users and service principals must authenticate.
 */
exports.RESOURCE_ID = 'https://vault.azure.net';

// The internal client is too low level, so we wrap it instead of exposing it directly.
const InternalClient = require('./keyVaultClient');


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
 * @param {function} callback
 *
 * @returns {function} callback(err, result, request, response)
 *
 *                      {Error}  err        - The Error object if an error occurred, null otherwise.
 *
 *                      {object} [result]   - The deserialized result object.
 *                      See {@link CertificateOperation} for more information.
 *
 *                      {object} [request]  - The HTTP Request object if an error did not occur.
 *
 *                      {stream} [response] - The HTTP Response stream if an error did not occur.
 */
function _getPendingCertificateSigningRequest(vaultBaseUrl, certificateName, options, callback) {
  /* jshint validthis: true */
  let client = this._internalClient;
  if (!callback && typeof options === 'function') {
    callback = options;
    options = null;
  }
  if (!callback) {
    throw new Error('callback cannot be null.');
  }
  // Validate
  try {
    if (vaultBaseUrl === null || vaultBaseUrl === undefined || typeof vaultBaseUrl.valueOf() !== 'string') {
      throw new Error('vaultBaseUrl cannot be null or undefined and it must be of type string.');
    }
    if (certificateName === null || certificateName === undefined || typeof certificateName.valueOf() !== 'string') {
      throw new Error('certificateName cannot be null or undefined and it must be of type string.');
    }
    if (this._internalClient.apiVersion === null || this._internalClient.apiVersion === undefined || typeof this._internalClient.apiVersion.valueOf() !== 'string') {
      throw new Error('this.apiVersion cannot be null or undefined and it must be of type string.');
    }
    if (this._internalClient.acceptLanguage !== null && this._internalClient.acceptLanguage !== undefined && typeof this._internalClient.acceptLanguage.valueOf() !== 'string') {
      throw new Error('this.acceptLanguage must be of type string.');
    }
  } catch (error) {
    return callback(error);
  }

  // Construct URL
  let requestUrl = this._internalClient.baseUri +
    '//certificates/{certificate-name}/pending';
  requestUrl = requestUrl.replace('{vaultBaseUrl}', vaultBaseUrl);
  requestUrl = requestUrl.replace('{certificate-name}', encodeURIComponent(certificateName));
  let queryParameters = [];
  queryParameters.push('api-version=' + encodeURIComponent(this._internalClient.apiVersion));
  if (queryParameters.length > 0) {
    requestUrl += '?' + queryParameters.join('&');
  }
  // trim all duplicate forward slashes in the url
  let regex = /([^:]\/)\/+/gi;
  requestUrl = requestUrl.replace(regex, '$1');

  // Create HTTP transport objects
  let httpRequest = new WebResource();
  httpRequest.method = 'GET';
  httpRequest.headers = {};
  httpRequest.url = requestUrl;
  // Set Headers
  if (this._internalClient.generateClientRequestId) {
    httpRequest.headers['x-ms-client-request-id'] = msRestAzure.generateUuid();
  }
  if (this._internalClient.acceptLanguage !== undefined && this._internalClient.acceptLanguage !== null) {
    httpRequest.headers['accept-language'] = this._internalClient.acceptLanguage;
  }
  if (options) {
    for (let headerName in options['customHeaders']) {
      if (options['customHeaders'].hasOwnProperty(headerName)) {
        httpRequest.headers[headerName] = options['customHeaders'][headerName];
      }
    }
  }
  httpRequest.headers['Content-Type'] = 'application/json; charset=utf-8';
  httpRequest.headers['Accept'] = 'application/pkcs10';
  httpRequest.body = null;
  // Send Request
  return client.pipeline(httpRequest, function (err, response, responseBody) {
    if (err) {
      return callback(err);
    }
    let statusCode = response.statusCode;
    if (statusCode !== 200) {
      let error = new Error(responseBody);
      error.statusCode = response.statusCode;
      error.request = msRest.stripRequest(httpRequest);
      error.response = msRest.stripResponse(response);
      if (responseBody === '') responseBody = null;
      let parsedErrorResponse;
      try {
        parsedErrorResponse = JSON.parse(responseBody);
        if (parsedErrorResponse) {
          let internalError = null;
          if (parsedErrorResponse.error) internalError = parsedErrorResponse.error;
          error.code = internalError ? internalError.code : parsedErrorResponse.code;
          error.message = internalError ? internalError.message : parsedErrorResponse.message;
        }
        if (parsedErrorResponse !== null && parsedErrorResponse !== undefined) {
          let resultMapper = new client.models['KeyVaultError']().mapper();
          error.body = client.deserialize(resultMapper, parsedErrorResponse, 'error.body');
        }
      } catch (defaultError) {
        error.message = `Error "${defaultError.message}" occurred in deserializing the responseBody ` +
          `- "${responseBody}" for the default response.`;
        return callback(error);
      }
      return callback(error);
    }
    // Create Result
    let result = null;
    if (responseBody === '') responseBody = null;
    // Deserialize Response
    if (statusCode === 200) {
      result = responseBody;
    }

    return callback(null, result, httpRequest, response);
  });
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
class KeyVaultClient {

  constructor(credentials, options) {
    if (credentials.createSigningFilter) {
      if (!options) options = [];
      if (!options.filters) options.filters = [];
      options.filters.push(credentials.createSigningFilter());
    }
    this._internalClient = new InternalClient(credentials, options);
    this._getPendingCertificateSigningRequest = _getPendingCertificateSigningRequest;
  }

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
   * @reject {Error} - The error object.
   */
  createKeyWithHttpOperationResponse(vaultBaseUrl, keyName, keyType, options) {
    return this._internalClient.createKeyWithHttpOperationResponse(vaultBaseUrl, keyName, keyType, options);
  }

  /**
   * Creates a new, named, key in the specified vault.
   *
   * @param {string} vaultBaseUrl The vault name, e.g.
   * https://myvault.vault.azure.net
   * 
   * @param {string} keyName The name of the key
   * 
   * @param {string} keyType The type of key to create. Valid key types, see
   * JsonWebKeyType. Possible values include: 'EC', 'RSA', 'RSA-HSM', 'oct'
   * 
   * @param {object} [options] Optional Parameters.
   * 
   * @param {number} [options.keySize] The key size in bytes. e.g. 1024 or 2048.
   * 
   * @param {array} [options.keyOps]
   * 
   * @param {object} [options.keyAttributes]
   * 
   * @param {boolean} [options.keyAttributes.enabled] Determines whether the
   * object is enabled
   * 
   * @param {date} [options.keyAttributes.notBefore] Not before date in UTC
   * 
   * @param {date} [options.keyAttributes.expires] Expiry date in UTC
   * 
   * @param {object} [options.tags] Application-specific metadata in the form of
   * key-value pairs
   * 
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   * 
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {KeyBundle} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link KeyBundle} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  createKey(vaultBaseUrl, keyName, keyType, options, optionalCallback) {
    return this._internalClient.createKey(vaultBaseUrl, keyName, keyType, options, optionalCallback);
  }

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
   * @reject {Error} - The error object.
   */
  importKeyWithHttpOperationResponse(vaultBaseUrl, keyName, key, options) {
    return this._internalClient.importKeyWithHttpOperationResponse(vaultBaseUrl, keyName, key, options);
  }

  /**
   * Imports a key into the specified vault
   *
   * @param {string} vaultBaseUrl The vault name, e.g.
   * https://myvault.vault.azure.net
   * 
   * @param {string} keyName The name of the key
   * 
   * @param {object} key The Json web key
   * 
   * @param {string} [key.kid] Key Identifier
   * 
   * @param {string} [key.kty] Key type, usually RSA. Possible values include:
   * 'EC', 'RSA', 'RSA-HSM', 'oct'
   * 
   * @param {array} [key.keyOps]
   * 
   * @param {buffer} [key.n] RSA modulus
   * 
   * @param {buffer} [key.e] RSA public exponent
   * 
   * @param {buffer} [key.d] RSA private exponent
   * 
   * @param {buffer} [key.dp] RSA Private Key Parameter
   * 
   * @param {buffer} [key.dq] RSA Private Key Parameter
   * 
   * @param {buffer} [key.qi] RSA Private Key Parameter
   * 
   * @param {buffer} [key.p] RSA secret prime
   * 
   * @param {buffer} [key.q] RSA secret prime, with p < q
   * 
   * @param {buffer} [key.k] Symmetric key
   * 
   * @param {buffer} [key.t] HSM Token, used with Bring Your Own Key
   * 
   * @param {object} [options] Optional Parameters.
   * 
   * @param {boolean} [options.hsm] Whether to import as a hardware key (HSM) or
   * software key
   * 
   * @param {object} [options.keyAttributes] The key management attributes
   * 
   * @param {boolean} [options.keyAttributes.enabled] Determines whether the
   * object is enabled
   * 
   * @param {date} [options.keyAttributes.notBefore] Not before date in UTC
   * 
   * @param {date} [options.keyAttributes.expires] Expiry date in UTC
   * 
   * @param {object} [options.tags] Application-specific metadata in the form of
   * key-value pairs
   * 
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   * 
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {KeyBundle} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link KeyBundle} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  importKey(vaultBaseUrl, keyName, key, options, optionalCallback) {
    return this._internalClient.importKey(vaultBaseUrl, keyName, key, options, optionalCallback);
  }

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
   * @reject {Error} - The error object.
   */
  deleteKeyWithHttpOperationResponse(vaultBaseUrl, keyName, options) {
    return this._internalClient.deleteKeyWithHttpOperationResponse(vaultBaseUrl, keyName, options);
  }

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
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {KeyBundle} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link KeyBundle} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  deleteKey(vaultBaseUrl, keyName, options, optionalCallback) {
    return this._internalClient.deleteKey(vaultBaseUrl, keyName, options, optionalCallback);
  }

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
   * @reject {Error} - The error object.
   */
  updateKeyWithHttpOperationResponse(keyIdentifier, options) {
    let parsedId = objId.parseKeyIdentifier(keyIdentifier);
    let version = (parsedId.version === null) ? '' : parsedId.version;
    return this._internalClient.updateKeyWithHttpOperationResponse(parsedId.vault, parsedId.name, version, options);
  }

  /**
   * The update key operation changes specified attributes of a stored key and
   * can be applied to any key type and key version stored in Azure Key Vault.
   * The cryptographic material of a key itself cannot be changed. In order to
   * perform this operation, the key must already exist in the Key Vault.
   * Authorization: requires the keys/update permission.
   * 
   * @param {string} keyIdentifier The key identifier. It may or may not contain a version path. 
   * If a version is not provided, the latest key version is used.
   * 
   * @param {object} [options] Optional Parameters.
   * 
   * @param {array} [options.keyOps] Json web key operations. For more
   * information on possible key operations, see JsonWebKeyOperation.
   * 
   * @param {object} [options.keyAttributes]
   * 
   * @param {boolean} [options.keyAttributes.enabled] Determines whether the
   * object is enabled
   * 
   * @param {date} [options.keyAttributes.notBefore] Not before date in UTC
   * 
   * @param {date} [options.keyAttributes.expires] Expiry date in UTC
   * 
   * @param {object} [options.tags] Application-specific metadata in the form of
   * key-value pairs
   * 
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   * 
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {KeyBundle} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link KeyBundle} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  updateKey(keyIdentifier, options, optionalCallback) {
    let parsedId = objId.parseKeyIdentifier(keyIdentifier);
    let version = (parsedId.version === null) ? '' : parsedId.version;
    return this._internalClient.updateKey(parsedId.vault, parsedId.name, version, options, optionalCallback);
  }

  /**
   * Gets the public part of a stored key. The get key operation is applicable to
   * all key types. If the requested key is symmetric, then no key material is
   * released in the response. Authorization: Requires the keys/get permission.
   *
   * @param {string} keyIdentifier The key identifier. It may or may not contain a version path. 
   * If a version is not provided, the latest key version is used.
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
   * @reject {Error} - The error object.
   */
  getKeyWithHttpOperationResponse(keyIdentifier, options) {
    let parsedId = objId.parseKeyIdentifier(keyIdentifier);
    let version = (parsedId.version === null) ? '' : parsedId.version;
    return this._internalClient.getKeyWithHttpOperationResponse(parsedId.vault, parsedId.name, version, options);
  }

  /**
   * Gets the public part of a stored key. The get key operation is applicable to
   * all key types. If the requested key is symmetric, then no key material is
   * released in the response. Authorization: Requires the keys/get permission.
   *
   * @param {string} keyIdentifier The key identifier. It may or may not contain a version path. 
   * If a version is not provided, the latest key version is used.
   * 
   * @param {object} [options] Optional Parameters.
   * 
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   * 
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {KeyBundle} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link KeyBundle} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  getKey(keyIdentifier, options, optionalCallback) {
    let parsedId = objId.parseKeyIdentifier(keyIdentifier);
    let version = (parsedId.version === null) ? '' : parsedId.version;
    return this._internalClient.getKey(parsedId.vault, parsedId.name, version, options, optionalCallback);
  }

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
   * @reject {Error} - The error object.
   */
  getKeyVersionsWithHttpOperationResponse(vaultBaseUrl, keyName, options) {
    return this._internalClient.getKeyVersionsWithHttpOperationResponse(vaultBaseUrl, keyName, options);
  }

  /**
   * List the versions of the specified key
   *
   * @param {string} vaultBaseUrl The vault name, e.g.
   * https://myvault.vault.azure.net
   * 
   * @param {string} keyName The name of the key
   * 
   * @param {object} [options] Optional Parameters.
   *
   * @param {number} [options.maxresults] Maximum number of results to return in
   * a page. If not specified the service will return up to 25 results.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   * 
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {KeyListResult} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link KeyListResult} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  getKeyVersions(vaultBaseUrl, keyName, options, optionalCallback) {
    return this._internalClient.getKeyVersions(vaultBaseUrl, keyName, options, optionalCallback);
  }

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
   * @reject {Error} - The error object.
   */
  getKeysWithHttpOperationResponse(vaultBaseUrl, options) {
    return this._internalClient.getKeysWithHttpOperationResponse(vaultBaseUrl, options);
  }

  /**
   * List keys in the specified vault
   *
   * @param {string} vaultBaseUrl The vault name, e.g.
   * https://myvault.vault.azure.net
   * 
   * @param {object} [options] Optional Parameters.
   *
   * @param {number} [options.maxresults] Maximum number of results to return in
   * a page. If not specified the service will return up to 25 results.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   * 
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {KeyListResult} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link KeyListResult} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  getKeys(vaultBaseUrl, options, optionalCallback) {
    return this._internalClient.getKeys(vaultBaseUrl, options, optionalCallback);
  }

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
   * @reject {Error} - The error object.
   */
  backupKeyWithHttpOperationResponse(vaultBaseUrl, keyName, options) {
    return this._internalClient.backupKeyWithHttpOperationResponse(vaultBaseUrl, keyName, options);
  }

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
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {BackupKeyResult} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link BackupKeyResult} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  backupKey(vaultBaseUrl, keyName, options, optionalCallback) {
    return this._internalClient.backupKey(vaultBaseUrl, keyName, options, optionalCallback);
  }

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
   * @reject {Error} - The error object.
   */
  restoreKeyWithHttpOperationResponse(vaultBaseUrl, keyBundleBackup, options) {
    return this._internalClient.restoreKeyWithHttpOperationResponse(vaultBaseUrl, keyBundleBackup, options);
  }

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
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {KeyBundle} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link KeyBundle} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  restoreKey(vaultBaseUrl, keyBundleBackup, options, optionalCallback) {
    return this._internalClient.restoreKey(vaultBaseUrl, keyBundleBackup, options, optionalCallback);
  }

  /**
   * Encrypts an arbitrary sequence of bytes using an encryption key that is
   * stored in a key vault.
   *
   * @param {string} keyIdentifier The key identifier. It may or may not contain a version path. 
   * If a version is not provided, the latest key version is used.
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
   * @reject {Error} - The error object.
   */
  encryptWithHttpOperationResponse(keyIdentifier, algorithm, value, options) {
    let parsedId = objId.parseKeyIdentifier(keyIdentifier);
    let version = (parsedId.version === null) ? '' : parsedId.version;
    return this._internalClient.encryptWithHttpOperationResponse(parsedId.vault, parsedId.name, version, algorithm, value, options);
  }

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
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {KeyOperationResult} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link KeyOperationResult} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  encrypt(keyIdentifier, algorithm, value, options, optionalCallback) {
    let parsedId = objId.parseKeyIdentifier(keyIdentifier);
    let version = (parsedId.version === null) ? '' : parsedId.version;
    return this._internalClient.encrypt(parsedId.vault, parsedId.name, version, algorithm, value, options, optionalCallback);
  }

  /**
   * Decrypts a single block of encrypted data.
   *
   * @param {string} keyIdentifier The key identifier. It may or may not contain a version path. 
   * If a version is not provided, the latest key version is used.
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
   * @reject {Error} - The error object.
   */
  decryptWithHttpOperationResponse(keyIdentifier, algorithm, value, options) {
    let parsedId = objId.parseKeyIdentifier(keyIdentifier);
    let version = (parsedId.version === null) ? '' : parsedId.version;
    return this._internalClient.decryptWithHttpOperationResponse(parsedId.vault, parsedId.name, version, algorithm, value, options);
  }

  /**
   * Decrypts a single block of encrypted data
   *
   * @param {string} keyIdentifier The key identifier. It may or may not contain a version path. 
   * If a version is not provided, the latest key version is used.
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
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {KeyOperationResult} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link KeyOperationResult} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  decrypt(keyIdentifier, algorithm, value, options, optionalCallback) {
    let parsedId = objId.parseKeyIdentifier(keyIdentifier);
    let version = (parsedId.version === null) ? '' : parsedId.version;
    return this._internalClient.decrypt(parsedId.vault, parsedId.name, version, algorithm, value, options, optionalCallback);
  }

  /**
   * Creates a signature from a digest using the specified key.
   *
   * @param {string} keyIdentifier The key identifier. It may or may not contain a version path. 
   * If a version is not provided, the latest key version is used.
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
   * @reject {Error} - The error object.
   */
  signWithHttpOperationResponse(keyIdentifier, algorithm, value, options) {
    let parsedId = objId.parseKeyIdentifier(keyIdentifier);
    let version = (parsedId.version === null) ? '' : parsedId.version;
    return this._internalClient.signWithHttpOperationResponse(parsedId.vault, parsedId.name, version, algorithm, value, options);
  }

  /**
   * Creates a signature from a digest using the specified key in the vault
   *
   * @param {string} keyIdentifier The key identifier. It may or may not contain a version path. 
   * If a version is not provided, the latest key version is used.
   *  
   * @param {string} algorithm The signing/verification algorithm identifier.
   * For more information on possible algorithm types, see
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
   * @param {function} callback
   *
   * @returns {function} callback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object.
   *                      See {@link KeyOperationResult} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  sign(keyIdentifier, algorithm, value, options, optionalCallback) {
    let parsedId = objId.parseKeyIdentifier(keyIdentifier);
    let version = (parsedId.version === null) ? '' : parsedId.version;
    return this._internalClient.sign(parsedId.vault, parsedId.name, version, algorithm, value, options, optionalCallback);
  }

  /**
   * Verifies a signature using a specified key.
   *
   * @param {string} keyIdentifier The key identifier. It may or may not contain a version path.
   * If a version is not provided, the latest key version is used.
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
   * @reject {Error} - The error object.
   */
  verifyWithHttpOperationResponse(keyIdentifier, algorithm, digest, signature, options) {
    let parsedId = objId.parseKeyIdentifier(keyIdentifier);
    let version = (parsedId.version === null) ? '' : parsedId.version;
    return this._internalClient.verifyWithHttpOperationResponse(parsedId.vault, parsedId.name, version, algorithm, digest, signature, options);
  }

  /**
   * Verifies a signature using the specified key
   *
   * @param {string} keyIdentifier The key identifier. It may or may not contain a version path.
   * If a version is not provided, the latest key version is used.
   * 
   * @param {string} algorithm The signing/verification algorithm. For more
   * information on possible algorithm types, see JsonWebKeySignatureAlgorithm.
   * Possible values include: 'RS256', 'RS384', 'RS512', 'RSNULL'
   * 
   * @param {buffer} digest The digest used for signing
   * 
   * @param {buffer} signature The signature to be verified
   * 
   * @param {object} [options] Optional Parameters.
   * 
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   * 
   * @param {function} callback
   *
   * @returns {function} callback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object.
   *                      See {@link KeyVerifyResult} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  verify(keyIdentifier, algorithm, digest, signature, options, optionalCallback) {
    let parsedId = objId.parseKeyIdentifier(keyIdentifier);
    let version = (parsedId.version === null) ? '' : parsedId.version;
    return this._internalClient.verify(parsedId.vault, parsedId.name, version, algorithm, digest, signature, options, optionalCallback);
  }

  /**
   * Wraps a symmetric key using a specified key.
   *
   * @param {string} keyIdentifier The key identifier. It may or may not contain a version path.
   * If a version is not provided, the latest key version is used.
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
   * @reject {Error} - The error object.
   */
  wrapKeyWithHttpOperationResponse(keyIdentifier, algorithm, value, options) {
    let parsedId = objId.parseKeyIdentifier(keyIdentifier);
    let version = (parsedId.version === null) ? '' : parsedId.version;
    return this._internalClient.wrapKeyWithHttpOperationResponse(parsedId.vault, parsedId.name, version, algorithm, value, options);
  }

  /**
   * Wraps a symmetric key using the specified key
   *
   * @param {string} keyIdentifier The key identifier. It may or may not contain a version path.
   * If a version is not provided, the latest key version is used.
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
   * @param {function} callback
   *
   * @returns {function} callback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object.
   *                      See {@link KeyOperationResult} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  wrapKey(keyIdentifier, algorithm, value, options, optionalCallback) {
    let parsedId = objId.parseKeyIdentifier(keyIdentifier);
    let version = (parsedId.version === null) ? '' : parsedId.version;
    return this._internalClient.wrapKey(parsedId.vault, parsedId.name, version, algorithm, value, options, optionalCallback);
  }

  /**
   * Unwraps a symmetric key using the specified key that was initially used for
   * wrapping that key.
   *
   * @param {string} keyIdentifier The key identifier. It may or may not contain a version path. 
   * If a version is not provided, the latest key version is used.
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
   * @reject {Error} - The error object.
   */
  unwrapKeyWithHttpOperationResponse(keyIdentifier, algorithm, value, options) {
    let parsedId = objId.parseKeyIdentifier(keyIdentifier);
    let version = (parsedId.version === null) ? '' : parsedId.version;
    return this._internalClient.unwrapKeyWithHttpOperationResponse(parsedId.vault, parsedId.name, version, algorithm, value, options);
  }

  /**
   * Unwraps a symmetric key using the specified key in the vault that has
   * initially been used for wrapping the key.
   *
   * @param {string} keyIdentifier The key identifier. It may or may not contain a version path. 
   * If a version is not provided, the latest key version is used.
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
   * @param {function} callback
   *
   * @returns {function} callback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object.
   *                      See {@link KeyOperationResult} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  unwrapKey(keyIdentifier, algorithm, value, options, optionalCallback) {
    let parsedId = objId.parseKeyIdentifier(keyIdentifier);
    let version = (parsedId.version === null) ? '' : parsedId.version;
    return this._internalClient.unwrapKey(parsedId.vault, parsedId.name, version, algorithm, value, options, optionalCallback);
  }

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
   * @reject {Error} - The error object.
   */
  setSecretWithHttpOperationResponse(vaultBaseUrl, secretName, value, options) {
    return this._internalClient.setSecretWithHttpOperationResponse(vaultBaseUrl, secretName, value, options);
  }

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
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {SecretBundle} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link SecretBundle} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  setSecret(vaultBaseUrl, secretName, value, options, optionalCallback) {
    return this._internalClient.setSecret(vaultBaseUrl, secretName, value, options, optionalCallback);
  }

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
   * @reject {Error} - The error object.
   */
  deleteSecretWithHttpOperationResponse(vaultBaseUrl, secretName, options) {
    return this._internalClient.deleteSecretWithHttpOperationResponse(vaultBaseUrl, secretName, options);
  }

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
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {SecretBundle} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link SecretBundle} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  deleteSecret(vaultBaseUrl, secretName, options, optionalCallback) {
    return this._internalClient.deleteSecret(vaultBaseUrl, secretName, options, optionalCallback);
  }

  /**
   * Updates the attributes associated with a specified secret in a given key
   * vault.
   *
   * @param {string} secretIdentifier The secret identifier. It may or may not contain a version path. 
   * If a version is not provided, the latest secret version is used.
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
   * @reject {Error} - The error object.
   */
  updateSecretWithHttpOperationResponse(secretIdentifier, options) {
    let parsedId = objId.parseSecretIdentifier(secretIdentifier);
    let version = (parsedId.version === null) ? '' : parsedId.version;
    return this._internalClient.updateSecretWithHttpOperationResponse(parsedId.vault, parsedId.name, version, options);
  }

  /**
   * Updates the attributes associated with a specified secret in a given key
   * vault.
   *
   * @param {string} secretIdentifier The secret identifier. It may or may not contain a version path. 
   * If a version is not provided, the latest secret version is used.
   * 
   * @param {object} [options] Optional Parameters.
   * 
   * @param {string} [options.contentType] Type of the secret value such as a
   * password
   * 
   * @param {object} [options.secretAttributes] The secret management attributes
   * 
   * @param {boolean} [options.secretAttributes.enabled] Determines whether the
   * object is enabled
   * 
   * @param {date} [options.secretAttributes.notBefore] Not before date in UTC
   * 
   * @param {date} [options.secretAttributes.expires] Expiry date in UTC
   * 
   * @param {object} [options.tags] Application-specific metadata in the form of
   * key-value pairs
   * 
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   * 
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {SecretBundle} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link SecretBundle} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  updateSecret(secretIdentifier, options, optionalCallback) {
    let parsedId = objId.parseSecretIdentifier(secretIdentifier);
    let version = (parsedId.version === null) ? '' : parsedId.version;
    return this._internalClient.updateSecret(parsedId.vault, parsedId.name, version, options, optionalCallback);
  }

  /**
   * Get a specified secret from a given key vault.
   *
   * @param {string} secretIdentifier The secret identifier. It may or may not contain a version path. 
   * If a version is not provided, the latest secret version is used.
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
   * @reject {Error} - The error object.
   */
  getSecretWithHttpOperationResponse(secretIdentifier, options) {
    let parsedId = objId.parseSecretIdentifier(secretIdentifier);
    let version = (parsedId.version === null) ? '' : parsedId.version;
    return this._internalClient.getSecretWithHttpOperationResponse(parsedId.vault, parsedId.name, version, options);
  }

  /**
   * Get a specified secret from a given key vault.
   *
   * @param {string} secretIdentifier The secret identifier. It may or may not contain a version path. 
   * If a version is not provided, the latest secret version is used.
   * 
   * @param {object} [options] Optional Parameters.
   * 
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   * 
   * @param {function} callback
   *
   * @returns {function} callback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object.
   *                      See {@link SecretBundle} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  getSecret(secretIdentifier, options, optionalCallback) {
    let parsedId = objId.parseSecretIdentifier(secretIdentifier);
    let version = (parsedId.version === null) ? '' : parsedId.version;
    return this._internalClient.getSecret(parsedId.vault, parsedId.name, version, options, optionalCallback);
  }

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
   * @reject {Error} - The error object.
   */
  getSecretsWithHttpOperationResponse(vaultBaseUrl, options) {
    return this._internalClient.getSecretsWithHttpOperationResponse(vaultBaseUrl, options);
  }

  /**
   * List secrets in the specified vault
   *
   * @param {string} vaultBaseUrl The vault name, e.g.
   * https://myvault.vault.azure.net
   * 
   * @param {object} [options] Optional Parameters.
   *
   * @param {number} [options.maxresults] Maximum number of results to return in
   * a page. If not specified the service will return up to 25 results.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   * 
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {SecretListResult} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link SecretListResult} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  getSecrets(vaultBaseUrl, options, optionalCallback) {
    return this._internalClient.getSecrets(vaultBaseUrl, options, optionalCallback);
  }

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
   * @reject {Error} - The error object.
   */
  getSecretVersionsWithHttpOperationResponse(vaultBaseUrl, secretName, options) {
    return this._internalClient.getSecretVersionsWithHttpOperationResponse(vaultBaseUrl, secretName, options);
  }

  /**
   * List the versions of the specified secret
   *
   * @param {string} vaultBaseUrl The vault name, e.g.
   * https://myvault.vault.azure.net
   * 
   * @param {string} secretName The name of the secret in the given vault
   * 
   * @param {object} [options] Optional Parameters.
   *
   * @param {number} [options.maxresults] Maximum number of results to return in
   * a page. If not specified the service will return up to 25 results.
   *
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   * 
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {SecretListResult} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link SecretListResult} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  getSecretVersions(vaultBaseUrl, secretName, options, optionalCallback) {
    return this._internalClient.getSecretVersions(vaultBaseUrl, secretName, options, optionalCallback);
  }

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
   * @reject {Error} - The error object.
   */
  getCertificatesWithHttpOperationResponse(vaultBaseUrl, options) {
    return this._internalClient.getCertificatesWithHttpOperationResponse(vaultBaseUrl, options);
  }

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
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {CertificateListResult} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link CertificateListResult} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  getCertificates(vaultBaseUrl, options, optionalCallback) {
    return this._internalClient.getCertificates(vaultBaseUrl, options, optionalCallback);
  }

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
   * @reject {Error} - The error object.
   */
  deleteCertificateWithHttpOperationResponse(vaultBaseUrl, certificateName, options) {
    return this._internalClient.deleteCertificateWithHttpOperationResponse(vaultBaseUrl, certificateName, options);
  }

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
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {CertificateBundle} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link CertificateBundle} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  deleteCertificate(vaultBaseUrl, certificateName, options, optionalCallback) {
    return this._internalClient.deleteCertificate(vaultBaseUrl, certificateName, options, optionalCallback);
  }

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
  setCertificateContactsWithHttpOperationResponse(vaultBaseUrl, contacts, options) {
    return this._internalClient.setCertificateContactsWithHttpOperationResponse(vaultBaseUrl, contacts, options);
  }

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
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {Contacts} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link Contacts} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  setCertificateContacts(vaultBaseUrl, contacts, options, optionalCallback) {
    return this._internalClient.setCertificateContacts(vaultBaseUrl, contacts, options, optionalCallback);
  }

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
   * @reject {Error} - The error object.
   */
  getCertificateContactsWithHttpOperationResponse(vaultBaseUrl, options) {
    return this._internalClient.getCertificateContactsWithHttpOperationResponse(vaultBaseUrl, options);
  }

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
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {Contacts} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link Contacts} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  getCertificateContacts(vaultBaseUrl, options, optionalCallback) {
    return this._internalClient.getCertificateContacts(vaultBaseUrl, options, optionalCallback);
  }

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
   * @reject {Error} - The error object.
   */
  deleteCertificateContactsWithHttpOperationResponse(vaultBaseUrl, options) {
    return this._internalClient.deleteCertificateContactsWithHttpOperationResponse(vaultBaseUrl, options);
  }

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
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {Contacts} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link Contacts} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  deleteCertificateContacts(vaultBaseUrl, options, optionalCallback) {
    return this._internalClient.deleteCertificateContacts(vaultBaseUrl, options, optionalCallback);
  }

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
   * @reject {Error} - The error object.
   */
  getCertificateIssuersWithHttpOperationResponse(vaultBaseUrl, options) {
    return this._internalClient.getCertificateIssuersWithHttpOperationResponse(vaultBaseUrl, options);
  }

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
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {CertificateIssuerListResult} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link CertificateIssuerListResult} for more
   *                      information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  getCertificateIssuers(vaultBaseUrl, options, optionalCallback) {
    return this._internalClient.getCertificateIssuers(vaultBaseUrl, options, optionalCallback);
  }

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
   * @reject {Error} - The error object.
   */
  setCertificateIssuerWithHttpOperationResponse(vaultBaseUrl, issuerName, provider, options) {
    return this._internalClient.setCertificateIssuerWithHttpOperationResponse(vaultBaseUrl, issuerName, provider, options);
  }

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
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {IssuerBundle} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link IssuerBundle} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  setCertificateIssuer(vaultBaseUrl, issuerName, provider, options, optionalCallback) {
    return this._internalClient.setCertificateIssuer(vaultBaseUrl, issuerName, provider, options, optionalCallback);
  }


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
   * @reject {Error} - The error object.
   */
  updateCertificateIssuerWithHttpOperationResponse(vaultBaseUrl, issuerName, options) {
    return this._internalClient.updateCertificateIssuerWithHttpOperationResponse(vaultBaseUrl, issuerName, options);
  }

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
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {IssuerBundle} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link IssuerBundle} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  updateCertificateIssuer(vaultBaseUrl, issuerName, options, optionalCallback) {
    return this._internalClient.updateCertificateIssuer(vaultBaseUrl, issuerName, options, optionalCallback);
  }

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
   * @reject {Error} - The error object.
   */
  getCertificateIssuerWithHttpOperationResponse(vaultBaseUrl, issuerName, options) {
    return this._internalClient.getCertificateIssuer(vaultBaseUrl, issuerName, options);
  }

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
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {IssuerBundle} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link IssuerBundle} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  getCertificateIssuer(vaultBaseUrl, issuerName, options, optionalCallback) {
    return this._internalClient.getCertificateIssuer(vaultBaseUrl, issuerName, options, optionalCallback);
  }

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
   * @reject {Error} - The error object.
   */
  deleteCertificateIssuerWithHttpOperationResponse(vaultBaseUrl, issuerName, options) {
    return this._internalClient.deleteCertificateIssuerWithHttpOperationResponse(vaultBaseUrl, issuerName, options);
  }

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
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {IssuerBundle} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link IssuerBundle} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  deleteCertificateIssuer(vaultBaseUrl, issuerName, options, optionalCallback) {
    return this._internalClient.deleteCertificateIssuer(vaultBaseUrl, issuerName, options, optionalCallback);
  }

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
   * @reject {Error} - The error object.
   */
  createCertificateWithHttpOperationResponse(vaultBaseUrl, certificateName, options) {
    return this._internalClient.createCertificateWithHttpOperationResponse(vaultBaseUrl, certificateName, options);
  }

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
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {CertificateOperation} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link CertificateOperation} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  createCertificate(vaultBaseUrl, certificateName, options, optionalCallback) {
    return this._internalClient.createCertificate(vaultBaseUrl, certificateName, options, optionalCallback);
  }

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
   * @reject {Error} - The error object.
   */
  importCertificateWithHttpOperationResponse(vaultBaseUrl, certificateName, base64EncodedCertificate, options) {
    return this._internalClient.importCertificateWithHttpOperationResponse(vaultBaseUrl, certificateName, base64EncodedCertificate, options);
  }

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
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {CertificateBundle} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link CertificateBundle} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  importCertificate(vaultBaseUrl, certificateName, base64EncodedCertificate, options, optionalCallback) {
    return this._internalClient.importCertificate(vaultBaseUrl, certificateName, base64EncodedCertificate, options, optionalCallback);
  }

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
   * @reject {Error} - The error object.
   */
  getCertificateVersionsWithHttpOperationResponse(vaultBaseUrl, certificateName, options) {
    return this._internalClient.getCertificateVersionsWithHttpOperationResponse(vaultBaseUrl, certificateName, options);
  }

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
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {CertificateListResult} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link CertificateListResult} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  getCertificateVersions(vaultBaseUrl, certificateName, options, optionalCallback) {
    return this._internalClient.getCertificateVersions(vaultBaseUrl, certificateName, options, optionalCallback);
  }

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
   * @reject {Error} - The error object.
   */
  getCertificatePolicyWithHttpOperationResponse(vaultBaseUrl, certificateName, options) {
    return this._internalClient.getCertificatePolicyWithHttpOperationResponse(vaultBaseUrl, certificateName, options);
  }

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
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {CertificatePolicy} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link CertificatePolicy} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  getCertificatePolicy(vaultBaseUrl, certificateName, options, optionalCallback) {
    return this._internalClient.getCertificatePolicy(vaultBaseUrl, certificateName, options, optionalCallback);
  }

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
   * @reject {Error} - The error object.
   */
  updateCertificatePolicyWithHttpOperationResponse(vaultBaseUrl, certificateName, certificatePolicy, options) {
    return this._internalClient.updateCertificatePolicyWithHttpOperationResponse(vaultBaseUrl, certificateName, certificatePolicy, options);
  }

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
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {CertificatePolicy} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link CertificatePolicy} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  updateCertificatePolicy(vaultBaseUrl, certificateName, certificatePolicy, options, optionalCallback) {
    return this._internalClient.updateCertificatePolicy(vaultBaseUrl, certificateName, certificatePolicy, options, optionalCallback);
  }

  /**
   * Updates the specified attributes associated with the given certificate.
   *
   * @param {string} certificateIdentifier The certificate identifier. It may or may not contain a version path. 
   * If a version is not provided, the latest certificate version is used.
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
   * @reject {Error} - The error object.
   */
  updateCertificateWithHttpOperationResponse(certificateIdentifier, options) {
    let parsedId = objId.parseCertificateIdentifier(certificateIdentifier);
    let version = (parsedId.version === null) ? '' : parsedId.version;
    return this._internalClient.updateCertificateWithHttpOperationResponse(parsedId.vault, parsedId.name, version, options);
  }

  /**
   * Updates the attributes associated with the specified certificate
   *
   * @param {string} certificateIdentifier The certificate identifier. It may or may not contain a version path. 
   * If a version is not provided, the latest certificate version is used.
   * 
   * @param {object} [options] Optional Parameters.
   * 
   * @param {object} [options.certificatePolicy] The management policy for the
   * certificate
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
   * size in bytes. e.g. 2048.
   * 
   * @param {boolean} [options.certificatePolicy.keyProperties.reuseKey]
   * Indicates if the same key pair will be used on certificate renewal.
   * 
   * @param {object} [options.certificatePolicy.secretProperties] Properties of
   * the secret backing a certificate.
   * 
   * @param {string} [options.certificatePolicy.secretProperties.contentType]
   * The media type (MIME type).
   * 
   * @param {object} [options.certificatePolicy.x509CertificateProperties]
   * Properties of the X509 component of a certificate.
   * 
   * @param {string}
   * [options.certificatePolicy.x509CertificateProperties.subject] The subject
   * name. Should be a valid X509 Distinguished Name.
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
   * @param {array} [options.certificatePolicy.lifetimeActions] Actions that
   * will be performed by Key Vault over the lifetime of a certificate.
   * 
   * @param {object} [options.certificatePolicy.issuerParameters] Parameters for
   * the issuer of the X509 component of a certificate.
   * 
   * @param {string} [options.certificatePolicy.issuerParameters.name] Name of
   * the referenced issuer object or reserved names e.g. 'Self', 'Unknown'.
   * 
   * @param {string}
   * [options.certificatePolicy.issuerParameters.certificateType] Type of
   * certificate to be requested from the issuer provider.
   * 
   * @param {object} [options.certificatePolicy.attributes] The certificate
   * attributes.
   * 
   * @param {object} [options.certificateAttributes] The attributes of the
   * certificate (optional)
   * 
   * @param {boolean} [options.certificateAttributes.enabled] Determines whether
   * the object is enabled
   * 
   * @param {date} [options.certificateAttributes.notBefore] Not before date in
   * UTC
   * 
   * @param {date} [options.certificateAttributes.expires] Expiry date in UTC
   * 
   * @param {object} [options.tags] Application-specific metadata in the form of
   * key-value pairs
   * 
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   * 
   * @param {function} callback
   *
   * @returns {function} callback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object.
   *                      See {@link CertificateBundle} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  updateCertificate(certificateIdentifier, options, optionalCallback) {
    let parsedId = objId.parseCertificateIdentifier(certificateIdentifier);
    let version = (parsedId.version === null) ? '' : parsedId.version;
    return this._internalClient.updateCertificate(parsedId.vault, parsedId.name, version, options, optionalCallback);
  }

  /**
   * Gets information about a specified certificate.
   *
   * @param {string} certificateIdentifier The certificate identifier. It may or may not contain a version path. 
   * If a version is not provided, the latest certificate version is used.
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
   * @reject {Error} - The error object.
   */
  getCertificateWithHttpOperationResponse(certificateIdentifier, options) {
    let parsedId = objId.parseCertificateIdentifier(certificateIdentifier);
    let version = (parsedId.version === null) ? '' : parsedId.version;
    return this._internalClient.getCertificateWithHttpOperationResponse(parsedId.vault, parsedId.name, version, options);
  }

  /**
   * Gets information about a specified certificate..
   *
   * @param {string} certificateIdentifier The certificate identifier. It may or may not contain a version path. 
   * If a version is not provided, the latest certificate version is used.
   * 
   * @param {object} [options] Optional Parameters.
   * 
   * @param {object} [options.customHeaders] Headers that will be added to the
   * request
   * 
   * @param {function} callback
   *
   * @returns {function} callback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object.
   *                      See {@link CertificateBundle} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  getCertificate(certificateIdentifier, options, optionalCallback) {
    let parsedId = objId.parseCertificateIdentifier(certificateIdentifier);
    let version = (parsedId.version === null) ? '' : parsedId.version;
    return this._internalClient.getCertificate(parsedId.vault, parsedId.name, version, options, optionalCallback);
  }

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
   * @reject {Error} - The error object.
   */
  updateCertificateOperationWithHttpOperationResponse(vaultBaseUrl, certificateName, cancellationRequested, options) {
    return this._internalClient.updateCertificateOperationWithHttpOperationResponse(vaultBaseUrl, certificateName, cancellationRequested, options);
  }

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
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {CertificateOperation} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link CertificateOperation} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  updateCertificateOperation(vaultBaseUrl, certificateName, cancellationRequested, options, optionalCallback) {
    return this._internalClient.updateCertificateOperation(vaultBaseUrl, certificateName, cancellationRequested, options, optionalCallback);
  }

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
   * @reject {Error} - The error object.
   */
  getCertificateOperationWithHttpOperationResponse(vaultBaseUrl, certificateName, options) {
    return this._internalClient.getCertificateOperationWithHttpOperationResponse(vaultBaseUrl, certificateName, options);
  }

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
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {CertificateOperation} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link CertificateOperation} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  getCertificateOperation(vaultBaseUrl, certificateName, options, optionalCallback) {
    return this._internalClient.getCertificateOperation(vaultBaseUrl, certificateName, options, optionalCallback);
  }

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
   * @reject {Error} - The error object.
   */
  deleteCertificateOperationWithHttpOperationResponse(vaultBaseUrl, certificateName, options) {
    return this._internalClient.deleteCertificateOperationWithHttpOperationResponse(vaultBaseUrl, certificateName, options);
  }

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
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {CertificateOperation} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link CertificateOperation} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  deleteCertificateOperation(vaultBaseUrl, certificateName, options, optionalCallback) {
    return this._internalClient.deleteCertificateOperation(vaultBaseUrl, certificateName, options, optionalCallback);
  }

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
   * @reject {Error} - The error object.
   */
  mergeCertificateWithHttpOperationResponse(vaultBaseUrl, certificateName, x509Certificates, options) {
    return this._internalClient.mergeCertificateWithHttpOperationResponse(vaultBaseUrl, certificateName, x509Certificates, options);
  }

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
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {CertificateBundle} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link CertificateBundle} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  mergeCertificate(vaultBaseUrl, certificateName, x509Certificates, options, optionalCallback) {
    return this._internalClient.mergeCertificate(vaultBaseUrl, certificateName, x509Certificates, options, optionalCallback);
  }

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
   * @reject {Error} - The error object.
   */
  getKeyVersionsNextWithHttpOperationResponse(nextPageLink, options) {
    return this._internalClient.getKeyVersionsNextWithHttpOperationResponse(nextPageLink, options);
  }

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
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {KeyListResult} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link KeyListResult} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  getKeyVersionsNext(nextPageLink, options, optionalCallback) {
    return this._internalClient.getKeyVersionsNext(nextPageLink, options, optionalCallback);
  }

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
   * @reject {Error} - The error object.
   */
  getKeysNextWithHttpOperationResponse(nextPageLink, options) {
    return this._internalClient.getKeysNextWithHttpOperationResponse(nextPageLink, options);
  }

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
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {KeyListResult} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link KeyListResult} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  getKeysNext(nextPageLink, options, optionalCallback) {
    return this._internalClient.getKeysNext(nextPageLink, options, optionalCallback);
  }

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
   * @reject {Error} - The error object.
   */
  getSecretsNextWithHttpOperationResponse(nextPageLink, options) {
    return this._internalClient.getSecretsNextWithHttpOperationResponse(nextPageLink, options);
  }

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
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {SecretListResult} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link SecretListResult} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  getSecretsNext(nextPageLink, options, optionalCallback) {
    return this._internalClient.getSecretsNext(nextPageLink, options, optionalCallback);
  }

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
   * @reject {Error} - The error object.
   */
  getSecretVersionsNextWithHttpOperationResponse(nextPageLink, options) {
    return this._internalClient.getSecretVersionsNextWithHttpOperationResponse(nextPageLink, options);
  }

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
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {SecretListResult} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link SecretListResult} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  getSecretVersionsNext(nextPageLink, options, optionalCallback) {
    return this._internalClient.getSecretVersionsNext(nextPageLink, options, optionalCallback);
  }

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
   * @reject {Error} - The error object.
   */
  getCertificatesNextWithHttpOperationResponse(nextPageLink, options) {
    return this._internalClient.getCertificatesNextWithHttpOperationResponse(nextPageLink, options);
  }

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
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {CertificateListResult} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link CertificateListResult} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  getCertificatesNext(nextPageLink, options, optionalCallback) {
    return this._internalClient.getCertificatesNext(nextPageLink, options, optionalCallback);
  }

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
   * @reject {Error} - The error object.
   */
  getCertificateIssuersNextWithHttpOperationResponse(nextPageLink, options) {
    return this._internalClient.getCertificateIssuersNextWithHttpOperationResponse(nextPageLink, options);
  }

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
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {CertificateIssuerListResult} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link CertificateIssuerListResult} for more
   *                      information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  getCertificateIssuersNext(nextPageLink, options, optionalCallback) {
    return this._internalClient.getCertificateIssuersNext(nextPageLink, options, optionalCallback);
  }

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
   * @reject {Error} - The error object.
   */
  getCertificateVersionsNextWithHttpOperationResponse(nextPageLink, options) {
    return this._internalClient.getCertificateVersionsNextWithHttpOperationResponse(nextPageLink, options);
  }

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
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {CertificateListResult} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link CertificateListResult} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  getCertificateVersionsNext(nextPageLink, options, optionalCallback) {
    return this._internalClient.getCertificateVersionsNext(nextPageLink, options, optionalCallback);
  }

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
    * @param {object} [options.customHeaders] Headers that will be added to the request
    * 
    * @returns {Promise} A promise is returned
    *
    * @resolve {HttpOperationResponse<CertificateListResult>} - The deserialized result object.
    *
    * @reject {Error} - The error object.
    */
  getPendingCertificateSigningRequestWithHttpOperationResponse(vaultBaseUrl, certificateName, options) {
    let self = this;
    return new Promise((resolve, reject) => {
      self._getPendingCertificateSigningRequest(vaultBaseUrl, certificateName, options, (err, result, request, response) => {
        let httpOperationResponse = new msRest.HttpOperationResponse(request, response);
        httpOperationResponse.body = result;
        if (err) { reject(err); }
        else { resolve(httpOperationResponse); }
        return;
      });
    });
  }

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
   * @param {function} [optionalCallback] - The optional callback.
   *
   * @returns {function|Promise} If a callback was passed as the last parameter
   * then it returns the callback else returns a Promise.
   *
   * {Promise} A promise is returned
   *
   *                      @resolve {CertificateOperation} - The deserialized result object.
   *
   *                      @reject {Error} - The error object.
   *
   * {function} optionalCallback(err, result, request, response)
   *
   *                      {Error}  err        - The Error object if an error occurred, null otherwise.
   *
   *                      {object} [result]   - The deserialized result object if an error did not occur.
   *                      See {@link CertificateOperation} for more information.
   *
   *                      {object} [request]  - The HTTP Request object if an error did not occur.
   *
   *                      {stream} [response] - The HTTP Response stream if an error did not occur.
   */
  getPendingCertificateSigningRequest(vaultBaseUrl, certificateName, options, optionalCallback) {
    let self = this;
    if (!optionalCallback && typeof options === 'function') {
      optionalCallback = options;
      options = null;
    }
    if (!optionalCallback) {
      return new Promise((resolve, reject) => {
        self._getPendingCertificateSigningRequest(vaultBaseUrl, certificateName, options, (err, result, request, response) => {
          if (err) { reject(err); }
          else { resolve(result); }
          return;
        });
      });
    } else {
      return self._getPendingCertificateSigningRequest(vaultBaseUrl, certificateName, options, optionalCallback);
    }
  }
}

/**
 * Creates a new {@linkcode KeyVaultClient} object.
 *
 * @param {object} [credentials]     The credentials, typically a {@linkcode KeyVaultCredentials} object. If null, an authentication filter must be provided.
 
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
module.exports.createKeyVaultClient = function createKeyVaultClient(credentials, options) {
  return new module.exports.KeyVaultClient(credentials, options);
};

module.exports.KeyVaultClient = KeyVaultClient;
module.exports.JsonWebKeyEncryptionAlgorithms = jwk.JsonWebKeyEncryptionAlgorithms;
module.exports.JsonWebKeySignatureAlgorithms = jwk.JsonWebKeySignatureAlgorithms;
module.exports.KeyVaultCredentials = kvcreds.KeyVaultCredentials;
module.exports.parseKeyIdentifier = objId.parseKeyIdentifier;
module.exports.createSecretIdentifier = objId.createSecretIdentifier;
module.exports.createKeyIdentifier = objId.createKeyIdentifier;
module.exports.parseSecretIdentifier = objId.parseSecretIdentifier;
module.exports.createCertificateIdentifier = objId.createCertificateIdentifier;
module.exports.parseCertificateIdentifier = objId.parseCertificateIdentifier;
module.exports.createCertificateOperationIdentifier = objId.createCertificateOperationIdentifier;
module.exports.parseCertificateOperationIdentifier = objId.parseCertificateOperationIdentifier;
module.exports.createIssuerIdentifier = objId.createIssuerIdentifier;
module.exports.parseIssuerIdentifier = objId.parseIssuerIdentifier;
module.exports.Models = models;