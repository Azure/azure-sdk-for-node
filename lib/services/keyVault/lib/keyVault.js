//
// Copyright (c) Microsoft and contributors.  All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//
// See the License for the specific language governing permissions and
// limitations under the License.
//

'use strict';
/* jshint latedef:false */
/* jshint camelcase:false */

var _ = require('underscore');
var url = require('url');
var util = require('util');
var jwk = require('./jwk');
var kvcreds = require('./keyVaultCredentials');

var exports = module.exports;

exports.JsonWebKey = jwk.JsonWebKey;
exports.JsonWebKeyEncryptionAlgorithms = jwk.JsonWebKeyEncryptionAlgorithms;
exports.JsonWebKeySignatureAlgorithms = jwk.JsonWebKeySignatureAlgorithms;
exports.KeyVaultCredentials = kvcreds.KeyVaultCredentials;

/** Identifier of the resource on which Key Vault users and service principals must authenticate.
 */
exports.RESOURCE_ID = 'https://vault.azure.net';

// The internal client is too low level, so we wrap it instead of exposing it directly.
var InternalClient = require('./keyVaultInternalClient');

/**
* Creates a new {@linkcode KeyVaultClient} object.
*
* @param {object} [credentials]     The credentials, typically a {@linkcode KeyVaultCredentials} object. If null, an authentication filter must be provided.
* @param {string} [baseUri]         Ignored, may be null.
* @param {array}  [filters]         Extra filters to attach to the client.
* @return {KeyVaultClient}
*/
exports.createKeyVaultClient = function (credentials, baseUri, filters) {
  return new exports.KeyVaultClient(credentials, baseUri, filters);
};

/**
* A Key Vault client object.
*
* @class
* @param {object} [credentials]     The credentials, typically a {@linkcode KeyVaultCredentials} object. If null, an authentication filter must be provided.
* @param {string} [baseUri]         Ignored, may be null.
* @param {array}  [filters]         Extra filters to attach to the client.
*/
function KeyVaultClient(credentials, baseUri, filters) {
  if (credentials.createSigningFilter) {
    if (!filters) filters = [];
    filters.push(credentials.createSigningFilter());
  }
  this._internalClient = new InternalClient.KeyVaultInternalClient(credentials, baseUri, filters);
  this._keys = this._internalClient.keys;
  this._secrets = this._internalClient.secrets;
}

exports.KeyVaultClient = KeyVaultClient;

/** See {@linkcode Service#withFilter}.
*/
KeyVaultClient.prototype.withFilter = function (newFilter) {
  this._internalClient = this._internalClient.withFilter(newFilter);
  this._keys = this._internalClient.keys;
  this._secrets = this._internalClient.secrets;
  return this;
};

/**
 * Performs an ENCRYPT operation using the specified key.
 * 
 * @param {string}                        keyIdentifier         The key identifier. It may or may not contain a version path. If a version is not provided, the latest key version is used.
 * @param {string}                        algorithm             The algorithm name. Use a constant from {@linkcode JsonWebKeyEncryptionAlgorithms}.
 * @param {Buffer}                        plainText             A {@linkcode Buffer} containing the data to be encrypted.
 * @param {KeyVaultClient~valueCallback}  callback              A callback that will be called on completion. The value will contain the ciphertext.
 */
KeyVaultClient.prototype.encrypt = function(keyIdentifier, algorithm, plainText, callback) {
    var keyOpRequest = createKeyOpRequest(algorithm, plainText);
    var result = this._keys.encryptData(keyIdentifier, serializeKeyRequest(keyOpRequest), valueResponseDeserializer(callback));
    return result;
};

/**
 * Performs a DECRYPT operation using the specified key.
 * 
 * @param {string}                        keyIdentifier         The key identifier. It may or may not contain a version path. If a version is not provided, the latest key version is used.
 * @param {string}                        algorithm             The algorithm name. Use a constant from {@linkcode JsonWebKeyEncryptionAlgorithms}.
 * @param {Buffer}                        cipherText            A {@linkcode Buffer} containing the data to be decrypted.
 * @param {KeyVaultClient~valueCallback}  callback              A callback that will be called on completion. The value will contain the plaintext.
 */
KeyVaultClient.prototype.decrypt = function(keyIdentifier, algorithm, cipherText, callback) {
    var keyOpRequest = createKeyOpRequest(algorithm, cipherText);
    var result = this._keys.decryptData(keyIdentifier, serializeKeyRequest(keyOpRequest), valueResponseDeserializer(callback));
    return result;
};

