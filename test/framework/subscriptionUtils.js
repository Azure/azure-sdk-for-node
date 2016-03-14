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

'use strict';

var __ = require('underscore');
var async = require('async');
var util = require('util');
var msRestAzure = require('ms-rest-azure');
var SubscriptionClient = require('../../lib/services/resourceManagement/lib/subscriptionClient/SubscriptionClient');


exports.getSubscriptions = function (environment, username, password, tenant, callback) {
  environment.acquireToken(username, password, tenant, function (err, authContext) {
    if (err) return callback(err);
    username = _crossCheckUserNameWithToken(username, authContext.userId);
    
    async.waterfall([
      function (callback) {
        _buildTenantList(environment, username, password, tenant, authContext, callback);
      },
      function (tenantList, callback) {
        getSubscriptionsFromTenants(environment, username, tenantList, callback);
      },
    ], function (err, subscriptions) {
      callback(err, subscriptions);
    });
  });
};

exports.getSubscriptionsFromTenants = function (username, authContext, callback) {
  _buildTenantList(username, password, tenant, authContext, function (err, tenants) {
    if (err) {
      callback(err);
    }
    var subscriptions = [];
    async.eachSeries(tenants, function (tenant, cb) {
      var tenantId = tenant.tenantId;
      var subscriptionClient = new SubscriptionClient(_createCredential(tenant.authContext));
      subscriptionClient.subscriptions.list(function (err, result) {
        if (!err) {
          subscriptions = subscriptions.concat(result.value.map(function (s) {
            return new msRestAzure.SubscriptionCredential(tenant.authContext, s.subscriptionId);
          }));
        }
        cb(err);
      });
    }, function (err) {
      callback(err, subscriptions);
    });
  });
};

function _buildTenantList(environment, username, password, tenant, authContext, callback) {
  var tenants = [];
  if (tenant) {
    tenants = [{
        tenantId: tenant,//'tenant' could be a logical name, interchangable with a tenant guid though
        authContext: authContext
      }];
    return callback(null, tenants);
  }
  var armClient = environment.getArmClient(_createCredential(authContext));
  armClient.tenants.list(function (err, result) {
    if (err) return callback(err);
    async.eachSeries(result.tenantIds/*'tenantInfos' could be a better name*/, function (tenantInfo, cb) {
      environment.acquireToken(username, password, tenantInfo.tenantId, function (err, authContext) {
        //TODO: verify
        if (err && err.match(new RegExp('.*\"error_codes\":\\[50034|50000\\].*'))) {
          console.log(util.format('Due to current limitation, we will skip retrieving subscriptions from the external tenant \'%s\'', tenantInfo.tenantId));
          err = null;
        }
        if (!err) {
          tenants.push({
            tenantId: tenantInfo.tenantId,
            authContext: authContext
          });
        }
        cb(err);
      });
    }, function (err) {
      callback(err, tenants);
    });
  });
}

function _ignoreCaseAndSpaceEquals(a, b) {
  return a === b || (_toLowerCaseAndRemoveSpace(a) === _toLowerCaseAndRemoveSpace(b));
}

function _toLowerCaseAndRemoveSpace(str) {
  if (!str) {
    return str;
  }
  
  return str.replace(/ /gi, '').toLowerCase();
}

function _crossCheckUserNameWithToken(usernameFromCommandline, userIdFromToken) {
  if (_ignoreCaseAndSpaceEquals(usernameFromCommandline, userIdFromToken)) {
    return userIdFromToken;
  } else {
    throw new Error(util.format('invalid user name %s', usernameFromCommandline));
  }
}

function _createCredential(authContext) {
  return new msRestAzure.SubscriptionCredentials(authContext, 'notUsed');
}

exports = module.exports;