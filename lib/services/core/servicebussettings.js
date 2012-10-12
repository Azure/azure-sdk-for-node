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

exports = module.exports = ServiceBusSettings;

var _serviceBusEndpointSetting = ServiceSettings.settingWithFunc(ConnectionStringKeys.SERVICE_BUS_ENDPOINT_NAME, Validate.getIsValidUri());
var _wrapNameSetting = ServiceSettings.setting(ConnectionStringKeys.SHARED_SECRET_ISSUER_NAME);
var _wrapPasswordSetting = ServiceSettings.setting(ConnectionStringKeys.SHARED_SECRET_VALUE_NAME);

var validKeys = [ 
  ConnectionStringKeys.SERVICE_BUS_ENDPOINT_NAME,
  ConnectionStringKeys.SHARED_SECRET_ISSUER_NAME,
  ConnectionStringKeys.SHARED_SECRET_VALUE_NAME
];

/**
* Creates new service bus settings instance.
* 
* @param {string} serviceBusEndpoint The Service Bus endpoint uri.
* @param {string} namespace          The service namespace.
* @param {string} wrapName           The wrap name.
* @param {string} wrapPassword       The wrap password.
*/
function ServiceBusSettings(serviceBusEndpointUri, namespace, wrapName, wrapPassword) {
  this._namespace = namespace;
  this._serviceBusEndpointUri = serviceBusEndpointUri;
  this._wrapEndpointUri = 'https://' + namespace + '-sb.accesscontrol.windows.net/WRAPv0.9';
  this._wrapName = wrapName;
  this._wrapPassword = wrapPassword;
}

/**
* Creates a ServiceBusSettings object from the given connection string.
* 
* @param {string} connectionString The storage settings connection string.
* 
* @return {ServiceBusSettings}
*/
ServiceBusSettings.createFromConnectionString = function (connectionString) {
  var tokenizedSettings = ServiceSettings.parseAndValidateKeys(connectionString, validKeys);

  var matchedSpecs = ServiceSettings.matchedSpecification(
    tokenizedSettings,
    ServiceSettings.allRequired(
      _serviceBusEndpointSetting,
      _wrapNameSetting,
      _wrapPasswordSetting
    )
  );

  if (matchedSpecs) {
    var endpoint = util.tryGetValueInsensitive(
      ConnectionStringKeys.SERVICE_BUS_ENDPOINT_NAME,
      tokenizedSettings
    );
      
    // Parse the namespace part from the URI
    var parsedUrl = url.parse(endpoint);
    var namespace = parsedUrl.host.split('.')[0];

    var issuerName  = util.tryGetValueInsensitive(
        ConnectionStringKeys.SHARED_SECRET_ISSUER_NAME,
        tokenizedSettings
    );

    var issuerValue = util.tryGetValueInsensitive(
        ConnectionStringKeys.SHARED_SECRET_VALUE_NAME,
        tokenizedSettings
    );
    
    return new ServiceBusSettings(
      endpoint,
      namespace,
      issuerName,
      issuerValue
    );
  }

  ServiceSettings.noMatch(connectionString);
};