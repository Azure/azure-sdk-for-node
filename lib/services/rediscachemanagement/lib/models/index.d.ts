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
 * Initializes a new instance of the Sku class.
 * @constructor
 * SKU parameters supplied to the create Redis operation.
 *
 * @member {string} name The type of Redis cache to deploy. Valid values:
 * (Basic, Standard, Premium). Possible values include: 'Basic', 'Standard',
 * 'Premium'
 *
 * @member {string} family The SKU family to use. Valid values: (C, P). (C =
 * Basic/Standard, P = Premium). Possible values include: 'C', 'P'
 *
 * @member {number} capacity The size of the Redis cache to deploy. Valid
 * values: for C (Basic/Standard) family (0, 1, 2, 3, 4, 5, 6), for P (Premium)
 * family (1, 2, 3, 4).
 *
 */
export interface Sku {
  name: string;
  family: string;
  capacity: number;
}

/**
 * @class
 * Initializes a new instance of the Resource class.
 * @constructor
 * The Resource definition.
 *
 * @member {string} [id] Resource ID.
 *
 * @member {string} [name] Resource name.
 *
 * @member {string} [type] Resource type.
 *
 * @member {string} location Resource location.
 *
 * @member {object} [tags] Resource tags.
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
 * Initializes a new instance of the RedisCreateParameters class.
 * @constructor
 * Parameters supplied to the Create Redis operation.
 *
 * @member {object} [redisConfiguration] All Redis Settings. Few possible keys:
 * rdb-backup-enabled,rdb-storage-connection-string,rdb-backup-frequency,maxmemory-delta,maxmemory-policy,notify-keyspace-events,maxmemory-samples,slowlog-log-slower-than,slowlog-max-len,list-max-ziplist-entries,list-max-ziplist-value,hash-max-ziplist-entries,hash-max-ziplist-value,set-max-intset-entries,zset-max-ziplist-entries,zset-max-ziplist-value
 * etc.
 *
 * @member {boolean} [enableNonSslPort] Specifies whether the non-ssl Redis
 * server port (6379) is enabled.
 *
 * @member {object} [tenantSettings] tenantSettings
 *
 * @member {number} [shardCount] The number of shards to be created on a
 * Premium Cluster Cache.
 *
 * @member {string} [subnetId] The full resource ID of a subnet in a virtual
 * network to deploy the Redis cache in. Example format:
 * /subscriptions/{subid}/resourceGroups/{resourceGroupName}/Microsoft.{Network|ClassicNetwork}/VirtualNetworks/vnet1/subnets/subnet1
 *
 * @member {string} [staticIP] Static IP address. Required when deploying a
 * Redis cache inside an existing Azure Virtual Network.
 *
 * @member {object} sku The SKU of the Redis cache to deploy.
 *
 * @member {string} [sku.name] The type of Redis cache to deploy. Valid values:
 * (Basic, Standard, Premium). Possible values include: 'Basic', 'Standard',
 * 'Premium'
 *
 * @member {string} [sku.family] The SKU family to use. Valid values: (C, P).
 * (C = Basic/Standard, P = Premium). Possible values include: 'C', 'P'
 *
 * @member {number} [sku.capacity] The size of the Redis cache to deploy. Valid
 * values: for C (Basic/Standard) family (0, 1, 2, 3, 4, 5, 6), for P (Premium)
 * family (1, 2, 3, 4).
 *
 */
export interface RedisCreateParameters extends Resource {
  redisConfiguration?: { [propertyName: string]: string };
  enableNonSslPort?: boolean;
  tenantSettings?: { [propertyName: string]: string };
  shardCount?: number;
  subnetId?: string;
  staticIP?: string;
  sku: Sku;
}