/**
 * Performs a SIGN operation using the specified key.
 * 
 * @param {string}                        keyIdentifier         The key identifier. It may or may not contain a version path. If a version is not provided, the latest key version is used.
 * @param {string}                        algorithm             The algorithm name. Use a constant from {@linkcode JsonWebKeySignatureAlgorithms}.
 * @param {Buffer}                        digest                A {@linkcode Buffer} containing the digest to be signed. It must be a valid digest.
 * @param {KeyVaultClient~valueCallback}  callback              A callback that will be called on completion. The value will contain the signature.
 */
KeyVaultClient.prototype.sign = function(keyIdentifier, algorithm, digest, callback) {
    var keyOpRequest = createKeyOpRequest(algorithm, digest);
    var result = this._keys.sign(keyIdentifier, serializeKeyRequest(keyOpRequest), valueResponseDeserializer(callback));
    return result;
};

/**
 * Performs a VERIFY operation using the specified key.
 * 
 * @param {string}                        keyIdentifier         The key identifier. It may or may not contain a version path. If a version is not provided, the latest key version is used.
 * @param {string}                        algorithm             The algorithm name. Use a constant from {@linkcode JsonWebKeySignatureAlgorithms}.
 * @param {Buffer}                        digest                A {@linkcode Buffer} containing the digest that was signed.
 * @param {Buffer}                        signature             A {@linkcode Buffer} containing the signature to be verified.
 * @param {KeyVaultClient~boolCallback}   callback              A callback that will be called on completion. The value will be true if the signature is valid for the digest.
 */
KeyVaultClient.prototype.verify = function(keyIdentifier, algorithm, digest, signature, callback) {
    var keyOpRequest = createVerifyOpRequest(algorithm, digest, signature);
    var result = this._keys.verify(keyIdentifier, serializeKeyRequest(keyOpRequest), keyResponseDeserializer(callback));
    return result;
};

/**
 * Performs a WRAP KEY operation using the specified key.
 * 
 * @param {string}                        keyIdentifier   The key identifier. It may or may not contain a version path. If a version is not provided, the latest key version is used.
 * @param {string}                        algorithm       The algorithm name. Use a constant from {@linkcode JsonWebKeyEncryptionAlgorithms}.
 * @param {Buffer}                        key             A {@linkcode Buffer} containing the key material to be wrapped.
 * @param {KeyVaultClient~valueCallback}  callback        A callback that will be called on completion. The value will contain the wrapped key.
 */
KeyVaultClient.prototype.wrapKey = function(keyIdentifier, algorithm, key, callback) {
    var keyOpRequest = createKeyOpRequest(algorithm, key);
    var result = this._keys.wrapKey(keyIdentifier, serializeKeyRequest(keyOpRequest), valueResponseDeserializer(callback));
    return result;
};

/**
 * Performs an UNWRAP KEY operation using the specified key.
 * 
 * @param {string}                        keyIdentifier         The key identifier. It may or may not contain a version path. If a version is not provided, the latest key version is used.
 * @param {string}                        algorithm             The algorithm name. Use a constant from {@linkcode JsonWebKeyEncryptionAlgorithms}.
 * @param {Buffer}                        cipherText            A {@linkcode Buffer} containing the wrapped key.
 * @param {KeyVaultClient~valueCallback}  callback              A callback that will be called on completion. The value will contain the unwrapped key material.
 */
KeyVaultClient.prototype.unwrapKey = function(keyIdentifier, algorithm, wrappedKey, callback) {
    var keyOpRequest = createKeyOpRequest(algorithm, wrappedKey);
    var result = this._keys.unwrapKey(keyIdentifier, serializeKeyRequest(keyOpRequest), valueResponseDeserializer(callback));
    return result;
};

/**
 * Performs a GET KEY operation, which retrieves key attributes from the service.
 * 
 * @param {string}                            keyIdentifier         The key identifier. It may or may not contain a version path. If a version is not provided, the latest key version is used.
 * @param {KeyVaultClient~keyBundleCallback}  callback              A callback that will be called on completion.
 */
KeyVaultClient.prototype.getKey = function(keyIdentifier, callback) {
    var result = this._keys.get(keyIdentifier, keyBundleResponseDeserializer(callback));
    return result;
};

/**
 * Performs a GET KEYS operation, which lists keys of a vault.
 * This operation may use paging. Call {@linkcode #getKeysNext} to retrieve more pages.
 * 
 * @param {string}                          vault       The vault identifier.
 * @param {number}                          maxresults  The maximum number of keys to return. This is the total number of keys, not the size of first page.
 * @param {KeyVaultClient~keyListCallback}  callback    A callback that will be called on completion.
 */
KeyVaultClient.prototype.getKeys = function(vault, maxresults, callback) {
    var result = this._keys.list(vault, maxresults, keyListResponseDeserializer(callback));
    return result;
};

/**
 * Resumes a GET KEYS operation by returning the next page.
 * 
 * @param {string}                          nextLink  The value returned by a previous call to {@linkcode #getKeys} or {@linkcode #getKeysNext}.
 * @param {KeyVaultClient~keyListCallback}  callback  A callback that will be called on completion.
 */
