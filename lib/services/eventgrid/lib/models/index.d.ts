/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */

import { BaseResource } from 'ms-rest-azure';
import { CloudError } from 'ms-rest-azure';
import * as moment from 'moment';

export { BaseResource } from 'ms-rest-azure';
export { CloudError } from 'ms-rest-azure';


/**
 * @class
 * Initializes a new instance of the StorageBlobCreatedEventData class.
 * @constructor
 * Schema of the Data property of an EventGridEvent for an
 * Microsoft.Storage.BlobCreated event.
 *
 * @member {string} [api] The name of the API/operation that triggered this
 * event.
 * @member {string} [clientRequestId] A request id provided by the client of
 * the storage API operation that triggered this event.
 * @member {string} [requestId] The request id generated by the Storage service
 * for the storage API operation that triggered this event.
 * @member {string} [eTag] The etag of the object at the time this event was
 * triggered.
 * @member {string} [contentType] The content type of the blob. This is the
 * same as what would be returned in the Content-Type header from the blob.
 * @member {number} [contentLength] The size of the blob in bytes. This is the
 * same as what would be returned in the Content-Length header from the blob.
 * @member {string} [blobType] The type of blob.
 * @member {string} [url] The path to the blob.
 * @member {string} [sequencer] An opaque string value representing the logical
 * sequence of events for any particular blob name. Users can use standard
 * string comparison to understand the relative sequence of two events on the
 * same blob name.
 * @member {object} [storageDiagnostics] For service use only. Diagnostic data
 * occasionally included by the Azure Storage service. This property should be
 * ignored by event consumers.
 */
export interface StorageBlobCreatedEventData {
  api?: string;
  clientRequestId?: string;
  requestId?: string;
  eTag?: string;
  contentType?: string;
  contentLength?: number;
  blobType?: string;
  url?: string;
  sequencer?: string;
  storageDiagnostics?: any;
}

/**
 * @class
 * Initializes a new instance of the StorageBlobDeletedEventData class.
 * @constructor
 * Schema of the Data property of an EventGridEvent for an
 * Microsoft.Storage.BlobDeleted event.
 *
 * @member {string} [api] The name of the API/operation that triggered this
 * event.
 * @member {string} [clientRequestId] A request id provided by the client of
 * the storage API operation that triggered this event.
 * @member {string} [requestId] The request id generated by the Storage service
 * for the storage API operation that triggered this event.
 * @member {string} [contentType] The content type of the blob. This is the
 * same as what would be returned in the Content-Type header from the blob.
 * @member {string} [blobType] The type of blob.
 * @member {string} [url] The path to the blob.
 * @member {string} [sequencer] An opaque string value representing the logical
 * sequence of events for any particular blob name. Users can use standard
 * string comparison to understand the relative sequence of two events on the
 * same blob name.
 * @member {object} [storageDiagnostics] For service use only. Diagnostic data
 * occasionally included by the Azure Storage service. This property should be
 * ignored by event consumers.
 */
export interface StorageBlobDeletedEventData {
  api?: string;
  clientRequestId?: string;
  requestId?: string;
  contentType?: string;
  blobType?: string;
  url?: string;
  sequencer?: string;
  storageDiagnostics?: any;
}

/**
 * @class
 * Initializes a new instance of the EventHubCaptureFileCreatedEventData class.
 * @constructor
 * Schema of the Data property of an EventGridEvent for an
 * Microsoft.EventHub.CaptureFileCreated event.
 *
 * @member {string} [fileurl] The path to the capture file.
 * @member {string} [fileType] The file type of the capture file.
 * @member {string} [partitionId] The shard ID.
 * @member {number} [sizeInBytes] The file size.
 * @member {number} [eventCount] The number of events in the file.
 * @member {number} [firstSequenceNumber] The smallest sequence number from the
 * queue.
 * @member {number} [lastSequenceNumber] The last sequence number from the
 * queue.
 * @member {date} [firstEnqueueTime] The first time from the queue.
 * @member {date} [lastEnqueueTime] The last time from the queue.
 */
export interface EventHubCaptureFileCreatedEventData {
  fileurl?: string;
  fileType?: string;
  partitionId?: string;
  sizeInBytes?: number;
  eventCount?: number;
  firstSequenceNumber?: number;
  lastSequenceNumber?: number;
  firstEnqueueTime?: Date;
  lastEnqueueTime?: Date;
}

