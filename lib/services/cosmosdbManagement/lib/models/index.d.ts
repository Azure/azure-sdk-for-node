/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import { BaseResource, CloudError } from "ms-rest-azure";
import * as moment from "moment";

export {

  BaseResource,
  CloudError
};

/**
 * The consistency policy for the Cosmos DB database account.
 */
export interface ConsistencyPolicy {
  /**
   * The default consistency level and configuration settings of the Cosmos DB account. Possible
   * values include: 'Eventual', 'Session', 'BoundedStaleness', 'Strong', 'ConsistentPrefix'
   */
  defaultConsistencyLevel: string;
  /**
   * When used with the Bounded Staleness consistency level, this value represents the number of
   * stale requests tolerated. Accepted range for this value is 1 – 2,147,483,647. Required when
   * defaultConsistencyPolicy is set to 'BoundedStaleness'.
   */
  maxStalenessPrefix?: number;
  /**
   * When used with the Bounded Staleness consistency level, this value represents the time amount
   * of staleness (in seconds) tolerated. Accepted range for this value is 5 - 86400. Required when
   * defaultConsistencyPolicy is set to 'BoundedStaleness'.
   */
  maxIntervalInSeconds?: number;
}

/**
 * Cosmos DB capability object
 */
export interface Capability {
  /**
   * Name of the Cosmos DB capability. For example, "name": "EnableCassandra". Current values also
   * include "EnableTable" and "EnableGremlin".
   */
  name?: string;
}

/**
 * A region in which the Azure Cosmos DB database account is deployed.
 */
export interface Location {
  /**
   * The unique identifier of the region within the database account. Example:
   * &lt;accountName&gt;-&lt;locationName&gt;.
   */
  readonly id?: string;
  /**
   * The name of the region.
   */
  locationName?: string;
  /**
   * The connection endpoint for the specific region. Example:
   * https://&lt;accountName&gt;-&lt;locationName&gt;.documents.azure.com:443/
   */
  readonly documentEndpoint?: string;
  provisioningState?: string;
  /**
   * The failover priority of the region. A failover priority of 0 indicates a write region. The
   * maximum value for a failover priority = (total number of regions - 1). Failover priority
   * values must be unique for each of the regions in which the database account exists.
  */
  failoverPriority?: number;
}

/**
 * The failover policy for a given region of a database account.
*/
export interface FailoverPolicy {
  /**
   * The unique identifier of the region in which the database account replicates to. Example:
   * &lt;accountName&gt;-&lt;locationName&gt;.
  */
  readonly id?: string;
  /**
   * The name of the region in which the database account exists.
  */
  locationName?: string;
  /**
   * The failover priority of the region. A failover priority of 0 indicates a write region. The
   * maximum value for a failover priority = (total number of regions - 1). Failover priority
   * values must be unique for each of the regions in which the database account exists.
  */
  failoverPriority?: number;
}

/**
 * Virtual Network ACL Rule object
*/
export interface VirtualNetworkRule {
  /**
   * Resource ID of a subnet, for example:
   * /subscriptions/{subscriptionId}/resourceGroups/{groupName}/providers/Microsoft.Network/virtualNetworks/{virtualNetworkName}/subnets/{subnetName}.
  */
  id?: string;
  /**
   * Create firewall rule before the virtual network has vnet service endpoint enabled.
  */
  ignoreMissingVNetServiceEndpoint?: boolean;
}

/**
 * A database account resource.
*/
export interface Resource extends BaseResource {
  /**
   * The unique resource identifier of the database account.
  */
  readonly id?: string;
  /**
   * The name of the database account.
  */
  readonly name?: string;
  /**
   * The type of Azure resource.
  */
  readonly type?: string;
  /**
   * The location of the resource group to which the resource belongs.
  */
  location: string;
  tags?: { [propertyName: string]: string };
}