KeyVaultClient.prototype.getKeysNext = function(nextLink, callback) {
    var result = this._keys.listNext(nextLink, keyListResponseDeserializer(callback));
    return result;
};

/**
 * Performs a GET KEY VERSIONS operation, which lists all versions of a key.
 * This operation may use paging. Call {@linkcode #getKeyVersionsNext} to retrieve more pages.
 * 
 * @param {string}                          vault       The vault identifier.
 * @param {string}                          keyName     The key name.
 * @param {number}                          maxresults  The maximum number of key versions to return. This is the total number of items, not the size of first page.
 * @param {KeyVaultClient~keyListCallback}  callback    A callback that will be called on completion.
 */
KeyVaultClient.prototype.getKeyVersions = function(vault, keyName, maxresults, callback) {
    var result = this._keys.listVersions(vault, keyName, maxresults, keyListResponseDeserializer(callback));
    return result;
};

/**
 * Resumes a GET KEY VERSIONS operation by returning the next page.
 * 
 * @param {string}                          nextLink  The value returned by a previous call to {@linkcode #getKeyVersions} or {@linkcode #getKeyVersionsNext}.
 * @param {KeyVaultClient~keyListCallback}  callback  A callback that will be called on completion.
 */
KeyVaultClient.prototype.getKeyVersionsNext = function(nextLink, callback) {
    var result = this._keys.listVersionsNext(nextLink, keyListResponseDeserializer(callback));
    return result;
};

/**
 * Performs a CREATE KEY operation, which creates a key and stores in the service.
 *
 * @param {string}                            vault                 The vault identifier.
 * @param {string}                            keyName               The key name. If a key with this name already exists, the service creates a new version and set as current.
 * @param {string}                            request.kty           The key type. Use a constant from {@linkcode JsonWebKeyType}.
 * @param {number}                            [request.key_size]    The key size. Must be valid for the key type. If omitted, a default for the key type is used.
 * @param {string[]}                          [request.key_ops]     The allowed operations on the key. Each can be a constant from {@linkcode JsonWebKeyOperation}.
 * @param {KeyAttributes}                     [request.attributes]  Initial attributes. If omitted, a service defined default is used.
 * @param {object}                            [request.tags]        User defined tags to be associated with the key.
 * @param {KeyVaultClient~keyBundleCallback}  callback              A callback that will be called on completion.
 */
KeyVaultClient.prototype.createKey = function(vault, keyName, request, callback) {
    var result = this._keys.create(vault, keyName, serializeKeyRequest(request), keyBundleResponseDeserializer(callback));
    return result;
};

/**
 * Performs a DELETE KEY operation, which deletes a key and all its versions.
 * This method returns data about the current version of deleted key.
 *
 * @param {string}                            vault       The vault identifier.
 * @param {string}                            keyName     The key name.
 * @param {KeyVaultClient~keyBundleCallback}  callback    A callback that will be called on completion.
 */
KeyVaultClient.prototype.deleteKey = function(vault, keyName, callback) {
    var result = this._keys.deleteKey(vault, keyName, keyBundleResponseDeserializer(callback));
    return result;
};

/**
 * Performs an UPDATE KEY operation, which updates attributes of a key version.
 *
 * @param {string}                            keyIdentifier         The key identifier. It may or may not contain a version path. If a version is not provided, the latest key version is used.
 * @param {string[]}                          [request.key_ops]     If informed, changes allowed operations. Each can be a constant from {@linkcode JsonWebKeyOperation}.
 * @param {KeyAttributes}                     [request.attributes]  If informed, changes attributes.
 * @param {object}                            [request.tags]        If informed, replaces all tags.
 * @param {KeyVaultClient~keyBundleCallback}  callback              A callback that will be called on completion.
 */
KeyVaultClient.prototype.updateKey = function(keyIdentifier, request, callback) {
    var result = this._keys.update(keyIdentifier, serializeKeyRequest(request), keyBundleResponseDeserializer(callback));
    return result;
};

/**
 * Performs an IMPORT KEY operation, which imports existing key material into a new key that is stored on the service.
 *
 * @param {string}                            vault                 The vault identifier.
 * @param {string}                            keyName               The key name. If a key with this name already exists, the service creates a new version and set as current.
 * @param {string}                            request.key           A {@linkcode JsonWebKey} that describes the key to be imported. The kid property is ignored.
 * @param {boolean}                           [request.hsm]         true to import as a "hardware" key, false to import as "software" key. Default is false.
 * @param {KeyAttributes}                     [request.attributes]  Initial attributes. If omitted, a service defined default is used.
 * @param {object}                            [request.tags]        User defined tags to be associated with the key.
 * @param {KeyVaultClient~keyBundleCallback}  callback              A callback that will be called on completion.
 */
