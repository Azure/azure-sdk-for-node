/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 * 
 */

exports.AuthorizationManagementClient = require('./services/authorizationManagement/lib/authorizationManagementClient');
exports.ComputeManagementClient = require('./services/computeManagement2/lib/computeManagementClient');
exports.IntuneResourceManagementClient = require('./services/intune/lib/intuneResourceManagementClient');
exports.NetworkManagementClient = require('./services/networkManagement2/lib/networkManagementClient');
exports.RedisManagementClient = require('./services/rediscachemanagement/lib/redisManagementClient');
exports.ResourceManagementClient = require('./services/resourceManagement/lib/resource/resourceManagementClient');
exports.AuthorizationClient = require('./services/resourceManagement/lib/authorization/authorizationClient');
exports.FeatureClient = require('./services/resourceManagement/lib/feature/featureClient');
exports.SubscriptionClient = require('./services/resourceManagement/lib/subscription/subscriptionClient');
exports.StorageManagementClient = require('./services/storageManagement2/lib/storageManagementClient');
exports.WebSiteManagementClient = require('./services/webSiteManagement2/lib/webSiteManagementClient');

exports = module.exports;
