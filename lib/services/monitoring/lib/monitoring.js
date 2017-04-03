//
// Copyright (c) Microsoft and contributors.  All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//
// See the License for the specific language governing permissions and
// limitations under the License.
//

var exports = module.exports;

/**
* Generated AlertsClient client exports.
* @ignore
*/
exports.AlertsClient = require('./alertsClient');

/**
* Creates a new {@link AlertsClient} object.
*
* NOTE: These APIs are still in development and should not be used.
*
* @ignore
* @param {string} [credentials.subscriptionId]      The subscription identifier.
* @param {string} [credentials.cert]                The cert value.
* @param {string} [credentials.key]                 The key value.
* @param {string} [baseUri]                         The base uri.
* @param {array}  [filters]                         Optional array of service filters
* @return {AlertsClient}                            A new AlertsClient object.
*/
exports.createAlertsClient = function (credentials, baseUri, filters) {
  return new exports.AlertsClient.AlertsClient(credentials, baseUri, filters);
};

/**
* Generated AutoScaleClient client exports.
* @ignore
*/
exports.AutoScaleClient = require('./autoscaleClient');

/**
* Creates a new {@link AutoScaleClient} object.
*
* NOTE: These APIs are still in development and should not be used.
*
* @ignore
* @param {string} [credentials.subscriptionId]      The subscription identifier.
* @param {string} [credentials.cert]                The cert value.
* @param {string} [credentials.key]                 The key value.
* @param {string} [baseUri]                         The base uri.
* @param {array}  [filters]                         Optional array of service filters
* @return {AutoScaleClient}                         A new AutoScaleClient object.
*/
exports.createAutoScaleClient = function (credentials, baseUri, filters) {
  return new exports.AutoScaleClient.AutoscaleClient(credentials, baseUri, filters);
};

/**
* Generated MetricsClient client exports.
* @ignore
*/
exports.MetricsClient = require('./metricsClient');

/**
* Creates a new {@link MetricsClient} object.
*
* NOTE: These APIs are still in development and should not be used.
*
* @ignore
* @param {string} [credentials.subscriptionId]      The subscription identifier.
* @param {string} [credentials.cert]                The cert value.
* @param {string} [credentials.key]                 The key value.
* @param {string} [baseUri]                         The base uri.
* @param {array}  [filters]                         Optional array of service filters
* @return {MetricsClient}                           A new MetricsClient object.
*/
exports.createMetricsClient = function (credentials, baseUri, filters) {
  return new exports.MetricsClient.MetricsClient(credentials, baseUri, filters);
};

/**
* Generated EventsClient client exports.
* @ignore
*/
exports.EventsClient = require('./eventsClient');

/**
* Creates a new {@link EventsClient} object.
*
* @param {object} credentials            The credentials, typically a TokenCloudCredential
* @param {string} [baseUri]              The base uri.
* @param {array} [filters]               Extra request filters to add
* @return {EventsClient}                A new EventsClient object.
*/
exports.createEventsClient = function (credentials, baseUri, filters) {
  return new exports.EventsClient.EventsClient(credentials, baseUri, filters);
};

var common = require('azure-common');

/**
* Creates a new CertificateCloudCredentials object.
* Either a pair of cert / key values need to be pass or a pem file location.
*
* @param {string} credentials.subscription  The subscription identifier.
* @param {string} [credentials.cert]        The certificate.
* @param {string} [credentials.key]         The certificate key.
* @param {string} [credentials.pem]         The PEM file content.
* @return {CertificateCloudCredentials}
*/
exports.createCertificateCloudCredentials = function (credentials) {
  return new common.CertificateCloudCredentials(credentials);
};