KeyVaultClient.prototype.importKey = function(vault, keyName, request, callback) {
    var keyIdentifier = createKeyIdentifier(vault, keyName).identifier;
    var result = this._keys.importMethod(keyIdentifier, serializeImportKeyRequest(request), keyBundleResponseDeserializer(callback));
    return result;
};

/**
 * Performs a BACKUP KEY operation, which backs up a key and all its versions.
 *
 * @param {string}                        vault       The vault identifier.
 * @param {string}                        keyName     The key name.
 * @param {KeyVaultClient~valueCallback}  callback    A callback that will be called on completion. The value is a sequence of bytes suitable for the RESTORE KEY operation.
 */
KeyVaultClient.prototype.backupKey = function(vault, keyName, callback) {
    var keyIdentifier = createKeyIdentifier(vault, keyName).identifier;
    var result = this._keys.backup(keyIdentifier, valueResponseDeserializer(callback));
    return result;
};

/**
 * Performs a RESTORE KEY operation, which restores a key and all its versions. The key to be restored must not exist previously.
 * This method returns data about the restored key. Despite all versions are being restored, only the current version is returned.
 *
 * @param {string}                            vault         The vault identifier.
 * @param {Buffer}                            backupValue   A sequence of bytes obtained through the BACKUP KEY operation.
 * @param {KeyVaultClient~keyBundleCallback}  callback      A callback that will be called on completion.
  */
KeyVaultClient.prototype.restoreKey = function(vault, backupValue, callback) {
    var keyOpRequest = createRestoreKeyRequest(backupValue);
    var result = this._keys.restore(vault, serializeKeyRequest(keyOpRequest), keyBundleResponseDeserializer(callback));
    return result;
};

/**
 * Performs a GET SECRET operation, which retrieves secret attributes from the service.
 * 
 * @param {string}                              secretIdentifier      The secret identifier. It may or may not contain a version path. If a version is not provided, the latest secret version is used.
 * @param {KeyVaultClient~secretBundleCallback} callback              A callback that will be called on completion.
 */
KeyVaultClient.prototype.getSecret = function(secretIdentifier, callback) {
    var result = this._secrets.get(secretIdentifier, secretBundleResponseDeserializer(callback));
    return result;
};

/**
 * Performs a SET SECRET operation, which stores a secret in the service.
 *
 * @param {string}                              vault                 The vault identifier.
 * @param {string}                              secretName            The secret name. If a secret with this name already exists, the service creates a new version and set as current.
 * @param {string}                              request.value         The secret value.
 * @param {string}                              [request.contentType] The value's content type.
 * @param {SecretAttributes}                    [request.attributes]  Initial attributes. If omitted, a service defined default is used.
 * @param {object}                              [request.tags]        User defined tags to be associated with the secret.
 * @param {KeyVaultClient~secretBundleCallback} callback              A callback that will be called on completion.
 */
KeyVaultClient.prototype.setSecret = function(vault, secretName, request, callback) {
    var secretIdentifier = createSecretIdentifier(vault, secretName).identifier;
    var result = this._secrets.set(secretIdentifier, serializeSecretRequest(request), secretBundleResponseDeserializer(callback));
    return result;
};

/**
 * Performs an UPDATE SECRET operation, which updates attributes of a secret version.
 *
 * @param {string}                              secretIdentifier      The secret identifier. It may or may not contain a version path. If a version is not provided, the latest secret version is used.
 * @param {stri}                                [request.contentType] If informed, changes the value's content type.
 * @param {SecretAttributes}                    [request.attributes]  If informed, changes attributes.
 * @param {object}                              [request.tags]        If informed, replaces all tags.
 * @param {KeyVaultClient~secretBundleCallback} callback              A callback that will be called on completion.
 */
KeyVaultClient.prototype.updateSecret = function(secretIdentifier, request, callback) {
    var result = this._secrets.update(secretIdentifier, serializeSecretRequest(request), secretBundleResponseDeserializer(callback));
    return result;
};

/**
 * Performs a DELETE SECRET operation, which deletes a secret and all its versions.
 * This method returns data about the current version of the deleted secret.
 *
 * @param {string}                              vault       The vault identifier.
 * @param {string}                              secretName  The secret name.
 * @param {KeyVaultClient~secretBundleCallback} callback    A callback that will be called on completion.
 */
KeyVaultClient.prototype.deleteSecret = function(vault, secretName, callback) {
    var secretIdentifier = createSecretIdentifier(vault, secretName).identifier;
    var result = this._secrets.deleteMethod(secretIdentifier, secretBundleResponseDeserializer(callback));
    return result;
};

