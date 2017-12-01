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
const KeyVaultClientBase = require('./keyVaultClient');


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
  let client = this;
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
    if (client.apiVersion === null || client.apiVersion === undefined || typeof client.apiVersion.valueOf() !== 'string') {
      throw new Error('this.apiVersion cannot be null or undefined and it must be of type string.');
    }
    if (client.acceptLanguage !== null && client.acceptLanguage !== undefined && typeof client.acceptLanguage.valueOf() !== 'string') {
      throw new Error('this.acceptLanguage must be of type string.');
    }
  } catch (error) {
    return callback(error);
  }

  // Construct URL
  let requestUrl = client.baseUri +
    '//certificates/{certificate-name}/pending';
  requestUrl = requestUrl.replace('{vaultBaseUrl}', vaultBaseUrl);
  requestUrl = requestUrl.replace('{certificate-name}', encodeURIComponent(certificateName));
  let queryParameters = [];
  queryParameters.push('api-version=' + encodeURIComponent(client.apiVersion));
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
  if (client.generateClientRequestId) {
    httpRequest.headers['x-ms-client-request-id'] = msRestAzure.generateUuid();
  }
  if (client.acceptLanguage !== undefined && client.acceptLanguage !== null) {
    httpRequest.headers['accept-language'] = client.acceptLanguage;
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
class KeyVaultClient extends KeyVaultClientBase {

  constructor(credentials, options) {
    // convert credentials to KeyVaultCredentials if needed
    let keyVaultCredentials = credentials;
    if (!(credentials instanceof msRestAzure.KeyVaultCredentials)) {
      keyVaultCredentials = new msRestAzure.KeyVaultCredentials(null, credentials);
    }

    // create and add new custom filter before calling super()
    if (keyVaultCredentials.createSigningFilter) {
      if (!options) options = [];
      if (!options.filters) options.filters = [];
      options.filters.push(keyVaultCredentials.createSigningFilter());
    }

    // ServiceClient constructor adds filter to the pipeline
    super(keyVaultCredentials, options);
    this._getPendingCertificateSigningRequest = _getPendingCertificateSigningRequest;
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
    return super.updateKeyWithHttpOperationResponse(parsedId.vault, parsedId.name, version, options);
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
    return super.updateKey(parsedId.vault, parsedId.name, version, options, optionalCallback);
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
    return super.getKeyWithHttpOperationResponse(parsedId.vault, parsedId.name, version, options);
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
    return super.getKey(parsedId.vault, parsedId.name, version, options, optionalCallback);
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
    return super.encryptWithHttpOperationResponse(parsedId.vault, parsedId.name, version, algorithm, value, options);
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
    return super.encrypt(parsedId.vault, parsedId.name, version, algorithm, value, options, optionalCallback);
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
    return super.decryptWithHttpOperationResponse(parsedId.vault, parsedId.name, version, algorithm, value, options);
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
    return super.decrypt(parsedId.vault, parsedId.name, version, algorithm, value, options, optionalCallback);
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
    return super.signWithHttpOperationResponse(parsedId.vault, parsedId.name, version, algorithm, value, options);
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
    return super.sign(parsedId.vault, parsedId.name, version, algorithm, value, options, optionalCallback);
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
    return super.verifyWithHttpOperationResponse(parsedId.vault, parsedId.name, version, algorithm, digest, signature, options);
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
    return super.verify(parsedId.vault, parsedId.name, version, algorithm, digest, signature, options, optionalCallback);
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
    return super.wrapKeyWithHttpOperationResponse(parsedId.vault, parsedId.name, version, algorithm, value, options);
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
    return super.wrapKey(parsedId.vault, parsedId.name, version, algorithm, value, options, optionalCallback);
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
    return super.unwrapKeyWithHttpOperationResponse(parsedId.vault, parsedId.name, version, algorithm, value, options);
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
    return super.unwrapKey(parsedId.vault, parsedId.name, version, algorithm, value, options, optionalCallback);
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
    return super.updateSecretWithHttpOperationResponse(parsedId.vault, parsedId.name, version, options);
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
    return super.updateSecret(parsedId.vault, parsedId.name, version, options, optionalCallback);
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
    return super.getSecretWithHttpOperationResponse(parsedId.vault, parsedId.name, version, options);
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
    return super.getSecret(parsedId.vault, parsedId.name, version, options, optionalCallback);
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
    return super.updateCertificateWithHttpOperationResponse(parsedId.vault, parsedId.name, version, options);
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
    return super.updateCertificate(parsedId.vault, parsedId.name, version, options, optionalCallback);
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
    return super.getCertificateWithHttpOperationResponse(parsedId.vault, parsedId.name, version, options);
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
    return super.getCertificate(parsedId.vault, parsedId.name, version, options, optionalCallback);
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