/**
 * @class
 * Initializes a new instance of the ResourceWriteSuccessData class.
 * @constructor
 * Schema of the Data property of an EventGridEvent for a
 * Microsoft.Resources.ResourceWriteSuccess event. This is raised when a
 * resource create or update operation succeeds.
 *
 * @member {string} [tenantId] The tenant ID of the resource.
 * @member {string} [subscriptionId] The subscription ID of the resource.
 * @member {string} [resourceGroup] The resource group of the resource.
 * @member {string} [resourceProvider] The resource provider performing the
 * operation.
 * @member {string} [resourceUri] The URI of the resource in the operation.
 * @member {string} [operationName] The operation that was performed.
 * @member {string} [status] The status of the operation.
 * @member {string} [authorization] The requested authorization for the
 * operation.
 * @member {string} [claims] The properties of the claims.
 * @member {string} [correlationId] An operation ID used for troubleshooting.
 * @member {string} [httpRequest] The details of the operation.
 */
export interface ResourceWriteSuccessData {
  tenantId?: string;
  subscriptionId?: string;
  resourceGroup?: string;
  resourceProvider?: string;
  resourceUri?: string;
  operationName?: string;
  status?: string;
  authorization?: string;
  claims?: string;
  correlationId?: string;
  httpRequest?: string;
}

/**
 * @class
 * Initializes a new instance of the ResourceWriteFailureData class.
 * @constructor
 * Schema of the Data property of an EventGridEvent for a
 * Microsoft.Resources.ResourceWriteFailure event. This is raised when a
 * resource create or update operation fails.
 *
 * @member {string} [tenantId] The tenant ID of the resource.
 * @member {string} [subscriptionId] The subscription ID of the resource.
 * @member {string} [resourceGroup] The resource group of the resource.
 * @member {string} [resourceProvider] The resource provider performing the
 * operation.
 * @member {string} [resourceUri] The URI of the resource in the operation.
 * @member {string} [operationName] The operation that was performed.
 * @member {string} [status] The status of the operation.
 * @member {string} [authorization] The requested authorization for the
 * operation.
 * @member {string} [claims] The properties of the claims.
 * @member {string} [correlationId] An operation ID used for troubleshooting.
 * @member {string} [httpRequest] The details of the operation.
 */
export interface ResourceWriteFailureData {
  tenantId?: string;
  subscriptionId?: string;
  resourceGroup?: string;
  resourceProvider?: string;
  resourceUri?: string;
  operationName?: string;
  status?: string;
  authorization?: string;
  claims?: string;
  correlationId?: string;
  httpRequest?: string;
}

/**
 * @class
 * Initializes a new instance of the ResourceWriteCancelData class.
 * @constructor
 * Schema of the Data property of an EventGridEvent for a
 * Microsoft.Resources.ResourceWriteCancel event. This is raised when a
 * resource create or update operation is canceled.
 *
 * @member {string} [tenantId] The tenant ID of the resource.
 * @member {string} [subscriptionId] The subscription ID of the resource.
 * @member {string} [resourceGroup] The resource group of the resource.
 * @member {string} [resourceProvider] The resource provider performing the
 * operation.
 * @member {string} [resourceUri] The URI of the resource in the operation.
 * @member {string} [operationName] The operation that was performed.
 * @member {string} [status] The status of the operation.
 * @member {string} [authorization] The requested authorization for the
 * operation.
 * @member {string} [claims] The properties of the claims.
 * @member {string} [correlationId] An operation ID used for troubleshooting.
 * @member {string} [httpRequest] The details of the operation.
 */
export interface ResourceWriteCancelData {
  tenantId?: string;
  subscriptionId?: string;
  resourceGroup?: string;
  resourceProvider?: string;
  resourceUri?: string;
  operationName?: string;
  status?: string;
  authorization?: string;
  claims?: string;
  correlationId?: string;
  httpRequest?: string;
}

/**
 * @class
 * Initializes a new instance of the ResourceDeleteSuccessData class.
 * @constructor
 * Schema of the Data property of an EventGridEvent for a
 * Microsoft.Resources.ResourceDeleteSuccess event. This is raised when a
 * resource delete operation succeeds.
 *
 * @member {string} [tenantId] The tenant ID of the resource.
 * @member {string} [subscriptionId] The subscription ID of the resource.
 * @member {string} [resourceGroup] The resource group of the resource.
 * @member {string} [resourceProvider] The resource provider performing the
 * operation.
 * @member {string} [resourceUri] The URI of the resource in the operation.
 * @member {string} [operationName] The operation that was performed.
 * @member {string} [status] The status of the operation.
 * @member {string} [authorization] The requested authorization for the
 * operation.
 * @member {string} [claims] The properties of the claims.
 * @member {string} [correlationId] An operation ID used for troubleshooting.
 * @member {string} [httpRequest] The details of the operation.
 */