/**
 * Performs a GET SECRETS operation, which lists secrets of a vault.
 * This operation may use paging. Call {@linkcode #getSecretsNext} to retrieve more pages.
 * 
 * @param {string}                            vault       The vault identifier.
 * @param {number}                            maxresults  The maximum number of secrets to return. This is the total number of secrets, not the size of first page.
 * @param {KeyVaultClient~secretListCallback} callback    A callback that will be called on completion.
 */
KeyVaultClient.prototype.getSecrets = function(vault, maxresults, callback) {
    var result = this._secrets.list(vault, maxresults, secretListResponseDeserializer(callback));
    return result;
};

/**
 * Resumes a GET SECRETS operation by returning the next page.
 * 
 * @param {string}                            nextLink  The value returned by a previous call to {@linkcode #getSecrets} or {@linkcode #getSecretsNext}.
 * @param {KeyVaultClient~secretListCallback} callback  A callback that will be called on completion.
 */
KeyVaultClient.prototype.getSecretsNext = function(nextLink, callback) {
    var result = this._secrets.listNext(nextLink, secretListResponseDeserializer(callback));
    return result;
};

/**
 * Performs a GET SECRET VERSIONS operation, which lists all versions of a secret.
 * This operation may use paging. Call {@linkcode #getSecretVersionsNext} to retrieve more pages.
 * 
 * @param {string}                            vault       The vault identifier.
 * @param {string}                            secretName  The secret name.
 * @param {number}                            maxresults  The maximum number of secret versions to return. This is the total number of items, not the size of first page.
 * @param {KeyVaultClient~secretListCallback} callback    A callback that will be called on completion.
 */
KeyVaultClient.prototype.getSecretVersions = function(vault, secretName, maxresults, callback) {
    var result = this._secrets.listVersions(vault, secretName, maxresults, secretListResponseDeserializer(callback));
    return result;
};

/**
 * Resumes a GET SECRET VERSIONS operation by returning the next page.
 * 
 * @param {string}                            nextLink  The value returned by a previous call to {@linkcode #getSecretVersions} or {@linkcode #getSecretVersionsNext}.
 * @param {KeyVaultClient~secretListCallback} callback  A callback that will be called on completion.
 */
KeyVaultClient.prototype.getSecretVersionsNext = function(nextLink, callback) {
    var result = this._secrets.listVersionsNext(nextLink, secretListResponseDeserializer(callback));
    return result;
};

// Callback definitions

/**
 * @callback KeyVaultClient~valueCallback
 * @param {object}        [err]         Error information. Only informed if the operation was not successful.
 * @param {object}        [result]      The operation result. Only informed on success.
 * @param {string}        result.kid    Identifier of the key used to perform the operation.
 * @param {Buffer}        result.value  The operation result. The content is defined by the operation.
 */

/**
 * @callback KeyVaultClient~boolCallback
 * @param {object}        [err]         Error information. Only informed if the operation was not successful.
 * @param {object}        [result]      The operation result. Only informed on success.
 * @param {string}        result.kid    Identifier of the key used to perform the operation.
 * @param {bool}          result.value  The operation result.
 */

/**
 * @callback KeyVaultClient~keyBundleCallback
 * @param {object}        [err]         Error information. Only informed if the operation was not successful.
 * @param {KeyBundle}     [result]      An object describing a key stored in the service. Only informed on success.
 */

/**
 * @callback KeyVaultClient~keyListCallback
 * @param {object}          [err]                       Error information. Only informed if the operation was not successful.
 * @param {object}          [result]                    An object describing a list of keys stored in the service. Only informed on success.
 * @param {object[]}        result.value                An array of objects, each describing a key stored in the service.
 * @param {string}          result.value[].kid          The key identifier.
 * @param {KeyAttributes}   result.value[].attributes   The key attributes.
 * @param {string}          [result.nextLink]           An optional string containing the continuation link, if more pages are available in the service.
 */

/**
 * @callback KeyVaultClient~secretBundleCallback
 * @param {object}            [err]         Error information. Only informed if the operation was not successful.
 * @param {SecretBundle}      [result]      An object describing a secret stored in the service. Only informed on success.
 */

/**
 * @callback KeyVaultClient~secretListCallback
 * @param {object}              [err]                       Error information. Only informed if the operation was not successful.
 * @param {object}              [result]                    An object describing a list of secrets stored in the service. Only informed on success.
 * @param {object[]}            result.value                An array of objects, each describing a secret stored in the service.
 * @param {string}              result.value[].id           The secret identifier.
 * @param {SecretAttributes}    result.value[].attributes   The secret attributes.
 * @param {string}              [result.nextLink]           An optional string containing the continuation link, if more pages are available in the service.
 */

/** An identifier for an Azure Key Vault resource.
  * @class
  */
