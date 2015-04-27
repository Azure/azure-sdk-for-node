/* jshint latedef:false */

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

var exports = module.exports;

/** Identifier of the resource on which Key Vault users and service principals must authenticate.
 */
exports.RESOURCE_ID = 'https://vault.azure.net';

// The internal client has no support for base64url and doesn't interpret exceptions.
// That's why we wrap it instead of exposing it directly.
var InternalClient = require('./keyVaultInternalClient');

/**
* Creates a new {@link KeyVaultClient} object.
*
* @param {string} [credentials.subscriptionId]      The subscription identifier.
* @param {string} [baseUri]                         The base uri.
* @param {array}  [filters]                         optional array of service filters
* @return {KeyVaultClient}                          A new KeyVaultClient object.
*/
exports.createKeyVaultClient = function (credentials, baseUri, filters) {
  return new exports.KeyVaultClient(credentials, baseUri, filters);
};

/**
* A client for the Azure Key Vault cloud service.
* @constructor
* @param {object} credentials The credentials object (typically, a TokenCloudCredentials instance)
* @param {string} [baseUri] The vault base URI, used only for operations that doesn't receive a full URI 
*                           (see description of each operation)
* @param {object[]} [filters] Extra filters to attach to the client
*/
function KeyVaultClient(credentials, baseUri, filters) {
    this.internalClient = new InternalClient.KeyVaultInternalClient(credentials, baseUri, filters);
    
    /**
    * An object that performs operations on keys.
    * @type {KeyVaultKeys}
    */
    this.keys = new KeyVaultKeys(this);

    /**
    * An object that performs operations on secrets.
    * @type {KeyVaultSecrets}
    */
    this.secrets = new KeyVaultSecrets(this);
}

/** Wrapper for withFilter() of Service class.
* Allows late binding of filters.
*/
KeyVaultClient.prototype.withFilter = function(newFilter) {
    this.internalClient = this.internalClient.withFilter(newFilter);
    return this;
};

/** A class that performs operations on vault keys.
*/
function KeyVaultKeys(client) {
    this.keys = client.internalClient.keys;
}

/**
* Requests that a backup of the specified key be downloaded to the client.
* @param {string} keyIdentifier
* @param {function} callback
* @returns {Stream} The response stream.
*/
KeyVaultKeys.prototype.backup = function(keyIdentifier, callback) {
    return this.keys.backup(keyIdentifier, keyResponseDeserializer(callback));
};

/**
* Creates a new, named, key in the specified vault.
* @param {string} vault
* @param {string} keyName
* @param {object} keyOpRequest
* @param {function} callback
* @returns {Stream} The response stream.
*/
KeyVaultKeys.prototype.create = function(vault, keyName, keyOpRequest, callback) {
    return this.keys.create(vault, keyName, serializeKeyRequest(keyOpRequest), keyResponseDeserializer(callback));
};

/**
* Decrypts a single block of data.
* @param {string} keyIdentifier
* @param {object} keyOpRequest
* @param {function} callback
* @returns {Stream} The response stream.
*/
KeyVaultKeys.prototype.decryptData = function(keyIdentifier, keyOpRequest, callback) {
    return this.keys.decryptData(keyIdentifier, serializeKeyRequest(keyOpRequest), keyResponseDeserializer(callback));
};

/**
* Delete the specified key
* @param {string} vault
* @param {string} keyName
* @param {function} callback
* @returns {Stream} The response stream.
*/
KeyVaultKeys.prototype.deleteKey = function(vault, keyName, callback) {
    return this.keys.deleteKey(vault, keyName, keyResponseDeserializer(callback));
};

/**
* Encrypts a single block of data.
* @param {string} keyIdentifier
* @param {object} keyOpRequest
* @param {function} callback
* @returns {Stream} The response stream.
*/
KeyVaultKeys.prototype.encryptData = function(keyIdentifier, keyOpRequest, callback) {
    return this.keys.encryptData(keyIdentifier, serializeKeyRequest(keyOpRequest), keyResponseDeserializer(callback));
};

