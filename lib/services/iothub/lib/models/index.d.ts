/*
 * MIT
 */

import { BaseResource } from 'ms-rest-azure';
import { CloudError } from 'ms-rest-azure';

export { BaseResource } from 'ms-rest-azure';
export { CloudError } from 'ms-rest-azure';


/**
 * @class
 * Initializes a new instance of the SharedAccessSignatureAuthorizationRule class.
 * @constructor
 * The properties of an IoT hub shared access policy.
 *
 * @member {string} keyName The name of the shared access policy.
 *
 * @member {string} [primaryKey] The primary key.
 *
 * @member {string} [secondaryKey] The secondary key.
 *
 * @member {string} rights The permissions assigned to the shared access
 * policy. Possible values include: 'RegistryRead', 'RegistryWrite',
 * 'ServiceConnect', 'DeviceConnect', 'RegistryRead, RegistryWrite',
 * 'RegistryRead, ServiceConnect', 'RegistryRead, DeviceConnect',
 * 'RegistryWrite, ServiceConnect', 'RegistryWrite, DeviceConnect',
 * 'ServiceConnect, DeviceConnect', 'RegistryRead, RegistryWrite,
 * ServiceConnect', 'RegistryRead, RegistryWrite, DeviceConnect',
 * 'RegistryRead, ServiceConnect, DeviceConnect', 'RegistryWrite,
 * ServiceConnect, DeviceConnect', 'RegistryRead, RegistryWrite,
 * ServiceConnect, DeviceConnect'
 *
 */
export interface SharedAccessSignatureAuthorizationRule {
  keyName: string;
  primaryKey?: string;
  secondaryKey?: string;
  rights: string;
}

/**
 * @class
 * Initializes a new instance of the IpFilterRule class.
 * @constructor
 * The IP filter rules for the IoT hub.
 *
 * @member {string} filterName The name of the IP filter rule.
 *
 * @member {string} action The desired action for requests captured by this
 * rule. Possible values include: 'Accept', 'Reject'
 *
 * @member {string} ipMask A string that contains the IP address range in CIDR
 * notation for the rule.
 *
 */
export interface IpFilterRule {
  filterName: string;
  action: string;
  ipMask: string;
}

/**
 * @class
 * Initializes a new instance of the EventHubProperties class.
 * @constructor
 * The properties of the provisioned Event Hub-compatible endpoint used by the
 * IoT hub.
 *
 * @member {number} [retentionTimeInDays] The retention time for
 * device-to-cloud messages in days. See:
 * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#device-to-cloud-messages
 *
 * @member {number} [partitionCount] The number of paritions for receiving
 * device-to-cloud messages in the Event Hub-compatible endpoint. See:
 * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#device-to-cloud-messages.
 *
 * @member {array} [partitionIds] The partition ids in the Event Hub-compatible
 * endpoint.
 *
 * @member {string} [path] The Event Hub-compatible name.
 *
 * @member {string} [endpoint] The Event Hub-compatible endpoint.
 *
 */
export interface EventHubProperties {
  retentionTimeInDays?: number;
  partitionCount?: number;
  readonly partitionIds?: string[];
  readonly path?: string;
  readonly endpoint?: string;
}

/**
 * @class
 * Initializes a new instance of the RoutingServiceBusQueueEndpointProperties class.
 * @constructor
 * The properties related to service bus queue endpoint types.
 *
 * @member {string} connectionString The connection string of the service bus
 * queue endpoint.
 *
 * @member {string} name The name of the service bus queue endpoint. The name
 * can only include alphanumeric characters, periods, underscores, hyphens and
 * has a maximum length of 64 characters. The following names are reserved;
 * events, operationsMonitoringEvents, fileNotifications, $default. Endpoint
 * names must be unique across endpoint types. The name need not be the same as
 * the actual queue name.
 *
 * @member {string} [subscriptionId] The subscription identifier of the service
 * bus queue endpoint.
 *
 * @member {string} [resourceGroup] The name of the resource group of the
 * service bus queue endpoint.
 *
 */
export interface RoutingServiceBusQueueEndpointProperties {
  connectionString: string;
  name: string;
  subscriptionId?: string;
  resourceGroup?: string;
}

/**
 * @class
 * Initializes a new instance of the RoutingServiceBusTopicEndpointProperties class.
 * @constructor
 * The properties related to service bus topic endpoint types.
 *
 * @member {string} connectionString The connection string of the service bus
 * topic endpoint.
 *
 * @member {string} name The name of the service bus topic endpoint. The name
 * can only include alphanumeric characters, periods, underscores, hyphens and
 * has a maximum length of 64 characters. The following names are reserved;
 * events, operationsMonitoringEvents, fileNotifications, $default. Endpoint
 * names must be unique across endpoint types.  The name need not be the same
 * as the actual topic name.
 *
 * @member {string} [subscriptionId] The subscription identifier of the service
 * bus topic endpoint.
 *
 * @member {string} [resourceGroup] The name of the resource group of the
 * service bus topic endpoint.
 *
 */
export interface RoutingServiceBusTopicEndpointProperties {
  connectionString: string;
  name: string;
  subscriptionId?: string;
  resourceGroup?: string;
}

