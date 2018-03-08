/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 */

import * as msRest from 'ms-rest';
import * as msRestAzure from 'ms-rest-azure';
import * as Models from './models';
import KeyVaultClientBase = require('./keyVaultClient');
export { Models };


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
export class KeyVaultClient extends KeyVaultClientBase{
  constructor(credentials: msRestAzure.KeyVaultCredentials, options?: msRestAzure.AzureServiceClientOptions);

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

export function createKeyVaultClient(credentials: msRestAzure.KeyVaultCredentials, options: msRestAzure.AzureServiceClientOptions): KeyVaultClient;

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