export interface ResourceDeleteSuccessData {
  tenantId?: string;
  subscriptionId?: string;
  resourceGroup?: string;
  resourceProvider?: string;
  resourceUri?: string;
  operationName?: string;
  status?: string;
  authorization?: string;
  claims?: string;
  correlationId?: string;
  httpRequest?: string;
}

/**
 * @class
 * Initializes a new instance of the ResourceDeleteFailureData class.
 * @constructor
 * Schema of the Data property of an EventGridEvent for a
 * Microsoft.Resources.ResourceDeleteFailure event. This is raised when a
 * resource delete operation fails.
 *
 * @member {string} [tenantId] The tenant ID of the resource.
 * @member {string} [subscriptionId] The subscription ID of the resource.
 * @member {string} [resourceGroup] The resource group of the resource.
 * @member {string} [resourceProvider] The resource provider performing the
 * operation.
 * @member {string} [resourceUri] The URI of the resource in the operation.
 * @member {string} [operationName] The operation that was performed.
 * @member {string} [status] The status of the operation.
 * @member {string} [authorization] The requested authorization for the
 * operation.
 * @member {string} [claims] The properties of the claims.
 * @member {string} [correlationId] An operation ID used for troubleshooting.
 * @member {string} [httpRequest] The details of the operation.
 */
export interface ResourceDeleteFailureData {
  tenantId?: string;
  subscriptionId?: string;
  resourceGroup?: string;
  resourceProvider?: string;
  resourceUri?: string;
  operationName?: string;
  status?: string;
  authorization?: string;
  claims?: string;
  correlationId?: string;
  httpRequest?: string;
}

/**
 * @class
 * Initializes a new instance of the ResourceDeleteCancelData class.
 * @constructor
 * Schema of the Data property of an EventGridEvent for an
 * Microsoft.Resources.ResourceDeleteCancel event. This is raised when a
 * resource delete operation is canceled.
 *
 * @member {string} [tenantId] The tenant ID of the resource.
 * @member {string} [subscriptionId] The subscription ID of the resource.
 * @member {string} [resourceGroup] The resource group of the resource.
 * @member {string} [resourceProvider] The resource provider performing the
 * operation.
 * @member {string} [resourceUri] The URI of the resource in the operation.
 * @member {string} [operationName] The operation that was performed.
 * @member {string} [status] The status of the operation.
 * @member {string} [authorization] The requested authorization for the
 * operation.
 * @member {string} [claims] The properties of the claims.
 * @member {string} [correlationId] An operation ID used for troubleshooting.
 * @member {string} [httpRequest] The details of the operation.
 */
export interface ResourceDeleteCancelData {
  tenantId?: string;
  subscriptionId?: string;
  resourceGroup?: string;
  resourceProvider?: string;
  resourceUri?: string;
  operationName?: string;
  status?: string;
  authorization?: string;
  claims?: string;
  correlationId?: string;
  httpRequest?: string;
}

/**
 * @class
 * Initializes a new instance of the EventGridEvent class.
 * @constructor
 * Properties of an event published to an Event Grid topic.
 *
 * @member {string} id An unique identifier for the event.
 * @member {string} [topic] The resource path of the event source.
 * @member {string} subject A resource path relative to the topic path.
 * @member {object} data Event data specific to the event type.
 * @member {string} eventType The type of the event that occurred.
 * @member {date} eventTime The time (in UTC) the event was generated.
 * @member {string} [metadataVersion] The schema version of the event metadata.
 * @member {string} dataVersion The schema version of the data object.
 */
export interface EventGridEvent {
  id: string;
  topic?: string;
  subject: string;
  data: any;
  eventType: string;
  eventTime: Date;
  readonly metadataVersion?: string;
  dataVersion: string;
}

