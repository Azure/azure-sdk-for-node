/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
*/

import { ServiceClientOptions, RequestOptions, ServiceCallback } from 'ms-rest';
import * as models from '../models';


/**
 * @class
 * RedisOperations
 * __NOTE__: An instance of this class is automatically created for an
 * instance of the RedisManagementClient.
 */
export interface RedisOperations {

    /**
     * Create or replace (overwrite/recreate, with potential downtime) an existing
     * Redis cache.
     *
     * @param {string} resourceGroupName The name of the resource group.
     *
     * @param {string} name The name of the Redis cache.
     *
     * @param {object} parameters Parameters supplied to the Create Redis
     * operation.
     *
     * @param {object} [parameters.redisConfiguration] All Redis Settings. Few
     * possible keys:
     * rdb-backup-enabled,rdb-storage-connection-string,rdb-backup-frequency,maxmemory-delta,maxmemory-policy,notify-keyspace-events,maxmemory-samples,slowlog-log-slower-than,slowlog-max-len,list-max-ziplist-entries,list-max-ziplist-value,hash-max-ziplist-entries,hash-max-ziplist-value,set-max-intset-entries,zset-max-ziplist-entries,zset-max-ziplist-value
     * etc.
     *
     * @param {boolean} [parameters.enableNonSslPort] Specifies whether the non-ssl
     * Redis server port (6379) is enabled.
     *
     * @param {object} [parameters.tenantSettings] tenantSettings
     *
     * @param {number} [parameters.shardCount] The number of shards to be created
     * on a Premium Cluster Cache.
     *
     * @param {string} [parameters.subnetId] The full resource ID of a subnet in a
     * virtual network to deploy the Redis cache in. Example format:
     * /subscriptions/{subid}/resourceGroups/{resourceGroupName}/Microsoft.{Network|ClassicNetwork}/VirtualNetworks/vnet1/subnets/subnet1
     *
     * @param {string} [parameters.staticIP] Static IP address. Required when
     * deploying a Redis cache inside an existing Azure Virtual Network.
     *
     * @param {object} parameters.sku The SKU of the Redis cache to deploy.
     *
     * @param {string} parameters.sku.name The type of Redis cache to deploy. Valid
     * values: (Basic, Standard, Premium). Possible values include: 'Basic',
     * 'Standard', 'Premium'
     *
     * @param {string} parameters.sku.family The SKU family to use. Valid values:
     * (C, P). (C = Basic/Standard, P = Premium). Possible values include: 'C', 'P'
     *
     * @param {number} parameters.sku.capacity The size of the Redis cache to
     * deploy. Valid values: for C (Basic/Standard) family (0, 1, 2, 3, 4, 5, 6),
     * for P (Premium) family (1, 2, 3, 4).
     *
     * @param {string} parameters.location Resource location.
     *
     * @param {object} [parameters.tags] Resource tags.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @param {ServiceCallback} [callback] callback function; see ServiceCallback
     * doc in ms-rest index.d.ts for details
     */
    create(resourceGroupName: string, name: string, parameters: models.RedisCreateParameters, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.RedisResource>): void;
    create(resourceGroupName: string, name: string, parameters: models.RedisCreateParameters, callback: ServiceCallback<models.RedisResource>): void;

    /**
     * Update an existing Redis cache.
     *
     * @param {string} resourceGroupName The name of the resource group.
     *
     * @param {string} name The name of the Redis cache.
     *
     * @param {object} parameters Parameters supplied to the Update Redis
     * operation.
     *
     * @param {object} [parameters.redisConfiguration] All Redis Settings. Few
     * possible keys:
     * rdb-backup-enabled,rdb-storage-connection-string,rdb-backup-frequency,maxmemory-delta,maxmemory-policy,notify-keyspace-events,maxmemory-samples,slowlog-log-slower-than,slowlog-max-len,list-max-ziplist-entries,list-max-ziplist-value,hash-max-ziplist-entries,hash-max-ziplist-value,set-max-intset-entries,zset-max-ziplist-entries,zset-max-ziplist-value
     * etc.
     *
     * @param {boolean} [parameters.enableNonSslPort] Specifies whether the non-ssl
     * Redis server port (6379) is enabled.
     *
     * @param {object} [parameters.tenantSettings] tenantSettings
     *
     * @param {number} [parameters.shardCount] The number of shards to be created
     * on a Premium Cluster Cache.
     *
     * @param {string} [parameters.subnetId] The full resource ID of a subnet in a
     * virtual network to deploy the Redis cache in. Example format:
     * /subscriptions/{subid}/resourceGroups/{resourceGroupName}/Microsoft.{Network|ClassicNetwork}/VirtualNetworks/vnet1/subnets/subnet1
     *
     * @param {string} [parameters.staticIP] Static IP address. Required when
     * deploying a Redis cache inside an existing Azure Virtual Network.
     *
     * @param {object} [parameters.sku] The SKU of the Redis cache to deploy.
     *
     * @param {string} parameters.sku.name The type of Redis cache to deploy. Valid
     * values: (Basic, Standard, Premium). Possible values include: 'Basic',
     * 'Standard', 'Premium'
     *
     * @param {string} parameters.sku.family The SKU family to use. Valid values:
     * (C, P). (C = Basic/Standard, P = Premium). Possible values include: 'C', 'P'
     *
     * @param {number} parameters.sku.capacity The size of the Redis cache to
     * deploy. Valid values: for C (Basic/Standard) family (0, 1, 2, 3, 4, 5, 6),
     * for P (Premium) family (1, 2, 3, 4).
     *
     * @param {object} [parameters.tags] Resource tags.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @param {ServiceCallback} [callback] callback function; see ServiceCallback
     * doc in ms-rest index.d.ts for details
     */
    update(resourceGroupName: string, name: string, parameters: models.RedisUpdateParameters, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.RedisResource>): void;
    update(resourceGroupName: string, name: string, parameters: models.RedisUpdateParameters, callback: ServiceCallback<models.RedisResource>): void;

