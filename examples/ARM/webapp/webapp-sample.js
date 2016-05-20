/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 */
'use strict';

var util = require('util');
var path = require('path');
var async = require('async');
var msRestAzure = require('ms-rest-azure');
var ResourceManagementClient = require('azure-arm-resource').ResourceManagementClient;
var SubscriptionManagementClient = require('azure-arm-resource').SubscriptionClient;
var WebSiteManagement = require('azure-arm-website');

var FileTokenCache = require('../../../lib/util/fileTokenCache');
var tokenCache = new FileTokenCache(path.resolve(path.join(__dirname, '../../../test/tmp/tokenstore.json')));

//Environment Setup
_validateEnvironmentVariables();
var clientId = process.env['CLIENT_ID'];
var domain = process.env['DOMAIN'];
var secret = process.env['APPLICATION_SECRET'];
var subscriptionId = process.env['AZURE_SUBSCRIPTION_ID'];
var credentials = new msRestAzure.ApplicationTokenCredentials(clientId, domain, secret, { 'tokenCache': tokenCache });
 
//Sample Config
var randomIds = {};
var location = 'westus';
var resourceGroupName = _generateRandomId('testrg', randomIds);
var hostingPlanName = _generateRandomId('plan', randomIds);
var webSiteName = _generateRandomId('testweb', randomIds);

var resourceClient = new ResourceManagementClient(credentials, subscriptionId);
var webSiteClient = new WebSiteManagement(credentials, subscriptionId);

// Work flow of this sample:
// 1. create a resource group 
// 2. create a hosting plan
// 3. create a website
// 4. get website detials info
// 5. delete website
// 6. delete resource group
async.series([
    function(callback) {
        createResourceGroup(function(err, result, request, response) {
            if (err) {
                return callback(err);
            }
            callback(null, result); 
        });
    },
    function(callback) {
        createHostingPlan(function(err, result, request, response) {
            if (err) {
                return callback(err);
            }
            callback(null, result);
        });  
    },
    function(callback) {
        createWebSite(function(err, result, request, response) {
            if (err) {
                return callback(err);
            }
            callback(null, result);
        });
    },
    function(callback) {
        getWebSite(function(err, result, request, response) {
            if (err) {
                return callback(err);
            }
            console.log(util.format('\nWeb site details: \n%s',
            util.inspect(result, { depth: null })));
            callback(null, result);
        });
    },
    function(callback) {
        deleteWebSite(function(err, result, request, response) {
            if (err) {
                return callback(err);
            }
            callback(null, result);
        });
    }
  ], 
  // Once above operations finish, cleanup and exit.
  function(err, results) {
      if (err) {
          console.log(util.format('\n??????Error occurred in one of the operations.\n%s', 
          util.inspect(err, { depth: null })));
      } else {
          console.log(util.format('\n######All the operations have completed successfully. ' + 
          'The final set of results are as follows:\n%s', util.inspect(results, { depth: null })));
      }
      // clean up
      deleteResourceGroup(function(err, result, request, response) {
        process.exit();
      });
  }
);
 
// Helper functions
function createResourceGroup(callback) {
    var groupParameters = { location: location, tags: { sampletag: 'sampleValue' } };
    console.log('\nCreating resource group: ' + resourceGroupName);
    return resourceClient.resourceGroups.createOrUpdate(resourceGroupName, groupParameters, callback);
}

function deleteResourceGroup(callback) {
    console.log('\nDeleting resource group: ' + resourceGroupName);
    return resourceClient.resourceGroups.deleteMethod(resourceGroupName, callback);
}

function createHostingPlan(callback) {
     var planToCreate = {
      resourceName: hostingPlanName,
      resourceProviderNamespace: 'Microsoft.Web',
      resourceType: 'serverFarms',
      resourceProviderApiVersion: '2014-06-01'
    };

    var planParameters = {
      properties: {
        sku: 'Standard',
        numberOfWorkers: 1,
        workerSize: 'Small',
        hostingPlanName: hostingPlanName
      },
      location: location
    };
    console.log('\nCreating hosting plan: ' + hostingPlanName);
    return resourceClient.resources.createOrUpdate(resourceGroupName, planToCreate.resourceProviderNamespace, '', planToCreate.resourceType, 
      planToCreate.resourceName, planToCreate.resourceProviderApiVersion, planParameters, callback);
}

function createWebSite(callback) {
  var parameters = {
    location: location,
    serverFarmId: hostingPlanName,
        webSite: {
            properties: {
                serverFarm: hostingPlanName
            }
        }
    };
    var siteEnvelope = { "location": location };
    console.log('\nCreating web site: ' + webSiteName);
    return webSiteClient.sites.createOrUpdateSite(resourceGroupName, webSiteName, parameters, null, callback);
}

function getWebSite(callback) {
    console.log('\nGeting info of : ' + webSiteName);
    return webSiteClient.sites.getSite(resourceGroupName, webSiteName, callback);
}

function deleteWebSite(callback) {
    console.log('\nDeleting web site : ' + webSiteName);
    return webSiteClient.sites.deleteSite(resourceGroupName, webSiteName, callback);
}
 
function _validateEnvironmentVariables() {
  var envs = [];
  if (!process.env['CLIENT_ID']) envs.push('CLIENT_ID');
  if (!process.env['DOMAIN']) envs.push('DOMAIN');
  if (!process.env['APPLICATION_SECRET']) envs.push('APPLICATION_SECRET');
  if (envs.length > 0) {
    throw new Error(util.format('please set/export the following environment variables: %s', envs.toString()));
  }
}

function _generateRandomId(prefix, exsitIds) {
  var newNumber;
  while (true) {
    newNumber = prefix + Math.floor(Math.random() * 10000);
    if (!exsitIds || !(newNumber in exsitIds)) {
      break;
    }
  }
  return newNumber;
}