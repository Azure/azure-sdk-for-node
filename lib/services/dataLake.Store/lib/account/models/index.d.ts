/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */

import * as msRestAzure from 'ms-rest-azure';
exports.BaseResource = msRestAzure.BaseResource;
exports.CloudError = msRestAzure.CloudError;

/**
 * @class
 * Initializes a new instance of the SubResource class.
 * @constructor
 * The Resource model definition for a nested resource.
 *
 * @member {string} [id] Resource Id
 *
 * @member {string} [name] Resource name
 *
 * @member {string} [type] Resource type
 *
 */
export interface SubResource {
  id?: string;
  name?: string;
  type?: string;
}

/**
 * @class
 * Initializes a new instance of the FirewallRule class.
 * @constructor
 * Data Lake Store firewall rule information
 *
 * @member {string} startIpAddress the start IP address for the firewall rule.
 *
 * @member {string} endIpAddress the end IP address for the firewall rule.
 *
 */
export interface FirewallRule extends SubResource {
  startIpAddress: string;
  endIpAddress: string;
}

/**
 * @class
 * Initializes a new instance of the TrustedIdProvider class.
 * @constructor
 * Data Lake Store firewall rule information
 *
 * @member {string} idProvider The URL of this trusted identity provider
 *
 */
export interface TrustedIdProvider extends SubResource {
  idProvider: string;
}

/**
 * @class
 * Initializes a new instance of the DataLakeStoreTrustedIdProviderListResult class.
 * @constructor
 * Data Lake Store trusted identity provider list information.
 *
 * @member {array} [value] the results of the list operation
 *
 * @member {string} [nextLink] the link (url) to the next page of results.
 *
 */
