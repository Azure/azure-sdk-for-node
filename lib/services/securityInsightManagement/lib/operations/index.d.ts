/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
*/

import { ServiceClientOptions, RequestOptions, ServiceCallback, HttpOperationResponse } from 'ms-rest';
import * as models from '../models';


/**
 * @class
 * Operations
 * __NOTE__: An instance of this class is automatically created for an
 * instance of the SecurityInsights.
 */
export interface Operations {


    /**
     * Lists all operations available Azure Security Insights Resource Provider.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<OperationsList>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    listWithHttpOperationResponse(options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<models.OperationsList>>;

    /**
     * Lists all operations available Azure Security Insights Resource Provider.
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
     *                      @resolve {OperationsList} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {OperationsList} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link OperationsList} for more information.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    list(options?: { customHeaders? : { [headerName: string]: string; } }): Promise<models.OperationsList>;
    list(callback: ServiceCallback<models.OperationsList>): void;
    list(options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.OperationsList>): void;


    /**
     * Lists all operations available Azure Security Insights Resource Provider.
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
     * @resolve {HttpOperationResponse<OperationsList>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    listNextWithHttpOperationResponse(nextPageLink: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<models.OperationsList>>;

    /**
     * Lists all operations available Azure Security Insights Resource Provider.
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
     *                      @resolve {OperationsList} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {OperationsList} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link OperationsList} for more information.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    listNext(nextPageLink: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<models.OperationsList>;
    listNext(nextPageLink: string, callback: ServiceCallback<models.OperationsList>): void;
    listNext(nextPageLink: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.OperationsList>): void;
}

/**
 * @class
 * AlertRules
 * __NOTE__: An instance of this class is automatically created for an
 * instance of the SecurityInsights.
 */
export interface AlertRules {