/**
 * @class
 * Initializes a new instance of the SubscriptionValidationEventData class.
 * @constructor
 * Schema of the Data property of an EventGridEvent for a
 * Microsoft.EventGrid.SubscriptionValidationEvent.
 *
 * @member {string} [validationCode] The validation code sent by Azure Event
 * Grid to validate an event subscription. To complete the validation
 * handshake, the subscriber must either respond with this validation code as
 * part of the validation response, or perform a GET request on the
 * validationUrl (available starting version 2018-05-01-preview).
 * @member {string} [validationUrl] The validation URL sent by Azure Event Grid
 * (available starting version 2018-05-01-preview). To complete the validation
 * handshake, the subscriber must either respond with the validationCode as
 * part of the validation response, or perform a GET request on the
 * validationUrl (available starting version 2018-05-01-preview).
 */
export interface SubscriptionValidationEventData {
  readonly validationCode?: string;
  readonly validationUrl?: string;
}

/**
 * @class
 * Initializes a new instance of the SubscriptionValidationResponse class.
 * @constructor
 * To complete an event subscription validation handshake, a subscriber can use
 * either the validationCode or the validationUrl received in a
 * SubscriptionValidationEvent. When the validationCode is used, the
 * SubscriptionValidationResponse can be used to build the response.
 *
 * @member {string} [validationResponse] The validation response sent by the
 * subscriber to Azure Event Grid to complete the validation of an event
 * subscription.
 */
export interface SubscriptionValidationResponse {
  validationResponse?: string;
}

/**
 * @class
 * Initializes a new instance of the SubscriptionDeletedEventData class.
 * @constructor
 * Schema of the Data property of an EventGridEvent for a
 * Microsoft.EventGrid.SubscriptionDeletedEvent.
 *
 * @member {string} [eventSubscriptionId] The Azure resource ID of the deleted
 * event subscription.
 */
export interface SubscriptionDeletedEventData {
  readonly eventSubscriptionId?: string;
}

/**
 * @class
 * Initializes a new instance of the DeviceLifeCycleEventProperties class.
 * @constructor
 * Schema of the Data property of an EventGridEvent for a device life cycle
 * event (DeviceCreated, DeviceDeleted).
 *
 * @member {string} [deviceId] The unique identifier of the device. This
 * case-sensitive string can be up to 128 characters long, and supports ASCII
 * 7-bit alphanumeric characters plus the following special characters: - : . +
 * % _ &#35; * ? ! ( ) , = @ ; $ '.
 * @member {string} [hubName] Name of the IoT Hub where the device was created
 * or deleted.
 * @member {object} [twin] Information about the device twin, which is the
 * cloud representation of application device metadata.
 * @member {string} [twin.authenticationType] Authentication type used for this
 * device: either SAS, SelfSigned, or CertificateAuthority.
 * @member {number} [twin.cloudToDeviceMessageCount] Count of cloud to device
 * messages sent to this device.
 * @member {string} [twin.connectionState] Whether the device is connected or
 * disconnected.
 * @member {string} [twin.deviceId] The unique identifier of the device twin.
 * @member {string} [twin.etag] A piece of information that describes the
 * content of the device twin. Each etag is guaranteed to be unique per device
 * twin.
 * @member {string} [twin.lastActivityTime] The ISO8601 timestamp of the last
 * activity.
 * @member {object} [twin.properties] Properties JSON element.
 * @member {object} [twin.properties.desired] A portion of the properties that
 * can be written only by the application back-end, and read by the device.
 * @member {object} [twin.properties.desired.metadata] Metadata information for
 * the properties JSON document.
 * @member {string} [twin.properties.desired.metadata.lastUpdated] The ISO8601
 * timestamp of the last time the properties were updated.
 * @member {number} [twin.properties.desired.version] Version of device twin
 * properties.
 * @member {object} [twin.properties.reported] A portion of the properties that
 * can be written only by the device, and read by the application back-end.
 * @member {object} [twin.properties.reported.metadata] Metadata information
 * for the properties JSON document.
 * @member {string} [twin.properties.reported.metadata.lastUpdated] The ISO8601
 * timestamp of the last time the properties were updated.
 * @member {number} [twin.properties.reported.version] Version of device twin
 * properties.
 * @member {string} [twin.status] Whether the device twin is enabled or
 * disabled.
 * @member {string} [twin.statusUpdateTime] The ISO8601 timestamp of the last
 * device twin status update.
 * @member {number} [twin.version] An integer that is incremented by one each
 * time the device twin is updated.
 * @member {object} [twin.x509Thumbprint] The thumbprint is a unique value for
 * the x509 certificate, commonly used to find a particular certificate in a
 * certificate store. The thumbprint is dynamically generated using the SHA1
 * algorithm, and does not physically exist in the certificate.
 * @member {string} [twin.x509Thumbprint.primaryThumbprint] Primary thumbprint
 * for the x509 certificate.
 * @member {string} [twin.x509Thumbprint.secondaryThumbprint] Secondary
 * thumbprint for the x509 certificate.
 */
