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
 * The Resource definition for other than namespace.
 */
export interface Resource extends BaseResource {
  /**
   * Resource Id
   */
  readonly id?: string;
  /**
   * Resource name
   */
  readonly name?: string;
  /**
   * Resource type
   */
  readonly type?: string;
}

/**
 * The Resource definition.
 */
export interface TrackedResource extends Resource {
  /**
   * The Geo-location where the resource lives
   */
  location: string;
  /**
   * Resource tags
   */
  tags?: { [propertyName: string]: string };
}

/**
 * The Resource definition.
 */
export interface ResourceNamespacePatch extends Resource {
  /**
   * Resource location
   */
  location?: string;
  /**
   * Resource tags
   */
  tags?: { [propertyName: string]: string };
}

/**
 * SKU of the namespace.
 */
export interface SBSku {
  /**
   * Name of this SKU. Possible values include: 'Basic', 'Standard', 'Premium'
   */
  name: string;
  /**
   * The billing tier of this particular SKU. Possible values include: 'Basic', 'Standard',
   * 'Premium'
   */
  tier?: string;
  /**
   * The specified messaging units for the tier. For Premium tier, capacity are 1,2 and 4.
   */
  capacity?: number;
}

/**
 * Description of a namespace resource.
 */
export interface SBNamespace extends TrackedResource {
  /**
   * Properties of Sku
   */
  sku?: SBSku;
  /**
   * Provisioning state of the namespace.
   */
  readonly provisioningState?: string;
  /**
   * The time the namespace was created.
   */
  readonly createdAt?: Date;
  /**
   * The time the namespace was updated.
   */
  readonly updatedAt?: Date;
  /**
   * Endpoint you can use to perform Service Bus operations.
   */
  readonly serviceBusEndpoint?: string;
  /**
   * Identifier for Azure Insights metrics
   */
  readonly metricId?: string;
}

/**
 * Description of a namespace resource.
 */
export interface SBNamespaceUpdateParameters extends ResourceNamespacePatch {
  /**
   * Properties of Sku
   */
  sku?: SBSku;
  /**
   * Provisioning state of the namespace.
   */
  readonly provisioningState?: string;
  /**
   * The time the namespace was created.
   */
  readonly createdAt?: Date;
  /**
   * The time the namespace was updated.
   */
  readonly updatedAt?: Date;
  /**
   * Endpoint you can use to perform Service Bus operations.
   */
  readonly serviceBusEndpoint?: string;
  /**
   * Identifier for Azure Insights metrics
   */
  readonly metricId?: string;
}

/**
 * Namespace Migrate Object
 */
export interface SBNamespaceMigrate {
  /**
   * Type of namespaces. Possible values include: 'Messaging', 'NotificationHub', 'Mixed',
   * 'EventHub', 'Relay'
   */
  targetNamespaceType: string;
}

/**
 * Description of a namespace authorization rule.
 */
export interface SBAuthorizationRule extends Resource {
  /**
   * The rights associated with the rule.
   */
  rights: string[];
}

/**
 * AuthorizationRule properties.
 */
export interface AuthorizationRuleProperties {
  /**
   * The rights associated with the rule.
   */
  rights: string[];
}

/**
 * Namespace/ServiceBus Connection String
 */
export interface AccessKeys {
  /**
   * Primary connection string of the created namespace authorization rule.
   */
  readonly primaryConnectionString?: string;
  /**
   * Secondary connection string of the created namespace authorization rule.
   */
  readonly secondaryConnectionString?: string;
  /**
   * Primary connection string of the alias if GEO DR is enabled
   */
  readonly aliasPrimaryConnectionString?: string;
  /**
   * Secondary  connection string of the alias if GEO DR is enabled
   */
  readonly aliasSecondaryConnectionString?: string;
  /**
   * A base64-encoded 256-bit primary key for signing and validating the SAS token.
   */
  readonly primaryKey?: string;
  /**
   * A base64-encoded 256-bit primary key for signing and validating the SAS token.
   */
  readonly secondaryKey?: string;
  /**
   * A string that describes the authorization rule.
   */
  readonly keyName?: string;
}

/**
 * Parameters supplied to the Regenerate Authorization Rule operation, specifies which key needs to
 * be reset.
 */
export interface RegenerateAccessKeyParameters {
  /**
   * The access key to regenerate. Possible values include: 'PrimaryKey', 'SecondaryKey'
   */
  keyType: string;
  /**
   * Optional, if the key value provided, is reset for KeyType value or autogenerate Key value set
   * for keyType
   */
  key?: string;
}