/**
* Retrieves the public portion of a key plus its attributes
* @param {string} keyIdentifier
* @param {function} callback
* @returns {Stream} The response stream.
*/
KeyVaultKeys.prototype.get = function(keyIdentifier, callback) {
    return this.keys.get(keyIdentifier, keyResponseDeserializer(callback));
};

/**
* Imports a key into the specified vault
* @param {string} keyIdentifier
* @param {object} keyOpRequest
* @param {function} callback
* @returns {Stream} The response stream.
*/
KeyVaultKeys.prototype.importMethod = function(keyIdentifier, keyOpRequest, callback) {
    return this.keys.importMethod(keyIdentifier, serializeKeyRequest(keyOpRequest), keyResponseDeserializer(callback));
};

/**
* List the keys in the vault
* @param {string} vault
* @param {Number} [top]
* @param {function} callback
* @returns {Stream} The response stream.
*/
KeyVaultKeys.prototype.list = function(vault, top, callback) {
    return this.keys.list(vault, top, keyResponseDeserializer(callback));
};

/**
* List the next page of keys in the vault
* @param {string} nextLink
* @param {function} callback
* @returns {Stream} The response stream.
*/
KeyVaultKeys.prototype.listNext = function(nextLink, callback) {
    return this.keys.listNext(nextLink, keyResponseDeserializer(callback));
};

/**
* List the versions of a key
* @param {string} vault
* @param {string} keyName
* @param {Number} [top]
* @param {function} callback
* @returns {Stream} The response stream.
*/
KeyVaultKeys.prototype.listVersions = function(vault, keyName, top, callback) {
    return this.keys.listVersions(vault, keyName, top, keyResponseDeserializer(callback));
};

/**
* List the next page of versions of a key
* @param {string} nextLink
* @param {function} callback
* @returns {Stream} The response stream.
*/
KeyVaultKeys.prototype.listVersionsNext = function(nextLink, callback) {
    return this.keys.listVersionsNext(nextLink, keyResponseDeserializer(callback));
};

/**
* Restores the backup key in to a vault
* @param {string} vault
* @param {object} keyOpRequest
* @param {function} callback
* @returns {Stream} The response stream.
*/
KeyVaultKeys.prototype.restore = function(vault, keyOpRequest, callback) {
    return this.keys.restore(vault, serializeKeyRequest(keyOpRequest), keyResponseDeserializer(callback));
};

/**
* Creates a signature from a digest using the specified key in the vault
* @param {string} keyIdentifier
* @param {object} keyOpRequest
* @param {function} callback
* @returns {Stream} The response stream.
*/
KeyVaultKeys.prototype.sign = function(keyIdentifier, keyOpRequest, callback) {
    return this.keys.sign(keyIdentifier, serializeKeyRequest(keyOpRequest), keyResponseDeserializer(callback));
};

/**
* Unwraps a symmetric key using the specified key in the vault
* @param {string} keyIdentifier
* @param {object} keyOpRequest
* @param {function} callback
* @returns {Stream} The response stream.
*/
KeyVaultKeys.prototype.unwrapKey = function(keyIdentifier, keyOpRequest, callback) {
    return this.keys.unwrapKey(keyIdentifier, serializeKeyRequest(keyOpRequest), keyResponseDeserializer(callback));
};

/**
* Updates the Key Attributes associated with the specified key
* @param {string} keyIdentifier
* @param {object} keyOpRequest
* @param {function} callback
* @returns {Stream} The response stream.
*/
KeyVaultKeys.prototype.update = function(keyIdentifier, keyOpRequest, callback) {
    return this.keys.update(keyIdentifier, serializeKeyRequest(keyOpRequest), keyResponseDeserializer(callback));
};

/**
* Verifies a signature using the specified key
* @param {string} keyIdentifier
* @param {object} keyOpRequest
* @param {function} callback
* @returns {Stream} The response stream.
*/
KeyVaultKeys.prototype.verify = function(keyIdentifier, keyOpRequest, callback) {
    return this.keys.verify(keyIdentifier, serializeKeyRequest(keyOpRequest), keyResponseDeserializer(callback));
};