export interface DeviceLifeCycleEventProperties {
  deviceId?: string;
  hubName?: string;
  twin?: DeviceTwinInfo;
}

/**
 * @class
 * Initializes a new instance of the IotHubDeviceCreatedEventData class.
 * @constructor
 * Event data for Microsoft.Devices.DeviceCreated event.
 *
 */
export interface IotHubDeviceCreatedEventData extends DeviceLifeCycleEventProperties {
}

/**
 * @class
 * Initializes a new instance of the IotHubDeviceDeletedEventData class.
 * @constructor
 * Event data for Microsoft.Devices.DeviceDeleted event.
 *
 */
export interface IotHubDeviceDeletedEventData extends DeviceLifeCycleEventProperties {
}

/**
 * @class
 * Initializes a new instance of the DeviceConnectionStateEventProperties class.
 * @constructor
 * Schema of the Data property of an EventGridEvent for a device connection
 * state event (DeviceConnected, DeviceDisconnected).
 *
 * @member {string} [deviceId] The unique identifier of the device. This
 * case-sensitive string can be up to 128 characters long, and supports ASCII
 * 7-bit alphanumeric characters plus the following special characters: - : . +
 * % _ &#35; * ? ! ( ) , = @ ; $ '.
 * @member {string} [moduleId] The unique identifier of the module. This
 * case-sensitive string can be up to 128 characters long, and supports ASCII
 * 7-bit alphanumeric characters plus the following special characters: - : . +
 * % _ &#35; * ? ! ( ) , = @ ; $ '.
 * @member {string} [hubName] Name of the IoT Hub where the device was created
 * or deleted.
 * @member {object} [deviceConnectionStateEventInfo] Information about the
 * device connection state event.
 * @member {string} [deviceConnectionStateEventInfo.sequenceNumber] Sequence
 * number is string representation of a hexadecimal number. string compare can
 * be used to identify the larger number because both in ASCII and HEX numbers
 * come after alphabets. If you are converting the string to hex, then the
 * number is a 256 bit number.
 */
export interface DeviceConnectionStateEventProperties {
  deviceId?: string;
  moduleId?: string;
  hubName?: string;
  deviceConnectionStateEventInfo?: DeviceConnectionStateEventInfo;
}

/**
 * @class
 * Initializes a new instance of the IotHubDeviceConnectedEventData class.
 * @constructor
 * Event data for Microsoft.Devices.DeviceConnected event.
 *
 */
export interface IotHubDeviceConnectedEventData extends DeviceConnectionStateEventProperties {
}

/**
 * @class
 * Initializes a new instance of the IotHubDeviceDisconnectedEventData class.
 * @constructor
 * Event data for Microsoft.Devices.DeviceDisconnected event.
 *
 */
export interface IotHubDeviceDisconnectedEventData extends DeviceConnectionStateEventProperties {
}

/**
 * @class
 * Initializes a new instance of the DeviceTwinMetadata class.
 * @constructor
 * Metadata information for the properties JSON document.
 *
 * @member {string} [lastUpdated] The ISO8601 timestamp of the last time the
 * properties were updated.
 */
export interface DeviceTwinMetadata {
  lastUpdated?: string;
}

/**
 * @class
 * Initializes a new instance of the DeviceTwinProperties class.
 * @constructor
 * A portion of the properties that can be written only by the application
 * back-end, and read by the device.
 *
 * @member {object} [metadata] Metadata information for the properties JSON
 * document.
 * @member {string} [metadata.lastUpdated] The ISO8601 timestamp of the last
 * time the properties were updated.
 * @member {number} [version] Version of device twin properties.
 */
export interface DeviceTwinProperties {
  metadata?: DeviceTwinMetadata;
  version?: number;
}