/**
 * Message Count Details.
 */
export interface MessageCountDetails {
  /**
   * Number of active messages in the queue, topic, or subscription.
   */
  readonly activeMessageCount?: number;
  /**
   * Number of messages that are dead lettered.
   */
  readonly deadLetterMessageCount?: number;
  /**
   * Number of scheduled messages.
   */
  readonly scheduledMessageCount?: number;
  /**
   * Number of messages transferred to another queue, topic, or subscription.
   */
  readonly transferMessageCount?: number;
  /**
   * Number of messages transferred into dead letters.
   */
  readonly transferDeadLetterMessageCount?: number;
}

/**
 * Description of queue Resource.
 */
export interface SBQueue extends Resource {
  /**
   * Message Count Details.
   */
  readonly countDetails?: MessageCountDetails;
  /**
   * The exact time the message was created.
   */
  readonly createdAt?: Date;
  /**
   * The exact time the message was updated.
   */
  readonly updatedAt?: Date;
  /**
   * Last time a message was sent, or the last time there was a receive request to this queue.
   */
  readonly accessedAt?: Date;
  /**
   * The size of the queue, in bytes.
   */
  readonly sizeInBytes?: number;
  /**
   * The number of messages in the queue.
   */
  readonly messageCount?: number;
  /**
   * ISO 8601 timespan duration of a peek-lock; that is, the amount of time that the message is
   * locked for other receivers. The maximum value for LockDuration is 5 minutes; the default value
   * is 1 minute.
   */
  lockDuration?: moment.Duration;
  /**
   * The maximum size of the queue in megabytes, which is the size of memory allocated for the
   * queue. Default is 1024.
   */
  maxSizeInMegabytes?: number;
  /**
   * A value indicating if this queue requires duplicate detection.
   */
  requiresDuplicateDetection?: boolean;
  /**
   * A value that indicates whether the queue supports the concept of sessions.
   */
  requiresSession?: boolean;
  /**
   * ISO 8601 default message timespan to live value. This is the duration after which the message
   * expires, starting from when the message is sent to Service Bus. This is the default value used
   * when TimeToLive is not set on a message itself.
   */
  defaultMessageTimeToLive?: moment.Duration;
  /**
   * A value that indicates whether this queue has dead letter support when a message expires.
   */
  deadLetteringOnMessageExpiration?: boolean;
  /**
   * ISO 8601 timeSpan structure that defines the duration of the duplicate detection history. The
   * default value is 10 minutes.
   */
  duplicateDetectionHistoryTimeWindow?: moment.Duration;
  /**
   * The maximum delivery count. A message is automatically deadlettered after this number of
   * deliveries. default value is 10.
   */
  maxDeliveryCount?: number;
  /**
   * Enumerates the possible values for the status of a messaging entity. Possible values include:
   * 'Active', 'Disabled', 'Restoring', 'SendDisabled', 'ReceiveDisabled', 'Creating', 'Deleting',
   * 'Renaming', 'Unknown'
   */
  status?: string;
  /**
   * Value that indicates whether server-side batched operations are enabled.
   */
  enableBatchedOperations?: boolean;
  /**
   * ISO 8061 timeSpan idle interval after which the queue is automatically deleted. The minimum
   * duration is 5 minutes.
   */
  autoDeleteOnIdle?: moment.Duration;
  /**
   * A value that indicates whether the queue is to be partitioned across multiple message brokers.
   */
  enablePartitioning?: boolean;
  /**
   * A value that indicates whether Express Entities are enabled. An express queue holds a message
   * in memory temporarily before writing it to persistent storage.
   */
  enableExpress?: boolean;
  /**
   * Queue/Topic name to forward the messages
   */
  forwardTo?: string;
  /**
   * Queue/Topic name to forward the Dead Letter message
   */
  forwardDeadLetteredMessagesTo?: string;
}

/**
 * Description of topic resource.
 */