/**
 * An Azure Cosmos DB database account.
*/
export interface DatabaseAccount extends Resource {
  /**
   * Indicates the type of database account. This can only be set at database account creation.
   * Possible values include: 'GlobalDocumentDB', 'MongoDB', 'Parse'
  */
  kind?: string;
  provisioningState?: string;
  /**
   * The connection endpoint for the Cosmos DB database account.
  */
  readonly documentEndpoint?: string;
  /**
   * The offer type for the Cosmos DB database account. Default value: Standard. Possible values
   * include: 'Standard'
  */
  readonly databaseAccountOfferType?: string;
  /**
   * Cosmos DB Firewall Support: This value specifies the set of IP addresses or IP address ranges
   * in CIDR form to be included as the allowed list of client IPs for a given database account. IP
   * addresses/ranges must be comma separated and must not contain any spaces.
  */
  ipRangeFilter?: string;
  /**
   * Flag to indicate whether to enable/disable Virtual Network ACL rules.
  */
  isVirtualNetworkFilterEnabled?: boolean;
  /**
   * Enables automatic failover of the write region in the rare event that the region is
   * unavailable due to an outage. Automatic failover will result in a new write region for the
   * account and is chosen based on the failover priorities configured for the account.
  */
  enableAutomaticFailover?: boolean;
  /**
   * The consistency policy for the Cosmos DB database account.
  */
  consistencyPolicy?: ConsistencyPolicy;
  /**
   * List of Cosmos DB capabilities for the account
  */
  capabilities?: Capability[];
  /**
   * An array that contains the write location for the Cosmos DB account.
  */
  readonly writeLocations?: Location[];
  /**
   * An array that contains of the read locations enabled for the Cosmos DB account.
  */
  readonly readLocations?: Location[];
  /**
   * An array that contains the regions ordered by their failover priorities.
  */
  readonly failoverPolicies?: FailoverPolicy[];
  /**
   * List of Virtual Network ACL rules configured for the Cosmos DB account.
  */
  virtualNetworkRules?: VirtualNetworkRule[];
  /**
   * Enables the account to write in multiple locations
  */
  enableMultipleWriteLocations?: boolean;
}

/**
 * Error Response.
*/
export interface ErrorResponse {
  /**
   * Error code.
  */
  code?: string;
  /**
   * Error message indicating why the operation failed.
  */
  message?: string;
}

/**
 * The list of new failover policies for the failover priority change.
*/
export interface FailoverPolicies {
  /**
   * List of failover policies.
  */
  failoverPolicies: FailoverPolicy[];
}

/**
 * Cosmos DB region to online or offline.
*/
export interface RegionForOnlineOffline {
  /**
   * Cosmos DB region, with spaces between words and each word capitalized.
  */
  region: string;
}

/**
 * Parameters to create and update Cosmos DB database accounts.
*/
export interface DatabaseAccountCreateUpdateParameters extends Resource {
  /**
   * Indicates the type of database account. This can only be set at database account creation.
   * Possible values include: 'GlobalDocumentDB', 'MongoDB', 'Parse'
  */
  kind?: string;
  /**
   * The consistency policy for the Cosmos DB account.
  */
  consistencyPolicy?: ConsistencyPolicy;
  /**
   * An array that contains the georeplication locations enabled for the Cosmos DB account.
  */
  locations: Location[];
  /**
   * Cosmos DB Firewall Support: This value specifies the set of IP addresses or IP address ranges
   * in CIDR form to be included as the allowed list of client IPs for a given database account. IP
   * addresses/ranges must be comma separated and must not contain any spaces.
  */
  ipRangeFilter?: string;
  /**
   * Flag to indicate whether to enable/disable Virtual Network ACL rules.
  */
  isVirtualNetworkFilterEnabled?: boolean;
  /**
   * Enables automatic failover of the write region in the rare event that the region is
   * unavailable due to an outage. Automatic failover will result in a new write region for the
   * account and is chosen based on the failover priorities configured for the account.
  */
  enableAutomaticFailover?: boolean;
  /**
   * List of Cosmos DB capabilities for the account
  */
  capabilities?: Capability[];
  /**
   * List of Virtual Network ACL rules configured for the Cosmos DB account.
  */
  virtualNetworkRules?: VirtualNetworkRule[];
  /**
   * Enables the account to write in multiple locations
  */
  enableMultipleWriteLocations?: boolean;
}

/**
 * Parameters for patching Azure Cosmos DB database account properties.
*/
export interface DatabaseAccountPatchParameters {
  tags?: { [propertyName: string]: string };
  /**
   * List of Cosmos DB capabilities for the account
  */
  capabilities?: Capability[];
}

/**
 * The read-only access keys for the given database account.
*/
export interface DatabaseAccountListReadOnlyKeysResult {
  /**
   * Base 64 encoded value of the primary read-only key.
  */
  readonly primaryReadonlyMasterKey?: string;
  /**
   * Base 64 encoded value of the secondary read-only key.
  */
  readonly secondaryReadonlyMasterKey?: string;
}