function ObjectIdentifier(collection, vault, name, version) {

  /** The vault URI.
    * @member {string}
    */
  this.vault = vault;

  /** The key name.
    * @member {string}
    */
  this.name = name;

  /** The key version. May be null.
    * @member {string}
    */
  this.version = version;

  /** The base identifier (i.e. without the version).
    * @member {string}
    */
  this.baseIdentifier = util.format('%s/%s/%s', vault, collection, name);

  /** The full identifier if a version was informed; otherwise is the same value of baseIdentifier.
    * @member {string}
    */
  this.identifier = version ? util.format('%s/%s', this.baseIdentifier, version) : this.baseIdentifier;
}

function createObjectIdentifier(collection, vault, name, version) {

  if (!_.isString(collection) || !(collection = collection.trim())) {
    throw new Error('Invalid collection argument');
  }

  if (!_.isString(vault) || !(vault = vault.trim())) {
    throw new Error('Invalid vault argument');
  }

  if (!_.isString(name) || !(name = name.trim())) {
    throw new Error('Invalid name argument');
  }

  if (version && !_.isString(version)) {
    throw new Error('Invalid version argument');
  }

  if (version) {
    version = version.trim();
  }

  if (!version) {
    version = null;
  }

  var baseUri;
  try {
    baseUri = url.parse(vault, true, true);
  } catch (e) {
    throw new Error(util.format('Invalid %s identifier: %s. Not a valid URI', collection, vault));
  }

  var vault = util.format('%s//%s', baseUri.protocol, baseUri.host);
  return new ObjectIdentifier(collection, vault, name, version);
}

/** Creates an ObjectIdentifier object for a key.
 @param {string} vault The vault URI.
 @param {string} name The key name.
 @param {string} [version=null] The object version.
 @return {ObjectIdentifier} An object that represents the key identifier.
*/
function createKeyIdentifier(vault, name, version) {
  return createObjectIdentifier('keys', vault, name, version);
}

exports.createKeyIdentifier = createKeyIdentifier;

/** Creates an ObjectIdentifier object for a secret.
 @param {string} vault The vault URI.
 @param {string} name The secret name.
 @param {string} [version=null] The object version.
 @return {ObjectIdentifier} An object that represents the secret identifier.
*/
function createSecretIdentifier(vault, name, version) {
  return createObjectIdentifier('secrets', vault, name, version);
}

exports.createSecretIdentifier = createSecretIdentifier;

function parseObjectIdentifier(collection, identifier) {

  if (!_.isString(collection) || !(collection = collection.trim())) {
    throw new Error('Invalid collection argument');
  }

  if (!_.isString(identifier) || !(identifier = identifier.trim())) {
    throw new Error('Invalid identifier argument');
  }

  var baseUri;
  try {
    baseUri = url.parse(identifier, true, true);
  } catch (e) {
    throw new Error(util.format('Invalid %s identifier: %s. Not a valid URI', collection, identifier));
  }

  // Path is of the form '/collection/name[/version]'
  var segments = baseUri.pathname.split('/');
  if (segments.length !== 3 && segments.length !== 4) {
    throw new Error(util.format('Invalid %s identifier: %s. Bad number of segments: %d', collection, identifier, segments.length));
  }

  if (collection !== segments[1]) {
    throw new Error(util.format('Invalid %s identifier: %s. segment [1] should be "%s", found "%s"', collection, identifier, collection, segments[1]));
  }

  var vault = util.format('%s//%s', baseUri.protocol, baseUri.host);
  var name = segments[2];
  var version = segments.length === 4 ? segments[3] : null;
  return new ObjectIdentifier(collection, vault, name, version);
}

/** Parses a string containing a key identifier and returns the ObjectIdentifier object.
 @param {string} identifier The key identifier (an URI).
 @return {ObjectIdentifier} An object that represents the key identifier.
*/
function parseKeyIdentifier(identifier) {
  return parseObjectIdentifier('keys', identifier);
}

exports.parseKeyIdentifier = parseKeyIdentifier;

/** Parses a string containing a secret identifier and returns the ObjectIdentifier object.
 @param {string} identifier The secret identifier (an URI).
 @return {ObjectIdentifier} An object that represents the secret identifier.
*/
function parseSecretIdentifier(identifier) {
  return parseObjectIdentifier('secrets', identifier);
}

exports.parseSecretIdentifier = parseSecretIdentifier;

/** @class 
  */
function KeyBundle() {
  
  /** The JWK object containig key information.
    * @member {JsonWebKey}
    */
  this.key = null;
  
  /** Key attributes.
    * @member {KeyAttributes}
    */
  this.attributes = null;

  /** User defined tags. Each tag must be a string.
    * @member {object}
    */
  this.tags = null;

}

/** @class
  */