export interface SBTopic extends Resource {
  /**
   * Size of the topic, in bytes.
   */
  readonly sizeInBytes?: number;
  /**
   * Exact time the message was created.
   */
  readonly createdAt?: Date;
  /**
   * The exact time the message was updated.
   */
  readonly updatedAt?: Date;
  /**
   * Last time the message was sent, or a request was received, for this topic.
   */
  readonly accessedAt?: Date;
  /**
   * Number of subscriptions.
   */
  readonly subscriptionCount?: number;
  /**
   * Message count details
   */
  readonly countDetails?: MessageCountDetails;
  /**
   * ISO 8601 Default message timespan to live value. This is the duration after which the message
   * expires, starting from when the message is sent to Service Bus. This is the default value used
   * when TimeToLive is not set on a message itself.
   */
  defaultMessageTimeToLive?: moment.Duration;
  /**
   * Maximum size of the topic in megabytes, which is the size of the memory allocated for the
   * topic. Default is 1024.
   */
  maxSizeInMegabytes?: number;
  /**
   * Value indicating if this topic requires duplicate detection.
   */
  requiresDuplicateDetection?: boolean;
  /**
   * ISO8601 timespan structure that defines the duration of the duplicate detection history. The
   * default value is 10 minutes.
   */
  duplicateDetectionHistoryTimeWindow?: moment.Duration;
  /**
   * Value that indicates whether server-side batched operations are enabled.
   */
  enableBatchedOperations?: boolean;
  /**
   * Enumerates the possible values for the status of a messaging entity. Possible values include:
   * 'Active', 'Disabled', 'Restoring', 'SendDisabled', 'ReceiveDisabled', 'Creating', 'Deleting',
   * 'Renaming', 'Unknown'
   */
  status?: string;
  /**
   * Value that indicates whether the topic supports ordering.
   */
  supportOrdering?: boolean;
  /**
   * ISO 8601 timespan idle interval after which the topic is automatically deleted. The minimum
   * duration is 5 minutes.
   */
  autoDeleteOnIdle?: moment.Duration;
  /**
   * Value that indicates whether the topic to be partitioned across multiple message brokers is
   * enabled.
   */
  enablePartitioning?: boolean;
  /**
   * Value that indicates whether Express Entities are enabled. An express topic holds a message in
   * memory temporarily before writing it to persistent storage.
   */
  enableExpress?: boolean;
}

/**
 * Description of subscription resource.
 */
export interface SBSubscription extends Resource {
  /**
   * Number of messages.
   */
  readonly messageCount?: number;
  /**
   * Exact time the message was created.
   */
  readonly createdAt?: Date;
  /**
   * Last time there was a receive request to this subscription.
   */
  readonly accessedAt?: Date;
  /**
   * The exact time the message was updated.
   */
  readonly updatedAt?: Date;
  /**
   * Message count details
   */
  readonly countDetails?: MessageCountDetails;
  /**
   * ISO 8061 lock duration timespan for the subscription. The default value is 1 minute.
   */
  lockDuration?: moment.Duration;
  /**
   * Value indicating if a subscription supports the concept of sessions.
   */
  requiresSession?: boolean;
  /**
   * ISO 8061 Default message timespan to live value. This is the duration after which the message
   * expires, starting from when the message is sent to Service Bus. This is the default value used
   * when TimeToLive is not set on a message itself.
   */
  defaultMessageTimeToLive?: moment.Duration;
  /**
   * Value that indicates whether a subscription has dead letter support on filter evaluation
   * exceptions.
   */
  deadLetteringOnFilterEvaluationExceptions?: boolean;
  /**
   * Value that indicates whether a subscription has dead letter support when a message expires.
   */
  deadLetteringOnMessageExpiration?: boolean;
  /**
   * ISO 8601 timeSpan structure that defines the duration of the duplicate detection history. The
   * default value is 10 minutes.
   */
  duplicateDetectionHistoryTimeWindow?: moment.Duration;
  /**
   * Number of maximum deliveries.
   */
  maxDeliveryCount?: number;
  /**
   * Enumerates the possible values for the status of a messaging entity. Possible values include:
   * 'Active', 'Disabled', 'Restoring', 'SendDisabled', 'ReceiveDisabled', 'Creating', 'Deleting',
   * 'Renaming', 'Unknown'
   */
  status?: string;
  /**
   * Value that indicates whether server-side batched operations are enabled.
   */
  enableBatchedOperations?: boolean;
  /**
   * ISO 8061 timeSpan idle interval after which the topic is automatically deleted. The minimum
   * duration is 5 minutes.
   */
  autoDeleteOnIdle?: moment.Duration;
  /**
   * Queue/Topic name to forward the messages
   */
  forwardTo?: string;
  /**
   * Queue/Topic name to forward the Dead Letter message
   */
  forwardDeadLetteredMessagesTo?: string;
}