    /**
     * Deletes a Redis cache.
     *
     * @param {string} resourceGroupName The name of the resource group.
     *
     * @param {string} name The name of the Redis cache.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @param {ServiceCallback} [callback] callback function; see ServiceCallback
     * doc in ms-rest index.d.ts for details
     */
    deleteMethod(resourceGroupName: string, name: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<void>): void;
    deleteMethod(resourceGroupName: string, name: string, callback: ServiceCallback<void>): void;

    /**
     * Gets a Redis cache (resource description).
     *
     * @param {string} resourceGroupName The name of the resource group.
     *
     * @param {string} name The name of the Redis cache.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @param {ServiceCallback} [callback] callback function; see ServiceCallback
     * doc in ms-rest index.d.ts for details
     */
    get(resourceGroupName: string, name: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.RedisResource>): void;
    get(resourceGroupName: string, name: string, callback: ServiceCallback<models.RedisResource>): void;

    /**
     * Lists all Redis caches in a resource group.
     *
     * @param {string} resourceGroupName The name of the resource group.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @param {ServiceCallback} [callback] callback function; see ServiceCallback
     * doc in ms-rest index.d.ts for details
     */
    listByResourceGroup(resourceGroupName: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.RedisListResult>): void;
    listByResourceGroup(resourceGroupName: string, callback: ServiceCallback<models.RedisListResult>): void;

    /**
     * Gets all Redis caches in the specified subscription.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @param {ServiceCallback} [callback] callback function; see ServiceCallback
     * doc in ms-rest index.d.ts for details
     */
    list(options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.RedisListResult>): void;
    list(callback: ServiceCallback<models.RedisListResult>): void;

    /**
     * Retrieve a Redis cache's access keys. This operation requires write
     * permission to the cache resource.
     *
     * @param {string} resourceGroupName The name of the resource group.
     *
     * @param {string} name The name of the Redis cache.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @param {ServiceCallback} [callback] callback function; see ServiceCallback
     * doc in ms-rest index.d.ts for details
     */
    listKeys(resourceGroupName: string, name: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.RedisAccessKeys>): void;
    listKeys(resourceGroupName: string, name: string, callback: ServiceCallback<models.RedisAccessKeys>): void;

    /**
     * Regenerate Redis cache's access keys. This operation requires write
     * permission to the cache resource.
     *
     * @param {string} resourceGroupName The name of the resource group.
     *
     * @param {string} name The name of the Redis cache.
     *
     * @param {string} keyType The Redis access key to regenerate. Possible values
     * include: 'Primary', 'Secondary'
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @param {ServiceCallback} [callback] callback function; see ServiceCallback
     * doc in ms-rest index.d.ts for details
     */
    regenerateKey(resourceGroupName: string, name: string, keyType: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.RedisAccessKeys>): void;
    regenerateKey(resourceGroupName: string, name: string, keyType: string, callback: ServiceCallback<models.RedisAccessKeys>): void;

    /**
     * Reboot specified Redis node(s). This operation requires write permission to
     * the cache resource. There can be potential data loss.
     *
     * @param {string} resourceGroupName The name of the resource group.
     *
     * @param {string} name The name of the Redis cache.
     *
     * @param {object} parameters Specifies which Redis node(s) to reboot.
     *
     * @param {string} parameters.rebootType Which Redis node(s) to reboot.
     * Depending on this value data loss is possible. Possible values include:
     * 'PrimaryNode', 'SecondaryNode', 'AllNodes'
     *
     * @param {number} [parameters.shardId] If clustering is enabled, the ID of the
     * shard to be rebooted.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @param {ServiceCallback} [callback] callback function; see ServiceCallback
     * doc in ms-rest index.d.ts for details
     */
    forceReboot(resourceGroupName: string, name: string, parameters: models.RedisRebootParameters, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<void>): void;
    forceReboot(resourceGroupName: string, name: string, parameters: models.RedisRebootParameters, callback: ServiceCallback<void>): void;

