/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 * 
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */

import * as msRestAzure from 'ms-rest-azure';
exports.BaseResource = msRestAzure.BaseResource;
exports.CloudError = msRestAzure.CloudError;

/**
 * @class
 * Initializes a new instance of the FeatureProperties class.
 * @constructor
 * Information about feature.
 *
 * @member {string} [state] The registration state of the feature for the
 * subscription.
 * 
 */
export interface FeatureProperties {
  state?: string;
}

/**
 * @class
 * Initializes a new instance of the FeatureResult class.
 * @constructor
 * Previewed feature information.
 *
 * @member {string} [name] The name of the feature.
 * 
 * @member {object} [properties] Properties of the previewed feature.
 * 
 * @member {string} [properties.state] The registration state of the feature
 * for the subscription.
 * 
 * @member {string} [id] The resource ID of the feature.
 * 
 * @member {string} [type] The resource type of the feature.
 * 
 */
export interface FeatureResult {
  name?: string;
  properties?: FeatureProperties;
  id?: string;
  type?: string;
}

/**
 * @class
 * Initializes a new instance of the FeatureOperationsListResult class.
 * @constructor
 * List of previewed features.
 *
 * @member {array} [value] The array of features.
 * 
 * @member {string} [nextLink] The URL to use for getting the next set of
 * results.
 * 
 */
export interface FeatureOperationsListResult {
  value?: FeatureResult[];
  nextLink?: string;
}


/**
 * @class
 * Initializes a new instance of the FeatureOperationsListResult class.
 * @constructor
 * List of previewed features.
 *
 * @member {string} [nextLink] The URL to use for getting the next set of
 * results.
 * 
 */
export interface FeatureOperationsListResult extends Array<FeatureResult> {
  nextLink?: string;
}