export interface DataLakeStoreTrustedIdProviderListResult {
  value?: TrustedIdProvider[];
  nextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the DataLakeStoreFirewallRuleListResult class.
 * @constructor
 * Data Lake Store firewall rule list information.
 *
 * @member {array} [value] the results of the list operation
 *
 * @member {string} [nextLink] the link (url) to the next page of results.
 *
 */
export interface DataLakeStoreFirewallRuleListResult {
  value?: FirewallRule[];
  nextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the EncryptionIdentity class.
 * @constructor
 * The encryption identity properties.
 *
 * @member {uuid} [principalId] The principal identifier associated with the
 * encryption.
 *
 * @member {uuid} [tenantId] The tenant identifier associated with the
 * encryption.
 *
 */
export interface EncryptionIdentity {
  principalId?: string;
  tenantId?: string;
}

/**
 * @class
 * Initializes a new instance of the KeyVaultMetaInfo class.
 * @constructor
 * Metadata information used by account encryption.
 *
 * @member {string} keyVaultResourceId The resource identifier for the user
 * managed Key Vault being used to encrypt.
 *
 * @member {string} encryptionKeyName The name of the user managed encryption
 * key.
 *
 * @member {string} encryptionKeyVersion The version of the user managed
 * encryption key.
 *
 */
export interface KeyVaultMetaInfo {
  keyVaultResourceId: string;
  encryptionKeyName: string;
  encryptionKeyVersion: string;
}

/**
 * @class
 * Initializes a new instance of the EncryptionConfig class.
 * @constructor
 * The encryption configuration for the account.
 *
 * @member {string} type The type of encryption configuration being used.
 * Currently the only supported types are 'UserManaged' and 'ServiceManaged'.
 * Possible values include: 'UserManaged', 'ServiceManaged'
 *
 * @member {object} [keyVaultMetaInfo] The Key vault information for connecting
 * to user managed encryption keys.
 *
 * @member {string} [keyVaultMetaInfo.keyVaultResourceId] The resource
 * identifier for the user managed Key Vault being used to encrypt.
 *
 * @member {string} [keyVaultMetaInfo.encryptionKeyName] The name of the user
 * managed encryption key.
 *
 * @member {string} [keyVaultMetaInfo.encryptionKeyVersion] The version of the
 * user managed encryption key.
 *
 */
export interface EncryptionConfig {
  type: string;
  keyVaultMetaInfo?: KeyVaultMetaInfo;
}

/**
 * @class
 * Initializes a new instance of the DataLakeStoreAccountUpdateParameters class.
 * @constructor
 * Data Lake Store account information to update
 *
 * @member {object} [tags] Resource tags
 *
 * @member {string} [firewallState] The current state of the IP address
 * firewall for this Data Lake store account. Disabling the firewall does not
 * remove existing rules, they will just be ignored until the firewall is
 * re-enabled. Possible values include: 'Enabled', 'Disabled'
 *
 * @member {string} [trustedIdProviderState] The current state of the trusted
 * identity provider feature for this Data Lake store account. Disabling
 * trusted identity provider functionality does not remove the providers, they
 * will just be ignored until this feature is re-enabled. Possible values
 * include: 'Enabled', 'Disabled'
 *
 * @member {string} [defaultGroup] the default owner group for all new folders
 * and files created in the Data Lake Store account.
 *
 * @member {string} [newTier] the billing tier to use for next month. Possible
 * values include: 'Consumption', 'Commitment_1TB', 'Commitment_10TB',
 * 'Commitment_100TB', 'Commitment_500TB', 'Commitment_1PB', 'Commitment_5PB'
 *
 */
export interface DataLakeStoreAccountUpdateParameters {
  tags?: { [propertyName: string]: string };
  firewallState?: string;
  trustedIdProviderState?: string;
  defaultGroup?: string;
  newTier?: string;
}

/**
 * @class
 * Initializes a new instance of the Resource class.
 * @constructor
 * The Resource model definition.
 *
 * @member {string} [id] Resource Id
 *
 * @member {string} [name] Resource name
 *
 * @member {string} [type] Resource type
 *
 * @member {string} location Resource location
 *
 * @member {object} [tags] Resource tags
 *
 */
export interface Resource extends BaseResource {
  id?: string;
  name?: string;
  type?: string;
  location: string;
  tags?: { [propertyName: string]: string };
}

/**
 * @class
 * Initializes a new instance of the DataLakeStoreAccount class.
 * @constructor
 * Data Lake Store account information
 *
 * @member {object} [identity] The Key vault encryption identity, if any.
 *
 * @member {uuid} [identity.principalId] The principal identifier associated
 * with the encryption.
 *
 * @member {uuid} [identity.tenantId] The tenant identifier associated with the
 * encryption.
 *
 * @member {string} [provisioningState] the status of the Data Lake Store
 * account while being provisioned. Possible values include: 'Failed',
 * 'Creating', 'Running', 'Succeeded', 'Patching', 'Suspending', 'Resuming',
 * 'Deleting', 'Deleted'
 *
 * @member {string} [state] the status of the Data Lake Store account after
 * provisioning has completed. Possible values include: 'Active', 'Suspended'
 *
 * @member {date} [creationTime] the account creation time.
 *
 * @member {string} [encryptionState] The current state of encryption for this
 * Data Lake store account. Possible values include: 'Enabled', 'Disabled'
 *
 * @member {string} [encryptionProvisioningState] The current state of
 * encryption provisioning for this Data Lake store account. Possible values
 * include: 'Creating', 'Succeeded'
 *
 * @member {object} [encryptionConfig] The Key vault encryption configuration.
 *
 * @member {string} [encryptionConfig.type] The type of encryption
 * configuration being used. Currently the only supported types are
 * 'UserManaged' and 'ServiceManaged'. Possible values include: 'UserManaged',
 * 'ServiceManaged'
 *
 * @member {object} [encryptionConfig.keyVaultMetaInfo] The Key vault
 * information for connecting to user managed encryption keys.
 *
 * @member {string} [encryptionConfig.keyVaultMetaInfo.keyVaultResourceId] The
 * resource identifier for the user managed Key Vault being used to encrypt.
 *
 * @member {string} [encryptionConfig.keyVaultMetaInfo.encryptionKeyName] The
 * name of the user managed encryption key.
 *
 * @member {string} [encryptionConfig.keyVaultMetaInfo.encryptionKeyVersion]
 * The version of the user managed encryption key.
 *
 * @member {string} [firewallState] The current state of the IP address
 * firewall for this Data Lake store account. Possible values include:
 * 'Enabled', 'Disabled'
 *
 * @member {array} [firewallRules] The list of firewall rules associated with
 * this Data Lake store account.
 *
 * @member {string} [trustedIdProviderState] The current state of the trusted
 * identity provider feature for this Data Lake store account. Possible values
 * include: 'Enabled', 'Disabled'
 *
 * @member {array} [trustedIdProviders] The list of trusted identity providers
 * associated with this Data Lake store account.
 *
 * @member {date} [lastModifiedTime] the account last modified time.
 *
 * @member {string} [endpoint] the gateway host.
 *
 * @member {string} [defaultGroup] the default owner group for all new folders
 * and files created in the Data Lake Store account.
 *
 * @member {string} [newTier] the billing tier to use for next month. Possible
 * values include: 'Consumption', 'Commitment_1TB', 'Commitment_10TB',
 * 'Commitment_100TB', 'Commitment_500TB', 'Commitment_1PB', 'Commitment_5PB'
 *
 * @member {string} [currentTier] the billing tier in use for the current
 * month. Possible values include: 'Consumption', 'Commitment_1TB',
 * 'Commitment_10TB', 'Commitment_100TB', 'Commitment_500TB', 'Commitment_1PB',
 * 'Commitment_5PB'
 *
 */
export interface DataLakeStoreAccount extends Resource {
  identity?: EncryptionIdentity;
  provisioningState?: string;
  state?: string;
  creationTime?: Date;
  encryptionState?: string;
  encryptionProvisioningState?: string;
  encryptionConfig?: EncryptionConfig;
  firewallState?: string;
  firewallRules?: FirewallRule[];
  trustedIdProviderState?: string;
  trustedIdProviders?: TrustedIdProvider[];
  lastModifiedTime?: Date;
  endpoint?: string;
  defaultGroup?: string;
  newTier?: string;
  currentTier?: string;
}

/**
 * @class
 * Initializes a new instance of the DataLakeStoreAccountListResult class.
 * @constructor
 * Data Lake Store account list information response.
 *
 * @member {array} [value] the results of the list operation
 *
 * @member {string} [nextLink] the link (url) to the next page of results.
 *
 */
export interface DataLakeStoreAccountListResult {
  value?: DataLakeStoreAccount[];
  nextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the ErrorDetails class.
 * @constructor
 * Data Lake Store error details information
 *
 * @member {string} [code] the HTTP status code or error code associated with
 * this error
 *
 * @member {string} [message] the error message localized based on
 * Accept-Language
 *
 * @member {string} [target] the target of the particular error (for example,
 * the name of the property in error).
 *
 */
export interface ErrorDetails {
  code?: string;
  message?: string;
  target?: string;
}

/**
 * @class
 * Initializes a new instance of the DataLakeStoreFirewallRuleListResult class.
 * @constructor
 * Data Lake Store firewall rule list information.
 *
 * @member {array} [value] the results of the list operation
 *
 * @member {string} [nextLink] the link (url) to the next page of results.
 *
 */
export interface DataLakeStoreFirewallRuleListResult {
  value?: FirewallRule[];
  nextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the DataLakeStoreTrustedIdProviderListResult class.
 * @constructor
 * Data Lake Store trusted identity provider list information.
 *
 * @member {array} [value] the results of the list operation
 *
 * @member {string} [nextLink] the link (url) to the next page of results.
 *
 */
export interface DataLakeStoreTrustedIdProviderListResult {
  value?: TrustedIdProvider[];
  nextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the DataLakeStoreAccountListResult class.
 * @constructor
 * Data Lake Store account list information response.
 *
 * @member {array} [value] the results of the list operation
 *
 * @member {string} [nextLink] the link (url) to the next page of results.
 *
 */
export interface DataLakeStoreAccountListResult {
  value?: DataLakeStoreAccount[];
  nextLink?: string;
}


/**
 * @class
 * Initializes a new instance of the DataLakeStoreFirewallRuleListResult class.
 * @constructor
 * Data Lake Store firewall rule list information.
 *
 * @member {string} [nextLink] the link (url) to the next page of results.
 *
 */
export interface DataLakeStoreFirewallRuleListResult extends Array<FirewallRule> {
  nextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the DataLakeStoreTrustedIdProviderListResult class.
 * @constructor
 * Data Lake Store trusted identity provider list information.
 *
 * @member {string} [nextLink] the link (url) to the next page of results.
 *
 */
export interface DataLakeStoreTrustedIdProviderListResult extends Array<TrustedIdProvider> {
  nextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the DataLakeStoreAccountListResult class.
 * @constructor
 * Data Lake Store account list information response.
 *
 * @member {string} [nextLink] the link (url) to the next page of results.
 *
 */
export interface DataLakeStoreAccountListResult extends Array<DataLakeStoreAccount> {
  nextLink?: string;
}
