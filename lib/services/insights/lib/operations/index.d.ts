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
 * UsageMetrics
 * __NOTE__: An instance of this class is automatically created for an
 * instance of the InsightsClient.
 */
export interface UsageMetrics {

    /**
     * The List operation lists the usage metrics for the resource.
     *
     * @param {string} resourceUri The identifier of the resource.
     * 
     * @param {object} [options] Optional Parameters.
     * 
     * @param {string} [options.filter] The filter to apply on the operation.
     * 
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     * 
     * @param {ServiceCallback} [callback] callback function; see ServiceCallback
     * doc in ms-rest index.d.ts for details
     */
    list(resourceUri: string, options: { filter? : string, customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.UsageMetricCollection>): void;
    list(resourceUri: string, callback: ServiceCallback<models.UsageMetricCollection>): void;
}

/**
 * @class
 * EventCategories
 * __NOTE__: An instance of this class is automatically created for an
 * instance of the InsightsClient.
 */
export interface EventCategories {

    /**
     * get the list of available event categories supported in the Activity Log
     * Service. The current list includes the following: Aministrative, Security,
     * ServiceHealth, Alert, Recommendation, Policy.
     *
     * @param {object} [options] Optional Parameters.
     * 
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     * 
     * @param {ServiceCallback} [callback] callback function; see ServiceCallback
     * doc in ms-rest index.d.ts for details
     */
    list(options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.EventCategoryCollection>): void;
    list(callback: ServiceCallback<models.EventCategoryCollection>): void;
}

/**
 * @class
 * Events
 * __NOTE__: An instance of this class is automatically created for an
 * instance of the InsightsClient.
 */
export interface Events {