/**
 * The access keys for the given database account.
*/
export interface DatabaseAccountListKeysResult {
  /**
   * Base 64 encoded value of the primary read-write key.
  */
  readonly primaryMasterKey?: string;
  /**
   * Base 64 encoded value of the secondary read-write key.
  */
  readonly secondaryMasterKey?: string;
  /**
   * Base 64 encoded value of the primary read-only key.
  */
  readonly primaryReadonlyMasterKey?: string;
  /**
   * Base 64 encoded value of the secondary read-only key.
  */
  readonly secondaryReadonlyMasterKey?: string;
}

/**
 * Connection string for the Cosmos DB account
*/
export interface DatabaseAccountConnectionString {
  /**
   * Value of the connection string
  */
  readonly connectionString?: string;
  /**
   * Description of the connection string
  */
  readonly description?: string;
}

/**
 * The connection strings for the given database account.
*/
export interface DatabaseAccountListConnectionStringsResult {
  /**
   * An array that contains the connection strings for the Cosmos DB account.
  */
  connectionStrings?: DatabaseAccountConnectionString[];
}

/**
 * Parameters to regenerate the keys within the database account.
*/
export interface DatabaseAccountRegenerateKeyParameters {
  /**
   * The access key to regenerate. Possible values include: 'primary', 'secondary',
   * 'primaryReadonly', 'secondaryReadonly'
  */
  keyKind: string;
}

/**
 * The object that represents the operation.
*/
export interface OperationDisplay {
  /**
   * Service provider: Microsoft.ResourceProvider
  */
  provider?: string;
  /**
   * Resource on which the operation is performed: Profile, endpoint, etc.
  */
  resource?: string;
  /**
   * Operation type: Read, write, delete, etc.
  */
  operation?: string;
  /**
   * Description of operation
  */
  description?: string;
}

/**
 * REST API operation
*/
export interface Operation {
  /**
   * Operation name: {provider}/{resource}/{operation}
  */
  name?: string;
  /**
   * The object that represents the operation.
  */
  display?: OperationDisplay;
}

/**
 * A metric name.
*/
export interface MetricName {
  /**
   * The name of the metric.
  */
  readonly value?: string;
  /**
   * The friendly name of the metric.
  */
  readonly localizedValue?: string;
}

/**
 * The usage data for a usage request.
*/
export interface Usage {
  /**
   * The unit of the metric. Possible values include: 'Count', 'Bytes', 'Seconds', 'Percent',
   * 'CountPerSecond', 'BytesPerSecond', 'Milliseconds'
  */
  unit?: string;
  /**
   * The name information for the metric.
  */
  readonly name?: MetricName;
  /**
   * The quota period used to summarize the usage values.
  */
  readonly quotaPeriod?: string;
  /**
   * Maximum value for this metric
  */
  readonly limit?: number;
  /**
   * Current value for this metric
  */
  readonly currentValue?: number;
}

/**
 * The partition level usage data for a usage request.
*/
export interface PartitionUsage extends Usage {
  /**
   * The partition id (GUID identifier) of the usages.
  */
  readonly partitionId?: string;
  /**
   * The partition key range id (integer identifier) of the usages.
  */
  readonly partitionKeyRangeId?: string;
}

/**
 * The availability of the metric.
*/
export interface MetricAvailability {
  /**
   * The time grain to be used to summarize the metric values.
  */
  readonly timeGrain?: string;
  /**
   * The retention for the metric values.
  */
  readonly retention?: string;
}

/**
 * The definition of a metric.
*/
export interface MetricDefinition {
  /**
   * The list of metric availabilities for the account.
  */
  readonly metricAvailabilities?: MetricAvailability[];
  /**
   * The primary aggregation type of the metric. Possible values include: 'None', 'Average',
   * 'Total', 'Minimimum', 'Maximum', 'Last'
  */
  readonly primaryAggregationType?: string;
  /**
   * The unit of the metric. Possible values include: 'Count', 'Bytes', 'Seconds', 'Percent',
   * 'CountPerSecond', 'BytesPerSecond', 'Milliseconds'
  */
  unit?: string;
  /**
   * The resource uri of the database.
  */
  readonly resourceUri?: string;
  /**
   * The name information for the metric.
  */
  readonly name?: MetricName;
}