/**
* Wraps a symmetric key using the specified key
* @param {string} keyIdentifier
* @param {object} keyOpRequest
* @param {function} callback
* @returns {Stream} The response stream.
*/
KeyVaultKeys.prototype.wrapKey = function(keyIdentifier, keyOpRequest, callback) {
    return this.keys.wrapKey(keyIdentifier, serializeKeyRequest(keyOpRequest), keyResponseDeserializer(callback));
};

function serializeKeyRequest(request) {
    return {
        rawJsonRequest: JSON.stringify(request)
    };
}

function keyResponseDeserializer(callback) {
    return function(err, response) {
        if (err) {
            return callback(err, null, response);
        }
        if (response.keyOpResponse) {
            return callback(null, JSON.parse(response.keyOpResponse), response);
        }
        return callback(new Error('Unrecognized response'), null, response);
    };
}

/** A class that performs operations on vault secrets.
*/
function KeyVaultSecrets(client) {
    this.secrets = client.internalClient.secrets;
}

/**
* Delete the specified secret
* @param {string} secretIdentifier
* @param {function} callback
* @returns {Stream} The response stream.
*/
KeyVaultSecrets.prototype.deleteMethod = function(secretIdentifier, callback) {
    return this.secrets.deleteMethod(secretIdentifier, secretResponseDeserializer(callback));
};

/**
* Gets a secret
* @param {string} secretIdentifier
* @param {function} callback
* @returns {Stream} The response stream.
*/
KeyVaultSecrets.prototype.get = function(secretIdentifier, callback) {
    return this.secrets.get(secretIdentifier, secretResponseDeserializer(callback));
};

/**
* List the secrets in the specified vault
* @param {string} vault
* @param {Number} [top]
* @param {function} callback
* @returns {Stream} The response stream.
*/
KeyVaultSecrets.prototype.list = function(vault, top, callback) {
    return this.secrets.list(vault, top, secretResponseDeserializer(callback));
};

/**
* List the next page of secrets in the specified vault
* @param {string} nextLink
* @param {function} callback
* @returns {Stream} The response stream.
*/
KeyVaultSecrets.prototype.listNext = function(nextLink, callback) {
    return this.secrets.listNext(nextLink, secretResponseDeserializer(callback));
};

/**
* List the versions of a secret in the specified vault
* @param {string} vault
* @param {string} secretName
* @param {Number} [top]
* @param {function} callback
* @returns {Stream} The response stream.
*/
KeyVaultSecrets.prototype.listVersions = function(vault, secretName, top, callback) {
    return this.secrets.listVersions(vault, secretName, top, secretResponseDeserializer(callback));
};

/**
* List the versions of a secret in the specified vault
* @param {string} nextLink
* @param {function} callback
* @returns {Stream} The response stream.
*/
KeyVaultSecrets.prototype.listVersionsNext = function(nextLink, callback) {
    return this.secrets.listVersionsNext(nextLink, secretResponseDeserializer(callback));
};

/**
* Sets a secret in the specified vault.
* @param {string} secretIdentifier
* @param {object} request
* @param {function} callback
* @returns {Stream} The response stream.
*/
KeyVaultSecrets.prototype.set = function(secretIdentifier, request, callback) {
    return this.secrets.set(secretIdentifier, serializeSecretRequest(request), secretResponseDeserializer(callback));
};

/**
* Update the specified secret
* @param {string} secretIdentifier
* @param {object} request
* @param {function} callback
* @returns {Stream} The response stream.
*/
KeyVaultSecrets.prototype.update = function(secretIdentifier, request, callback) {
    return this.secrets.update(secretIdentifier, serializeSecretRequest(request), secretResponseDeserializer(callback));
};

function serializeSecretRequest(request) {
    return {
        rawJsonRequest: JSON.stringify(request)
    };
}

function secretResponseDeserializer(callback) {
    return function(err, response) {
        if (err) {
            return callback(err, null, response);

        }
        if (response.response) {
            return callback(null, JSON.parse(response.response), response);
        }
        return callback(new Error('Unrecognized response'), null, response);
    };
}

exports.KeyVaultClient = KeyVaultClient;
