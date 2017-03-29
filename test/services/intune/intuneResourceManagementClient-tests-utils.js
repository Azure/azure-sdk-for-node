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

var request = require('request');
var moment = require('moment');
var should = require('should');
var util = require('util');

function IntuneTestUtils() {}

IntuneTestUtils.PolicyType = Object.freeze({
  iOS: 0,
  Android: 1
});

IntuneTestUtils.Constants = Object.freeze({
  IntuneAndroidPolicy: 'IntuneAndroidPolicy',
  IntuneiOSPolicy: 'IntuneiOSPolicy',
  PlatformTypeQuery: 'platform eq \'{0}\''
})

IntuneTestUtils.getAADAuthToken = function(username, password, clientId, targetResource, callback) {
  if ((!username || typeof username !== 'string') ||
    (!password || typeof password !== 'string') ||
    (!clientId || typeof clientId !== 'string')) {
    callback(null, 'dummyToken');
  }

  var authEndpoint = IntuneTestUtils.getAADAuthEndpoint(process.env['ENVIRONMENT']);

  if (!targetResource) {
    targetResource = authEndpoint.substring(0, authEndpoint.length - 1);
  }

  request(authEndpoint + 'common/UserRealm/' + username + '?api-version=1.0',
    function(err, httpResponse, body) {
      if (err) {
        callback(err);
      }

      if (!httpResponse || httpResponse.statusCode !== 200) {
        callback(httpResponse);
      }

      var response;
      try {
        response = JSON.parse(body);
        if (!response || !response.domain_name) {
          callback("response is incorrect");
        }
      } catch (e) {
        callback(e);
      }

      request.post({
        url: authEndpoint + response.domain_name + '/oauth2/token',
        form: {
          resource: targetResource,
          client_id: clientId,
          grant_type: 'password',
          username: username,
          password: password,
          scope: 'openid'
        }
      }, function(err, httpResponse, body) {
        if (err) {
          callback(err);
        }

        if (!httpResponse || httpResponse.statusCode !== 200) {
          callback(httpResponse);
        }

        var response;
        try {
          response = JSON.parse(body);
          if (!response || !response.access_token) {
            callback("response is incorrect");
          }
        } catch (e) {
          callback(e);
        }

        callback(null, response.access_token);
      });
    });
}

IntuneTestUtils.getPolicyPutPayload = function(policyType) {
  if (policyType !== IntuneTestUtils.PolicyType.iOS && policyType !== IntuneTestUtils.PolicyType.Android) {
    return null;
  }

  // Common properties for all policies
  var properties = {
    accessRecheckOfflineTimeout: moment.duration('PT1H1M'),
    accessRecheckOnlineTimeout: moment.duration('PT1H1M'),
    appSharingFromLevel: 'allApps',
    appSharingToLevel: 'allApps',
    authentication: 'required',
    clipboardSharingLevel: 'allApps',
    dataBackup: 'allow',
    pinNumRetry: 1,
    deviceCompliance: 'enable',
    fileSharingSaveAs: 'allow',
    offlineWipeTimeout: moment.duration('P1D'),
    pin: 'required'
  };

  if (policyType === IntuneTestUtils.PolicyType.iOS) {
    properties.description = 'iosOneCreated';
    properties.friendlyName = 'iosOneCreated';
    properties.touchId = 'enable';
    properties.managedBrowser = 'required';
    properties.fileEncryptionLevel = 'deviceLocked'
  } else {
    properties.description = 'androidOneCreated';
    properties.friendlyName = 'androidOneCreated';
    properties.screenCapture = 'allow';
    properties.managedBrowser = 'required';
    properties.fileEncryption = 'notRequired';
  }

  return properties;
}

IntuneTestUtils.getPolicyPatchPayload = function() {
  return {
    friendlyName: 'Patched'
  };
}

