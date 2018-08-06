import * as msRest from "ms-rest-js";
import * as Models from "../models";
import { ApplicationInsightsDataClientContext } from "../applicationInsightsDataClientContext";
/** Class representing a Metrics. */
export declare class Metrics {
    private readonly client;
    private readonly serializer;
    /**
     * Create a Metrics.
     * @param {ApplicationInsightsDataClientContext} client Reference to the service client.
     */
    constructor(client: ApplicationInsightsDataClientContext);
    /**
     * @summary Retrieve metric data
     *
     * Gets metric values for a single metric
     *
     * @param {string} appId ID of the application. This is Application ID from the API Access settings
     * blade in the Azure portal.
     *
     * @param {MetricId} metricId ID of the metric. This is either a standard AI metric, or an
     * application-specific custom metric. Possible values include: 'requests/count',
     * 'requests/duration', 'requests/failed', 'users/count', 'users/authenticated', 'pageViews/count',
     * 'pageViews/duration', 'client/processingDuration', 'client/receiveDuration',
     * 'client/networkDuration', 'client/sendDuration', 'client/totalDuration', 'dependencies/count',
     * 'dependencies/failed', 'dependencies/duration', 'exceptions/count', 'exceptions/browser',
     * 'exceptions/server', 'sessions/count', 'performanceCounters/requestExecutionTime',
     * 'performanceCounters/requestsPerSecond', 'performanceCounters/requestsInQueue',
     * 'performanceCounters/memoryAvailableBytes', 'performanceCounters/exceptionsPerSecond',
     * 'performanceCounters/processCpuPercentage', 'performanceCounters/processIOBytesPerSecond',
     * 'performanceCounters/processPrivateBytes', 'performanceCounters/processorCpuPercentage',
     * 'availabilityResults/availabilityPercentage', 'availabilityResults/duration',
     * 'billing/telemetryCount', 'customEvents/count'
     *
     * @param {MetricsGetOptionalParams} [options] Optional Parameters.
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse} The deserialized result object.
     *
     * @reject {Error|ServiceError} The error object.
     */
    getWithHttpOperationResponse(appId: string, metricId: Models.MetricId, options?: Models.MetricsGetOptionalParams): Promise<msRest.HttpOperationResponse<Models.MetricsResult>>;
    /**
     * @summary Retrieve metric data
     *
     * Gets metric values for multiple metrics
     *
     * @param {string} appId ID of the application. This is Application ID from the API Access settings
     * blade in the Azure portal.
     *
     * @param {MetricsPostBodySchema[]} body The batched metrics query.
     *
     * @param {RequestOptionsBase} [options] Optional Parameters.
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse} The deserialized result object.
     *
     * @reject {Error|ServiceError} The error object.
     */
    getMultipleWithHttpOperationResponse(appId: string, body: Models.MetricsPostBodySchema[], options?: msRest.RequestOptionsBase): Promise<msRest.HttpOperationResponse<Models.MetricsResultsItem[]>>;
    /**
     * @summary Retrieve metric metatadata
     *
     * Gets metadata describing the available metrics
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
    getMetadataWithHttpOperationResponse(appId: string, options?: msRest.RequestOptionsBase): Promise<msRest.HttpOperationResponse<any>>;
    /**
     * @summary Retrieve metric data
     *
     * Gets metric values for a single metric
     *
     * @param {string} appId ID of the application. This is Application ID from the API Access settings
     * blade in the Azure portal.
     *
     * @param {MetricId} metricId ID of the metric. This is either a standard AI metric, or an
     * application-specific custom metric. Possible values include: 'requests/count',
     * 'requests/duration', 'requests/failed', 'users/count', 'users/authenticated', 'pageViews/count',
     * 'pageViews/duration', 'client/processingDuration', 'client/receiveDuration',
     * 'client/networkDuration', 'client/sendDuration', 'client/totalDuration', 'dependencies/count',
     * 'dependencies/failed', 'dependencies/duration', 'exceptions/count', 'exceptions/browser',
     * 'exceptions/server', 'sessions/count', 'performanceCounters/requestExecutionTime',
     * 'performanceCounters/requestsPerSecond', 'performanceCounters/requestsInQueue',
     * 'performanceCounters/memoryAvailableBytes', 'performanceCounters/exceptionsPerSecond',
     * 'performanceCounters/processCpuPercentage', 'performanceCounters/processIOBytesPerSecond',
     * 'performanceCounters/processPrivateBytes', 'performanceCounters/processorCpuPercentage',
     * 'availabilityResults/availabilityPercentage', 'availabilityResults/duration',
     * 'billing/telemetryCount', 'customEvents/count'
     *
     * @param {MetricsGetOptionalParams} [options] Optional Parameters.
     *
     * @param {ServiceCallback} callback The callback.
     *
     * @returns {ServiceCallback} callback(err, result, request, operationRes)
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *                      {Models.MetricsResult} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link Models.MetricsResult} for more information.
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *                      {HttpOperationResponse} [response] - The HTTP Response stream if an error did not occur.
     */
    get(appId: string, metricId: Models.MetricId): Promise<Models.MetricsResult>;
    get(appId: string, metricId: Models.MetricId, options: Models.MetricsGetOptionalParams): Promise<Models.MetricsResult>;
    get(appId: string, metricId: Models.MetricId, callback: msRest.ServiceCallback<Models.MetricsResult>): void;
    get(appId: string, metricId: Models.MetricId, options: Models.MetricsGetOptionalParams, callback: msRest.ServiceCallback<Models.MetricsResult>): void;
    /**
     * @summary Retrieve metric data
     *
     * Gets metric values for multiple metrics
     *
     * @param {string} appId ID of the application. This is Application ID from the API Access settings
     * blade in the Azure portal.
     *
     * @param {MetricsPostBodySchema[]} body The batched metrics query.
     *
     * @param {RequestOptionsBase} [options] Optional Parameters.
     *
     * @param {ServiceCallback} callback The callback.
     *
     * @returns {ServiceCallback} callback(err, result, request, operationRes)
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *                      {Models.MetricsResultsItem[]} [result]   - The deserialized result object if an error did not occur.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *                      {HttpOperationResponse} [response] - The HTTP Response stream if an error did not occur.
     */
    getMultiple(appId: string, body: Models.MetricsPostBodySchema[]): Promise<Models.MetricsResultsItem[]>;
    getMultiple(appId: string, body: Models.MetricsPostBodySchema[], options: msRest.RequestOptionsBase): Promise<Models.MetricsResultsItem[]>;
    getMultiple(appId: string, body: Models.MetricsPostBodySchema[], callback: msRest.ServiceCallback<Models.MetricsResultsItem[]>): void;
    getMultiple(appId: string, body: Models.MetricsPostBodySchema[], options: msRest.RequestOptionsBase, callback: msRest.ServiceCallback<Models.MetricsResultsItem[]>): void;
    /**
     * @summary Retrieve metric metatadata
     *
     * Gets metadata describing the available metrics
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
    getMetadata(appId: string): Promise<any>;
    getMetadata(appId: string, options: msRest.RequestOptionsBase): Promise<any>;
    getMetadata(appId: string, callback: msRest.ServiceCallback<any>): void;
    getMetadata(appId: string, options: msRest.RequestOptionsBase, callback: msRest.ServiceCallback<any>): void;
}