/**
 * @class
 * Initializes a new instance of the RoutingEventHubProperties class.
 * @constructor
 * The properties related to an event hub endpoint.
 *
 * @member {string} connectionString The connection string of the event hub
 * endpoint.
 *
 * @member {string} name The name of the event hub endpoint. The name can only
 * include alphanumeric characters, periods, underscores, hyphens and has a
 * maximum length of 64 characters. The following names are reserved;  events,
 * operationsMonitoringEvents, fileNotifications, $default. Endpoint names must
 * be unique across endpoint types.
 *
 * @member {string} [subscriptionId] The subscription identifier of the event
 * hub endpoint.
 *
 * @member {string} [resourceGroup] The name of the resource group of the event
 * hub endpoint.
 *
 */
export interface RoutingEventHubProperties {
  connectionString: string;
  name: string;
  subscriptionId?: string;
  resourceGroup?: string;
}

/**
 * @class
 * Initializes a new instance of the RoutingEndpoints class.
 * @constructor
 * The properties related to the custom endpoints to which your IoT hub routes
 * messages based on the routing rules. A maximum of 10 custom endpoints are
 * allowed across all endpoint types for paid hubs and only 1 custom endpoint
 * is allowed across all endpoint types for free hubs.
 *
 * @member {array} [serviceBusQueues] The list of Service Bus queue endpoints
 * that IoT hub routes the messages to, based on the routing rules.
 *
 * @member {array} [serviceBusTopics] The list of Service Bus topic endpoints
 * that the IoT hub routes the messages to, based on the routing rules.
 *
 * @member {array} [eventHubs] The list of Event Hubs endpoints that IoT hub
 * routes messages to, based on the routing rules. This list does not include
 * the built-in Event Hubs endpoint.
 *
 */
export interface RoutingEndpoints {
  serviceBusQueues?: RoutingServiceBusQueueEndpointProperties[];
  serviceBusTopics?: RoutingServiceBusTopicEndpointProperties[];
  eventHubs?: RoutingEventHubProperties[];
}

/**
 * @class
 * Initializes a new instance of the RouteProperties class.
 * @constructor
 * The properties of a routing rule that your IoT hub uses to route messages to
 * endpoints.
 *
 * @member {string} name The name of the route. The name can only include
 * alphanumeric characters, periods, underscores, hyphens, has a maximum length
 * of 64 characters,  and must be unique.
 *
 * @member {string} source The source that the routing rule is to be applied
 * to, such as DeviceMessages. Possible values include: 'DeviceMessages',
 * 'TwinChangeEvents', 'DeviceLifecycleEvents', 'DeviceJobLifecycleEvents'
 *
 * @member {string} [condition] The condition that is evaluated to apply the
 * routing rule. If no condition is provided, it evaluates to true by default.
 * For grammar, See:
 * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-query-language
 *
 * @member {array} endpointNames The list of endpoints to which messages that
 * satisfy the condition are routed. Currently only one endpoint is allowed.
 *
 * @member {boolean} isEnabled Used to specify whether a route is enabled.
 *
 */
export interface RouteProperties {
  name: string;
  source: string;
  condition?: string;
  endpointNames: string[];
  isEnabled: boolean;
}

/**
 * @class
 * Initializes a new instance of the FallbackRouteProperties class.
 * @constructor
 * The properties related to the fallback route based on which the IoT hub
 * routes messages to the fallback endpoint.
 *
 * @member {string} [condition] The condition which is evaluated in order to
 * apply the fallback route. If the condition is not provided it will evaluate
 * to true by default. For grammar, See:
 * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-query-language
 *
 * @member {array} endpointNames The list of endpoints to which the messages
 * that satisfy the condition are routed to. Currently only 1 endpoint is
 * allowed.
 *
 * @member {boolean} isEnabled Used to specify whether the fallback route is
 * enabled or not.
 *
 */
export interface FallbackRouteProperties {
  condition?: string;
  endpointNames: string[];
  isEnabled: boolean;
}

/**
 * @class
 * Initializes a new instance of the RoutingProperties class.
 * @constructor
 * The routing related properties of the IoT hub. See:
 * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging
 *
 * @member {object} [endpoints]
 *
 * @member {array} [endpoints.serviceBusQueues] The list of Service Bus queue
 * endpoints that IoT hub routes the messages to, based on the routing rules.
 *
 * @member {array} [endpoints.serviceBusTopics] The list of Service Bus topic
 * endpoints that the IoT hub routes the messages to, based on the routing
 * rules.
 *
 * @member {array} [endpoints.eventHubs] The list of Event Hubs endpoints that
 * IoT hub routes messages to, based on the routing rules. This list does not
 * include the built-in Event Hubs endpoint.
 *
 * @member {array} [routes] The list of user-provided routing rules that the
 * IoT hub uses to route messages to built-in and custom endpoints. A maximum
 * of 100 routing rules are allowed for paid hubs and a maximum of 5 routing
 * rules are allowed for free hubs.
 *
 * @member {object} [fallbackRoute] The properties of the route that is used as
 * a fall-back route when none of the conditions specified in the 'routes'
 * section are met. This is an optional parameter. When this property is not
 * set, the messages which do not meet any of the conditions specified in the
 * 'routes' section get routed to the built-in eventhub endpoint.
 *
 * @member {string} [fallbackRoute.condition] The condition which is evaluated
 * in order to apply the fallback route. If the condition is not provided it
 * will evaluate to true by default. For grammar, See:
 * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-query-language
 *
 * @member {array} [fallbackRoute.endpointNames] The list of endpoints to which
 * the messages that satisfy the condition are routed to. Currently only 1
 * endpoint is allowed.
 *
 * @member {boolean} [fallbackRoute.isEnabled] Used to specify whether the
 * fallback route is enabled or not.
 *
 */
