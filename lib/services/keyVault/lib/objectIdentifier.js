var url = require('url');
var util = require('util');


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

  if (typeof collection != 'string' || !(collection = collection.trim())) {
    throw new Error('Invalid collection argument');
  }

  if (typeof vault != 'string' || !(vault = vault.trim())) {
    throw new Error('Invalid vault argument');
  }

  if (typeof name != 'string' || !(name = name.trim())) {
    throw new Error('Invalid name argument');
  }

  if (version && typeof version != 'string') {
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

function parseObjectIdentifier(collection, identifier) {

  if (typeof collection != 'string' || !(collection = collection.trim())) {
    throw new Error('Invalid collection argument');
  }

  if (typeof identifier != 'string' || !(identifier = identifier.trim())) {
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

/** Creates an ObjectIdentifier object for a key.
 @param {string} vault The vault URI.
 @param {string} name The key name.
 @param {string} [version=null] The object version.
 @return {ObjectIdentifier} An object that represents the key identifier.
*/
module.exports.createKeyIdentifier = function (vault, name, version) {
    return createObjectIdentifier('keys', vault, name, version);
};

/** Parses a string containing a key identifier and returns the ObjectIdentifier object.
 @param {string} identifier The key identifier (an URI).
 @return {ObjectIdentifier} An object that represents the key identifier.
*/
module.exports.parseKeyIdentifier = function (identifier) {
    return parseObjectIdentifier('keys', identifier);
};

/** Creates an ObjectIdentifier object for a secret.
 @param {string} vault The vault URI.
 @param {string} name The secret name.
 @param {string} [version=null] The object version.
 @return {ObjectIdentifier} An object that represents the secret identifier.
*/
module.exports.createSecretIdentifier = function (vault, name, version) {
    return createObjectIdentifier('secrets', vault, name, version);
};

/** Parses a string containing a secret identifier and returns the ObjectIdentifier object.
 @param {string} identifier The secret identifier (an URI).
 @return {ObjectIdentifier} An object that represents the secret identifier.
*/
module.exports.parseSecretIdentifier = function (identifier) {
    return parseObjectIdentifier('secrets', identifier);
};

/** Creates an ObjectIdentifier object for a certificate.
 @param {string} vault The vault URI.
 @param {string} name The certificate name.
 @param {string} [version=null] The object version.
 @return {ObjectIdentifier} An object that represents the certificate identifier.
*/
module.exports.createCertificateIdentifier = function (vault, name, version) {
    return createObjectIdentifier('certificates', vault, name, version);
};

/** Parses a string containing a certificate identifier and returns the ObjectIdentifier object.
 @param {string} identifier The certificate identifier (an URI).
 @return {ObjectIdentifier} An object that represents the certificate identifier.
*/
module.exports.parseCertificateIdentifier = function (identifier) {
    return parseObjectIdentifier('certificates', identifier);
};

/** Creates an ObjectIdentifier object for a certificate operation.
 @param {string} vault The vault URI.
 @param {string} name The certificate name.
 @return {ObjectIdentifier} An object that represents the certificate identifier.
*/
module.exports.createCertificateOperationIdentifier = function (vault, name) {
    var objId = createObjectIdentifier('certificates', vault, name, 'pending');
    objId.baseIdentifier = objId.identifier;
    objId.version = null;
    return objId;
};

/** Parses a string containing a certificate identifier and returns the ObjectIdentifier object.
 @param {string} identifier The certificate identifier (an URI).
 @return {ObjectIdentifier} An object that represents the certificate identifier.
*/
module.exports.parseCertificateOperationIdentifier = function (identifier) {
    var objId = parseObjectIdentifier('certificates', identifier);
    objId.baseIdentifier = objId.identifier;
    objId.version = null;
    return objId;
};

/** Creates an ObjectIdentifier object for a certificate issuer.
 @param {string} vault The vault URI.
 @param {string} name The certificate issuer name.
 @return {ObjectIdentifier} An object that represents the certificate issuer identifier.
*/
module.exports.createIssuerIdentifier = function (vault, name) {
    return createObjectIdentifier('certificates/issuers', vault, name);
};

/** Parses a string containing a certificate issuer identifier and returns the ObjectIdentifier object.
 @param {string} identifier The certificate issuer identifier (an URI).
 @return {ObjectIdentifier} An object that represents the certificate issuer identifier.
*/
module.exports.parseIssuerIdentifier = function (identifier) {
    var baseUri;
    try {
        baseUri = url.parse(identifier, true, true);
    } catch (e) {
        throw new Error(util.format('Invalid %s identifier: %s. Not a valid URI', 'issuer', identifier));
    }
    
    // Path is of the form '/certificate/issuer/name'
    var segments = baseUri.pathname.split('/');
    if (segments.length !== 4) {
        throw new Error(util.format('Invalid %s identifier: %s. Bad number of segments: %d', 'issuer', identifier, segments.length));
    }
    
    if ('certificates' !== segments[1]) {
        throw new Error(util.format('Invalid %s identifier: %s. segment [1] should be "%s", found "%s"', 'issuer', identifier, 'certificates', segments[1]));
    }
    
    if ('issuers' !== segments[2]) {
        throw new Error(util.format('Invalid %s identifier: %s. segment [2] should be "%s", found "%s"', 'issuer', identifier, 'issuers', segments[1]));
    }
    
    var vault = util.format('%s//%s', baseUri.protocol, baseUri.host);
    var name = segments[3];
    return new ObjectIdentifier('certificates/issuers', vault, name, null);
};