/**
 * @class
 * Initializes a new instance of the DeviceTwinInfoProperties class.
 * @constructor
 * Properties JSON element.
 *
 * @member {object} [desired] A portion of the properties that can be written
 * only by the application back-end, and read by the device.
 * @member {object} [desired.metadata] Metadata information for the properties
 * JSON document.
 * @member {string} [desired.metadata.lastUpdated] The ISO8601 timestamp of the
 * last time the properties were updated.
 * @member {number} [desired.version] Version of device twin properties.
 * @member {object} [reported] A portion of the properties that can be written
 * only by the device, and read by the application back-end.
 * @member {object} [reported.metadata] Metadata information for the properties
 * JSON document.
 * @member {string} [reported.metadata.lastUpdated] The ISO8601 timestamp of
 * the last time the properties were updated.
 * @member {number} [reported.version] Version of device twin properties.
 */
export interface DeviceTwinInfoProperties {
  desired?: DeviceTwinProperties;
  reported?: DeviceTwinProperties;
}

/**
 * @class
 * Initializes a new instance of the DeviceTwinInfoX509Thumbprint class.
 * @constructor
 * The thumbprint is a unique value for the x509 certificate, commonly used to
 * find a particular certificate in a certificate store. The thumbprint is
 * dynamically generated using the SHA1 algorithm, and does not physically
 * exist in the certificate.
 *
 * @member {string} [primaryThumbprint] Primary thumbprint for the x509
 * certificate.
 * @member {string} [secondaryThumbprint] Secondary thumbprint for the x509
 * certificate.
 */
export interface DeviceTwinInfoX509Thumbprint {
  primaryThumbprint?: string;
  secondaryThumbprint?: string;
}

/**
 * @class
 * Initializes a new instance of the DeviceTwinInfo class.
 * @constructor
 * Information about the device twin, which is the cloud representation of
 * application device metadata.
 *
 * @member {string} [authenticationType] Authentication type used for this
 * device: either SAS, SelfSigned, or CertificateAuthority.
 * @member {number} [cloudToDeviceMessageCount] Count of cloud to device
 * messages sent to this device.
 * @member {string} [connectionState] Whether the device is connected or
 * disconnected.
 * @member {string} [deviceId] The unique identifier of the device twin.
 * @member {string} [etag] A piece of information that describes the content of
 * the device twin. Each etag is guaranteed to be unique per device twin.
 * @member {string} [lastActivityTime] The ISO8601 timestamp of the last
 * activity.
 * @member {object} [properties] Properties JSON element.
 * @member {object} [properties.desired] A portion of the properties that can
 * be written only by the application back-end, and read by the device.
 * @member {object} [properties.desired.metadata] Metadata information for the
 * properties JSON document.
 * @member {string} [properties.desired.metadata.lastUpdated] The ISO8601
 * timestamp of the last time the properties were updated.
 * @member {number} [properties.desired.version] Version of device twin
 * properties.
 * @member {object} [properties.reported] A portion of the properties that can
 * be written only by the device, and read by the application back-end.
 * @member {object} [properties.reported.metadata] Metadata information for the
 * properties JSON document.
 * @member {string} [properties.reported.metadata.lastUpdated] The ISO8601
 * timestamp of the last time the properties were updated.
 * @member {number} [properties.reported.version] Version of device twin
 * properties.
 * @member {string} [status] Whether the device twin is enabled or disabled.
 * @member {string} [statusUpdateTime] The ISO8601 timestamp of the last device
 * twin status update.
 * @member {number} [version] An integer that is incremented by one each time
 * the device twin is updated.
 * @member {object} [x509Thumbprint] The thumbprint is a unique value for the
 * x509 certificate, commonly used to find a particular certificate in a
 * certificate store. The thumbprint is dynamically generated using the SHA1
 * algorithm, and does not physically exist in the certificate.
 * @member {string} [x509Thumbprint.primaryThumbprint] Primary thumbprint for
 * the x509 certificate.
 * @member {string} [x509Thumbprint.secondaryThumbprint] Secondary thumbprint
 * for the x509 certificate.
 */
export interface DeviceTwinInfo {
  authenticationType?: string;
  cloudToDeviceMessageCount?: number;
  connectionState?: string;
  deviceId?: string;
  etag?: string;
  lastActivityTime?: string;
  properties?: DeviceTwinInfoProperties;
  status?: string;
  statusUpdateTime?: string;
  version?: number;
  x509Thumbprint?: DeviceTwinInfoX509Thumbprint;
}

/**
 * @class
 * Initializes a new instance of the DeviceConnectionStateEventInfo class.
 * @constructor
 * Information about the device connection state event.
 *
 * @member {string} [sequenceNumber] Sequence number is string representation
 * of a hexadecimal number. string compare can be used to identify the larger
 * number because both in ASCII and HEX numbers come after alphabets. If you
 * are converting the string to hex, then the number is a 256 bit number.
 */