export interface RoutingProperties {
  endpoints?: RoutingEndpoints;
  routes?: RouteProperties[];
  fallbackRoute?: FallbackRouteProperties;
}

/**
 * @class
 * Initializes a new instance of the StorageEndpointProperties class.
 * @constructor
 * The properties of the Azure Storage endpoint for file upload.
 *
 * @member {moment.duration} [sasTtlAsIso8601] The period of time for which the
 * the SAS URI generated by IoT Hub for file upload is valid. See:
 * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-file-upload#file-upload-notification-configuration-options.
 *
 * @member {string} connectionString The connection string for the Azure
 * Storage account to which files are uploaded.
 *
 * @member {string} containerName The name of the root container where you
 * upload files. The container need not exist but should be creatable using the
 * connectionString specified.
 *
 */
export interface StorageEndpointProperties {
  sasTtlAsIso8601?: moment.Duration;
  connectionString: string;
  containerName: string;
}

/**
 * @class
 * Initializes a new instance of the MessagingEndpointProperties class.
 * @constructor
 * The properties of the messaging endpoints used by this IoT hub.
 *
 * @member {moment.duration} [lockDurationAsIso8601] The lock duration. See:
 * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-file-upload.
 *
 * @member {moment.duration} [ttlAsIso8601] The period of time for which a
 * message is available to consume before it is expired by the IoT hub. See:
 * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-file-upload.
 *
 * @member {number} [maxDeliveryCount] The number of times the IoT hub attempts
 * to deliver a message. See:
 * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-file-upload.
 *
 */
export interface MessagingEndpointProperties {
  lockDurationAsIso8601?: moment.Duration;
  ttlAsIso8601?: moment.Duration;
  maxDeliveryCount?: number;
}

/**
 * @class
 * Initializes a new instance of the FeedbackProperties class.
 * @constructor
 * The properties of the feedback queue for cloud-to-device messages.
 *
 * @member {moment.duration} [lockDurationAsIso8601] The lock duration for the
 * feedback queue. See:
 * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#cloud-to-device-messages.
 *
 * @member {moment.duration} [ttlAsIso8601] The period of time for which a
 * message is available to consume before it is expired by the IoT hub. See:
 * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#cloud-to-device-messages.
 *
 * @member {number} [maxDeliveryCount] The number of times the IoT hub attempts
 * to deliver a message on the feedback queue. See:
 * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#cloud-to-device-messages.
 *
 */
export interface FeedbackProperties {
  lockDurationAsIso8601?: moment.Duration;
  ttlAsIso8601?: moment.Duration;
  maxDeliveryCount?: number;
}

/**
 * @class
 * Initializes a new instance of the CloudToDeviceProperties class.
 * @constructor
 * The IoT hub cloud-to-device messaging properties.
 *
 * @member {number} [maxDeliveryCount] The max delivery count for
 * cloud-to-device messages in the device queue. See:
 * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#cloud-to-device-messages.
 *
 * @member {moment.duration} [defaultTtlAsIso8601] The default time to live for
 * cloud-to-device messages in the device queue. See:
 * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#cloud-to-device-messages.
 *
 * @member {object} [feedback]
 *
 * @member {moment.duration} [feedback.lockDurationAsIso8601] The lock duration
 * for the feedback queue. See:
 * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#cloud-to-device-messages.
 *
 * @member {moment.duration} [feedback.ttlAsIso8601] The period of time for
 * which a message is available to consume before it is expired by the IoT hub.
 * See:
 * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#cloud-to-device-messages.
 *
 * @member {number} [feedback.maxDeliveryCount] The number of times the IoT hub
 * attempts to deliver a message on the feedback queue. See:
 * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#cloud-to-device-messages.
 *
 */
export interface CloudToDeviceProperties {
  maxDeliveryCount?: number;
  defaultTtlAsIso8601?: moment.Duration;
  feedback?: FeedbackProperties;
}

/**
 * @class
 * Initializes a new instance of the OperationsMonitoringProperties class.
 * @constructor
 * The operations monitoring properties for the IoT hub. The possible keys to
 * the dictionary are Connections, DeviceTelemetry, C2DCommands,
 * DeviceIdentityOperations, FileUploadOperations, Routes, D2CTwinOperations,
 * C2DTwinOperations, TwinQueries, JobsOperations, DirectMethods.
 *
 * @member {object} [events]
 *
 */
export interface OperationsMonitoringProperties {
  events?: { [propertyName: string]: string };
}