    /**
     * Gets all alert rules.
     *
     * @param {string} resourceGroupName The name of the resource group within the
     * user's subscription. The name is case insensitive.
     *
     * @param {string} operationalInsightsResourceProvider The namespace of
     * workspaces resource provider- Microsoft.OperationalInsights.
     *
     * @param {string} workspaceName The name of the workspace.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<AlertRulesList>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    listWithHttpOperationResponse(resourceGroupName: string, operationalInsightsResourceProvider: string, workspaceName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<models.AlertRulesList>>;

    /**
     * Gets all alert rules.
     *
     * @param {string} resourceGroupName The name of the resource group within the
     * user's subscription. The name is case insensitive.
     *
     * @param {string} operationalInsightsResourceProvider The namespace of
     * workspaces resource provider- Microsoft.OperationalInsights.
     *
     * @param {string} workspaceName The name of the workspace.
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
     *                      @resolve {AlertRulesList} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {AlertRulesList} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link AlertRulesList} for more information.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    list(resourceGroupName: string, operationalInsightsResourceProvider: string, workspaceName: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<models.AlertRulesList>;
    list(resourceGroupName: string, operationalInsightsResourceProvider: string, workspaceName: string, callback: ServiceCallback<models.AlertRulesList>): void;
    list(resourceGroupName: string, operationalInsightsResourceProvider: string, workspaceName: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.AlertRulesList>): void;


    /**
     * Gets a alert rule.
     *
     * @param {string} resourceGroupName The name of the resource group within the
     * user's subscription. The name is case insensitive.
     *
     * @param {string} operationalInsightsResourceProvider The namespace of
     * workspaces resource provider- Microsoft.OperationalInsights.
     *
     * @param {string} workspaceName The name of the workspace.
     *
     * @param {string} ruleId Alert rule ID
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<AlertRule>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    getWithHttpOperationResponse(resourceGroupName: string, operationalInsightsResourceProvider: string, workspaceName: string, ruleId: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<models.AlertRule>>;

    /**
     * Gets a alert rule.
     *
     * @param {string} resourceGroupName The name of the resource group within the
     * user's subscription. The name is case insensitive.
     *
     * @param {string} operationalInsightsResourceProvider The namespace of
     * workspaces resource provider- Microsoft.OperationalInsights.
     *
     * @param {string} workspaceName The name of the workspace.
     *
     * @param {string} ruleId Alert rule ID
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
     *                      @resolve {AlertRule} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {AlertRule} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link AlertRule} for more information.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    get(resourceGroupName: string, operationalInsightsResourceProvider: string, workspaceName: string, ruleId: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<models.AlertRule>;
    get(resourceGroupName: string, operationalInsightsResourceProvider: string, workspaceName: string, ruleId: string, callback: ServiceCallback<models.AlertRule>): void;
    get(resourceGroupName: string, operationalInsightsResourceProvider: string, workspaceName: string, ruleId: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.AlertRule>): void;


    /**
     * Creates or updates the alert rule.
     *
     * @param {string} resourceGroupName The name of the resource group within the
     * user's subscription. The name is case insensitive.
     *
     * @param {string} operationalInsightsResourceProvider The namespace of
     * workspaces resource provider- Microsoft.OperationalInsights.
     *
     * @param {string} workspaceName The name of the workspace.
     *
     * @param {string} ruleId Alert rule ID
     *
     * @param {object} alertRule The alert rule
     *
     * @param {string} [alertRule.kind] The kind of the alert rule. Possible values
     * include: 'Scheduled'
     *
     * @param {string} [alertRule.etag] Etag of the alert rule.
     *
     * @param {object} [options] Optional Parameters.
     *
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     *
     * @returns {Promise} A promise is returned
     *
     * @resolve {HttpOperationResponse<AlertRule>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    createWithHttpOperationResponse(resourceGroupName: string, operationalInsightsResourceProvider: string, workspaceName: string, ruleId: string, alertRule: models.AlertRule, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<models.AlertRule>>;

    /**
     * Creates or updates the alert rule.
     *
     * @param {string} resourceGroupName The name of the resource group within the
     * user's subscription. The name is case insensitive.
     *
     * @param {string} operationalInsightsResourceProvider The namespace of
     * workspaces resource provider- Microsoft.OperationalInsights.
     *
     * @param {string} workspaceName The name of the workspace.
     *
     * @param {string} ruleId Alert rule ID
     *
     * @param {object} alertRule The alert rule
     *
     * @param {string} [alertRule.kind] The kind of the alert rule. Possible values
     * include: 'Scheduled'
     *
     * @param {string} [alertRule.etag] Etag of the alert rule.
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
     *                      @resolve {AlertRule} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {AlertRule} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link AlertRule} for more information.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    create(resourceGroupName: string, operationalInsightsResourceProvider: string, workspaceName: string, ruleId: string, alertRule: models.AlertRule, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<models.AlertRule>;
    create(resourceGroupName: string, operationalInsightsResourceProvider: string, workspaceName: string, ruleId: string, alertRule: models.AlertRule, callback: ServiceCallback<models.AlertRule>): void;
    create(resourceGroupName: string, operationalInsightsResourceProvider: string, workspaceName: string, ruleId: string, alertRule: models.AlertRule, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.AlertRule>): void;


    /**
     * Delete the alert rule.
     *
     * @param {string} resourceGroupName The name of the resource group within the
     * user's subscription. The name is case insensitive.
     *
     * @param {string} operationalInsightsResourceProvider The namespace of
     * workspaces resource provider- Microsoft.OperationalInsights.
     *
     * @param {string} workspaceName The name of the workspace.
     *
     * @param {string} ruleId Alert rule ID
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
    deleteMethodWithHttpOperationResponse(resourceGroupName: string, operationalInsightsResourceProvider: string, workspaceName: string, ruleId: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<void>>;

    /**
     * Delete the alert rule.
     *
     * @param {string} resourceGroupName The name of the resource group within the
     * user's subscription. The name is case insensitive.
     *
     * @param {string} operationalInsightsResourceProvider The namespace of
     * workspaces resource provider- Microsoft.OperationalInsights.
     *
     * @param {string} workspaceName The name of the workspace.
     *
     * @param {string} ruleId Alert rule ID
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
    deleteMethod(resourceGroupName: string, operationalInsightsResourceProvider: string, workspaceName: string, ruleId: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<void>;
    deleteMethod(resourceGroupName: string, operationalInsightsResourceProvider: string, workspaceName: string, ruleId: string, callback: ServiceCallback<void>): void;
    deleteMethod(resourceGroupName: string, operationalInsightsResourceProvider: string, workspaceName: string, ruleId: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<void>): void;


    /**
     * Gets all alert rules.
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
     * @resolve {HttpOperationResponse<AlertRulesList>} - The deserialized result object.
     *
     * @reject {Error|ServiceError} - The error object.
     */
    listNextWithHttpOperationResponse(nextPageLink: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<HttpOperationResponse<models.AlertRulesList>>;

    /**
     * Gets all alert rules.
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
     *                      @resolve {AlertRulesList} - The deserialized result object.
     *
     *                      @reject {Error|ServiceError} - The error object.
     *
     * {ServiceCallback} optionalCallback(err, result, request, response)
     *
     *                      {Error|ServiceError}  err        - The Error object if an error occurred, null otherwise.
     *
     *                      {AlertRulesList} [result]   - The deserialized result object if an error did not occur.
     *                      See {@link AlertRulesList} for more information.
     *
     *                      {WebResource} [request]  - The HTTP Request object if an error did not occur.
     *
     *                      {http.IncomingMessage} [response] - The HTTP Response stream if an error did not occur.
     */
    listNext(nextPageLink: string, options?: { customHeaders? : { [headerName: string]: string; } }): Promise<models.AlertRulesList>;
    listNext(nextPageLink: string, callback: ServiceCallback<models.AlertRulesList>): void;
    listNext(nextPageLink: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.AlertRulesList>): void;
}