/**
 * Description of a Check Name availability request properties.
 */
export interface CheckNameAvailability {
  /**
   * The Name to check the namespace name availability and The namespace name can contain only
   * letters, numbers, and hyphens. The namespace must start with a letter, and it must end with a
   * letter or number.
   */
  name: string;
}

/**
 * Description of a Check Name availability request properties.
 */
export interface CheckNameAvailabilityResult {
  /**
   * The detailed info regarding the reason associated with the namespace.
   */
  readonly message?: string;
  /**
   * Value indicating namespace is availability, true if the namespace is available; otherwise,
   * false.
   */
  nameAvailable?: boolean;
  /**
   * The reason for unavailability of a namespace. Possible values include: 'None', 'InvalidName',
   * 'SubscriptionIsDisabled', 'NameInUse', 'NameInLockdown',
   * 'TooManyNamespaceInCurrentSubscription'
   */
  reason?: string;
}

/**
 * The object that represents the operation.
 */
export interface OperationDisplay {
  /**
   * Service provider: Microsoft.ServiceBus
   */
  readonly provider?: string;
  /**
   * Resource on which the operation is performed: Invoice, etc.
   */
  readonly resource?: string;
  /**
   * Operation type: Read, write, delete, etc.
   */
  readonly operation?: string;
}

/**
 * A ServiceBus REST API operation
 */
export interface Operation {
  /**
   * Operation name: {provider}/{resource}/{operation}
   */
  readonly name?: string;
  /**
   * The object that represents the operation.
   */
  display?: OperationDisplay;
}

/**
 * Error response indicates ServiceBus service is not able to process the incoming request. The
 * reason is provided in the error message.
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
 * Represents the filter actions which are allowed for the transformation of a message that have
 * been matched by a filter expression.
 */
export interface Action {
  /**
   * SQL expression. e.g. MyProperty='ABC'
   */
  sqlExpression?: string;
  /**
   * This property is reserved for future use. An integer value showing the compatibility level,
   * currently hard-coded to 20.
   */
  compatibilityLevel?: number;
  /**
   * Value that indicates whether the rule action requires preprocessing.
   */
  requiresPreprocessing?: boolean;
}

/**
 * Represents a filter which is a composition of an expression and an action that is executed in
 * the pub/sub pipeline.
 */
export interface SqlFilter {
  /**
   * The SQL expression. e.g. MyProperty='ABC'
   */
  sqlExpression?: string;
  /**
   * This property is reserved for future use. An integer value showing the compatibility level,
   * currently hard-coded to 20.
   */
  readonly compatibilityLevel?: number;
  /**
   * Value that indicates whether the rule action requires preprocessing.
   */
  requiresPreprocessing?: boolean;
}

/**
 * Represents the correlation filter expression.
 */
export interface CorrelationFilter {
  /**
   * dictionary object for custom filters
   */
  properties?: { [propertyName: string]: string };
  /**
   * Identifier of the correlation.
   */
  correlationId?: string;
  /**
   * Identifier of the message.
   */
  messageId?: string;
  /**
   * Address to send to.
   */
  to?: string;
  /**
   * Address of the queue to reply to.
   */
  replyTo?: string;
  /**
   * Application specific label.
   */
  label?: string;
  /**
   * Session identifier.
   */
  sessionId?: string;
  /**
   * Session identifier to reply to.
   */
  replyToSessionId?: string;
  /**
   * Content type of the message.
   */
  contentType?: string;
  /**
   * Value that indicates whether the rule action requires preprocessing.
   */
  requiresPreprocessing?: boolean;
}

/**
 * Description of Rule Resource.
 */
export interface Rule extends Resource {
  /**
   * Represents the filter actions which are allowed for the transformation of a message that have
   * been matched by a filter expression.
   */
  action?: Action;
  /**
   * Filter type that is evaluated against a BrokeredMessage. Possible values include: 'SqlFilter',
   * 'CorrelationFilter'
   */
  filterType?: string;
  /**
   * Properties of sqlFilter
   */
  sqlFilter?: SqlFilter;
  /**
   * Properties of correlationFilter
   */
  correlationFilter?: CorrelationFilter;
}

/**
 * Represents set of actions written in SQL language-based syntax that is performed against a
 * ServiceBus.Messaging.BrokeredMessage
 */
export interface SqlRuleAction extends Action {
}

