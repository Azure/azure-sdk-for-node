import * as msRest from "ms-rest-js";
import * as Models from "../models";
import { ApplicationInsightsDataClientContext } from "../applicationInsightsDataClientContext";
/** Class representing a Events. */
export declare class Events {
    private readonly client;
    private readonly serializer;
    /**
     * Create a Events.
     * @param {ApplicationInsightsDataClientContext} client Reference to the service client.
     */
    constructor(client: ApplicationInsightsDataClientContext);
    /**
     * @summary Execute OData query
     *
     * Executes an OData query for events
     *
     * @param {string} appId ID of the application. This is Application ID from the API Access settings
     * blade in the Azure portal.
     *
     * @param {EventType} eventType The type of events to query; either a standard event type
     * (`traces`, `customEvents`, `pageViews`, `requests`, `dependencies`, `exceptions`,
     * `availabilityResults`) or `$all` to query across all event types. Possible values include:
     * '$all', 'traces', 'customEvents', 'pageViews', 'browserTimings', 'requests', 'dependencies',
     * 'exceptions', 'availabilityResults', 'performanceCounters', 'customMetrics'
     *
     * @param {EventsGetByTypeOptionalParams} [options] Optional Parameters.
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse} The deserialized result object.
     *
     * @reject {Error|ServiceError} The error object.
     */
    getByTypeWithHttpOperationResponse(appId: string, eventType: Models.EventType, options?: Models.EventsGetByTypeOptionalParams): Promise<msRest.HttpOperationResponse<Models.EventsResults>>;
    /**
     * @summary Get an event
     *
     * Gets the data for a single event
     *
     * @param {string} appId ID of the application. This is Application ID from the API Access settings
     * blade in the Azure portal.
     *
     * @param {EventType} eventType The type of events to query; either a standard event type
     * (`traces`, `customEvents`, `pageViews`, `requests`, `dependencies`, `exceptions`,
     * `availabilityResults`) or `$all` to query across all event types. Possible values include:
     * '$all', 'traces', 'customEvents', 'pageViews', 'browserTimings', 'requests', 'dependencies',
     * 'exceptions', 'availabilityResults', 'performanceCounters', 'customMetrics'
     *
     * @param {string} eventId ID of event.
     *
     * @param {EventsGetOptionalParams} [options] Optional Parameters.
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse} The deserialized result object.
     *
     * @reject {Error|ServiceError} The error object.
     */
    getWithHttpOperationResponse(appId: string, eventType: Models.EventType, eventId: string, options?: Models.EventsGetOptionalParams): Promise<msRest.HttpOperationResponse<Models.EventsResults>>;
    /**
     * @summary Get OData metadata
     *
     * Gets OData EDMX metadata describing the event data model
     *
     * @param {string} appId ID of the application. This is Application ID from the API Access settings
     * blade in the Azure portal.
     *
     * @param {RequestOptionsBase} [options] Optional Parameters.
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse} The deserialized result object.
     *
     * @reject {Error|ServiceError} The error object.
     */
    getOdataMetadataWithHttpOperationResponse(appId: string, options?: msRest.RequestOptionsBase): Promise<msRest.HttpOperationResponse<any>>;
    /**
     * @summary Execute OData query
     *
     * Executes an OData query for events
     *
     * @param {string} appId ID of the application. This is Application ID from the API Access settings
     * blade in the Azure portal.
     *
     * @param {EventType} eventType The type of events to query; either a standard event type
     * (`traces`, `customEvents`, `pageViews`, `requests`, `dependencies`, `exceptions`,
     * `availabilityResults`) or `$all` to query across all event types. Possible values include:
     * '$all', 'traces', 'customEvents', 'pageViews', 'browserTimings', 'requests', 'dependencies',
     * 'exceptions', 'availabilityResults', 'performanceCounters', 'customMetrics'
     *
     * @param {EventsGetByTypeOptionalParams} [options] Optional Parameters.
     *
     * @param {ServiceCallback} callback The callback.
     *
     * @returns {ServiceCallback} callback(err, result, request, operationRes)
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *                      {Models.EventsResults} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link Models.EventsResults} for more information.
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *                      {HttpOperationResponse} [response] - The HTTP Response stream if an error did not occur.
     */
    getByType(appId: string, eventType: Models.EventType): Promise<Models.EventsResults>;
    getByType(appId: string, eventType: Models.EventType, options: Models.EventsGetByTypeOptionalParams): Promise<Models.EventsResults>;
    getByType(appId: string, eventType: Models.EventType, callback: msRest.ServiceCallback<Models.EventsResults>): void;
    getByType(appId: string, eventType: Models.EventType, options: Models.EventsGetByTypeOptionalParams, callback: msRest.ServiceCallback<Models.EventsResults>): void;
    /**
     * @summary Get an event
     *
     * Gets the data for a single event
     *
     * @param {string} appId ID of the application. This is Application ID from the API Access settings
     * blade in the Azure portal.
     *
     * @param {EventType} eventType The type of events to query; either a standard event type
     * (`traces`, `customEvents`, `pageViews`, `requests`, `dependencies`, `exceptions`,
     * `availabilityResults`) or `$all` to query across all event types. Possible values include:
     * '$all', 'traces', 'customEvents', 'pageViews', 'browserTimings', 'requests', 'dependencies',
     * 'exceptions', 'availabilityResults', 'performanceCounters', 'customMetrics'
     *
     * @param {string} eventId ID of event.
     *
     * @param {EventsGetOptionalParams} [options] Optional Parameters.
     *
     * @param {ServiceCallback} callback The callback.
     *
     * @returns {ServiceCallback} callback(err, result, request, operationRes)
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *                      {Models.EventsResults} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link Models.EventsResults} for more information.
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *                      {HttpOperationResponse} [response] - The HTTP Response stream if an error did not occur.
     */
    get(appId: string, eventType: Models.EventType, eventId: string): Promise<Models.EventsResults>;
    get(appId: string, eventType: Models.EventType, eventId: string, options: Models.EventsGetOptionalParams): Promise<Models.EventsResults>;
    get(appId: string, eventType: Models.EventType, eventId: string, callback: msRest.ServiceCallback<Models.EventsResults>): void;
    get(appId: string, eventType: Models.EventType, eventId: string, options: Models.EventsGetOptionalParams, callback: msRest.ServiceCallback<Models.EventsResults>): void;
    /**
     * @summary Get OData metadata
     *
     * Gets OData EDMX metadata describing the event data model
     *
     * @param {string} appId ID of the application. This is Application ID from the API Access settings
     * blade in the Azure portal.
     *
     * @param {RequestOptionsBase} [options] Optional Parameters.
     *
     * @param {ServiceCallback} callback The callback.
     *
     * @returns {ServiceCallback} callback(err, result, request, operationRes)
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *                      {any} [result]   - The deserialized result object if an error did not occur.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *                      {HttpOperationResponse} [response] - The HTTP Response stream if an error did not occur.
     */
    getOdataMetadata(appId: string): Promise<any>;
    getOdataMetadata(appId: string, options: msRest.RequestOptionsBase): Promise<any>;
    getOdataMetadata(appId: string, callback: msRest.ServiceCallback<any>): void;
    getOdataMetadata(appId: string, options: msRest.RequestOptionsBase, callback: msRest.ServiceCallback<any>): void;
}