/**
 * @class
 * Initializes a new instance of the IotHubProperties class.
 * @constructor
 * The properties of an IoT hub.
 *
 * @member {array} [authorizationPolicies] The shared access policies you can
 * use to secure a connection to the IoT hub.
 *
 * @member {array} [ipFilterRules] The IP filter rules.
 *
 * @member {string} [provisioningState] The provisioning state.
 *
 * @member {string} [hostName] The name of the host.
 *
 * @member {object} [eventHubEndpoints] The Event Hub-compatible endpoint
 * properties. The possible keys to this dictionary are events and
 * operationsMonitoringEvents. Both of these keys have to be present in the
 * dictionary while making create or update calls for the IoT hub.
 *
 * @member {object} [routing]
 *
 * @member {object} [routing.endpoints]
 *
 * @member {array} [routing.endpoints.serviceBusQueues] The list of Service Bus
 * queue endpoints that IoT hub routes the messages to, based on the routing
 * rules.
 *
 * @member {array} [routing.endpoints.serviceBusTopics] The list of Service Bus
 * topic endpoints that the IoT hub routes the messages to, based on the
 * routing rules.
 *
 * @member {array} [routing.endpoints.eventHubs] The list of Event Hubs
 * endpoints that IoT hub routes messages to, based on the routing rules. This
 * list does not include the built-in Event Hubs endpoint.
 *
 * @member {array} [routing.routes] The list of user-provided routing rules
 * that the IoT hub uses to route messages to built-in and custom endpoints. A
 * maximum of 100 routing rules are allowed for paid hubs and a maximum of 5
 * routing rules are allowed for free hubs.
 *
 * @member {object} [routing.fallbackRoute] The properties of the route that is
 * used as a fall-back route when none of the conditions specified in the
 * 'routes' section are met. This is an optional parameter. When this property
 * is not set, the messages which do not meet any of the conditions specified
 * in the 'routes' section get routed to the built-in eventhub endpoint.
 *
 * @member {string} [routing.fallbackRoute.condition] The condition which is
 * evaluated in order to apply the fallback route. If the condition is not
 * provided it will evaluate to true by default. For grammar, See:
 * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-query-language
 *
 * @member {array} [routing.fallbackRoute.endpointNames] The list of endpoints
 * to which the messages that satisfy the condition are routed to. Currently
 * only 1 endpoint is allowed.
 *
 * @member {boolean} [routing.fallbackRoute.isEnabled] Used to specify whether
 * the fallback route is enabled or not.
 *
 * @member {object} [storageEndpoints] The list of Azure Storage endpoints
 * where you can upload files. Currently you can configure only one Azure
 * Storage account and that MUST have its key as $default. Specifying more than
 * one storage account causes an error to be thrown. Not specifying a value for
 * this property when the enableFileUploadNotifications property is set to
 * True, causes an error to be thrown.
 *
 * @member {object} [messagingEndpoints] The messaging endpoint properties for
 * the file upload notification queue.
 *
 * @member {boolean} [enableFileUploadNotifications] If True, file upload
 * notifications are enabled.
 *
 * @member {object} [cloudToDevice]
 *
 * @member {number} [cloudToDevice.maxDeliveryCount] The max delivery count for
 * cloud-to-device messages in the device queue. See:
 * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#cloud-to-device-messages.
 *
 * @member {moment.duration} [cloudToDevice.defaultTtlAsIso8601] The default
 * time to live for cloud-to-device messages in the device queue. See:
 * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#cloud-to-device-messages.
 *
 * @member {object} [cloudToDevice.feedback]
 *
 * @member {moment.duration} [cloudToDevice.feedback.lockDurationAsIso8601] The
 * lock duration for the feedback queue. See:
 * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#cloud-to-device-messages.
 *
 * @member {moment.duration} [cloudToDevice.feedback.ttlAsIso8601] The period
 * of time for which a message is available to consume before it is expired by
 * the IoT hub. See:
 * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#cloud-to-device-messages.
 *
 * @member {number} [cloudToDevice.feedback.maxDeliveryCount] The number of
 * times the IoT hub attempts to deliver a message on the feedback queue. See:
 * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#cloud-to-device-messages.
 *
 * @member {string} [comments] Comments.
 *
 * @member {object} [operationsMonitoringProperties]
 *
 * @member {object} [operationsMonitoringProperties.events]
 *
 * @member {string} [features] The capabilities and features enabled for the
 * IoT hub. Possible values include: 'None', 'DeviceManagement'
 *
 */
export interface IotHubProperties {
  authorizationPolicies?: SharedAccessSignatureAuthorizationRule[];
  ipFilterRules?: IpFilterRule[];
  readonly provisioningState?: string;
  readonly hostName?: string;
  eventHubEndpoints?: { [propertyName: string]: EventHubProperties };
  routing?: RoutingProperties;
  storageEndpoints?: { [propertyName: string]: StorageEndpointProperties };
  messagingEndpoints?: { [propertyName: string]: MessagingEndpointProperties };
  enableFileUploadNotifications?: boolean;
  cloudToDevice?: CloudToDeviceProperties;
  comments?: string;
  operationsMonitoringProperties?: OperationsMonitoringProperties;
  features?: string;
}