export interface DeviceConnectionStateEventInfo {
  sequenceNumber?: string;
}

/**
 * @class
 * Initializes a new instance of the ContainerRegistryEventData class.
 * @constructor
 * The content of the event request message.
 *
 * @member {string} [id] The event ID.
 * @member {date} [timestamp] The time at which the event occurred.
 * @member {string} [action] The action that encompasses the provided event.
 * @member {object} [target] The target of the event.
 * @member {string} [target.mediaType] The MIME type of the referenced object.
 * @member {number} [target.size] The number of bytes of the content. Same as
 * Length field.
 * @member {string} [target.digest] The digest of the content, as defined by
 * the Registry V2 HTTP API Specification.
 * @member {number} [target.length] The number of bytes of the content. Same as
 * Size field.
 * @member {string} [target.repository] The repository name.
 * @member {string} [target.url] The direct URL to the content.
 * @member {string} [target.tag] The tag name.
 * @member {object} [request] The request that generated the event.
 * @member {string} [request.id] The ID of the request that initiated the
 * event.
 * @member {string} [request.addr] The IP or hostname and possibly port of the
 * client connection that initiated the event. This is the RemoteAddr from the
 * standard http request.
 * @member {string} [request.host] The externally accessible hostname of the
 * registry instance, as specified by the http host header on incoming
 * requests.
 * @member {string} [request.method] The request method that generated the
 * event.
 * @member {string} [request.useragent] The user agent header of the request.
 * @member {object} [actor] The agent that initiated the event. For most
 * situations, this could be from the authorization context of the request.
 * @member {string} [actor.name] The subject or username associated with the
 * request context that generated the event.
 * @member {object} [source] The registry node that generated the event. Put
 * differently, while the actor initiates the event, the source generates it.
 * @member {string} [source.addr] The IP or hostname and the port of the
 * registry node that generated the event. Generally, this will be resolved by
 * os.Hostname() along with the running port.
 * @member {string} [source.instanceID] The running instance of an application.
 * Changes after each restart.
 */
export interface ContainerRegistryEventData {
  id?: string;
  timestamp?: Date;
  action?: string;
  target?: ContainerRegistryEventTarget;
  request?: ContainerRegistryEventRequest;
  actor?: ContainerRegistryEventActor;
  source?: ContainerRegistryEventSource;
}

/**
 * @class
 * Initializes a new instance of the ContainerRegistryImagePushedEventData class.
 * @constructor
 * Schema of the Data property of an EventGridEvent for a
 * Microsoft.ContainerRegistry.ImagePushed event.
 *
 */
export interface ContainerRegistryImagePushedEventData extends ContainerRegistryEventData {
}

/**
 * @class
 * Initializes a new instance of the ContainerRegistryImageDeletedEventData class.
 * @constructor
 * Schema of the Data property of an EventGridEvent for a
 * Microsoft.ContainerRegistry.ImageDeleted event.
 *
 */
export interface ContainerRegistryImageDeletedEventData extends ContainerRegistryEventData {
}

/**
 * @class
 * Initializes a new instance of the ContainerRegistryEventTarget class.
 * @constructor
 * The target of the event.
 *
 * @member {string} [mediaType] The MIME type of the referenced object.
 * @member {number} [size] The number of bytes of the content. Same as Length
 * field.
 * @member {string} [digest] The digest of the content, as defined by the
 * Registry V2 HTTP API Specification.
 * @member {number} [length] The number of bytes of the content. Same as Size
 * field.
 * @member {string} [repository] The repository name.
 * @member {string} [url] The direct URL to the content.
 * @member {string} [tag] The tag name.
 */
export interface ContainerRegistryEventTarget {
  mediaType?: string;
  size?: number;
  digest?: string;
  length?: number;
  repository?: string;
  url?: string;
  tag?: string;
}

/**
 * @class
 * Initializes a new instance of the ContainerRegistryEventRequest class.
 * @constructor
 * The request that generated the event.
 *
 * @member {string} [id] The ID of the request that initiated the event.
 * @member {string} [addr] The IP or hostname and possibly port of the client
 * connection that initiated the event. This is the RemoteAddr from the
 * standard http request.
 * @member {string} [host] The externally accessible hostname of the registry
 * instance, as specified by the http host header on incoming requests.
 * @member {string} [method] The request method that generated the event.
 * @member {string} [useragent] The user agent header of the request.
 */
