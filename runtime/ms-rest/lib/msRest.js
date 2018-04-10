// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

'use strict';

const utils = require('./utils');
exports.Constants = require('./constants');

exports.WebResource = require('./webResource');
exports.ServiceClient = require('./serviceClient');
exports.HttpOperationResponse = require('./httpOperationResponse');

// Credentials
exports.TokenCredentials = require('./credentials/tokenCredentials');
exports.BasicAuthenticationCredentials = require('./credentials/basicAuthenticationCredentials');
exports.ApiKeyCredentials = require('./credentials/apiKeyCredentials');

// Other filters
exports.ProxyFilter = require('./filters/proxyFilter');
exports.LogFilter = require('./filters/logFilter');
exports.SigningFilter = require('./filters/signingFilter');
exports.ExponentialRetryPolicyFilter = require('./filters/exponentialRetryPolicyFilter');
exports.UserAgentFilter = require('./filters/msRestUserAgentFilter');
exports.FormDataFilter = require('./filters/formDataFilter');
exports.RpRegistrationFilter = require('./filters/rpRegistrationFilter');

exports.requestPipeline = require('./requestPipeline');
exports.stripResponse = utils.stripResponse;
exports.stripRequest = utils.stripRequest;
exports.isValidUuid = utils.isValidUuid;
exports.homeDir = utils.homeDir;

//serialization
exports.serializeObject = require('./serialization').serializeObject;
exports.serialize = require('./serialization').serialize;
exports.deserialize = require('./serialization').deserialize;
const serialization = require('./serialization');

exports.addSerializationMixin = function addSerializationMixin(destObject) {
  ['serialize', 'serializeObject', 'deserialize'].forEach((property) => {
    destObject[property] = serialization[property];
  });
};

exports = module.exports;