export interface PremiumMessagingRegionsProperties {
  /**
   * Region code
  */
  readonly code?: string;
  /**
   * Full name of the region
  */
  readonly fullName?: string;
}

/**
 * Premium Messaging Region
*/
export interface PremiumMessagingRegions extends ResourceNamespacePatch {
  properties?: PremiumMessagingRegionsProperties;
}

/**
 * Capture storage details for capture description
*/
export interface Destination {
  /**
   * Name for capture destination
  */
  name?: string;
  /**
   * Resource id of the storage account to be used to create the blobs
  */
  storageAccountResourceId?: string;
  /**
   * Blob container Name
  */
  blobContainer?: string;
  /**
   * Blob naming convention for archive, e.g.
   * {Namespace}/{EventHub}/{PartitionId}/{Year}/{Month}/{Day}/{Hour}/{Minute}/{Second}. Here all
   * the parameters (Namespace,EventHub .. etc) are mandatory irrespective of order
  */
  archiveNameFormat?: string;
}

/**
 * Properties to configure capture description for eventhub
*/
export interface CaptureDescription {
  /**
   * A value that indicates whether capture description is enabled.
  */
  enabled?: boolean;
  /**
   * Enumerates the possible values for the encoding format of capture description. Possible values
   * include: 'Avro', 'AvroDeflate'
  */
  encoding?: string;
  /**
   * The time window allows you to set the frequency with which the capture to Azure Blobs will
   * happen, value should between 60 to 900 seconds
  */
  intervalInSeconds?: number;
  /**
   * The size window defines the amount of data built up in your Event Hub before an capture
   * operation, value should be between 10485760 and 524288000 bytes
  */
  sizeLimitInBytes?: number;
  /**
   * Properties of Destination where capture will be stored. (Storage Account, Blob Names)
  */
  destination?: Destination;
}

/**
 * Single item in List or Get Event Hub operation
*/
export interface Eventhub extends Resource {
  /**
   * Current number of shards on the Event Hub.
  */
  readonly partitionIds?: string[];
  /**
   * Exact time the Event Hub was created.
  */
  readonly createdAt?: Date;
  /**
   * The exact time the message was updated.
  */
  readonly updatedAt?: Date;
  /**
   * Number of days to retain the events for this Event Hub, value should be 1 to 7 days
  */
  messageRetentionInDays?: number;
  /**
   * Number of partitions created for the Event Hub, allowed values are from 1 to 32 partitions.
  */
  partitionCount?: number;
  /**
   * Enumerates the possible values for the status of the Event Hub. Possible values include:
   * 'Active', 'Disabled', 'Restoring', 'SendDisabled', 'ReceiveDisabled', 'Creating', 'Deleting',
   * 'Renaming', 'Unknown'
  */
  status?: string;
  /**
   * Properties of capture description
  */
  captureDescription?: CaptureDescription;
}

/**
 * Single item in List or Get Alias(Disaster Recovery configuration) operation
*/
export interface ArmDisasterRecovery extends Resource {
  /**
   * Provisioning state of the Alias(Disaster Recovery configuration) - possible values 'Accepted'
   * or 'Succeeded' or 'Failed'. Possible values include: 'Accepted', 'Succeeded', 'Failed'
  */
  readonly provisioningState?: string;
  /**
   * Number of entities pending to be replicated.
  */
  readonly pendingReplicationOperationsCount?: number;
  /**
   * ARM Id of the Primary/Secondary eventhub namespace name, which is part of GEO DR pairing
  */
  partnerNamespace?: string;
  /**
   * Primary/Secondary eventhub namespace name, which is part of GEO DR pairing
  */
  alternateName?: string;
  /**
   * role of namespace in GEO DR - possible values 'Primary' or 'PrimaryNotReplicating' or
   * 'Secondary'. Possible values include: 'Primary', 'PrimaryNotReplicating', 'Secondary'
  */
  readonly role?: string;
}

/**
 * Single item in List or Get Migration Config operation
*/
export interface MigrationConfigProperties extends Resource {
  /**
   * Provisioning state of Migration Configuration
  */
  readonly provisioningState?: string;
  /**
   * Number of entities pending to be replicated.
  */
  readonly pendingReplicationOperationsCount?: number;
  /**
   * Existing premium Namespace ARM Id name which has no entities, will be used for migration
  */
  targetNamespace: string;
  /**
   * Name to access Standard Namespace after migration
  */
  postMigrationName: string;
  /**
   * State in which Standard to Premium Migration is, possible values : Unknown, Reverting,
   * Completing, Initiating, Syncing, Active
  */
  readonly migrationState?: string;
}