    /**
     * Import data into Redis cache.
     *
     * @param {string} resourceGroupName The name of the resource group.
     *
     * @param {string} name The name of the Redis cache.
     *
     * @param {object} parameters Parameters for Redis import operation.
     *
     * @param {string} [parameters.format] File format.
     *
     * @param {array} parameters.files files to import.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @param {ServiceCallback} [callback] callback function; see ServiceCallback
     * doc in ms-rest index.d.ts for details
     */
    importData(resourceGroupName: string, name: string, parameters: models.ImportRDBParameters, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<void>): void;
    importData(resourceGroupName: string, name: string, parameters: models.ImportRDBParameters, callback: ServiceCallback<void>): void;

    /**
     * Export data from the redis cache to blobs in a container.
     *
     * @param {string} resourceGroupName The name of the resource group.
     *
     * @param {string} name The name of the Redis cache.
     *
     * @param {object} parameters Parameters for Redis export operation.
     *
     * @param {string} [parameters.format] File format.
     *
     * @param {string} parameters.prefix Prefix to use for exported files.
     *
     * @param {string} parameters.container Container name to export to.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @param {ServiceCallback} [callback] callback function; see ServiceCallback
     * doc in ms-rest index.d.ts for details
     */
    exportData(resourceGroupName: string, name: string, parameters: models.ExportRDBParameters, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<void>): void;
    exportData(resourceGroupName: string, name: string, parameters: models.ExportRDBParameters, callback: ServiceCallback<void>): void;

    /**
     * Create or replace (overwrite/recreate, with potential downtime) an existing
     * Redis cache.
     *
     * @param {string} resourceGroupName The name of the resource group.
     *
     * @param {string} name The name of the Redis cache.
     *
     * @param {object} parameters Parameters supplied to the Create Redis
     * operation.
     *
     * @param {object} [parameters.redisConfiguration] All Redis Settings. Few
     * possible keys:
     * rdb-backup-enabled,rdb-storage-connection-string,rdb-backup-frequency,maxmemory-delta,maxmemory-policy,notify-keyspace-events,maxmemory-samples,slowlog-log-slower-than,slowlog-max-len,list-max-ziplist-entries,list-max-ziplist-value,hash-max-ziplist-entries,hash-max-ziplist-value,set-max-intset-entries,zset-max-ziplist-entries,zset-max-ziplist-value
     * etc.
     *
     * @param {boolean} [parameters.enableNonSslPort] Specifies whether the non-ssl
     * Redis server port (6379) is enabled.
     *
     * @param {object} [parameters.tenantSettings] tenantSettings
     *
     * @param {number} [parameters.shardCount] The number of shards to be created
     * on a Premium Cluster Cache.
     *
     * @param {string} [parameters.subnetId] The full resource ID of a subnet in a
     * virtual network to deploy the Redis cache in. Example format:
     * /subscriptions/{subid}/resourceGroups/{resourceGroupName}/Microsoft.{Network|ClassicNetwork}/VirtualNetworks/vnet1/subnets/subnet1
     *
     * @param {string} [parameters.staticIP] Static IP address. Required when
     * deploying a Redis cache inside an existing Azure Virtual Network.
     *
     * @param {object} parameters.sku The SKU of the Redis cache to deploy.
     *
     * @param {string} parameters.sku.name The type of Redis cache to deploy. Valid
     * values: (Basic, Standard, Premium). Possible values include: 'Basic',
     * 'Standard', 'Premium'
     *
     * @param {string} parameters.sku.family The SKU family to use. Valid values:
     * (C, P). (C = Basic/Standard, P = Premium). Possible values include: 'C', 'P'
     *
     * @param {number} parameters.sku.capacity The size of the Redis cache to
     * deploy. Valid values: for C (Basic/Standard) family (0, 1, 2, 3, 4, 5, 6),
     * for P (Premium) family (1, 2, 3, 4).
     *
     * @param {string} parameters.location Resource location.
     *
     * @param {object} [parameters.tags] Resource tags.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @param {ServiceCallback} [callback] callback function; see ServiceCallback
     * doc in ms-rest index.d.ts for details
     */
    beginCreate(resourceGroupName: string, name: string, parameters: models.RedisCreateParameters, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.RedisResource>): void;
    beginCreate(resourceGroupName: string, name: string, parameters: models.RedisCreateParameters, callback: ServiceCallback<models.RedisResource>): void;