/**
 * @class
 * Initializes a new instance of the IotHubSkuInfo class.
 * @constructor
 * Information about the SKU of the IoT hub.
 *
 * @member {string} name The name of the SKU. Possible values include: 'F1',
 * 'S1', 'S2', 'S3'
 *
 * @member {string} [tier] The billing tier for the IoT hub. Possible values
 * include: 'Free', 'Standard'
 *
 * @member {number} capacity The number of provisioned IoT Hub units. See:
 * https://docs.microsoft.com/azure/azure-subscription-service-limits#iot-hub-limits.
 *
 */
export interface IotHubSkuInfo {
  name: string;
  readonly tier?: string;
  capacity: number;
}

/**
 * @class
 * Initializes a new instance of the Resource class.
 * @constructor
 * The common properties of an Azure resource.
 *
 * @member {string} [id] The resource identifier.
 *
 * @member {string} [name] The resource name.
 *
 * @member {string} [type] The resource type.
 *
 * @member {string} location The resource location.
 *
 * @member {object} [tags] The resource tags.
 *
 */
export interface Resource extends BaseResource {
  readonly id?: string;
  readonly name?: string;
  readonly type?: string;
  location: string;
  tags?: { [propertyName: string]: string };
}

/**
 * @class
 * Initializes a new instance of the IotHubDescription class.
 * @constructor
 * The description of the IoT hub.
 *
 * @member {string} subscriptionid The subscription identifier.
 *
 * @member {string} resourcegroup The name of the resource group that contains
 * the IoT hub. A resource group name uniquely identifies the resource group
 * within the subscription.
 *
 * @member {string} [etag] The Etag field is *not* required. If it is provided
 * in the response body, it must also be provided as a header per the normal
 * ETag convention.
 *
 * @member {object} [properties]
 *
 * @member {array} [properties.authorizationPolicies] The shared access
 * policies you can use to secure a connection to the IoT hub.
 *
 * @member {array} [properties.ipFilterRules] The IP filter rules.
 *
 * @member {string} [properties.provisioningState] The provisioning state.
 *
 * @member {string} [properties.hostName] The name of the host.
 *
 * @member {object} [properties.eventHubEndpoints] The Event Hub-compatible
 * endpoint properties. The possible keys to this dictionary are events and
 * operationsMonitoringEvents. Both of these keys have to be present in the
 * dictionary while making create or update calls for the IoT hub.
 *
 * @member {object} [properties.routing]
 *
 * @member {object} [properties.routing.endpoints]
 *
 * @member {array} [properties.routing.endpoints.serviceBusQueues] The list of
 * Service Bus queue endpoints that IoT hub routes the messages to, based on
 * the routing rules.
 *
 * @member {array} [properties.routing.endpoints.serviceBusTopics] The list of
 * Service Bus topic endpoints that the IoT hub routes the messages to, based
 * on the routing rules.
 *
 * @member {array} [properties.routing.endpoints.eventHubs] The list of Event
 * Hubs endpoints that IoT hub routes messages to, based on the routing rules.
 * This list does not include the built-in Event Hubs endpoint.
 *
 * @member {array} [properties.routing.routes] The list of user-provided
 * routing rules that the IoT hub uses to route messages to built-in and custom
 * endpoints. A maximum of 100 routing rules are allowed for paid hubs and a
 * maximum of 5 routing rules are allowed for free hubs.
 *
 * @member {object} [properties.routing.fallbackRoute] The properties of the
 * route that is used as a fall-back route when none of the conditions
 * specified in the 'routes' section are met. This is an optional parameter.
 * When this property is not set, the messages which do not meet any of the
 * conditions specified in the 'routes' section get routed to the built-in
 * eventhub endpoint.
 *
 * @member {string} [properties.routing.fallbackRoute.condition] The condition
 * which is evaluated in order to apply the fallback route. If the condition is
 * not provided it will evaluate to true by default. For grammar, See:
 * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-query-language
 *
 * @member {array} [properties.routing.fallbackRoute.endpointNames] The list of
 * endpoints to which the messages that satisfy the condition are routed to.
 * Currently only 1 endpoint is allowed.
 *
 * @member {boolean} [properties.routing.fallbackRoute.isEnabled] Used to
 * specify whether the fallback route is enabled or not.
 *
 * @member {object} [properties.storageEndpoints] The list of Azure Storage
 * endpoints where you can upload files. Currently you can configure only one
 * Azure Storage account and that MUST have its key as $default. Specifying
 * more than one storage account causes an error to be thrown. Not specifying a
 * value for this property when the enableFileUploadNotifications property is
 * set to True, causes an error to be thrown.
 *
 * @member {object} [properties.messagingEndpoints] The messaging endpoint
 * properties for the file upload notification queue.
 *
 * @member {boolean} [properties.enableFileUploadNotifications] If True, file
 * upload notifications are enabled.
 *
 * @member {object} [properties.cloudToDevice]
 *
 * @member {number} [properties.cloudToDevice.maxDeliveryCount] The max
 * delivery count for cloud-to-device messages in the device queue. See:
 * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#cloud-to-device-messages.
 *
 * @member {moment.duration} [properties.cloudToDevice.defaultTtlAsIso8601] The
 * default time to live for cloud-to-device messages in the device queue. See:
 * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#cloud-to-device-messages.
 *
 * @member {object} [properties.cloudToDevice.feedback]
 *
 * @member {moment.duration}
 * [properties.cloudToDevice.feedback.lockDurationAsIso8601] The lock duration
 * for the feedback queue. See:
 * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#cloud-to-device-messages.
 *
 * @member {moment.duration} [properties.cloudToDevice.feedback.ttlAsIso8601]
 * The period of time for which a message is available to consume before it is
 * expired by the IoT hub. See:
 * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#cloud-to-device-messages.
 *
 * @member {number} [properties.cloudToDevice.feedback.maxDeliveryCount] The
 * number of times the IoT hub attempts to deliver a message on the feedback
 * queue. See:
 * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#cloud-to-device-messages.
 *
 * @member {string} [properties.comments] Comments.
 *
 * @member {object} [properties.operationsMonitoringProperties]
 *
 * @member {object} [properties.operationsMonitoringProperties.events]
 *
 * @member {string} [properties.features] The capabilities and features enabled
 * for the IoT hub. Possible values include: 'None', 'DeviceManagement'
 *
 * @member {object} sku
 *
 * @member {string} [sku.name] The name of the SKU. Possible values include:
 * 'F1', 'S1', 'S2', 'S3'
 *
 * @member {string} [sku.tier] The billing tier for the IoT hub. Possible
 * values include: 'Free', 'Standard'
 *
 * @member {number} [sku.capacity] The number of provisioned IoT Hub units.
 * See:
 * https://docs.microsoft.com/azure/azure-subscription-service-limits#iot-hub-limits.
 *
 */