/**
 * @class
 * Initializes a new instance of the RedisUpdateParameters class.
 * @constructor
 * Parameters supplied to the Update Redis operation.
 *
 * @member {object} [redisConfiguration] All Redis Settings. Few possible keys:
 * rdb-backup-enabled,rdb-storage-connection-string,rdb-backup-frequency,maxmemory-delta,maxmemory-policy,notify-keyspace-events,maxmemory-samples,slowlog-log-slower-than,slowlog-max-len,list-max-ziplist-entries,list-max-ziplist-value,hash-max-ziplist-entries,hash-max-ziplist-value,set-max-intset-entries,zset-max-ziplist-entries,zset-max-ziplist-value
 * etc.
 *
 * @member {boolean} [enableNonSslPort] Specifies whether the non-ssl Redis
 * server port (6379) is enabled.
 *
 * @member {object} [tenantSettings] tenantSettings
 *
 * @member {number} [shardCount] The number of shards to be created on a
 * Premium Cluster Cache.
 *
 * @member {string} [subnetId] The full resource ID of a subnet in a virtual
 * network to deploy the Redis cache in. Example format:
 * /subscriptions/{subid}/resourceGroups/{resourceGroupName}/Microsoft.{Network|ClassicNetwork}/VirtualNetworks/vnet1/subnets/subnet1
 *
 * @member {string} [staticIP] Static IP address. Required when deploying a
 * Redis cache inside an existing Azure Virtual Network.
 *
 * @member {object} [sku] The SKU of the Redis cache to deploy.
 *
 * @member {string} [sku.name] The type of Redis cache to deploy. Valid values:
 * (Basic, Standard, Premium). Possible values include: 'Basic', 'Standard',
 * 'Premium'
 *
 * @member {string} [sku.family] The SKU family to use. Valid values: (C, P).
 * (C = Basic/Standard, P = Premium). Possible values include: 'C', 'P'
 *
 * @member {number} [sku.capacity] The size of the Redis cache to deploy. Valid
 * values: for C (Basic/Standard) family (0, 1, 2, 3, 4, 5, 6), for P (Premium)
 * family (1, 2, 3, 4).
 *
 * @member {object} [tags] Resource tags.
 *
 */
export interface RedisUpdateParameters {
  redisConfiguration?: { [propertyName: string]: string };
  enableNonSslPort?: boolean;
  tenantSettings?: { [propertyName: string]: string };
  shardCount?: number;
  subnetId?: string;
  staticIP?: string;
  sku?: Sku;
  tags?: { [propertyName: string]: string };
}

/**
 * @class
 * Initializes a new instance of the RedisAccessKeys class.
 * @constructor
 * Redis cache access keys.
 *
 * @member {string} [primaryKey] The current primary key that clients can use
 * to authenticate with Redis cache.
 *
 * @member {string} [secondaryKey] The current secondary key that clients can
 * use to authenticate with Redis cache.
 *
 */
export interface RedisAccessKeys {
  primaryKey?: string;
  secondaryKey?: string;
}

/**
 * @class
 * Initializes a new instance of the RedisFirewallRule class.
 * @constructor
 * A firewall rule on a redis cache has a name, and describes a contiguous
 * range of IP addresses permitted to connect
 *
 * @member {string} [id] resource ID (of the firewall rule)
 *
 * @member {string} [name] name of the firewall rule
 *
 * @member {string} [type] type (of the firewall rule resource =
 * 'Microsoft.Cache/redis/firewallRule')
 *
 * @member {string} startIP lowest IP address included in the range
 *
 * @member {string} endIP highest IP address included in the range
 *
 */
export interface RedisFirewallRule {
  id?: string;
  name?: string;
  type?: string;
  startIP: string;
  endIP: string;
}

/**
 * @class
 * Initializes a new instance of the RedisFirewallRuleListResult class.
 * @constructor
 * The response of list firewall rules Redis operation.
 *
 * @member {array} value Results of the list firewall rules operation.
 *
 * @member {string} [nextLink] Link for next set of locations.
 *
 */