    /**
     * Deletes a Redis cache.
     *
     * @param {string} resourceGroupName The name of the resource group.
     *
     * @param {string} name The name of the Redis cache.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @param {ServiceCallback} [callback] callback function; see ServiceCallback
     * doc in ms-rest index.d.ts for details
     */
    beginDeleteMethod(resourceGroupName: string, name: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<void>): void;
    beginDeleteMethod(resourceGroupName: string, name: string, callback: ServiceCallback<void>): void;

    /**
     * Import data into Redis cache.
     *
     * @param {string} resourceGroupName The name of the resource group.
     *
     * @param {string} name The name of the Redis cache.
     *
     * @param {object} parameters Parameters for Redis import operation.
     *
     * @param {string} [parameters.format] File format.
     *
     * @param {array} parameters.files files to import.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @param {ServiceCallback} [callback] callback function; see ServiceCallback
     * doc in ms-rest index.d.ts for details
     */
    beginImportData(resourceGroupName: string, name: string, parameters: models.ImportRDBParameters, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<void>): void;
    beginImportData(resourceGroupName: string, name: string, parameters: models.ImportRDBParameters, callback: ServiceCallback<void>): void;

    /**
     * Export data from the redis cache to blobs in a container.
     *
     * @param {string} resourceGroupName The name of the resource group.
     *
     * @param {string} name The name of the Redis cache.
     *
     * @param {object} parameters Parameters for Redis export operation.
     *
     * @param {string} [parameters.format] File format.
     *
     * @param {string} parameters.prefix Prefix to use for exported files.
     *
     * @param {string} parameters.container Container name to export to.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @param {ServiceCallback} [callback] callback function; see ServiceCallback
     * doc in ms-rest index.d.ts for details
     */
    beginExportData(resourceGroupName: string, name: string, parameters: models.ExportRDBParameters, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<void>): void;
    beginExportData(resourceGroupName: string, name: string, parameters: models.ExportRDBParameters, callback: ServiceCallback<void>): void;

    /**
     * Lists all Redis caches in a resource group.
     *
     * @param {string} nextPageLink The NextLink from the previous successful call
     * to List operation.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @param {ServiceCallback} [callback] callback function; see ServiceCallback
     * doc in ms-rest index.d.ts for details
     */
    listByResourceGroupNext(nextPageLink: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.RedisListResult>): void;
    listByResourceGroupNext(nextPageLink: string, callback: ServiceCallback<models.RedisListResult>): void;

    /**
     * Gets all Redis caches in the specified subscription.
     *
     * @param {string} nextPageLink The NextLink from the previous successful call
     * to List operation.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @param {ServiceCallback} [callback] callback function; see ServiceCallback
     * doc in ms-rest index.d.ts for details
     */
    listNext(nextPageLink: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.RedisListResult>): void;
    listNext(nextPageLink: string, callback: ServiceCallback<models.RedisListResult>): void;
}

/**
 * @class
 * PatchSchedules
 * __NOTE__: An instance of this class is automatically created for an
 * instance of the RedisManagementClient.
 */
export interface PatchSchedules {

    /**
     * Create or replace the patching schedule for Redis cache (requires Premium
     * SKU).
     *
     * @param {string} resourceGroupName The name of the resource group.
     *
     * @param {string} name The name of the Redis cache.
     *
     * @param {array} scheduleEntries List of patch schedules for a Redis cache.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @param {ServiceCallback} [callback] callback function; see ServiceCallback
     * doc in ms-rest index.d.ts for details
     */
    createOrUpdate(resourceGroupName: string, name: string, scheduleEntries: models.ScheduleEntry[], options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.RedisPatchSchedule>): void;
    createOrUpdate(resourceGroupName: string, name: string, scheduleEntries: models.ScheduleEntry[], callback: ServiceCallback<models.RedisPatchSchedule>): void;

    /**
     * Deletes the patching schedule of a redis cache (requires Premium SKU).
     *
     * @param {string} resourceGroupName The name of the resource group.
     *
     * @param {string} name The name of the redis cache.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @param {ServiceCallback} [callback] callback function; see ServiceCallback
     * doc in ms-rest index.d.ts for details
     */
    deleteMethod(resourceGroupName: string, name: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<void>): void;
    deleteMethod(resourceGroupName: string, name: string, callback: ServiceCallback<void>): void;

    /**
     * Gets the patching schedule of a redis cache (requires Premium SKU).
     *
     * @param {string} resourceGroupName The name of the resource group.
     *
     * @param {string} name The name of the redis cache.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @param {ServiceCallback} [callback] callback function; see ServiceCallback
     * doc in ms-rest index.d.ts for details
     */
    get(resourceGroupName: string, name: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.RedisPatchSchedule>): void;
    get(resourceGroupName: string, name: string, callback: ServiceCallback<models.RedisPatchSchedule>): void;
}