    /**
     * Provides the list of events. The **$filter** is very restricted and allows
     * only the following patterns. - List events for a resource group:
     * $filter=eventTimestamp ge '<Start Time>' and eventTimestamp le '<End Time>'
     * and eventChannels eq 'Admin, Operation' and resourceGroupName eq
     * '<ResourceGroupName>'. - List events for resource: $filter=eventTimestamp ge
     * '<Start Time>' and eventTimestamp le '<End Time>' and eventChannels eq
     * 'Admin, Operation' and resourceUri eq '<ResourceURI>'. - List events for a
     * subscription: $filter=eventTimestamp ge '<Start Time>' and eventTimestamp le
     * '<End Time>' and eventChannels eq 'Admin, Operation'. -List events for a
     * resource provider: $filter=eventTimestamp ge '<Start Time>' and
     * eventTimestamp le '<End Time>' and eventChannels eq 'Admin, Operation' and
     * resourceProvider eq '<ResourceProviderName>'. - List events for a
     * correlation Id: api-version=2014-04-01&$filter=eventTimestamp ge
     * '2014-07-16T04:36:37.6407898Z' and eventTimestamp le
     * '2014-07-20T04:36:37.6407898Z' and eventChannels eq 'Admin, Operation' and
     * correlationId eq '<CorrelationID>'. No other syntax is allowed.
     *
     * @param {object} [options] Optional Parameters.
     * 
     * @param {string} [options.filter] Reduces the set of data collected. The
     * syntax allowed depends on the operation. See the operation's description for
     * details.
     * 
     * @param {string} [options.select] Used to fetch events with only the given
     * properties. The filter is a comma separated list of property names to be
     * returned. Possible values are: authorization, channels, claims,
     * correlationId, description, eventDataId, eventName, eventTimestamp,
     * httpRequest, level, operationId, operationName, properties,
     * resourceGroupName, resourceProviderName, resourceId, status,
     * submissionTimestamp, subStatus, subscriptionId
     * 
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     * 
     * @param {ServiceCallback} [callback] callback function; see ServiceCallback
     * doc in ms-rest index.d.ts for details
     */
    list(options: { filter? : string, select? : string, customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.EventDataCollection>): void;
    list(callback: ServiceCallback<models.EventDataCollection>): void;

    /**
     * Provides the list of events. The **$filter** is very restricted and allows
     * only the following patterns. - List events for a resource group:
     * $filter=eventTimestamp ge '<Start Time>' and eventTimestamp le '<End Time>'
     * and eventChannels eq 'Admin, Operation' and resourceGroupName eq
     * '<ResourceGroupName>'. - List events for resource: $filter=eventTimestamp ge
     * '<Start Time>' and eventTimestamp le '<End Time>' and eventChannels eq
     * 'Admin, Operation' and resourceUri eq '<ResourceURI>'. - List events for a
     * subscription: $filter=eventTimestamp ge '<Start Time>' and eventTimestamp le
     * '<End Time>' and eventChannels eq 'Admin, Operation'. -List events for a
     * resource provider: $filter=eventTimestamp ge '<Start Time>' and
     * eventTimestamp le '<End Time>' and eventChannels eq 'Admin, Operation' and
     * resourceProvider eq '<ResourceProviderName>'. - List events for a
     * correlation Id: api-version=2014-04-01&$filter=eventTimestamp ge
     * '2014-07-16T04:36:37.6407898Z' and eventTimestamp le
     * '2014-07-20T04:36:37.6407898Z' and eventChannels eq 'Admin, Operation' and
     * correlationId eq '<CorrelationID>'. No other syntax is allowed.
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
    listNext(nextPageLink: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.EventDataCollection>): void;
    listNext(nextPageLink: string, callback: ServiceCallback<models.EventDataCollection>): void;
}

/**
 * @class
 * TenantEvents
 * __NOTE__: An instance of this class is automatically created for an
 * instance of the InsightsClient.
 */
export interface TenantEvents {

    /**
     * get the Activity Logs for the Tenant. Everything that is applicable to the
     * API to get the Activity Log for the subscription is applicable to this API
     * (the parameters, $filter, etc.). One thing to point out here is that this
     * API does *not* retrieve the logs at the individual subscription of the
     * tenant but only surfaces the logs that were generated at the tenant level.
     * The **$filter** is very restricted and allows only the following patterns. -
     * List events for a resource group: $filter=eventTimestamp ge '<Start Time>'
     * and eventTimestamp le '<End Time>' and eventChannels eq 'Admin, Operation'
     * and resourceGroupName eq '<ResourceGroupName>'. - List events for resource:
     * $filter=eventTimestamp ge '<Start Time>' and eventTimestamp le '<End Time>'
     * and eventChannels eq 'Admin, Operation' and resourceUri eq '<ResourceURI>'.
     * - List events for a subscription: $filter=eventTimestamp ge '<Start Time>'
     * and eventTimestamp le '<End Time>' and eventChannels eq 'Admin, Operation'.
     * - List evetns for a resource provider: $filter=eventTimestamp ge '<Start
     * Time>' and eventTimestamp le '<End Time>' and eventChannels eq 'Admin,
     * Operation' and resourceProvider eq '<ResourceProviderName>'. - List events
     * for a correlation Id: api-version=2014-04-01&$filter=eventTimestamp ge
     * '2014-07-16T04:36:37.6407898Z' and eventTimestamp le
     * '2014-07-20T04:36:37.6407898Z' and eventChannels eq 'Admin, Operation' and
     * correlationId eq '<CorrelationID>'. No other syntax is allowed.
     *
     * @param {object} [options] Optional Parameters.
     * 
     * @param {string} [options.filter] Reduces the set of data collected. The
     * syntax allowed depends on the operation. See the operation's description for
     * details.
     * 
     * @param {string} [options.select] Used to fetch events with only the given
     * properties. The filter is a comma separated list of property names to be
     * returned. Possible values are: authorization, channels, claims,
     * correlationId, description, eventDataId, eventName, eventTimestamp,
     * httpRequest, level, operationId, operationName, properties,
     * resourceGroupName, resourceProviderName, resourceId, status,
     * submissionTimestamp, subStatus, subscriptionId
     * 
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     * 
     * @param {ServiceCallback} [callback] callback function; see ServiceCallback
     * doc in ms-rest index.d.ts for details
     */
    list(options: { filter? : string, select? : string, customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.EventDataCollection>): void;
    list(callback: ServiceCallback<models.EventDataCollection>): void;

    /**
     * get the Activity Logs for the Tenant. Everything that is applicable to the
     * API to get the Activity Log for the subscription is applicable to this API
     * (the parameters, $filter, etc.). One thing to point out here is that this
     * API does *not* retrieve the logs at the individual subscription of the
     * tenant but only surfaces the logs that were generated at the tenant level.
     * The **$filter** is very restricted and allows only the following patterns. -
     * List events for a resource group: $filter=eventTimestamp ge '<Start Time>'
     * and eventTimestamp le '<End Time>' and eventChannels eq 'Admin, Operation'
     * and resourceGroupName eq '<ResourceGroupName>'. - List events for resource:
     * $filter=eventTimestamp ge '<Start Time>' and eventTimestamp le '<End Time>'
     * and eventChannels eq 'Admin, Operation' and resourceUri eq '<ResourceURI>'.
     * - List events for a subscription: $filter=eventTimestamp ge '<Start Time>'
     * and eventTimestamp le '<End Time>' and eventChannels eq 'Admin, Operation'.
     * - List evetns for a resource provider: $filter=eventTimestamp ge '<Start
     * Time>' and eventTimestamp le '<End Time>' and eventChannels eq 'Admin,
     * Operation' and resourceProvider eq '<ResourceProviderName>'. - List events
     * for a correlation Id: api-version=2014-04-01&$filter=eventTimestamp ge
     * '2014-07-16T04:36:37.6407898Z' and eventTimestamp le
     * '2014-07-20T04:36:37.6407898Z' and eventChannels eq 'Admin, Operation' and
     * correlationId eq '<CorrelationID>'. No other syntax is allowed.
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
    listNext(nextPageLink: string, options: { customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.EventDataCollection>): void;
    listNext(nextPageLink: string, callback: ServiceCallback<models.EventDataCollection>): void;
}

/**
 * @class
 * MetricDefinitions
 * __NOTE__: An instance of this class is automatically created for an
 * instance of the InsightsClient.
 */
export interface MetricDefinitions {

    /**
     * Lists the metric definitions for the resource. The **$filter** parameter is
     * optional, and can be used to only retrieve certain metric definitions. For
     * example, get just the definition for the CPU percentage counter:
     * $filter=name.value eq '\Processor(_Total)\% Processor Time'. This $filter is
     * very restricted and allows only these 'name eq <value>' clauses separated by
     * or operators. No other syntax is allowed.
     *
     * @param {string} resourceUri The identifier of the resource.
     * 
     * @param {object} [options] Optional Parameters.
     * 
     * @param {string} [options.filter] Reduces the set of data collected. The
     * syntax allowed depends on the operation. See the operation's description for
     * details.
     * 
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     * 
     * @param {ServiceCallback} [callback] callback function; see ServiceCallback
     * doc in ms-rest index.d.ts for details
     */
    list(resourceUri: string, options: { filter? : string, customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.MetricDefinitionCollection>): void;
    list(resourceUri: string, callback: ServiceCallback<models.MetricDefinitionCollection>): void;
}

/**
 * @class
 * Metrics
 * __NOTE__: An instance of this class is automatically created for an
 * instance of the InsightsClient.
 */
export interface Metrics {

    /**
     * Lists the metric values for a resource. The $filter is used to reduce the
     * set of metric data returned. Some common properties for this expression will
     * be: name.value, aggregationType, startTime, endTime, timeGrain. The filter
     * expression uses these properties with comparison operators (eg. eq, gt, lt)
     * and multiple expressions can be combined with parentheses and 'and/or'
     * operators. Some example filter expressions are: - $filter=(name.value eq
     * 'RunsSucceeded') and aggregationType eq 'Total' and startTime eq 2016-02-20
     * and endTime eq 2016-02-21 and timeGrain eq duration'PT1M', -
     * $filter=(name.value eq 'RunsSucceeded') and (aggregationType eq 'Total' or
     * aggregationType eq 'Average') and startTime eq 2016-02-20 and endTime eq
     * 2016-02-21 and timeGrain eq duration'PT1H', - $filter=(name.value eq
     * 'ActionsCompleted' or name.value eq 'RunsSucceeded') and (aggregationType eq
     * 'Total' or aggregationType eq 'Average') and startTime eq 2016-02-20 and
     * endTime eq 2016-02-21 and timeGrain eq duration'PT1M'.
     *
     * @param {string} resourceUri The identifier of the resource.
     * 
     * @param {object} [options] Optional Parameters.
     * 
     * @param {string} [options.filter] Reduces the set of data collected. The
     * syntax allowed depends on the operation. See the operation's description for
     * details.
     * 
     * @param {object} [options.customHeaders] Headers that will be added to the
     * request
     * 
     * @param {ServiceCallback} [callback] callback function; see ServiceCallback
     * doc in ms-rest index.d.ts for details
     */
    list(resourceUri: string, options: { filter? : string, customHeaders? : { [headerName: string]: string; } }, callback: ServiceCallback<models.MetricCollection>): void;
    list(resourceUri: string, callback: ServiceCallback<models.MetricCollection>): void;
}