export interface RedisFirewallRuleListResult {
  value: RedisFirewallRule[];
  nextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the RedisResource class.
 * @constructor
 * A single Redis item in List or Get Operation.
 *
 * @member {object} [redisConfiguration] All Redis Settings. Few possible keys:
 * rdb-backup-enabled,rdb-storage-connection-string,rdb-backup-frequency,maxmemory-delta,maxmemory-policy,notify-keyspace-events,maxmemory-samples,slowlog-log-slower-than,slowlog-max-len,list-max-ziplist-entries,list-max-ziplist-value,hash-max-ziplist-entries,hash-max-ziplist-value,set-max-intset-entries,zset-max-ziplist-entries,zset-max-ziplist-value
 * etc.
 *
 * @member {boolean} [enableNonSslPort] Specifies whether the non-ssl Redis
 * server port (6379) is enabled.
 *
 * @member {object} [tenantSettings] tenantSettings
 *
 * @member {number} [shardCount] The number of shards to be created on a
 * Premium Cluster Cache.
 *
 * @member {string} [subnetId] The full resource ID of a subnet in a virtual
 * network to deploy the Redis cache in. Example format:
 * /subscriptions/{subid}/resourceGroups/{resourceGroupName}/Microsoft.{Network|ClassicNetwork}/VirtualNetworks/vnet1/subnets/subnet1
 *
 * @member {string} [staticIP] Static IP address. Required when deploying a
 * Redis cache inside an existing Azure Virtual Network.
 *
 * @member {object} [sku] The SKU of the Redis cache to deploy.
 *
 * @member {string} [sku.name] The type of Redis cache to deploy. Valid values:
 * (Basic, Standard, Premium). Possible values include: 'Basic', 'Standard',
 * 'Premium'
 *
 * @member {string} [sku.family] The SKU family to use. Valid values: (C, P).
 * (C = Basic/Standard, P = Premium). Possible values include: 'C', 'P'
 *
 * @member {number} [sku.capacity] The size of the Redis cache to deploy. Valid
 * values: for C (Basic/Standard) family (0, 1, 2, 3, 4, 5, 6), for P (Premium)
 * family (1, 2, 3, 4).
 *
 * @member {string} [redisVersion] Redis version.
 *
 * @member {string} [provisioningState] Redis instance provisioning status.
 *
 * @member {string} [hostName] Redis host name.
 *
 * @member {number} [port] Redis non-SSL port.
 *
 * @member {number} [sslPort] Redis SSL port.
 *
 * @member {object} [accessKeys] The keys of the Redis cache - not set if this
 * object is not the response to Create or Update redis cache
 *
 * @member {string} [accessKeys.primaryKey] The current primary key that
 * clients can use to authenticate with Redis cache.
 *
 * @member {string} [accessKeys.secondaryKey] The current secondary key that
 * clients can use to authenticate with Redis cache.
 *
 */
export interface RedisResource extends Resource {
  redisConfiguration?: { [propertyName: string]: string };
  enableNonSslPort?: boolean;
  tenantSettings?: { [propertyName: string]: string };
  shardCount?: number;
  subnetId?: string;
  staticIP?: string;
  sku?: Sku;
  redisVersion?: string;
  provisioningState?: string;
  hostName?: string;
  port?: number;
  sslPort?: number;
  accessKeys?: RedisAccessKeys;
}

/**
 * @class
 * Initializes a new instance of the RedisListResult class.
 * @constructor
 * The response of list Redis operation.
 *
 * @member {array} [value] List of Redis cache instances.
 *
 * @member {string} [nextLink] Link for next set of locations.
 *
 */
export interface RedisListResult {
  value?: RedisResource[];
  nextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the RedisRegenerateKeyParameters class.
 * @constructor
 * Specifies which Redis access keys to reset.
 *
 * @member {string} keyType The Redis access key to regenerate. Possible values
 * include: 'Primary', 'Secondary'
 *
 */
export interface RedisRegenerateKeyParameters {
  keyType: string;
}

/**
 * @class
 * Initializes a new instance of the RedisRebootParameters class.
 * @constructor
 * Specifies which Redis node(s) to reboot.
 *
 * @member {string} rebootType Which Redis node(s) to reboot. Depending on this
 * value data loss is possible. Possible values include: 'PrimaryNode',
 * 'SecondaryNode', 'AllNodes'
 *
 * @member {number} [shardId] If clustering is enabled, the ID of the shard to
 * be rebooted.
 *
 */
export interface RedisRebootParameters {
  rebootType: string;
  shardId?: number;
}

/**
 * @class
 * Initializes a new instance of the ExportRDBParameters class.
 * @constructor
 * Parameters for Redis export operation.
 *
 * @member {string} [format] File format.
 *
 * @member {string} prefix Prefix to use for exported files.
 *
 * @member {string} container Container name to export to.
 *
 */
export interface ExportRDBParameters {
  format?: string;
  prefix: string;
  container: string;
}

/**
 * @class
 * Initializes a new instance of the ImportRDBParameters class.
 * @constructor
 * Parameters for Redis import operation.
 *
 * @member {string} [format] File format.
 *
 * @member {array} files files to import.
 *
 */
export interface ImportRDBParameters {
  format?: string;
  files: string[];
}

/**
 * @class
 * Initializes a new instance of the ScheduleEntry class.
 * @constructor
 * Patch schedule entry for a Premium Redis Cache.
 *
 * @member {string} dayOfWeek Day of the week when a cache can be patched.
 * Possible values include: 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
 * 'Friday', 'Saturday', 'Sunday', 'Everyday', 'Weekend'
 *
 * @member {number} startHourUtc Start hour after which cache patching can
 * start.
 *
 * @member {moment.duration} [maintenanceWindow] ISO8601 timespan specifying
 * how much time cache patching can take.
 *
 */
export interface ScheduleEntry {
  dayOfWeek: string;
  startHourUtc: number;
  maintenanceWindow?: moment.Duration;
}

/**
 * @class
 * Initializes a new instance of the RedisPatchSchedule class.
 * @constructor
 * Response to put/get patch schedules for Redis cache.
 *
 * @member {string} [id] Resource ID.
 *
 * @member {string} [name] Resource name.
 *
 * @member {string} [type] Resource type.
 *
 * @member {string} [location] Resource location.
 *
 * @member {array} scheduleEntries List of patch schedules for a Redis cache.
 *
 */
export interface RedisPatchSchedule {
  id?: string;
  name?: string;
  type?: string;
  location?: string;
  scheduleEntries: ScheduleEntry[];
}

/**
 * @class
 * Initializes a new instance of the RedisForceRebootResponse class.
 * @constructor
 * Response to force reboot for Redis cache.
 *
 * @member {string} [message] Status message
 *
 */
export interface RedisForceRebootResponse {
  message?: string;
}

/**
 * @class
 * Initializes a new instance of the OperationDisplay class.
 * @constructor
 * The object that describes the operation.
 *
 * @member {string} [provider] Friendly name of the resource provider
 *
 * @member {string} [operation] Operation type: read, write, delete,
 * listKeys/action, etc.
 *
 * @member {string} [resource] Resource type on which the operation is
 * performed.
 *
 * @member {string} [description] Friendly name of the operation
 *
 */
export interface OperationDisplay {
  provider?: string;
  operation?: string;
  resource?: string;
  description?: string;
}

/**
 * @class
 * Initializes a new instance of the Operation class.
 * @constructor
 * REST API operation
 *
 * @member {string} [name] Operation name: {provider}/{resource}/{operation}
 *
 * @member {object} [display] The object that describes the operation.
 *
 * @member {string} [display.provider] Friendly name of the resource provider
 *
 * @member {string} [display.operation] Operation type: read, write, delete,
 * listKeys/action, etc.
 *
 * @member {string} [display.resource] Resource type on which the operation is
 * performed.
 *
 * @member {string} [display.description] Friendly name of the operation
 *
 */
export interface Operation {
  name?: string;
  display?: OperationDisplay;
}

/**
 * @class
 * Initializes a new instance of the OperationListResult class.
 * @constructor
 * Result of the request to list REST API operations. It contains a list of
 * operations and a URL nextLink to get the next set of results.
 *
 * @member {array} [value] List of operations supported by the resource
 * provider.
 *
 * @member {string} [nextLink] URL to get the next set of operation list
 * results if there are any.
 *
 */
export interface OperationListResult {
  value?: Operation[];
  nextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the OperationListResult class.
 * @constructor
 * Result of the request to list REST API operations. It contains a list of
 * operations and a URL nextLink to get the next set of results.
 *
 * @member {array} [value] List of operations supported by the resource
 * provider.
 *
 * @member {string} [nextLink] URL to get the next set of operation list
 * results if there are any.
 *
 */
export interface OperationListResult {
  value?: Operation[];
  nextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the RedisListResult class.
 * @constructor
 * The response of list Redis operation.
 *
 * @member {array} [value] List of Redis cache instances.
 *
 * @member {string} [nextLink] Link for next set of locations.
 *
 */
export interface RedisListResult {
  value?: RedisResource[];
  nextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the RedisFirewallRuleListResult class.
 * @constructor
 * The response of list firewall rules Redis operation.
 *
 * @member {array} value Results of the list firewall rules operation.
 *
 * @member {string} [nextLink] Link for next set of locations.
 *
 */
export interface RedisFirewallRuleListResult {
  value: RedisFirewallRule[];
  nextLink?: string;
}


/**
 * @class
 * Initializes a new instance of the OperationListResult class.
 * @constructor
 * Result of the request to list REST API operations. It contains a list of
 * operations and a URL nextLink to get the next set of results.
 *
 * @member {string} [nextLink] URL to get the next set of operation list
 * results if there are any.
 *
 */
export interface OperationListResult extends Array<Operation> {
  nextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the RedisListResult class.
 * @constructor
 * The response of list Redis operation.
 *
 * @member {string} [nextLink] Link for next set of locations.
 *
 */
export interface RedisListResult extends Array<RedisResource> {
  nextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the RedisFirewallRuleListResult class.
 * @constructor
 * The response of list firewall rules Redis operation.
 *
 * @member {string} [nextLink] Link for next set of locations.
 *
 */
export interface RedisFirewallRuleListResult extends Array<RedisFirewallRule> {
  nextLink?: string;
}
