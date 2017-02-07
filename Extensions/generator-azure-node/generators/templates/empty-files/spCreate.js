'use strict';

// Steps:
// 1. Create AD application
// 2. Create SP on top of the AD application
// 3. Assigning the Contributor role to the SP

function createServicePrincipal() {
  var msrestazure = require('ms-rest-azure');
  var graph = require('azure-graph');
  var authorization = require('azure-arm-authorization');
  var util = require('util');
  var moment = require('moment');

  // TODO: Initialize these variables
  var tenantId;
  var subscriptionId;
  var passwordForSp;
  var displayName;

  var homePage = 'http://' + displayName + ':8080';
  var identifierUris = [ homePage ];
  var roleId = 'b24988ac-6180-42a0-ab88-20f7382dd24c'; // contributor role
  var scope = '/subscriptions/' + subscriptionId;
  var roleDefinitionId = scope + '/providers/Microsoft.Authorization/roleDefinitions/' + roleId;
  var loginOptions = {
    domain: tenantId
  };

  msrestazure.interactiveLogin(loginOptions, function(err, creds) {
    if (err) {
      console.log('Error occured in interactive login: \n' + util.inspect(err, { depth: null }));
      return;
    }

    var options = {
      domain: tenantId,
      tokenAudience: 'graph',
      username: creds.username,
      tokenCache: creds.tokenCache,
      environment: creds.environment
    };
    var credsForGraph = new msrestazure.DeviceTokenCredentials(options);
    var graphClient = new graph(credsForGraph, tenantId);
    var startDate = new Date(Date.now());
    var endDate = new Date(startDate.toISOString());
    var m = moment(endDate);
    m.add(1, 'years');
    endDate = new Date(m.toISOString());
    var applicationCreateParameters = {
      availableToOtherTenants: false,
      displayName: displayName,
      homePage: homePage,
      identifierUris: identifierUris,
      passwordCredentials: [{
        startDate: startDate,
        endDate: endDate,
        keyId: msrestazure.generateUuid(),
        value: passwordForSp
      }]
    };

    graphClient.applications.create(applicationCreateParameters, function (err, application, req, res) {
      if (err) {
        console.log('Error occured while creating the application: \n' + util.inspect(err, { depth: null }));
        return;
      }

      var servicePrincipalCreateParameters = {
        appId: application.appId,
        accountEnabled: true
      };

      graphClient.servicePrincipals.create(servicePrincipalCreateParameters, function (err, sp, req, res) {
        if (err) {
          console.log('Error occured while creating the servicePrincipal: \n' + util.inspect(err, { depth: null }));
          return;
        }

        var authorizationClient = new authorization(creds, subscriptionId, null);
        var assignmentGuid = msrestazure.generateUuid();
        var roleCreateParams = {
          properties: {
            principalId: sp.objectId,
            roleDefinitionId: roleDefinitionId,
            scope: scope
          }
        };

        authorizationClient.roleAssignments.create(scope, assignmentGuid, roleCreateParams, function (err, roleAssignment, req, res) {
          if (err) {
            console.log('\nError occured while creating the roleAssignment: \n' + util.inspect(err, { depth: null }));
            return;
          }

          console.log('>>>>>>>>>>>\nSuccessfully created the role assignment for the servicePrincipal.\n');
          console.log('>>>>>>>>>>>\nIn future for login you will need the following info:');
          console.log('ServicePrincipal Id (SPN):    ' + sp.appId);
          console.log('ServicePincipal Password:    ' + passwordForSp);
          console.log('Tenant Id for ServicePrincipal:    ' + tenantId);
          console.log('>>>>>>>>>>>\n');
        });
      });
    });
  });
}