function KeyAttributes() {

  /** true if the object is explicitly enabled, false otherwise.
    * @member {boolean}
    */
  this.enabled = null;

  /** Date when the object was created in the service. 
    * @member {Date}
    */
  this.created = null;

  /** Last time the object was updated in the service.
    * @member {Date}
    */
  this.updated = null;  

  /** The date when the object becomes available for operations (the "not-before" date).
    * @member {Date}
    */
  this.nbf = null;

  /** The date when the object becomes unavailable for operations (the "expiration" date).
    * @member {Date}
    */
  this.exp = null;  

}

exports.KeyAttributes = KeyAttributes;

KeyAttributes.fromJson = function(json) {
  var result = new KeyAttributes();
  result.enabled = json.enabled;
  result.created = numberToDate(json.created);
  result.updated = numberToDate(json.updated);
  result.nbf = numberToDate(json.nbf);
  result.exp = numberToDate(json.exp);
  return result;
};

KeyAttributes.prototype.toJson = function() {
  var result = {};
  result.enabled = this.enabled;
  result.created = dateToNumber(this.created);
  result.updated = dateToNumber(this.updated);
  result.nbf = dateToNumber(this.nbf);
  result.exp = dateToNumber(this.exp);
  return result;
};

/** @class 
  */
function SecretBundle() {
  
  /** The secret identifier.
    * @member {string}
    */
  this.id = null;
  
  /** The contents that must be protected (the secret value).
    * @member {string}
    */
  this.value = null;
  
  /** The content type.
    * @member {string}
    */
  this.contentType = null;
  
  /** The secret attributes.
    * @member {SecretAttributes}
    */
  this.attributes = null;

  /** User defined tags. Each tag must be a string.
    * @member {object}
    */
  this.tags = null;

}

/** @class
  */
function SecretAttributes() {

  /** true if the object is explicitly enabled, false otherwise.
    * @member {boolean}
    */
  this.enabled = null;

  /** Date when the object was created in the service. 
    * @member {Date}
    */
  this.created = null;

  /** Last time the object was updated in the service.
    * @member {Date}
    */
  this.updated = null;  

  /** The date when the object becomes available for operations (the "not-before" date).
    * @member {Date}
    */
  this.nbf = null;

  /** The date when the object becomes unavailable for operations (the "expiration" date).
    * @member {Date}
    */
  this.exp = null;  

}

exports.SecretAttributes = SecretAttributes;

SecretAttributes.fromJson = function(json) {
  var result = new SecretAttributes();
  result.enabled = json.enabled;
  result.created = numberToDate(json.created);
  result.updated = numberToDate(json.updated);
  result.nbf = numberToDate(json.nbf);
  result.exp = numberToDate(json.exp);
  return result;
};

SecretAttributes.prototype.toJson = function() {
  var result = {};
  result.enabled = this.enabled;
  result.created = dateToNumber(this.created);
  result.updated = dateToNumber(this.updated);
  result.nbf = dateToNumber(this.nbf);
  result.exp = dateToNumber(this.exp);
  return result;
};

function createKeyOpRequest(algorithm, data) {
  var request = {};
  request.alg = algorithm;
  request.value = bufferToBase64Url(data);
  return request;
}

function createVerifyOpRequest(algorithm, digest, signature) {
    var request = {};
    request.alg = algorithm;
    request.digest = bufferToBase64Url(digest);
    request.value = bufferToBase64Url(signature);
    return request;
}

function createRestoreKeyRequest(backupValue) {
    var request = {};
    request.value = bufferToBase64Url(backupValue);
    return request;
}

function serializeImportKeyRequest(request) {
  var result = { rawJsonRequest: JSON.stringify(request) };
  if (request.key || request.attributes) {
    result = JSON.parse(result.rawJsonRequest);
    if (request.key) {
      result.key = jwkToJson(request.key);
    }
    if (request.attributes) {
      result.attributes = request.attributes.toJson();
    }
    result = { rawJsonRequest: JSON.stringify(result) };
  }
  return result;
}

function serializeKeyRequest(request) {
  var result = { rawJsonRequest: JSON.stringify(request) };
  if (request.attributes) {
    result = JSON.parse(result.rawJsonRequest);
    result.attributes = request.attributes.toJson();
    result = { rawJsonRequest: JSON.stringify(result) };
  }
  return result;
}

function valueResponseDeserializer(callback) {
  return keyResponseDeserializer(function(err, result, response) {
    if (err || !result || !result.value) {
      return callback(err, result, response);
    }
    result.value = base64UrlToBuffer(result.value);
    return callback(err, result, response);
  });
}

function keyBundleResponseDeserializer(callback) {
  return keyResponseDeserializer(function(err, result, response) {
    if (err || !result) {
      return callback(err, result, response);
    }
    if (result.key) {
      result.key = jwkFromJson(result.key);
    }
    if (result.attributes) {
      result.attributes = KeyAttributes.fromJson(result.attributes);
    }
    return callback(err, result, response);
  });
}