/**
 * Represents metrics values.
*/
export interface MetricValue {
  /**
   * The number of values for the metric.
  */
  readonly _count?: number;
  /**
   * The average value of the metric.
  */
  readonly average?: number;
  /**
   * The max value of the metric.
  */
  readonly maximum?: number;
  /**
   * The min value of the metric.
  */
  readonly minimum?: number;
  /**
   * The metric timestamp (ISO-8601 format).
  */
  readonly timestamp?: Date;
  /**
   * The total value of the metric.
  */
  readonly total?: number;
}

/**
 * Metric data
*/
export interface Metric {
  /**
   * The start time for the metric (ISO-8601 format).
  */
  readonly startTime?: Date;
  /**
   * The end time for the metric (ISO-8601 format).
  */
  readonly endTime?: Date;
  /**
   * The time grain to be used to summarize the metric values.
  */
  readonly timeGrain?: string;
  /**
   * The unit of the metric. Possible values include: 'Count', 'Bytes', 'Seconds', 'Percent',
   * 'CountPerSecond', 'BytesPerSecond', 'Milliseconds'
  */
  unit?: string;
  /**
   * The name information for the metric.
  */
  readonly name?: MetricName;
  /**
   * The metric values for the specified time window and timestep.
  */
  readonly metricValues?: MetricValue[];
}

/**
 * Represents percentile metrics values.
*/
export interface PercentileMetricValue extends MetricValue {
  /**
   * The 10th percentile value for the metric.
  */
  readonly p10?: number;
  /**
   * The 25th percentile value for the metric.
  */
  readonly p25?: number;
  /**
   * The 50th percentile value for the metric.
  */
  readonly p50?: number;
  /**
   * The 75th percentile value for the metric.
  */
  readonly p75?: number;
  /**
   * The 90th percentile value for the metric.
  */
  readonly p90?: number;
  /**
   * The 95th percentile value for the metric.
  */
  readonly p95?: number;
  /**
   * The 99th percentile value for the metric.
  */
  readonly p99?: number;
}

/**
 * Percentile Metric data
*/
export interface PercentileMetric {
  /**
   * The start time for the metric (ISO-8601 format).
  */
  readonly startTime?: Date;
  /**
   * The end time for the metric (ISO-8601 format).
  */
  readonly endTime?: Date;
  /**
   * The time grain to be used to summarize the metric values.
  */
  readonly timeGrain?: string;
  /**
   * The unit of the metric. Possible values include: 'Count', 'Bytes', 'Seconds', 'Percent',
   * 'CountPerSecond', 'BytesPerSecond', 'Milliseconds'
  */
  unit?: string;
  /**
   * The name information for the metric.
  */
  readonly name?: MetricName;
  /**
   * The percentile metric values for the specified time window and timestep.
  */
  readonly metricValues?: PercentileMetricValue[];
}

/**
 * The metric values for a single partition.
*/
export interface PartitionMetric extends Metric {
  /**
   * The partition id (GUID identifier) of the metric values.
  */
  readonly partitionId?: string;
  /**
   * The partition key range id (integer identifier) of the metric values.
  */
  readonly partitionKeyRangeId?: string;
}

/**
 * The List operation response, that contains the database accounts and their properties.
*/
export interface DatabaseAccountsListResult extends Array<DatabaseAccount> {
}

/**
 * The response to a list metrics request.
*/
export interface MetricListResult extends Array<Metric> {
}

/**
 * The response to a list usage request.
*/
export interface UsagesResult extends Array<Usage> {
}

/**
 * The response to a list metric definitions request.
*/
export interface MetricDefinitionsListResult extends Array<MetricDefinition> {
}

/**
 * Result of the request to list Resource Provider operations. It contains a list of operations and
 * a URL link to get the next set of results.
*/
export interface OperationListResult extends Array<Operation> {
  /**
   * URL to get the next set of operation list results if there are any.
  */
  nextLink?: string;
}

/**
 * The response to a list percentile metrics request.
*/
export interface PercentileMetricListResult extends Array<PercentileMetric> {
}

/**
 * The response to a list partition metrics request.
*/
export interface PartitionMetricListResult extends Array<PartitionMetric> {
}

/**
 * The response to a list partition level usage request.
*/
export interface PartitionUsagesResult extends Array<PartitionUsage> {
}
