/*
 * MIT
*/

import { ServiceClientOptions, RequestOptions, ServiceCallback, HttpOperationResponse } from 'ms-rest';
import * as models from '../models';


/**
 * @class
 * IotHubResource
 * __NOTE__: An instance of this class is automatically created for an
 * instance of the IotHubClient.
 */
export interface IotHubResource {


    /**
     * @summary Get the non-security related metadata of an IoT hub.
     *
     * Get the non-security related metadata of an IoT hub.
     *
     * @param {string} resourceGroupName The name of the resource group that
     * contains the IoT hub.
     *
     * @param {string} resourceName The name of the IoT hub.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<IotHubDescription>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    getWithHttpOperationResponse(resourceGroupName: string, resourceName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<models.IotHubDescription>>;

    /**
     * @summary Get the non-security related metadata of an IoT hub.
     *
     * Get the non-security related metadata of an IoT hub.
     *
     * @param {string} resourceGroupName The name of the resource group that
     * contains the IoT hub.
     *
     * @param {string} resourceName The name of the IoT hub.
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
     *                      @resolve {IotHubDescription} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {IotHubDescription} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link IotHubDescription} for more information.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    get(resourceGroupName: string, resourceName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<models.IotHubDescription>;
    get(resourceGroupName: string, resourceName: string, callback: ServiceCallback<models.IotHubDescription>): void;
    get(resourceGroupName: string, resourceName: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.IotHubDescription>): void;


    /**
     * @summary Create or update the metadata of an IoT hub.
     *
     * Create or update the metadata of an Iot hub. The usual pattern to modify a
     * property is to retrieve the IoT hub metadata and security metadata, and then
     * combine them with the modified values in a new body to update the IoT hub.
     *
     * @param {string} resourceGroupName The name of the resource group that
     * contains the IoT hub.
     *
     * @param {string} resourceName The name of the IoT hub to create or update.
     *
     * @param {object} iotHubDescription The IoT hub metadata and security
     * metadata.
     *
     * @param {string} iotHubDescription.subscriptionid The subscription
     * identifier.
     *
     * @param {string} iotHubDescription.resourcegroup The name of the resource
     * group that contains the IoT hub. A resource group name uniquely identifies
     * the resource group within the subscription.
     *
     * @param {string} [iotHubDescription.etag] The Etag field is *not* required.
     * If it is provided in the response body, it must also be provided as a header
     * per the normal ETag convention.
     *
     * @param {object} [iotHubDescription.properties]
     *
     * @param {array} [iotHubDescription.properties.authorizationPolicies] The
     * shared access policies you can use to secure a connection to the IoT hub.
     *
     * @param {array} [iotHubDescription.properties.ipFilterRules] The IP filter
     * rules.
     *
     * @param {object} [iotHubDescription.properties.eventHubEndpoints] The Event
     * Hub-compatible endpoint properties. The possible keys to this dictionary are
     * events and operationsMonitoringEvents. Both of these keys have to be present
     * in the dictionary while making create or update calls for the IoT hub.
     *
     * @param {object} [iotHubDescription.properties.routing]
     *
     * @param {object} [iotHubDescription.properties.routing.endpoints]
     *
     * @param {array}
     * [iotHubDescription.properties.routing.endpoints.serviceBusQueues] The list
     * of Service Bus queue endpoints that IoT hub routes the messages to, based on
     * the routing rules.
     *
     * @param {array}
     * [iotHubDescription.properties.routing.endpoints.serviceBusTopics] The list
     * of Service Bus topic endpoints that the IoT hub routes the messages to,
     * based on the routing rules.
     *
     * @param {array} [iotHubDescription.properties.routing.endpoints.eventHubs]
     * The list of Event Hubs endpoints that IoT hub routes messages to, based on
     * the routing rules. This list does not include the built-in Event Hubs
     * endpoint.
     *
     * @param {array} [iotHubDescription.properties.routing.routes] The list of
     * user-provided routing rules that the IoT hub uses to route messages to
     * built-in and custom endpoints. A maximum of 100 routing rules are allowed
     * for paid hubs and a maximum of 5 routing rules are allowed for free hubs.
     *
     * @param {object} [iotHubDescription.properties.routing.fallbackRoute] The
     * properties of the route that is used as a fall-back route when none of the
     * conditions specified in the 'routes' section are met. This is an optional
     * parameter. When this property is not set, the messages which do not meet any
     * of the conditions specified in the 'routes' section get routed to the
     * built-in eventhub endpoint.
     *
     * @param {string}
     * [iotHubDescription.properties.routing.fallbackRoute.condition] The condition
     * which is evaluated in order to apply the fallback route. If the condition is
     * not provided it will evaluate to true by default. For grammar, See:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-query-language
     *
     * @param {array}
     * iotHubDescription.properties.routing.fallbackRoute.endpointNames The list of
     * endpoints to which the messages that satisfy the condition are routed to.
     * Currently only 1 endpoint is allowed.
     *
     * @param {boolean}
     * iotHubDescription.properties.routing.fallbackRoute.isEnabled Used to specify
     * whether the fallback route is enabled or not.
     *
     * @param {object} [iotHubDescription.properties.storageEndpoints] The list of
     * Azure Storage endpoints where you can upload files. Currently you can
     * configure only one Azure Storage account and that MUST have its key as
     * $default. Specifying more than one storage account causes an error to be
     * thrown. Not specifying a value for this property when the
     * enableFileUploadNotifications property is set to True, causes an error to be
     * thrown.
     *
     * @param {object} [iotHubDescription.properties.messagingEndpoints] The
     * messaging endpoint properties for the file upload notification queue.
     *
     * @param {boolean}
     * [iotHubDescription.properties.enableFileUploadNotifications] If True, file
     * upload notifications are enabled.
     *
     * @param {object} [iotHubDescription.properties.cloudToDevice]
     *
     * @param {number}
     * [iotHubDescription.properties.cloudToDevice.maxDeliveryCount] The max
     * delivery count for cloud-to-device messages in the device queue. See:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#cloud-to-device-messages.
     *
     * @param {moment.duration}
     * [iotHubDescription.properties.cloudToDevice.defaultTtlAsIso8601] The default
     * time to live for cloud-to-device messages in the device queue. See:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#cloud-to-device-messages.
     *
     * @param {object} [iotHubDescription.properties.cloudToDevice.feedback]
     *
     * @param {moment.duration}
     * [iotHubDescription.properties.cloudToDevice.feedback.lockDurationAsIso8601]
     * The lock duration for the feedback queue. See:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#cloud-to-device-messages.
     *
     * @param {moment.duration}
     * [iotHubDescription.properties.cloudToDevice.feedback.ttlAsIso8601] The
     * period of time for which a message is available to consume before it is
     * expired by the IoT hub. See:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#cloud-to-device-messages.
     *
     * @param {number}
     * [iotHubDescription.properties.cloudToDevice.feedback.maxDeliveryCount] The
     * number of times the IoT hub attempts to deliver a message on the feedback
     * queue. See:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#cloud-to-device-messages.
     *
     * @param {string} [iotHubDescription.properties.comments] Comments.
     *
     * @param {object}
     * [iotHubDescription.properties.operationsMonitoringProperties]
     *
     * @param {object}
     * [iotHubDescription.properties.operationsMonitoringProperties.events]
     *
     * @param {string} [iotHubDescription.properties.features] The capabilities and
     * features enabled for the IoT hub. Possible values include: 'None',
     * 'DeviceManagement'
     *
     * @param {object} iotHubDescription.sku
     *
     * @param {string} iotHubDescription.sku.name The name of the SKU. Possible
     * values include: 'F1', 'S1', 'S2', 'S3'
     *
     * @param {number} iotHubDescription.sku.capacity The number of provisioned IoT
     * Hub units. See:
     * https://docs.microsoft.com/azure/azure-subscription-service-limits#iot-hub-limits.
     *
     * @param {string} iotHubDescription.location The resource location.
     *
     * @param {object} [iotHubDescription.tags] The resource tags.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<IotHubDescription>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    createOrUpdateWithHttpOperationResponse(resourceGroupName: string, resourceName: string, iotHubDescription: models.IotHubDescription, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<models.IotHubDescription>>;

    /**
     * @summary Create or update the metadata of an IoT hub.
     *
     * Create or update the metadata of an Iot hub. The usual pattern to modify a
     * property is to retrieve the IoT hub metadata and security metadata, and then
     * combine them with the modified values in a new body to update the IoT hub.
     *
     * @param {string} resourceGroupName The name of the resource group that
     * contains the IoT hub.
     *
     * @param {string} resourceName The name of the IoT hub to create or update.
     *
     * @param {object} iotHubDescription The IoT hub metadata and security
     * metadata.
     *
     * @param {string} iotHubDescription.subscriptionid The subscription
     * identifier.
     *
     * @param {string} iotHubDescription.resourcegroup The name of the resource
     * group that contains the IoT hub. A resource group name uniquely identifies
     * the resource group within the subscription.
     *
     * @param {string} [iotHubDescription.etag] The Etag field is *not* required.
     * If it is provided in the response body, it must also be provided as a header
     * per the normal ETag convention.
     *
     * @param {object} [iotHubDescription.properties]
     *
     * @param {array} [iotHubDescription.properties.authorizationPolicies] The
     * shared access policies you can use to secure a connection to the IoT hub.
     *
     * @param {array} [iotHubDescription.properties.ipFilterRules] The IP filter
     * rules.
     *
     * @param {object} [iotHubDescription.properties.eventHubEndpoints] The Event
     * Hub-compatible endpoint properties. The possible keys to this dictionary are
     * events and operationsMonitoringEvents. Both of these keys have to be present
     * in the dictionary while making create or update calls for the IoT hub.
     *
     * @param {object} [iotHubDescription.properties.routing]
     *
     * @param {object} [iotHubDescription.properties.routing.endpoints]
     *
     * @param {array}
     * [iotHubDescription.properties.routing.endpoints.serviceBusQueues] The list
     * of Service Bus queue endpoints that IoT hub routes the messages to, based on
     * the routing rules.
     *
     * @param {array}
     * [iotHubDescription.properties.routing.endpoints.serviceBusTopics] The list
     * of Service Bus topic endpoints that the IoT hub routes the messages to,
     * based on the routing rules.
     *
     * @param {array} [iotHubDescription.properties.routing.endpoints.eventHubs]
     * The list of Event Hubs endpoints that IoT hub routes messages to, based on
     * the routing rules. This list does not include the built-in Event Hubs
     * endpoint.
     *
     * @param {array} [iotHubDescription.properties.routing.routes] The list of
     * user-provided routing rules that the IoT hub uses to route messages to
     * built-in and custom endpoints. A maximum of 100 routing rules are allowed
     * for paid hubs and a maximum of 5 routing rules are allowed for free hubs.
     *
     * @param {object} [iotHubDescription.properties.routing.fallbackRoute] The
     * properties of the route that is used as a fall-back route when none of the
     * conditions specified in the 'routes' section are met. This is an optional
     * parameter. When this property is not set, the messages which do not meet any
     * of the conditions specified in the 'routes' section get routed to the
     * built-in eventhub endpoint.
     *
     * @param {string}
     * [iotHubDescription.properties.routing.fallbackRoute.condition] The condition
     * which is evaluated in order to apply the fallback route. If the condition is
     * not provided it will evaluate to true by default. For grammar, See:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-query-language
     *
     * @param {array}
     * iotHubDescription.properties.routing.fallbackRoute.endpointNames The list of
     * endpoints to which the messages that satisfy the condition are routed to.
     * Currently only 1 endpoint is allowed.
     *
     * @param {boolean}
     * iotHubDescription.properties.routing.fallbackRoute.isEnabled Used to specify
     * whether the fallback route is enabled or not.
     *
     * @param {object} [iotHubDescription.properties.storageEndpoints] The list of
     * Azure Storage endpoints where you can upload files. Currently you can
     * configure only one Azure Storage account and that MUST have its key as
     * $default. Specifying more than one storage account causes an error to be
     * thrown. Not specifying a value for this property when the
     * enableFileUploadNotifications property is set to True, causes an error to be
     * thrown.
     *
     * @param {object} [iotHubDescription.properties.messagingEndpoints] The
     * messaging endpoint properties for the file upload notification queue.
     *
     * @param {boolean}
     * [iotHubDescription.properties.enableFileUploadNotifications] If True, file
     * upload notifications are enabled.
     *
     * @param {object} [iotHubDescription.properties.cloudToDevice]
     *
     * @param {number}
     * [iotHubDescription.properties.cloudToDevice.maxDeliveryCount] The max
     * delivery count for cloud-to-device messages in the device queue. See:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#cloud-to-device-messages.
     *
     * @param {moment.duration}
     * [iotHubDescription.properties.cloudToDevice.defaultTtlAsIso8601] The default
     * time to live for cloud-to-device messages in the device queue. See:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#cloud-to-device-messages.
     *
     * @param {object} [iotHubDescription.properties.cloudToDevice.feedback]
     *
     * @param {moment.duration}
     * [iotHubDescription.properties.cloudToDevice.feedback.lockDurationAsIso8601]
     * The lock duration for the feedback queue. See:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#cloud-to-device-messages.
     *
     * @param {moment.duration}
     * [iotHubDescription.properties.cloudToDevice.feedback.ttlAsIso8601] The
     * period of time for which a message is available to consume before it is
     * expired by the IoT hub. See:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#cloud-to-device-messages.
     *
     * @param {number}
     * [iotHubDescription.properties.cloudToDevice.feedback.maxDeliveryCount] The
     * number of times the IoT hub attempts to deliver a message on the feedback
     * queue. See:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#cloud-to-device-messages.
     *
     * @param {string} [iotHubDescription.properties.comments] Comments.
     *
     * @param {object}
     * [iotHubDescription.properties.operationsMonitoringProperties]
     *
     * @param {object}
     * [iotHubDescription.properties.operationsMonitoringProperties.events]
     *
     * @param {string} [iotHubDescription.properties.features] The capabilities and
     * features enabled for the IoT hub. Possible values include: 'None',
     * 'DeviceManagement'
     *
     * @param {object} iotHubDescription.sku
     *
     * @param {string} iotHubDescription.sku.name The name of the SKU. Possible
     * values include: 'F1', 'S1', 'S2', 'S3'
     *
     * @param {number} iotHubDescription.sku.capacity The number of provisioned IoT
     * Hub units. See:
     * https://docs.microsoft.com/azure/azure-subscription-service-limits#iot-hub-limits.
     *
     * @param {string} iotHubDescription.location The resource location.
     *
     * @param {object} [iotHubDescription.tags] The resource tags.
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
     *                      @resolve {IotHubDescription} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {IotHubDescription} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link IotHubDescription} for more information.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    createOrUpdate(resourceGroupName: string, resourceName: string, iotHubDescription: models.IotHubDescription, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<models.IotHubDescription>;
    createOrUpdate(resourceGroupName: string, resourceName: string, iotHubDescription: models.IotHubDescription, callback: ServiceCallback<models.IotHubDescription>): void;
    createOrUpdate(resourceGroupName: string, resourceName: string, iotHubDescription: models.IotHubDescription, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.IotHubDescription>): void;


    /**
     * @summary Delete an IoT hub.
     *
     * Delete an IoT hub.
     *
     * @param {string} resourceGroupName The name of the resource group that
     * contains the IoT hub.
     *
     * @param {string} resourceName The name of the IoT hub to delete.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<Object>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    deleteMethodWithHttpOperationResponse(resourceGroupName: string, resourceName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<any>>;

    /**
     * @summary Delete an IoT hub.
     *
     * Delete an IoT hub.
     *
     * @param {string} resourceGroupName The name of the resource group that
     * contains the IoT hub.
     *
     * @param {string} resourceName The name of the IoT hub to delete.
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
     *                      @resolve {Object} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {Object} [result]   - The deserialized result object if an error did not occur.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    deleteMethod(resourceGroupName: string, resourceName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<any>;
    deleteMethod(resourceGroupName: string, resourceName: string, callback: ServiceCallback<any>): void;
    deleteMethod(resourceGroupName: string, resourceName: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<any>): void;


    /**
     * @summary Get all the IoT hubs in a subscription.
     *
     * Get all the IoT hubs in a subscription.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<IotHubDescriptionListResult>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    listBySubscriptionWithHttpOperationResponse(options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<models.IotHubDescriptionListResult>>;

    /**
     * @summary Get all the IoT hubs in a subscription.
     *
     * Get all the IoT hubs in a subscription.
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
     *                      @resolve {IotHubDescriptionListResult} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {IotHubDescriptionListResult} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link IotHubDescriptionListResult} for more
     *                      information.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    listBySubscription(options?: { customHeaders? : { [headerName: string]: string; } }): Promise<models.IotHubDescriptionListResult>;
    listBySubscription(callback: ServiceCallback<models.IotHubDescriptionListResult>): void;
    listBySubscription(options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.IotHubDescriptionListResult>): void;


    /**
     * @summary Get all the IoT hubs in a resource group.
     *
     * Get all the IoT hubs in a resource group.
     *
     * @param {string} resourceGroupName The name of the resource group that
     * contains the IoT hubs.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<IotHubDescriptionListResult>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    listByResourceGroupWithHttpOperationResponse(resourceGroupName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<models.IotHubDescriptionListResult>>;

    /**
     * @summary Get all the IoT hubs in a resource group.
     *
     * Get all the IoT hubs in a resource group.
     *
     * @param {string} resourceGroupName The name of the resource group that
     * contains the IoT hubs.
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
     *                      @resolve {IotHubDescriptionListResult} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {IotHubDescriptionListResult} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link IotHubDescriptionListResult} for more
     *                      information.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    listByResourceGroup(resourceGroupName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<models.IotHubDescriptionListResult>;
    listByResourceGroup(resourceGroupName: string, callback: ServiceCallback<models.IotHubDescriptionListResult>): void;
    listByResourceGroup(resourceGroupName: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.IotHubDescriptionListResult>): void;


    /**
     * @summary Get the statistics from an IoT hub.
     *
     * Get the statistics from an IoT hub.
     *
     * @param {string} resourceGroupName The name of the resource group that
     * contains the IoT hub.
     *
     * @param {string} resourceName The name of the IoT hub.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<RegistryStatistics>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    getStatsWithHttpOperationResponse(resourceGroupName: string, resourceName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<models.RegistryStatistics>>;

    /**
     * @summary Get the statistics from an IoT hub.
     *
     * Get the statistics from an IoT hub.
     *
     * @param {string} resourceGroupName The name of the resource group that
     * contains the IoT hub.
     *
     * @param {string} resourceName The name of the IoT hub.
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
     *                      @resolve {RegistryStatistics} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {RegistryStatistics} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link RegistryStatistics} for more information.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    getStats(resourceGroupName: string, resourceName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<models.RegistryStatistics>;
    getStats(resourceGroupName: string, resourceName: string, callback: ServiceCallback<models.RegistryStatistics>): void;
    getStats(resourceGroupName: string, resourceName: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.RegistryStatistics>): void;


    /**
     * @summary Get the list of valid SKUs for an IoT hub.
     *
     * Get the list of valid SKUs for an IoT hub.
     *
     * @param {string} resourceGroupName The name of the resource group that
     * contains the IoT hub.
     *
     * @param {string} resourceName The name of the IoT hub.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<IotHubSkuDescriptionListResult>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    getValidSkusWithHttpOperationResponse(resourceGroupName: string, resourceName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<models.IotHubSkuDescriptionListResult>>;

    /**
     * @summary Get the list of valid SKUs for an IoT hub.
     *
     * Get the list of valid SKUs for an IoT hub.
     *
     * @param {string} resourceGroupName The name of the resource group that
     * contains the IoT hub.
     *
     * @param {string} resourceName The name of the IoT hub.
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
     *                      @resolve {IotHubSkuDescriptionListResult} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {IotHubSkuDescriptionListResult} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link IotHubSkuDescriptionListResult} for more
     *                      information.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    getValidSkus(resourceGroupName: string, resourceName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<models.IotHubSkuDescriptionListResult>;
    getValidSkus(resourceGroupName: string, resourceName: string, callback: ServiceCallback<models.IotHubSkuDescriptionListResult>): void;
    getValidSkus(resourceGroupName: string, resourceName: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.IotHubSkuDescriptionListResult>): void;


    /**
     * @summary Get a list of the consumer groups in the Event Hub-compatible
     * device-to-cloud endpoint in an IoT hub.
     *
     * Get a list of the consumer groups in the Event Hub-compatible
     * device-to-cloud endpoint in an IoT hub.
     *
     * @param {string} resourceGroupName The name of the resource group that
     * contains the IoT hub.
     *
     * @param {string} resourceName The name of the IoT hub.
     *
     * @param {string} eventHubEndpointName The name of the Event Hub-compatible
     * endpoint.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<EventHubConsumerGroupsListResult>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    listEventHubConsumerGroupsWithHttpOperationResponse(resourceGroupName: string, resourceName: string, eventHubEndpointName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<models.EventHubConsumerGroupsListResult>>;

    /**
     * @summary Get a list of the consumer groups in the Event Hub-compatible
     * device-to-cloud endpoint in an IoT hub.
     *
     * Get a list of the consumer groups in the Event Hub-compatible
     * device-to-cloud endpoint in an IoT hub.
     *
     * @param {string} resourceGroupName The name of the resource group that
     * contains the IoT hub.
     *
     * @param {string} resourceName The name of the IoT hub.
     *
     * @param {string} eventHubEndpointName The name of the Event Hub-compatible
     * endpoint.
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
     *                      @resolve {EventHubConsumerGroupsListResult} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {EventHubConsumerGroupsListResult} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link EventHubConsumerGroupsListResult} for more
     *                      information.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    listEventHubConsumerGroups(resourceGroupName: string, resourceName: string, eventHubEndpointName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<models.EventHubConsumerGroupsListResult>;
    listEventHubConsumerGroups(resourceGroupName: string, resourceName: string, eventHubEndpointName: string, callback: ServiceCallback<models.EventHubConsumerGroupsListResult>): void;
    listEventHubConsumerGroups(resourceGroupName: string, resourceName: string, eventHubEndpointName: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.EventHubConsumerGroupsListResult>): void;


    /**
     * @summary Get a consumer group from the Event Hub-compatible device-to-cloud
     * endpoint for an IoT hub.
     *
     * Get a consumer group from the Event Hub-compatible device-to-cloud endpoint
     * for an IoT hub.
     *
     * @param {string} resourceGroupName The name of the resource group that
     * contains the IoT hub.
     *
     * @param {string} resourceName The name of the IoT hub.
     *
     * @param {string} eventHubEndpointName The name of the Event Hub-compatible
     * endpoint in the IoT hub.
     *
     * @param {string} name The name of the consumer group to retrieve.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<EventHubConsumerGroupInfo>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    getEventHubConsumerGroupWithHttpOperationResponse(resourceGroupName: string, resourceName: string, eventHubEndpointName: string, name: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<models.EventHubConsumerGroupInfo>>;

    /**
     * @summary Get a consumer group from the Event Hub-compatible device-to-cloud
     * endpoint for an IoT hub.
     *
     * Get a consumer group from the Event Hub-compatible device-to-cloud endpoint
     * for an IoT hub.
     *
     * @param {string} resourceGroupName The name of the resource group that
     * contains the IoT hub.
     *
     * @param {string} resourceName The name of the IoT hub.
     *
     * @param {string} eventHubEndpointName The name of the Event Hub-compatible
     * endpoint in the IoT hub.
     *
     * @param {string} name The name of the consumer group to retrieve.
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
     *                      @resolve {EventHubConsumerGroupInfo} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {EventHubConsumerGroupInfo} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link EventHubConsumerGroupInfo} for more
     *                      information.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    getEventHubConsumerGroup(resourceGroupName: string, resourceName: string, eventHubEndpointName: string, name: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<models.EventHubConsumerGroupInfo>;
    getEventHubConsumerGroup(resourceGroupName: string, resourceName: string, eventHubEndpointName: string, name: string, callback: ServiceCallback<models.EventHubConsumerGroupInfo>): void;
    getEventHubConsumerGroup(resourceGroupName: string, resourceName: string, eventHubEndpointName: string, name: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.EventHubConsumerGroupInfo>): void;


    /**
     * @summary Add a consumer group to an Event Hub-compatible endpoint in an IoT
     * hub.
     *
     * Add a consumer group to an Event Hub-compatible endpoint in an IoT hub.
     *
     * @param {string} resourceGroupName The name of the resource group that
     * contains the IoT hub.
     *
     * @param {string} resourceName The name of the IoT hub.
     *
     * @param {string} eventHubEndpointName The name of the Event Hub-compatible
     * endpoint in the IoT hub.
     *
     * @param {string} name The name of the consumer group to add.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<EventHubConsumerGroupInfo>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    createEventHubConsumerGroupWithHttpOperationResponse(resourceGroupName: string, resourceName: string, eventHubEndpointName: string, name: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<models.EventHubConsumerGroupInfo>>;

    /**
     * @summary Add a consumer group to an Event Hub-compatible endpoint in an IoT
     * hub.
     *
     * Add a consumer group to an Event Hub-compatible endpoint in an IoT hub.
     *
     * @param {string} resourceGroupName The name of the resource group that
     * contains the IoT hub.
     *
     * @param {string} resourceName The name of the IoT hub.
     *
     * @param {string} eventHubEndpointName The name of the Event Hub-compatible
     * endpoint in the IoT hub.
     *
     * @param {string} name The name of the consumer group to add.
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
     *                      @resolve {EventHubConsumerGroupInfo} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {EventHubConsumerGroupInfo} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link EventHubConsumerGroupInfo} for more
     *                      information.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    createEventHubConsumerGroup(resourceGroupName: string, resourceName: string, eventHubEndpointName: string, name: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<models.EventHubConsumerGroupInfo>;
    createEventHubConsumerGroup(resourceGroupName: string, resourceName: string, eventHubEndpointName: string, name: string, callback: ServiceCallback<models.EventHubConsumerGroupInfo>): void;
    createEventHubConsumerGroup(resourceGroupName: string, resourceName: string, eventHubEndpointName: string, name: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.EventHubConsumerGroupInfo>): void;


    /**
     * @summary Delete a consumer group from an Event Hub-compatible endpoint in an
     * IoT hub.
     *
     * Delete a consumer group from an Event Hub-compatible endpoint in an IoT hub.
     *
     * @param {string} resourceGroupName The name of the resource group that
     * contains the IoT hub.
     *
     * @param {string} resourceName The name of the IoT hub.
     *
     * @param {string} eventHubEndpointName The name of the Event Hub-compatible
     * endpoint in the IoT hub.
     *
     * @param {string} name The name of the consumer group to delete.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<null>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    deleteEventHubConsumerGroupWithHttpOperationResponse(resourceGroupName: string, resourceName: string, eventHubEndpointName: string, name: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<void>>;

    /**
     * @summary Delete a consumer group from an Event Hub-compatible endpoint in an
     * IoT hub.
     *
     * Delete a consumer group from an Event Hub-compatible endpoint in an IoT hub.
     *
     * @param {string} resourceGroupName The name of the resource group that
     * contains the IoT hub.
     *
     * @param {string} resourceName The name of the IoT hub.
     *
     * @param {string} eventHubEndpointName The name of the Event Hub-compatible
     * endpoint in the IoT hub.
     *
     * @param {string} name The name of the consumer group to delete.
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
     *                      @resolve {null} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {null} [result]   - The deserialized result object if an error did not occur.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    deleteEventHubConsumerGroup(resourceGroupName: string, resourceName: string, eventHubEndpointName: string, name: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<void>;
    deleteEventHubConsumerGroup(resourceGroupName: string, resourceName: string, eventHubEndpointName: string, name: string, callback: ServiceCallback<void>): void;
    deleteEventHubConsumerGroup(resourceGroupName: string, resourceName: string, eventHubEndpointName: string, name: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<void>): void;


    /**
     * @summary Get a list of all the jobs in an IoT hub. For more information,
     * see:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-identity-registry.
     *
     * Get a list of all the jobs in an IoT hub. For more information, see:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-identity-registry.
     *
     * @param {string} resourceGroupName The name of the resource group that
     * contains the IoT hub.
     *
     * @param {string} resourceName The name of the IoT hub.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<JobResponseListResult>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    listJobsWithHttpOperationResponse(resourceGroupName: string, resourceName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<models.JobResponseListResult>>;

    /**
     * @summary Get a list of all the jobs in an IoT hub. For more information,
     * see:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-identity-registry.
     *
     * Get a list of all the jobs in an IoT hub. For more information, see:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-identity-registry.
     *
     * @param {string} resourceGroupName The name of the resource group that
     * contains the IoT hub.
     *
     * @param {string} resourceName The name of the IoT hub.
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
     *                      @resolve {JobResponseListResult} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {JobResponseListResult} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link JobResponseListResult} for more information.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    listJobs(resourceGroupName: string, resourceName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<models.JobResponseListResult>;
    listJobs(resourceGroupName: string, resourceName: string, callback: ServiceCallback<models.JobResponseListResult>): void;
    listJobs(resourceGroupName: string, resourceName: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.JobResponseListResult>): void;


    /**
     * @summary Get the details of a job from an IoT hub. For more information,
     * see:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-identity-registry.
     *
     * Get the details of a job from an IoT hub. For more information, see:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-identity-registry.
     *
     * @param {string} resourceGroupName The name of the resource group that
     * contains the IoT hub.
     *
     * @param {string} resourceName The name of the IoT hub.
     *
     * @param {string} jobId The job identifier.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<JobResponse>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    getJobWithHttpOperationResponse(resourceGroupName: string, resourceName: string, jobId: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<models.JobResponse>>;

    /**
     * @summary Get the details of a job from an IoT hub. For more information,
     * see:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-identity-registry.
     *
     * Get the details of a job from an IoT hub. For more information, see:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-identity-registry.
     *
     * @param {string} resourceGroupName The name of the resource group that
     * contains the IoT hub.
     *
     * @param {string} resourceName The name of the IoT hub.
     *
     * @param {string} jobId The job identifier.
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
     *                      @resolve {JobResponse} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {JobResponse} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link JobResponse} for more information.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    getJob(resourceGroupName: string, resourceName: string, jobId: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<models.JobResponse>;
    getJob(resourceGroupName: string, resourceName: string, jobId: string, callback: ServiceCallback<models.JobResponse>): void;
    getJob(resourceGroupName: string, resourceName: string, jobId: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.JobResponse>): void;


    /**
     * @summary Get the quota metrics for an IoT hub.
     *
     * Get the quota metrics for an IoT hub.
     *
     * @param {string} resourceGroupName The name of the resource group that
     * contains the IoT hub.
     *
     * @param {string} resourceName The name of the IoT hub.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<IotHubQuotaMetricInfoListResult>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    getQuotaMetricsWithHttpOperationResponse(resourceGroupName: string, resourceName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<models.IotHubQuotaMetricInfoListResult>>;

    /**
     * @summary Get the quota metrics for an IoT hub.
     *
     * Get the quota metrics for an IoT hub.
     *
     * @param {string} resourceGroupName The name of the resource group that
     * contains the IoT hub.
     *
     * @param {string} resourceName The name of the IoT hub.
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
     *                      @resolve {IotHubQuotaMetricInfoListResult} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {IotHubQuotaMetricInfoListResult} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link IotHubQuotaMetricInfoListResult} for more
     *                      information.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    getQuotaMetrics(resourceGroupName: string, resourceName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<models.IotHubQuotaMetricInfoListResult>;
    getQuotaMetrics(resourceGroupName: string, resourceName: string, callback: ServiceCallback<models.IotHubQuotaMetricInfoListResult>): void;
    getQuotaMetrics(resourceGroupName: string, resourceName: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.IotHubQuotaMetricInfoListResult>): void;


    /**
     * @summary Check if an IoT hub name is available.
     *
     * Check if an IoT hub name is available.
     *
     * @param {string} name The name of the IoT hub to check.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<IotHubNameAvailabilityInfo>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    checkNameAvailabilityWithHttpOperationResponse(name: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<models.IotHubNameAvailabilityInfo>>;

    /**
     * @summary Check if an IoT hub name is available.
     *
     * Check if an IoT hub name is available.
     *
     * @param {string} name The name of the IoT hub to check.
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
     *                      @resolve {IotHubNameAvailabilityInfo} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {IotHubNameAvailabilityInfo} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link IotHubNameAvailabilityInfo} for more
     *                      information.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    checkNameAvailability(name: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<models.IotHubNameAvailabilityInfo>;
    checkNameAvailability(name: string, callback: ServiceCallback<models.IotHubNameAvailabilityInfo>): void;
    checkNameAvailability(name: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.IotHubNameAvailabilityInfo>): void;


    /**
     * @summary Get the security metadata for an IoT hub. For more information,
     * see: https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-security.
     *
     * Get the security metadata for an IoT hub. For more information, see:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-security.
     *
     * @param {string} resourceGroupName The name of the resource group that
     * contains the IoT hub.
     *
     * @param {string} resourceName The name of the IoT hub.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<SharedAccessSignatureAuthorizationRuleListResult>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    listKeysWithHttpOperationResponse(resourceGroupName: string, resourceName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<models.SharedAccessSignatureAuthorizationRuleListResult>>;

    /**
     * @summary Get the security metadata for an IoT hub. For more information,
     * see: https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-security.
     *
     * Get the security metadata for an IoT hub. For more information, see:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-security.
     *
     * @param {string} resourceGroupName The name of the resource group that
     * contains the IoT hub.
     *
     * @param {string} resourceName The name of the IoT hub.
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
     *                      @resolve {SharedAccessSignatureAuthorizationRuleListResult} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {SharedAccessSignatureAuthorizationRuleListResult} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link
     *                      SharedAccessSignatureAuthorizationRuleListResult} for
     *                      more information.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    listKeys(resourceGroupName: string, resourceName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<models.SharedAccessSignatureAuthorizationRuleListResult>;
    listKeys(resourceGroupName: string, resourceName: string, callback: ServiceCallback<models.SharedAccessSignatureAuthorizationRuleListResult>): void;
    listKeys(resourceGroupName: string, resourceName: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.SharedAccessSignatureAuthorizationRuleListResult>): void;


    /**
     * @summary Get a shared access policy by name from an IoT hub. For more
     * information, see:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-security.
     *
     * Get a shared access policy by name from an IoT hub. For more information,
     * see: https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-security.
     *
     * @param {string} resourceGroupName The name of the resource group that
     * contains the IoT hub.
     *
     * @param {string} resourceName The name of the IoT hub.
     *
     * @param {string} keyName The name of the shared access policy.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<SharedAccessSignatureAuthorizationRule>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    getKeysForKeyNameWithHttpOperationResponse(resourceGroupName: string, resourceName: string, keyName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<models.SharedAccessSignatureAuthorizationRule>>;

    /**
     * @summary Get a shared access policy by name from an IoT hub. For more
     * information, see:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-security.
     *
     * Get a shared access policy by name from an IoT hub. For more information,
     * see: https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-security.
     *
     * @param {string} resourceGroupName The name of the resource group that
     * contains the IoT hub.
     *
     * @param {string} resourceName The name of the IoT hub.
     *
     * @param {string} keyName The name of the shared access policy.
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
     *                      @resolve {SharedAccessSignatureAuthorizationRule} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {SharedAccessSignatureAuthorizationRule} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link SharedAccessSignatureAuthorizationRule} for
     *                      more information.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    getKeysForKeyName(resourceGroupName: string, resourceName: string, keyName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<models.SharedAccessSignatureAuthorizationRule>;
    getKeysForKeyName(resourceGroupName: string, resourceName: string, keyName: string, callback: ServiceCallback<models.SharedAccessSignatureAuthorizationRule>): void;
    getKeysForKeyName(resourceGroupName: string, resourceName: string, keyName: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.SharedAccessSignatureAuthorizationRule>): void;


    /**
     * @summary Exports all the device identities in the IoT hub identity registry
     * to an Azure Storage blob container. For more information, see:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-identity-registry#import-and-export-device-identities.
     *
     * Exports all the device identities in the IoT hub identity registry to an
     * Azure Storage blob container. For more information, see:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-identity-registry#import-and-export-device-identities.
     *
     * @param {string} resourceGroupName The name of the resource group that
     * contains the IoT hub.
     *
     * @param {string} resourceName The name of the IoT hub.
     *
     * @param {object} exportDevicesParameters The parameters that specify the
     * export devices operation.
     *
     * @param {string} exportDevicesParameters.exportBlobContainerUri The export
     * blob container URI.
     *
     * @param {boolean} exportDevicesParameters.excludeKeys The value indicating
     * whether keys should be excluded during export.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<JobResponse>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    exportDevicesWithHttpOperationResponse(resourceGroupName: string, resourceName: string, exportDevicesParameters: models.ExportDevicesRequest, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<models.JobResponse>>;

    /**
     * @summary Exports all the device identities in the IoT hub identity registry
     * to an Azure Storage blob container. For more information, see:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-identity-registry#import-and-export-device-identities.
     *
     * Exports all the device identities in the IoT hub identity registry to an
     * Azure Storage blob container. For more information, see:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-identity-registry#import-and-export-device-identities.
     *
     * @param {string} resourceGroupName The name of the resource group that
     * contains the IoT hub.
     *
     * @param {string} resourceName The name of the IoT hub.
     *
     * @param {object} exportDevicesParameters The parameters that specify the
     * export devices operation.
     *
     * @param {string} exportDevicesParameters.exportBlobContainerUri The export
     * blob container URI.
     *
     * @param {boolean} exportDevicesParameters.excludeKeys The value indicating
     * whether keys should be excluded during export.
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
     *                      @resolve {JobResponse} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {JobResponse} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link JobResponse} for more information.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    exportDevices(resourceGroupName: string, resourceName: string, exportDevicesParameters: models.ExportDevicesRequest, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<models.JobResponse>;
    exportDevices(resourceGroupName: string, resourceName: string, exportDevicesParameters: models.ExportDevicesRequest, callback: ServiceCallback<models.JobResponse>): void;
    exportDevices(resourceGroupName: string, resourceName: string, exportDevicesParameters: models.ExportDevicesRequest, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.JobResponse>): void;


    /**
     * @summary Import, update, or delete device identities in the IoT hub identity
     * registry from a blob. For more information, see:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-identity-registry#import-and-export-device-identities.
     *
     * Import, update, or delete device identities in the IoT hub identity registry
     * from a blob. For more information, see:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-identity-registry#import-and-export-device-identities.
     *
     * @param {string} resourceGroupName The name of the resource group that
     * contains the IoT hub.
     *
     * @param {string} resourceName The name of the IoT hub.
     *
     * @param {object} importDevicesParameters The parameters that specify the
     * import devices operation.
     *
     * @param {string} importDevicesParameters.inputBlobContainerUri The input blob
     * container URI.
     *
     * @param {string} importDevicesParameters.outputBlobContainerUri The output
     * blob container URI.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<JobResponse>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    importDevicesWithHttpOperationResponse(resourceGroupName: string, resourceName: string, importDevicesParameters: models.ImportDevicesRequest, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<models.JobResponse>>;

    /**
     * @summary Import, update, or delete device identities in the IoT hub identity
     * registry from a blob. For more information, see:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-identity-registry#import-and-export-device-identities.
     *
     * Import, update, or delete device identities in the IoT hub identity registry
     * from a blob. For more information, see:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-identity-registry#import-and-export-device-identities.
     *
     * @param {string} resourceGroupName The name of the resource group that
     * contains the IoT hub.
     *
     * @param {string} resourceName The name of the IoT hub.
     *
     * @param {object} importDevicesParameters The parameters that specify the
     * import devices operation.
     *
     * @param {string} importDevicesParameters.inputBlobContainerUri The input blob
     * container URI.
     *
     * @param {string} importDevicesParameters.outputBlobContainerUri The output
     * blob container URI.
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
     *                      @resolve {JobResponse} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {JobResponse} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link JobResponse} for more information.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    importDevices(resourceGroupName: string, resourceName: string, importDevicesParameters: models.ImportDevicesRequest, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<models.JobResponse>;
    importDevices(resourceGroupName: string, resourceName: string, importDevicesParameters: models.ImportDevicesRequest, callback: ServiceCallback<models.JobResponse>): void;
    importDevices(resourceGroupName: string, resourceName: string, importDevicesParameters: models.ImportDevicesRequest, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.JobResponse>): void;


    /**
     * @summary Create or update the metadata of an IoT hub.
     *
     * Create or update the metadata of an Iot hub. The usual pattern to modify a
     * property is to retrieve the IoT hub metadata and security metadata, and then
     * combine them with the modified values in a new body to update the IoT hub.
     *
     * @param {string} resourceGroupName The name of the resource group that
     * contains the IoT hub.
     *
     * @param {string} resourceName The name of the IoT hub to create or update.
     *
     * @param {object} iotHubDescription The IoT hub metadata and security
     * metadata.
     *
     * @param {string} iotHubDescription.subscriptionid The subscription
     * identifier.
     *
     * @param {string} iotHubDescription.resourcegroup The name of the resource
     * group that contains the IoT hub. A resource group name uniquely identifies
     * the resource group within the subscription.
     *
     * @param {string} [iotHubDescription.etag] The Etag field is *not* required.
     * If it is provided in the response body, it must also be provided as a header
     * per the normal ETag convention.
     *
     * @param {object} [iotHubDescription.properties]
     *
     * @param {array} [iotHubDescription.properties.authorizationPolicies] The
     * shared access policies you can use to secure a connection to the IoT hub.
     *
     * @param {array} [iotHubDescription.properties.ipFilterRules] The IP filter
     * rules.
     *
     * @param {object} [iotHubDescription.properties.eventHubEndpoints] The Event
     * Hub-compatible endpoint properties. The possible keys to this dictionary are
     * events and operationsMonitoringEvents. Both of these keys have to be present
     * in the dictionary while making create or update calls for the IoT hub.
     *
     * @param {object} [iotHubDescription.properties.routing]
     *
     * @param {object} [iotHubDescription.properties.routing.endpoints]
     *
     * @param {array}
     * [iotHubDescription.properties.routing.endpoints.serviceBusQueues] The list
     * of Service Bus queue endpoints that IoT hub routes the messages to, based on
     * the routing rules.
     *
     * @param {array}
     * [iotHubDescription.properties.routing.endpoints.serviceBusTopics] The list
     * of Service Bus topic endpoints that the IoT hub routes the messages to,
     * based on the routing rules.
     *
     * @param {array} [iotHubDescription.properties.routing.endpoints.eventHubs]
     * The list of Event Hubs endpoints that IoT hub routes messages to, based on
     * the routing rules. This list does not include the built-in Event Hubs
     * endpoint.
     *
     * @param {array} [iotHubDescription.properties.routing.routes] The list of
     * user-provided routing rules that the IoT hub uses to route messages to
     * built-in and custom endpoints. A maximum of 100 routing rules are allowed
     * for paid hubs and a maximum of 5 routing rules are allowed for free hubs.
     *
     * @param {object} [iotHubDescription.properties.routing.fallbackRoute] The
     * properties of the route that is used as a fall-back route when none of the
     * conditions specified in the 'routes' section are met. This is an optional
     * parameter. When this property is not set, the messages which do not meet any
     * of the conditions specified in the 'routes' section get routed to the
     * built-in eventhub endpoint.
     *
     * @param {string}
     * [iotHubDescription.properties.routing.fallbackRoute.condition] The condition
     * which is evaluated in order to apply the fallback route. If the condition is
     * not provided it will evaluate to true by default. For grammar, See:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-query-language
     *
     * @param {array}
     * iotHubDescription.properties.routing.fallbackRoute.endpointNames The list of
     * endpoints to which the messages that satisfy the condition are routed to.
     * Currently only 1 endpoint is allowed.
     *
     * @param {boolean}
     * iotHubDescription.properties.routing.fallbackRoute.isEnabled Used to specify
     * whether the fallback route is enabled or not.
     *
     * @param {object} [iotHubDescription.properties.storageEndpoints] The list of
     * Azure Storage endpoints where you can upload files. Currently you can
     * configure only one Azure Storage account and that MUST have its key as
     * $default. Specifying more than one storage account causes an error to be
     * thrown. Not specifying a value for this property when the
     * enableFileUploadNotifications property is set to True, causes an error to be
     * thrown.
     *
     * @param {object} [iotHubDescription.properties.messagingEndpoints] The
     * messaging endpoint properties for the file upload notification queue.
     *
     * @param {boolean}
     * [iotHubDescription.properties.enableFileUploadNotifications] If True, file
     * upload notifications are enabled.
     *
     * @param {object} [iotHubDescription.properties.cloudToDevice]
     *
     * @param {number}
     * [iotHubDescription.properties.cloudToDevice.maxDeliveryCount] The max
     * delivery count for cloud-to-device messages in the device queue. See:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#cloud-to-device-messages.
     *
     * @param {moment.duration}
     * [iotHubDescription.properties.cloudToDevice.defaultTtlAsIso8601] The default
     * time to live for cloud-to-device messages in the device queue. See:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#cloud-to-device-messages.
     *
     * @param {object} [iotHubDescription.properties.cloudToDevice.feedback]
     *
     * @param {moment.duration}
     * [iotHubDescription.properties.cloudToDevice.feedback.lockDurationAsIso8601]
     * The lock duration for the feedback queue. See:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#cloud-to-device-messages.
     *
     * @param {moment.duration}
     * [iotHubDescription.properties.cloudToDevice.feedback.ttlAsIso8601] The
     * period of time for which a message is available to consume before it is
     * expired by the IoT hub. See:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#cloud-to-device-messages.
     *
     * @param {number}
     * [iotHubDescription.properties.cloudToDevice.feedback.maxDeliveryCount] The
     * number of times the IoT hub attempts to deliver a message on the feedback
     * queue. See:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#cloud-to-device-messages.
     *
     * @param {string} [iotHubDescription.properties.comments] Comments.
     *
     * @param {object}
     * [iotHubDescription.properties.operationsMonitoringProperties]
     *
     * @param {object}
     * [iotHubDescription.properties.operationsMonitoringProperties.events]
     *
     * @param {string} [iotHubDescription.properties.features] The capabilities and
     * features enabled for the IoT hub. Possible values include: 'None',
     * 'DeviceManagement'
     *
     * @param {object} iotHubDescription.sku
     *
     * @param {string} iotHubDescription.sku.name The name of the SKU. Possible
     * values include: 'F1', 'S1', 'S2', 'S3'
     *
     * @param {number} iotHubDescription.sku.capacity The number of provisioned IoT
     * Hub units. See:
     * https://docs.microsoft.com/azure/azure-subscription-service-limits#iot-hub-limits.
     *
     * @param {string} iotHubDescription.location The resource location.
     *
     * @param {object} [iotHubDescription.tags] The resource tags.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<IotHubDescription>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    beginCreateOrUpdateWithHttpOperationResponse(resourceGroupName: string, resourceName: string, iotHubDescription: models.IotHubDescription, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<models.IotHubDescription>>;

    /**
     * @summary Create or update the metadata of an IoT hub.
     *
     * Create or update the metadata of an Iot hub. The usual pattern to modify a
     * property is to retrieve the IoT hub metadata and security metadata, and then
     * combine them with the modified values in a new body to update the IoT hub.
     *
     * @param {string} resourceGroupName The name of the resource group that
     * contains the IoT hub.
     *
     * @param {string} resourceName The name of the IoT hub to create or update.
     *
     * @param {object} iotHubDescription The IoT hub metadata and security
     * metadata.
     *
     * @param {string} iotHubDescription.subscriptionid The subscription
     * identifier.
     *
     * @param {string} iotHubDescription.resourcegroup The name of the resource
     * group that contains the IoT hub. A resource group name uniquely identifies
     * the resource group within the subscription.
     *
     * @param {string} [iotHubDescription.etag] The Etag field is *not* required.
     * If it is provided in the response body, it must also be provided as a header
     * per the normal ETag convention.
     *
     * @param {object} [iotHubDescription.properties]
     *
     * @param {array} [iotHubDescription.properties.authorizationPolicies] The
     * shared access policies you can use to secure a connection to the IoT hub.
     *
     * @param {array} [iotHubDescription.properties.ipFilterRules] The IP filter
     * rules.
     *
     * @param {object} [iotHubDescription.properties.eventHubEndpoints] The Event
     * Hub-compatible endpoint properties. The possible keys to this dictionary are
     * events and operationsMonitoringEvents. Both of these keys have to be present
     * in the dictionary while making create or update calls for the IoT hub.
     *
     * @param {object} [iotHubDescription.properties.routing]
     *
     * @param {object} [iotHubDescription.properties.routing.endpoints]
     *
     * @param {array}
     * [iotHubDescription.properties.routing.endpoints.serviceBusQueues] The list
     * of Service Bus queue endpoints that IoT hub routes the messages to, based on
     * the routing rules.
     *
     * @param {array}
     * [iotHubDescription.properties.routing.endpoints.serviceBusTopics] The list
     * of Service Bus topic endpoints that the IoT hub routes the messages to,
     * based on the routing rules.
     *
     * @param {array} [iotHubDescription.properties.routing.endpoints.eventHubs]
     * The list of Event Hubs endpoints that IoT hub routes messages to, based on
     * the routing rules. This list does not include the built-in Event Hubs
     * endpoint.
     *
     * @param {array} [iotHubDescription.properties.routing.routes] The list of
     * user-provided routing rules that the IoT hub uses to route messages to
     * built-in and custom endpoints. A maximum of 100 routing rules are allowed
     * for paid hubs and a maximum of 5 routing rules are allowed for free hubs.
     *
     * @param {object} [iotHubDescription.properties.routing.fallbackRoute] The
     * properties of the route that is used as a fall-back route when none of the
     * conditions specified in the 'routes' section are met. This is an optional
     * parameter. When this property is not set, the messages which do not meet any
     * of the conditions specified in the 'routes' section get routed to the
     * built-in eventhub endpoint.
     *
     * @param {string}
     * [iotHubDescription.properties.routing.fallbackRoute.condition] The condition
     * which is evaluated in order to apply the fallback route. If the condition is
     * not provided it will evaluate to true by default. For grammar, See:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-query-language
     *
     * @param {array}
     * iotHubDescription.properties.routing.fallbackRoute.endpointNames The list of
     * endpoints to which the messages that satisfy the condition are routed to.
     * Currently only 1 endpoint is allowed.
     *
     * @param {boolean}
     * iotHubDescription.properties.routing.fallbackRoute.isEnabled Used to specify
     * whether the fallback route is enabled or not.
     *
     * @param {object} [iotHubDescription.properties.storageEndpoints] The list of
     * Azure Storage endpoints where you can upload files. Currently you can
     * configure only one Azure Storage account and that MUST have its key as
     * $default. Specifying more than one storage account causes an error to be
     * thrown. Not specifying a value for this property when the
     * enableFileUploadNotifications property is set to True, causes an error to be
     * thrown.
     *
     * @param {object} [iotHubDescription.properties.messagingEndpoints] The
     * messaging endpoint properties for the file upload notification queue.
     *
     * @param {boolean}
     * [iotHubDescription.properties.enableFileUploadNotifications] If True, file
     * upload notifications are enabled.
     *
     * @param {object} [iotHubDescription.properties.cloudToDevice]
     *
     * @param {number}
     * [iotHubDescription.properties.cloudToDevice.maxDeliveryCount] The max
     * delivery count for cloud-to-device messages in the device queue. See:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#cloud-to-device-messages.
     *
     * @param {moment.duration}
     * [iotHubDescription.properties.cloudToDevice.defaultTtlAsIso8601] The default
     * time to live for cloud-to-device messages in the device queue. See:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#cloud-to-device-messages.
     *
     * @param {object} [iotHubDescription.properties.cloudToDevice.feedback]
     *
     * @param {moment.duration}
     * [iotHubDescription.properties.cloudToDevice.feedback.lockDurationAsIso8601]
     * The lock duration for the feedback queue. See:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#cloud-to-device-messages.
     *
     * @param {moment.duration}
     * [iotHubDescription.properties.cloudToDevice.feedback.ttlAsIso8601] The
     * period of time for which a message is available to consume before it is
     * expired by the IoT hub. See:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#cloud-to-device-messages.
     *
     * @param {number}
     * [iotHubDescription.properties.cloudToDevice.feedback.maxDeliveryCount] The
     * number of times the IoT hub attempts to deliver a message on the feedback
     * queue. See:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messaging#cloud-to-device-messages.
     *
     * @param {string} [iotHubDescription.properties.comments] Comments.
     *
     * @param {object}
     * [iotHubDescription.properties.operationsMonitoringProperties]
     *
     * @param {object}
     * [iotHubDescription.properties.operationsMonitoringProperties.events]
     *
     * @param {string} [iotHubDescription.properties.features] The capabilities and
     * features enabled for the IoT hub. Possible values include: 'None',
     * 'DeviceManagement'
     *
     * @param {object} iotHubDescription.sku
     *
     * @param {string} iotHubDescription.sku.name The name of the SKU. Possible
     * values include: 'F1', 'S1', 'S2', 'S3'
     *
     * @param {number} iotHubDescription.sku.capacity The number of provisioned IoT
     * Hub units. See:
     * https://docs.microsoft.com/azure/azure-subscription-service-limits#iot-hub-limits.
     *
     * @param {string} iotHubDescription.location The resource location.
     *
     * @param {object} [iotHubDescription.tags] The resource tags.
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
     *                      @resolve {IotHubDescription} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {IotHubDescription} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link IotHubDescription} for more information.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    beginCreateOrUpdate(resourceGroupName: string, resourceName: string, iotHubDescription: models.IotHubDescription, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<models.IotHubDescription>;
    beginCreateOrUpdate(resourceGroupName: string, resourceName: string, iotHubDescription: models.IotHubDescription, callback: ServiceCallback<models.IotHubDescription>): void;
    beginCreateOrUpdate(resourceGroupName: string, resourceName: string, iotHubDescription: models.IotHubDescription, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.IotHubDescription>): void;


    /**
     * @summary Delete an IoT hub.
     *
     * Delete an IoT hub.
     *
     * @param {string} resourceGroupName The name of the resource group that
     * contains the IoT hub.
     *
     * @param {string} resourceName The name of the IoT hub to delete.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<Object>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    beginDeleteMethodWithHttpOperationResponse(resourceGroupName: string, resourceName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<any>>;

    /**
     * @summary Delete an IoT hub.
     *
     * Delete an IoT hub.
     *
     * @param {string} resourceGroupName The name of the resource group that
     * contains the IoT hub.
     *
     * @param {string} resourceName The name of the IoT hub to delete.
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
     *                      @resolve {Object} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {Object} [result]   - The deserialized result object if an error did not occur.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    beginDeleteMethod(resourceGroupName: string, resourceName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<any>;
    beginDeleteMethod(resourceGroupName: string, resourceName: string, callback: ServiceCallback<any>): void;
    beginDeleteMethod(resourceGroupName: string, resourceName: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<any>): void;


    /**
     * @summary Get all the IoT hubs in a subscription.
     *
     * Get all the IoT hubs in a subscription.
     *
     * @param {string} nextPageLink The NextLink from the previous successful call
     * to List operation.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<IotHubDescriptionListResult>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    listBySubscriptionNextWithHttpOperationResponse(nextPageLink: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<models.IotHubDescriptionListResult>>;

    /**
     * @summary Get all the IoT hubs in a subscription.
     *
     * Get all the IoT hubs in a subscription.
     *
     * @param {string} nextPageLink The NextLink from the previous successful call
     * to List operation.
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
     *                      @resolve {IotHubDescriptionListResult} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {IotHubDescriptionListResult} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link IotHubDescriptionListResult} for more
     *                      information.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    listBySubscriptionNext(nextPageLink: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<models.IotHubDescriptionListResult>;
    listBySubscriptionNext(nextPageLink: string, callback: ServiceCallback<models.IotHubDescriptionListResult>): void;
    listBySubscriptionNext(nextPageLink: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.IotHubDescriptionListResult>): void;


    /**
     * @summary Get all the IoT hubs in a resource group.
     *
     * Get all the IoT hubs in a resource group.
     *
     * @param {string} nextPageLink The NextLink from the previous successful call
     * to List operation.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<IotHubDescriptionListResult>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    listByResourceGroupNextWithHttpOperationResponse(nextPageLink: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<models.IotHubDescriptionListResult>>;

    /**
     * @summary Get all the IoT hubs in a resource group.
     *
     * Get all the IoT hubs in a resource group.
     *
     * @param {string} nextPageLink The NextLink from the previous successful call
     * to List operation.
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
     *                      @resolve {IotHubDescriptionListResult} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {IotHubDescriptionListResult} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link IotHubDescriptionListResult} for more
     *                      information.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    listByResourceGroupNext(nextPageLink: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<models.IotHubDescriptionListResult>;
    listByResourceGroupNext(nextPageLink: string, callback: ServiceCallback<models.IotHubDescriptionListResult>): void;
    listByResourceGroupNext(nextPageLink: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.IotHubDescriptionListResult>): void;


    /**
     * @summary Get the list of valid SKUs for an IoT hub.
     *
     * Get the list of valid SKUs for an IoT hub.
     *
     * @param {string} nextPageLink The NextLink from the previous successful call
     * to List operation.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<IotHubSkuDescriptionListResult>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    getValidSkusNextWithHttpOperationResponse(nextPageLink: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<models.IotHubSkuDescriptionListResult>>;

    /**
     * @summary Get the list of valid SKUs for an IoT hub.
     *
     * Get the list of valid SKUs for an IoT hub.
     *
     * @param {string} nextPageLink The NextLink from the previous successful call
     * to List operation.
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
     *                      @resolve {IotHubSkuDescriptionListResult} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {IotHubSkuDescriptionListResult} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link IotHubSkuDescriptionListResult} for more
     *                      information.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    getValidSkusNext(nextPageLink: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<models.IotHubSkuDescriptionListResult>;
    getValidSkusNext(nextPageLink: string, callback: ServiceCallback<models.IotHubSkuDescriptionListResult>): void;
    getValidSkusNext(nextPageLink: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.IotHubSkuDescriptionListResult>): void;


    /**
     * @summary Get a list of the consumer groups in the Event Hub-compatible
     * device-to-cloud endpoint in an IoT hub.
     *
     * Get a list of the consumer groups in the Event Hub-compatible
     * device-to-cloud endpoint in an IoT hub.
     *
     * @param {string} nextPageLink The NextLink from the previous successful call
     * to List operation.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<EventHubConsumerGroupsListResult>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    listEventHubConsumerGroupsNextWithHttpOperationResponse(nextPageLink: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<models.EventHubConsumerGroupsListResult>>;

    /**
     * @summary Get a list of the consumer groups in the Event Hub-compatible
     * device-to-cloud endpoint in an IoT hub.
     *
     * Get a list of the consumer groups in the Event Hub-compatible
     * device-to-cloud endpoint in an IoT hub.
     *
     * @param {string} nextPageLink The NextLink from the previous successful call
     * to List operation.
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
     *                      @resolve {EventHubConsumerGroupsListResult} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {EventHubConsumerGroupsListResult} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link EventHubConsumerGroupsListResult} for more
     *                      information.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    listEventHubConsumerGroupsNext(nextPageLink: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<models.EventHubConsumerGroupsListResult>;
    listEventHubConsumerGroupsNext(nextPageLink: string, callback: ServiceCallback<models.EventHubConsumerGroupsListResult>): void;
    listEventHubConsumerGroupsNext(nextPageLink: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.EventHubConsumerGroupsListResult>): void;


    /**
     * @summary Get a list of all the jobs in an IoT hub. For more information,
     * see:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-identity-registry.
     *
     * Get a list of all the jobs in an IoT hub. For more information, see:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-identity-registry.
     *
     * @param {string} nextPageLink The NextLink from the previous successful call
     * to List operation.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<JobResponseListResult>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    listJobsNextWithHttpOperationResponse(nextPageLink: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<models.JobResponseListResult>>;

    /**
     * @summary Get a list of all the jobs in an IoT hub. For more information,
     * see:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-identity-registry.
     *
     * Get a list of all the jobs in an IoT hub. For more information, see:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-identity-registry.
     *
     * @param {string} nextPageLink The NextLink from the previous successful call
     * to List operation.
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
     *                      @resolve {JobResponseListResult} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {JobResponseListResult} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link JobResponseListResult} for more information.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    listJobsNext(nextPageLink: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<models.JobResponseListResult>;
    listJobsNext(nextPageLink: string, callback: ServiceCallback<models.JobResponseListResult>): void;
    listJobsNext(nextPageLink: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.JobResponseListResult>): void;


    /**
     * @summary Get the quota metrics for an IoT hub.
     *
     * Get the quota metrics for an IoT hub.
     *
     * @param {string} nextPageLink The NextLink from the previous successful call
     * to List operation.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<IotHubQuotaMetricInfoListResult>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    getQuotaMetricsNextWithHttpOperationResponse(nextPageLink: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<models.IotHubQuotaMetricInfoListResult>>;

    /**
     * @summary Get the quota metrics for an IoT hub.
     *
     * Get the quota metrics for an IoT hub.
     *
     * @param {string} nextPageLink The NextLink from the previous successful call
     * to List operation.
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
     *                      @resolve {IotHubQuotaMetricInfoListResult} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {IotHubQuotaMetricInfoListResult} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link IotHubQuotaMetricInfoListResult} for more
     *                      information.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    getQuotaMetricsNext(nextPageLink: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<models.IotHubQuotaMetricInfoListResult>;
    getQuotaMetricsNext(nextPageLink: string, callback: ServiceCallback<models.IotHubQuotaMetricInfoListResult>): void;
    getQuotaMetricsNext(nextPageLink: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.IotHubQuotaMetricInfoListResult>): void;


    /**
     * @summary Get the security metadata for an IoT hub. For more information,
     * see: https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-security.
     *
     * Get the security metadata for an IoT hub. For more information, see:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-security.
     *
     * @param {string} nextPageLink The NextLink from the previous successful call
     * to List operation.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<SharedAccessSignatureAuthorizationRuleListResult>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    listKeysNextWithHttpOperationResponse(nextPageLink: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<models.SharedAccessSignatureAuthorizationRuleListResult>>;

    /**
     * @summary Get the security metadata for an IoT hub. For more information,
     * see: https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-security.
     *
     * Get the security metadata for an IoT hub. For more information, see:
     * https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-security.
     *
     * @param {string} nextPageLink The NextLink from the previous successful call
     * to List operation.
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
     *                      @resolve {SharedAccessSignatureAuthorizationRuleListResult} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {SharedAccessSignatureAuthorizationRuleListResult} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link
     *                      SharedAccessSignatureAuthorizationRuleListResult} for
     *                      more information.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    listKeysNext(nextPageLink: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<models.SharedAccessSignatureAuthorizationRuleListResult>;
    listKeysNext(nextPageLink: string, callback: ServiceCallback<models.SharedAccessSignatureAuthorizationRuleListResult>): void;
    listKeysNext(nextPageLink: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.SharedAccessSignatureAuthorizationRuleListResult>): void;
}