export interface IotHubDescription extends Resource {
  subscriptionid: string;
  resourcegroup: string;
  etag?: string;
  properties?: IotHubProperties;
  sku: IotHubSkuInfo;
}

/**
 * @class
 * Initializes a new instance of the SharedAccessSignatureAuthorizationRuleListResult class.
 * @constructor
 * The list of shared access policies with a next link.
 *
 * @member {array} [value] The list of shared access policies.
 *
 * @member {string} [nextLink] The next link.
 *
 */
export interface SharedAccessSignatureAuthorizationRuleListResult {
  value?: SharedAccessSignatureAuthorizationRule[];
  readonly nextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the ErrorDetails class.
 * @constructor
 * Error details.
 *
 * @member {string} [code] The error code.
 *
 * @member {string} [httpStatusCode] The HTTP status code.
 *
 * @member {string} [message] The error message.
 *
 * @member {string} [details] The error details.
 *
 */
export interface ErrorDetails {
  readonly code?: string;
  readonly httpStatusCode?: string;
  readonly message?: string;
  readonly details?: string;
}

/**
 * @class
 * Initializes a new instance of the IotHubQuotaMetricInfo class.
 * @constructor
 * Quota metrics properties.
 *
 * @member {string} [name] The name of the quota metric.
 *
 * @member {number} [currentValue] The current value for the quota metric.
 *
 * @member {number} [maxValue] The maximum value of the quota metric.
 *
 */
export interface IotHubQuotaMetricInfo {
  readonly name?: string;
  readonly currentValue?: number;
  readonly maxValue?: number;
}

/**
 * @class
 * Initializes a new instance of the IotHubQuotaMetricInfoListResult class.
 * @constructor
 * The JSON-serialized array of IotHubQuotaMetricInfo objects with a next link.
 *
 * @member {array} [value] The array of quota metrics objects.
 *
 * @member {string} [nextLink] The next link.
 *
 */
export interface IotHubQuotaMetricInfoListResult {
  value?: IotHubQuotaMetricInfo[];
  readonly nextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the RegistryStatistics class.
 * @constructor
 * Identity registry statistics.
 *
 * @member {number} [totalDeviceCount] The total count of devices in the
 * identity registry.
 *
 * @member {number} [enabledDeviceCount] The count of enabled devices in the
 * identity registry.
 *
 * @member {number} [disabledDeviceCount] The count of disabled devices in the
 * identity registry.
 *
 */
export interface RegistryStatistics {
  readonly totalDeviceCount?: number;
  readonly enabledDeviceCount?: number;
  readonly disabledDeviceCount?: number;
}

/**
 * @class
 * Initializes a new instance of the JobResponse class.
 * @constructor
 * The properties of the Job Response object.
 *
 * @member {string} [jobId] The job identifier.
 *
 * @member {date} [startTimeUtc] The start time of the job.
 *
 * @member {date} [endTimeUtc] The time the job stopped processing.
 *
 * @member {string} [type] The type of the job. Possible values include:
 * 'unknown', 'export', 'import', 'backup', 'readDeviceProperties',
 * 'writeDeviceProperties', 'updateDeviceConfiguration', 'rebootDevice',
 * 'factoryResetDevice', 'firmwareUpdate'
 *
 * @member {string} [status] The status of the job. Possible values include:
 * 'unknown', 'enqueued', 'running', 'completed', 'failed', 'cancelled'
 *
 * @member {string} [failureReason] If status == failed, this string containing
 * the reason for the failure.
 *
 * @member {string} [statusMessage] The status message for the job.
 *
 * @member {string} [parentJobId] The job identifier of the parent job, if any.
 *
 */
export interface JobResponse {
  readonly jobId?: string;
  readonly startTimeUtc?: Date;
  readonly endTimeUtc?: Date;
  readonly type?: string;
  readonly status?: string;
  readonly failureReason?: string;
  readonly statusMessage?: string;
  readonly parentJobId?: string;
}

/**
 * @class
 * Initializes a new instance of the JobResponseListResult class.
 * @constructor
 * The JSON-serialized array of JobResponse objects with a next link.
 *
 * @member {array} [value] The array of JobResponse objects.
 *
 * @member {string} [nextLink] The next link.
 *
 */
export interface JobResponseListResult {
  value?: JobResponse[];
  readonly nextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the IotHubCapacity class.
 * @constructor
 * IoT Hub capacity information.
 *
 * @member {number} [minimum] The minimum number of units.
 *
 * @member {number} [maximum] The maximum number of units.
 *
 * @member {number} [default] The default number of units.
 *
 * @member {string} [scaleType] The type of the scaling enabled. Possible
 * values include: 'Automatic', 'Manual', 'None'
 *
 */
export interface IotHubCapacity {
  readonly minimum?: number;
  readonly maximum?: number;
  readonly default?: number;
  readonly scaleType?: string;
}

/**
 * @class
 * Initializes a new instance of the IotHubSkuDescription class.
 * @constructor
 * SKU properties.
 *
 * @member {string} [resourceType] The type of the resource.
 *
 * @member {object} sku
 *
 * @member {string} [sku.name] The name of the SKU. Possible values include:
 * 'F1', 'S1', 'S2', 'S3'
 *
 * @member {string} [sku.tier] The billing tier for the IoT hub. Possible
 * values include: 'Free', 'Standard'
 *
 * @member {number} [sku.capacity] The number of provisioned IoT Hub units.
 * See:
 * https://docs.microsoft.com/azure/azure-subscription-service-limits#iot-hub-limits.
 *
 * @member {object} capacity
 *
 * @member {number} [capacity.minimum] The minimum number of units.
 *
 * @member {number} [capacity.maximum] The maximum number of units.
 *
 * @member {number} [capacity.default] The default number of units.
 *
 * @member {string} [capacity.scaleType] The type of the scaling enabled.
 * Possible values include: 'Automatic', 'Manual', 'None'
 *
 */
export interface IotHubSkuDescription {
  readonly resourceType?: string;
  sku: IotHubSkuInfo;
  capacity: IotHubCapacity;
}

/**
 * @class
 * Initializes a new instance of the EventHubConsumerGroupsListResult class.
 * @constructor
 * The JSON-serialized array of Event Hub-compatible consumer group names with
 * a next link.
 *
 * @member {array} [value] The array of Event Hub-compatible consumer group
 * names.
 *
 * @member {string} [nextLink] The next link.
 *
 */
export interface EventHubConsumerGroupsListResult {
  value?: string[];
  readonly nextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the EventHubConsumerGroupInfo class.
 * @constructor
 * The properties of the EventHubConsumerGroupInfo object.
 *
 * @member {object} [tags] The tags.
 *
 * @member {string} [id] The Event Hub-compatible consumer group identifier.
 *
 * @member {string} [name] The Event Hub-compatible consumer group name.
 *
 */
export interface EventHubConsumerGroupInfo {
  tags?: { [propertyName: string]: string };
  id?: string;
  name?: string;
}

/**
 * @class
 * Initializes a new instance of the IotHubSkuDescriptionListResult class.
 * @constructor
 * The JSON-serialized array of IotHubSkuDescription objects with a next link.
 *
 * @member {array} [value] The array of IotHubSkuDescription.
 *
 * @member {string} [nextLink] The next link.
 *
 */
export interface IotHubSkuDescriptionListResult {
  value?: IotHubSkuDescription[];
  readonly nextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the IotHubDescriptionListResult class.
 * @constructor
 * The JSON-serialized array of IotHubDescription objects with a next link.
 *
 * @member {array} [value] The array of IotHubDescription objects.
 *
 * @member {string} [nextLink] The next link.
 *
 */
export interface IotHubDescriptionListResult {
  value?: IotHubDescription[];
  readonly nextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the OperationInputs class.
 * @constructor
 * Input values.
 *
 * @member {string} name The name of the IoT hub to check.
 *
 */
export interface OperationInputs {
  name: string;
}

/**
 * @class
 * Initializes a new instance of the IotHubNameAvailabilityInfo class.
 * @constructor
 * The properties indicating whether a given IoT hub name is available.
 *
 * @member {boolean} [nameAvailable] The value which indicates whether the
 * provided name is available.
 *
 * @member {string} [reason] The reason for unavailability. Possible values
 * include: 'Invalid', 'AlreadyExists'
 *
 * @member {string} [message] The detailed reason message.
 *
 */
export interface IotHubNameAvailabilityInfo {
  readonly nameAvailable?: boolean;
  readonly reason?: string;
  message?: string;
}

/**
 * @class
 * Initializes a new instance of the ExportDevicesRequest class.
 * @constructor
 * Use to provide parameters when requesting an export of all devices in the
 * IoT hub.
 *
 * @member {string} exportBlobContainerUri The export blob container URI.
 *
 * @member {boolean} excludeKeys The value indicating whether keys should be
 * excluded during export.
 *
 */
export interface ExportDevicesRequest {
  exportBlobContainerUri: string;
  excludeKeys: boolean;
}

/**
 * @class
 * Initializes a new instance of the ImportDevicesRequest class.
 * @constructor
 * Use to provide parameters when requesting an import of all devices in the
 * hub.
 *
 * @member {string} inputBlobContainerUri The input blob container URI.
 *
 * @member {string} outputBlobContainerUri The output blob container URI.
 *
 */
export interface ImportDevicesRequest {
  inputBlobContainerUri: string;
  outputBlobContainerUri: string;
}

/**
 * @class
 * Initializes a new instance of the IotHubDescriptionListResult class.
 * @constructor
 * The JSON-serialized array of IotHubDescription objects with a next link.
 *
 * @member {array} [value] The array of IotHubDescription objects.
 *
 * @member {string} [nextLink] The next link.
 *
 */
export interface IotHubDescriptionListResult {
  value?: IotHubDescription[];
  readonly nextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the IotHubSkuDescriptionListResult class.
 * @constructor
 * The JSON-serialized array of IotHubSkuDescription objects with a next link.
 *
 * @member {array} [value] The array of IotHubSkuDescription.
 *
 * @member {string} [nextLink] The next link.
 *
 */
export interface IotHubSkuDescriptionListResult {
  value?: IotHubSkuDescription[];
  readonly nextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the EventHubConsumerGroupsListResult class.
 * @constructor
 * The JSON-serialized array of Event Hub-compatible consumer group names with
 * a next link.
 *
 * @member {array} [value] The array of Event Hub-compatible consumer group
 * names.
 *
 * @member {string} [nextLink] The next link.
 *
 */
export interface EventHubConsumerGroupsListResult {
  value?: string[];
  readonly nextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the JobResponseListResult class.
 * @constructor
 * The JSON-serialized array of JobResponse objects with a next link.
 *
 * @member {array} [value] The array of JobResponse objects.
 *
 * @member {string} [nextLink] The next link.
 *
 */
export interface JobResponseListResult {
  value?: JobResponse[];
  readonly nextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the IotHubQuotaMetricInfoListResult class.
 * @constructor
 * The JSON-serialized array of IotHubQuotaMetricInfo objects with a next link.
 *
 * @member {array} [value] The array of quota metrics objects.
 *
 * @member {string} [nextLink] The next link.
 *
 */
export interface IotHubQuotaMetricInfoListResult {
  value?: IotHubQuotaMetricInfo[];
  readonly nextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the SharedAccessSignatureAuthorizationRuleListResult class.
 * @constructor
 * The list of shared access policies with a next link.
 *
 * @member {array} [value] The list of shared access policies.
 *
 * @member {string} [nextLink] The next link.
 *
 */
export interface SharedAccessSignatureAuthorizationRuleListResult {
  value?: SharedAccessSignatureAuthorizationRule[];
  readonly nextLink?: string;
}


/**
 * @class
 * Initializes a new instance of the IotHubDescriptionListResult class.
 * @constructor
 * The JSON-serialized array of IotHubDescription objects with a next link.
 *
 * @member {string} [nextLink] The next link.
 *
 */
export interface IotHubDescriptionListResult extends Array<IotHubDescription> {
  readonly nextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the IotHubSkuDescriptionListResult class.
 * @constructor
 * The JSON-serialized array of IotHubSkuDescription objects with a next link.
 *
 * @member {string} [nextLink] The next link.
 *
 */
export interface IotHubSkuDescriptionListResult extends Array<IotHubSkuDescription> {
  readonly nextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the EventHubConsumerGroupsListResult class.
 * @constructor
 * The JSON-serialized array of Event Hub-compatible consumer group names with
 * a next link.
 *
 * @member {string} [nextLink] The next link.
 *
 */
export interface EventHubConsumerGroupsListResult extends Array<string> {
  readonly nextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the JobResponseListResult class.
 * @constructor
 * The JSON-serialized array of JobResponse objects with a next link.
 *
 * @member {string} [nextLink] The next link.
 *
 */
export interface JobResponseListResult extends Array<JobResponse> {
  readonly nextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the IotHubQuotaMetricInfoListResult class.
 * @constructor
 * The JSON-serialized array of IotHubQuotaMetricInfo objects with a next link.
 *
 * @member {string} [nextLink] The next link.
 *
 */
export interface IotHubQuotaMetricInfoListResult extends Array<IotHubQuotaMetricInfo> {
  readonly nextLink?: string;
}

/**
 * @class
 * Initializes a new instance of the SharedAccessSignatureAuthorizationRuleListResult class.
 * @constructor
 * The list of shared access policies with a next link.
 *
 * @member {string} [nextLink] The next link.
 *
 */
export interface SharedAccessSignatureAuthorizationRuleListResult extends Array<SharedAccessSignatureAuthorizationRule> {
  readonly nextLink?: string;
}