export interface ContainerRegistryEventRequest {
  id?: string;
  addr?: string;
  host?: string;
  method?: string;
  useragent?: string;
}

/**
 * @class
 * Initializes a new instance of the ContainerRegistryEventActor class.
 * @constructor
 * The agent that initiated the event. For most situations, this could be from
 * the authorization context of the request.
 *
 * @member {string} [name] The subject or username associated with the request
 * context that generated the event.
 */
export interface ContainerRegistryEventActor {
  name?: string;
}

/**
 * @class
 * Initializes a new instance of the ContainerRegistryEventSource class.
 * @constructor
 * The registry node that generated the event. Put differently, while the actor
 * initiates the event, the source generates it.
 *
 * @member {string} [addr] The IP or hostname and the port of the registry node
 * that generated the event. Generally, this will be resolved by os.Hostname()
 * along with the running port.
 * @member {string} [instanceID] The running instance of an application.
 * Changes after each restart.
 */
export interface ContainerRegistryEventSource {
  addr?: string;
  instanceID?: string;
}

/**
 * @class
 * Initializes a new instance of the ServiceBusActiveMessagesAvailableWithNoListenersEventData class.
 * @constructor
 * Schema of the Data property of an EventGridEvent for a
 * Microsoft.ServiceBus.ActiveMessagesAvailableWithNoListeners event.
 *
 * @member {string} [namespaceName] The namespace name of the
 * Microsoft.ServiceBus resource.
 * @member {string} [requestUri] The endpoint of the Microsoft.ServiceBus
 * resource.
 * @member {string} [entityType] The entity type of the Microsoft.ServiceBus
 * resource. Could be one of 'queue' or 'subscriber'.
 * @member {string} [queueName] The name of the Microsoft.ServiceBus queue. If
 * the entity type is of type 'subscriber', then this value will be null.
 * @member {string} [topicName] The name of the Microsoft.ServiceBus topic. If
 * the entity type is of type 'queue', then this value will be null.
 * @member {string} [subscriptionName] The name of the Microsoft.ServiceBus
 * topic's subscription. If the entity type is of type 'queue', then this value
 * will be null.
 */
export interface ServiceBusActiveMessagesAvailableWithNoListenersEventData {
  namespaceName?: string;
  requestUri?: string;
  entityType?: string;
  queueName?: string;
  topicName?: string;
  subscriptionName?: string;
}

/**
 * @class
 * Initializes a new instance of the ServiceBusDeadletterMessagesAvailableWithNoListenersEventData class.
 * @constructor
 * Schema of the Data property of an EventGridEvent for a
 * Microsoft.ServiceBus.DeadletterMessagesAvailableWithNoListenersEvent event.
 *
 * @member {string} [namespaceName] The namespace name of the
 * Microsoft.ServiceBus resource.
 * @member {string} [requestUri] The endpoint of the Microsoft.ServiceBus
 * resource.
 * @member {string} [entityType] The entity type of the Microsoft.ServiceBus
 * resource. Could be one of 'queue' or 'subscriber'.
 * @member {string} [queueName] The name of the Microsoft.ServiceBus queue. If
 * the entity type is of type 'subscriber', then this value will be null.
 * @member {string} [topicName] The name of the Microsoft.ServiceBus topic. If
 * the entity type is of type 'queue', then this value will be null.
 * @member {string} [subscriptionName] The name of the Microsoft.ServiceBus
 * topic's subscription. If the entity type is of type 'queue', then this value
 * will be null.
 */
export interface ServiceBusDeadletterMessagesAvailableWithNoListenersEventData {
  namespaceName?: string;
  requestUri?: string;
  entityType?: string;
  queueName?: string;
  topicName?: string;
  subscriptionName?: string;
}

/**
 * @class
 * Initializes a new instance of the MediaJobStateChangeEventData class.
 * @constructor
 * Schema of the Data property of an EventGridEvent for a
 * Microsoft.Media.JobStateChange event.
 *
 * @member {string} [previousState] The previous state of the Job. Possible
 * values include: 'Canceled', 'Canceling', 'Error', 'Finished', 'Processing',
 * 'Queued', 'Scheduled'
 * @member {string} [state] The new state of the Job. Possible values include:
 * 'Canceled', 'Canceling', 'Error', 'Finished', 'Processing', 'Queued',
 * 'Scheduled'
 */
export interface MediaJobStateChangeEventData {
  readonly previousState?: string;
  readonly state?: string;
}