/**
 * Properties supplied for Subnet
*/
export interface Subnet {
  /**
   * Resource ID of Virtual Network Subnet
  */
  id?: string;
}

/**
 * The response from the List namespace operation.
*/
export interface NWRuleSetIpRules {
  /**
   * IP Mask
  */
  ipMask?: string;
  /**
   * The IP Filter Action. Possible values include: 'Allow'
  */
  action?: string;
}

/**
 * The response from the List namespace operation.
*/
export interface NWRuleSetVirtualNetworkRules {
  /**
   * Subnet properties
  */
  subnet?: Subnet;
  /**
   * Value that indicates whether to ignore missing VNet Service Endpoint
  */
  ignoreMissingVnetServiceEndpoint?: boolean;
}

/**
 * Description of NetworkRuleSet resource.
*/
export interface NetworkRuleSet extends Resource {
  /**
   * Default Action for Network Rule Set. Possible values include: 'Allow', 'Deny'
  */
  defaultAction?: string;
  /**
   * List VirtualNetwork Rules
  */
  virtualNetworkRules?: NWRuleSetVirtualNetworkRules[];
  /**
   * List of IpRules
  */
  ipRules?: NWRuleSetIpRules[];
}

/**
 * Result of the request to list ServiceBus operations. It contains a list of operations and a URL
 * link to get the next set of results.
*/
export interface OperationListResult extends Array<Operation> {
  /**
   * URL to get the next set of operation list results if there are any.
  */
  readonly nextLink?: string;
}

/**
 * The response of the List Namespace operation.
*/
export interface SBNamespaceListResult extends Array<SBNamespace> {
  /**
   * Link to the next set of results. Not empty if Value contains incomplete list of Namespaces.
  */
  nextLink?: string;
}

/**
 * The response to the List Namespace operation.
*/
export interface SBAuthorizationRuleListResult extends Array<SBAuthorizationRule> {
  /**
   * Link to the next set of results. Not empty if Value contains incomplete list of Authorization
   * Rules.
  */
  nextLink?: string;
}

/**
 * The result of the List Alias(Disaster Recovery configuration) operation.
*/
export interface ArmDisasterRecoveryListResult extends Array<ArmDisasterRecovery> {
  /**
   * Link to the next set of results. Not empty if Value contains incomplete list of Alias(Disaster
   * Recovery configuration)
  */
  readonly nextLink?: string;
}

/**
 * The result of the List migrationConfigurations operation.
*/
export interface MigrationConfigListResult extends Array<MigrationConfigProperties> {
  /**
   * Link to the next set of results. Not empty if Value contains incomplete list of
   * migrationConfigurations
  */
  readonly nextLink?: string;
}

/**
 * The response to the List Queues operation.
*/
export interface SBQueueListResult extends Array<SBQueue> {
  /**
   * Link to the next set of results. Not empty if Value contains incomplete list of queues.
  */
  nextLink?: string;
}

/**
 * The response to the List Topics operation.
*/
export interface SBTopicListResult extends Array<SBTopic> {
  /**
   * Link to the next set of results. Not empty if Value contains incomplete list of topics.
  */
  nextLink?: string;
}

/**
 * The response to the List Subscriptions operation.
*/
export interface SBSubscriptionListResult extends Array<SBSubscription> {
  /**
   * Link to the next set of results. Not empty if Value contains incomplete list of subscriptions.
  */
  nextLink?: string;
}

/**
 * The response of the List rule operation.
*/
export interface RuleListResult extends Array<Rule> {
  /**
   * Link to the next set of results. Not empty if Value contains incomplete list of rules
  */
  nextLink?: string;
}

/**
 * The response of the List PremiumMessagingRegions operation.
*/
export interface PremiumMessagingRegionsListResult extends Array<PremiumMessagingRegions> {
  /**
   * Link to the next set of results. Not empty if Value contains incomplete list of
   * PremiumMessagingRegions.
  */
  readonly nextLink?: string;
}

/**
 * The result of the List EventHubs operation.
*/
export interface EventHubListResult extends Array<Eventhub> {
  /**
   * Link to the next set of results. Not empty if Value contains incomplete list of EventHubs.
  */
  readonly nextLink?: string;
}
