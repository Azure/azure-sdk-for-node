// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

'use strict';

exports = module.exports;
exports.AzureServiceClient = require('./azureServiceClient');
exports.UserTokenCredentials = require('./credentials/userTokenCredentials');
exports.ApplicationTokenCredentials = require('./credentials/applicationTokenCredentials');
exports.DeviceTokenCredentials = require('./credentials/deviceTokenCredentials');
exports.CognitiveServicesCredentials = require('./credentials/cognitiveServicesCredentials');
exports.TopicCredentials = require('./credentials/topicCredentials');
exports.MSITokenCredentials = require('./credentials/msiTokenCredentials');
exports.MSIVmTokenCredentials = require('./credentials/msiVmTokenCredentials');
exports.MSIAppServiceTokenCredentials = require('./credentials/msiAppServiceTokenCredentials');
exports.KeyVaultCredentials = require('./credentials/keyVaultCredentials');
exports.AzureEnvironment = require('./azureEnvironment');
exports.BaseResource = require('./baseResource');
exports.CloudError = require('./cloudError');
exports.TokenCredentials = require('ms-rest').TokenCredentials;
exports.generateUuid = require('./utils').generateUuid;
exports.interactiveLogin = require('./login').interactive;
exports.interactiveLoginWithAuthResponse = require('./login').interactiveWithAuthResponse;
exports.loginWithUsernamePassword = require('./login').withUsernamePassword;
exports.loginWithUsernamePasswordWithAuthResponse = require('./login').withUsernamePasswordWithAuthResponse;
exports.loginWithServicePrincipalSecret = require('./login').withServicePrincipalSecret;
exports.loginWithServicePrincipalSecretWithAuthResponse = require('./login').withServicePrincipalSecretWithAuthResponse;
exports.loginWithAuthFile = require('./login').withAuthFile;
exports.loginWithAuthFileAuthResponse = require('./login').withAuthFileWithAuthResponse;
exports.loginWithMSI = require('./login').withMSI;
exports.loginWithVmMSI = exports.loginWithMSI;
exports.loginWithAppServiceMSI = require('./login').withAppServiceMSI;
