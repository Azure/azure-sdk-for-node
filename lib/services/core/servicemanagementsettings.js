/**
* Copyright (c) Microsoft.  All rights reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

var url = require('url');

var util = require('../../util/util');

var ConnectionStringParser = require('./connectionstringparser');
var ServiceSettings = require('./servicesettings');
var Constants = require('../../util/constants');
var ConnectionStringKeys = Constants.ConnectionStringKeys;
var Validate = require('../../util/validate');

exports = module.exports = ServiceManagementSettings;

var endpointSetting = ServiceSettings.settingWithFunc(
  ConnectionStringKeys.SERVICE_MANAGEMENT_ENDPOINT_NAME,
  Validate.isValidUri
);

var certificatePathSetting = ServiceSettings.setting(ConnectionStringKeys.CERTIFICATE_PATH_NAME);
var subscriptionIdSetting = ServiceSettings.setting(ConnectionStringKeys.SUBSCRIPTION_ID_NAME);

var validKeys = [ 
  ConnectionStringKeys.SUBSCRIPTION_ID_NAME,
  ConnectionStringKeys.CERTIFICATE_PATH_NAME,
  ConnectionStringKeys.SERVICE_MANAGEMENT_ENDPOINT_NAME
];

/**
* Creates new service management settings instance.
* 
* @param {string} subscriptionId  The user provided subscription id.
* @param {string} endpointUri     The service management endpoint uri.
* @param {string} certificatePath The management certificate path.
*/
function ServiceManagementSettings(subscriptionId, endpointUri, certificatePath) {
  this._subscriptionId = subscriptionId;
  this._endpointUri = endpointUri;
  this._certificatePath = certificatePath;
}

/**
* Creates a ServiceBusSettings object from a set of settings.
* 
* @param {object} settings The settings object.
* 
* @return {ServiceManagementSettings}
*/
ServiceManagementSettings.createFromSettings = function (settings) {
  var matchedSpecs = ServiceSettings.matchedSpecification(
    settings,
    ServiceSettings.allRequired(
      subscriptionIdSetting,
      certificatePathSetting
    ),
    ServiceSettings.optional(
      endpointSetting
    )
  );

  if (matchedSpecs) {
    var endpointUri = util.tryGetValueInsensitive(
      ConnectionStringKeys.SERVICE_MANAGEMENT_ENDPOINT_NAME,
      settings,
      Constants.SERVICE_MANAGEMENT_URL
    );

    var subscriptionId = util.tryGetValueInsensitive(
      ConnectionStringKeys.SUBSCRIPTION_ID_NAME,
      settings
    );

    var certificatePath = util.tryGetValueInsensitive(
      ConnectionStringKeys.CERTIFICATE_PATH_NAME,
      settings
    );

    return new ServiceManagementSettings(
      subscriptionId,
      endpointUri,
      certificatePath
    );
  }

  ServiceSettings.noMatchSettings(settings);
};

/**
* Creates a ServiceManagementSettings object from the given connection string.
* 
* @param {string} connectionString The storage settings connection string.
* 
* @return {ServiceManagementSettings}
*/
ServiceManagementSettings.createFromConnectionString = function (connectionString) {
  var tokenizedSettings = ServiceSettings.parseAndValidateKeys(connectionString, validKeys);
  try {
    return ServiceManagementSettings.createFromSettings(tokenizedSettings);
  } catch (e) {
    if (e instanceof ServiceSettings.NoMatchError) {
      // Replace no match settings exception by no match connection string one.
      ServiceSettings.noMatchConnectionString(connectionString);
    } else {
      throw e;
    }
  }
}