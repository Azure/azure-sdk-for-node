import * as msRest from "ms-rest-js";
import * as Models from "../models";
import { ApplicationInsightsDataClientContext } from "../applicationInsightsDataClientContext";
/** Class representing a Query. */
export declare class Query {
    private readonly client;
    /**
     * Create a Query.
     * @param {ApplicationInsightsDataClientContext} client Reference to the service client.
     */
    constructor(client: ApplicationInsightsDataClientContext);
    /**
     * @summary Execute an Analytics query
     *
     * Executes an Analytics query for data.
     * [Here](https://dev.applicationinsights.io/documentation/Using-the-API/Query) is an example for
     * using POST with an Analytics query.
     *
     * @param {string} appId ID of the application. This is Application ID from the API Access settings
     * blade in the Azure portal.
     *
     * @param {QueryBody} body The Analytics query. Learn more about the [Analytics query
     * syntax](https://azure.microsoft.com/documentation/articles/app-insights-analytics-reference/)
     *
     * @param {RequestOptionsBase} [options] Optional Parameters.
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse} The deserialized result object.
     *
     * @reject {Error|ServiceError} The error object.
     */
    executeWithHttpOperationResponse(appId: string, body: Models.QueryBody, options?: msRest.RequestOptionsBase): Promise<msRest.HttpOperationResponse<Models.QueryResults>>;
    /**
     * @summary Execute an Analytics query
     *
     * Executes an Analytics query for data.
     * [Here](https://dev.applicationinsights.io/documentation/Using-the-API/Query) is an example for
     * using POST with an Analytics query.
     *
     * @param {string} appId ID of the application. This is Application ID from the API Access settings
     * blade in the Azure portal.
     *
     * @param {QueryBody} body The Analytics query. Learn more about the [Analytics query
     * syntax](https://azure.microsoft.com/documentation/articles/app-insights-analytics-reference/)
     *
     * @param {RequestOptionsBase} [options] Optional Parameters.
     *
     * @param {ServiceCallback} callback The callback.
     *
     * @returns {ServiceCallback} callback(err, result, request, operationRes)
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *                      {Models.QueryResults} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link Models.QueryResults} for more information.
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *                      {HttpOperationResponse} [response] - The HTTP Response stream if an error did not occur.
     */
    execute(appId: string, body: Models.QueryBody): Promise<Models.QueryResults>;
    execute(appId: string, body: Models.QueryBody, options: msRest.RequestOptionsBase): Promise<Models.QueryResults>;
    execute(appId: string, body: Models.QueryBody, callback: msRest.ServiceCallback<Models.QueryResults>): void;
    execute(appId: string, body: Models.QueryBody, options: msRest.RequestOptionsBase, callback: msRest.ServiceCallback<Models.QueryResults>): void;
}