function keyListResponseDeserializer(callback) {
  return keyResponseDeserializer(function(err, result, response) {
    if (err || !result || !result.value || !result.value.length) {
      return callback(err, result, response);
    }
    var keys = result.value;
    for (var i = 0; i < keys.length; ++i) {
      keys[i].attributes = KeyAttributes.fromJson(keys[i].attributes);
    }
    return callback(err, result, response);
  });
}

function keyResponseDeserializer(callback) {
  return function (err, response) {
    if (err) {
      return callback(err, null, response);
    }
    if (response.keyOpResponse) {
      return callback(null, JSON.parse(response.keyOpResponse), response);
    }
    return callback(new Error('Unrecognized response'), null, response);
  };
}

function serializeSecretRequest(request) {
  var result = { rawJsonRequest: JSON.stringify(request) };
  if (request.attributes) {
    result = JSON.parse(result.rawJsonRequest);
    result.attributes = request.attributes.toJson();
    result = { rawJsonRequest: JSON.stringify(result) };
  }
  return result;
}

function secretBundleResponseDeserializer(callback) {
  return secretResponseDeserializer(function(err, result, response) {
    if (err || !result) {
      return callback(err, result, response);
    }
    if (result.attributes) {
      result.attributes = SecretAttributes.fromJson(result.attributes);
    }
    return callback(err, result, response);
  });
}

function secretListResponseDeserializer(callback) {
  return secretResponseDeserializer(function(err, result, response) {
    if (err || !result || !result.value || !result.value.length) {
      return callback(err, result, response);
    }
    var secrets = result.value;
    for (var i = 0; i < secrets.length; ++i) {
      secrets[i].attributes = SecretAttributes.fromJson(secrets[i].attributes);
    }
    return callback(err, result, response);
  });
}

function secretResponseDeserializer(callback) {
  return function (err, response) {
    if (err) {
      return callback(err, null, response);

    }
    if (response.response) {
      return callback(null, JSON.parse(response.response), response);
    }
    return callback(new Error('Unrecognized response'), null, response);
  };
}

function dateToNumber(d) {
  if (!d) {
    return null;
  }
  // A Date can be converted to string in JSON-clone operations, so let's tolerate.
  if (_.isString(d)) {
    d = new Date(d);
  }
  return parseInt(d.getTime() / 1000);
}

function numberToDate(n) {
  if (!n) {
    return null;
  }
  return new Date(n*1000);
}

function jwkToJson(src) {
  var dst = {};
  dst.kid = src.kid;
  dst.kty = src.kty;
  dst.key_ops = src.key_ops;
  dst.k = bufferToBase64Url(src.k);
  dst.n = bufferToBase64Url(src.n);
  dst.e = bufferToBase64Url(src.e);
  dst.d = bufferToBase64Url(src.d);
  dst.p = bufferToBase64Url(src.p);
  dst.q = bufferToBase64Url(src.q);
  dst.dp = bufferToBase64Url(src.dp);
  dst.dq = bufferToBase64Url(src.dq);
  dst.qi = bufferToBase64Url(src.qi);
  dst.key_hsm = bufferToBase64Url(src.key_hsm);
  return dst;
}

function jwkFromJson(src) {
  var dst = new jwk.JsonWebKey();
  dst.kid = src.kid;
  dst.kty = src.kty;
  dst.key_ops = src.key_ops;
  dst.k = base64UrlToBuffer(src.k);
  dst.n = base64UrlToBuffer(src.n);
  dst.e = base64UrlToBuffer(src.e);
  dst.d = base64UrlToBuffer(src.d);
  dst.p = base64UrlToBuffer(src.p);
  dst.q = base64UrlToBuffer(src.q);
  dst.dp = base64UrlToBuffer(src.dp);
  dst.dq = base64UrlToBuffer(src.dq);
  dst.qi = base64UrlToBuffer(src.qi);
  dst.key_hsm = base64UrlToBuffer(src.key_hsm);
  return dst;
}

function bufferToBase64Url(buffer) {
  if (!buffer) {
    return null;
  }
  // Buffer to Base64.
  var str = buffer.toString('base64');
  // Base64 to Base64Url.
  return trimEnd(str, '=').replace(/\+/g, '-').replace(/\//g, '_');
}

function trimEnd(str, ch) {
  var len = str.length;
  while ((len - 1) >= 0 && str[len - 1] === ch) {
    --len;
  }
  return str.substr(0, len);
}

function base64UrlToBuffer(str) {
  if (!str) {
    return null;
  }
  // Base64Url to Base64.
  str = str.replace(/\-/g, '+').replace(/\_/g, '/');
  // Base64 to Buffer.
  return new Buffer(str, 'base64');
}