IntuneTestUtils.deletePolicies = function(client, location, policyType, ids, callback) {
  var pt;
  if (policyType === IntuneTestUtils.PolicyType.iOS) {
    pt = 'ios';
  } else if (policyType === IntuneTestUtils.PolicyType.Android) {
    pt = 'android';
  } else {
    callback(true);
  }

  if (!ids || !ids.length) {
    callback(true);
  }

  var completed = 0;
  var resolver = function(error, result) {
    if (error) {
      callback(false);
      return;
    }

    completed++;
    if (completed == ids.length) {
      callback(true);
    }
  }

  for (var i = 0; i < ids.length; i++) {
    client[pt].deleteMAMPolicy(location, ids[i], null, resolver);
  }
};

IntuneTestUtils.deleteAllPolicies = function(client, location, policyType, callback) {
  var pt;
  if (policyType === IntuneTestUtils.PolicyType.iOS) {
    pt = 'ios';
  } else if (policyType === IntuneTestUtils.PolicyType.Android) {
    pt = 'android';
  } else {
    callback(true);
  }

  var remaining;

  client[pt].getMAMPolicies(location, null, null, null, null, function(error, result, request, response) {
    if (error) {
      callback(false);
    }

    response.statusCode.should.equal(200);

    remaining = result.length;
    if (remaining === 0) {
      callback(true);
    }

    var resolver = function(error, result) {
      if (error) {
        callback(false);
        return;
      }

      remaining--;
      if (remaining === 0) {
        callback(true);
      }
    }

    for (var i = 0; i < result.length; i++) {
      client[pt].deleteMAMPolicy(location, result[i].name, null, resolver);
    }
  });
};

IntuneTestUtils.done = function(numberOfPendingEvents, resolver) {
  return function(pending, callback) {
    var p = pending;
    var c = callback;
    return function() {
      p.should.be.greaterThan(0);

      p--;
      if (p === 0) {
        c();
      }
    }
  }(numberOfPendingEvents, resolver);
};

IntuneTestUtils.getAADUsersAndGroups = function(username, password, clientId, callback) {
  var graphServicePrincipalId = '00000002-0000-0000-c000-000000000000';
  var graphEndpoint = IntuneTestUtils.getAADGraphEndpoint(process.env['ENVIRONMENT']);
  var domain = username.split('@')[1];
  var results = {};

  done = IntuneTestUtils.done(2, function() {
    callback(results);
  })

  IntuneTestUtils.getAADAuthToken(username, password, clientId, graphServicePrincipalId, function(error, token) {
    var requestOptionsForGroups = {
      url: graphEndpoint + domain + '/groups?api-version=1.6',
      headers: {
        "Authorization": 'Bearer ' + token
      }
    }

    var requestOptionsForUsers = {
      url: graphEndpoint + domain + '/users?api-version=1.6',
      headers: {
        "Authorization": 'Bearer ' + token
      }
    }

    request(requestOptionsForGroups, function(error, response, body) {
      should.not.exist(error);
      should.exist(body);
      response.statusCode.should.equal(200);

      results.groups = JSON.parse(body).value;

      done();
    });

    request(requestOptionsForUsers, function(error, response, body) {
      should.not.exist(error);
      should.exist(body);
      response.statusCode.should.equal(200);

      results.users = JSON.parse(body).value;

      done();
    });
  });
}

IntuneTestUtils.getAADAuthEndpoint = function(environment) {
  if (environment === 'dogfood') {
    return 'https://login.windows-ppe.net/';
  }

  return 'https://login.windows.net/';
}

IntuneTestUtils.getAADGraphEndpoint = function(environment) {
  if (environment === 'dogfood') {
    return 'https://graph.ppe.windows.net/';
  }

  return 'https://graph.windows.net/';
}

IntuneTestUtils.format = function(formatString) {
  if (!formatString || !arguments || !arguments.length) {
    return formatString;
  }

  var result = formatString;
  for (var i = 1; i < arguments.length; i++) {
    var val = arguments[i] ? arguments[i].toString() : '';
    result = result.replace('{' + (i - 1) + '}', val);
  }

  return result;
}

module.exports = IntuneTestUtils;
