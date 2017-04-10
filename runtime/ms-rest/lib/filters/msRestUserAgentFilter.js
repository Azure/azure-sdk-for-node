// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

'use strict';

var os = require('os');
var Constants = require('../constants');
var HeaderConstants = Constants.HeaderConstants;

/**
* Creates a filter to add the user agent header in a request.
*
* @param {string} userAgent The user agent string to use.
*/
exports.create = function (userAgentInfo) {
  return function handle(resource, next, callback) {
    // This filter must be excuted last, before the request is sent over the wire.
    // So, we call the next filter in the chain and finally when the call stack unwinds
    // we tag the request with our payload.
    var rest = next(resource, callback);
    
    if (!resource.headers[HeaderConstants.USER_AGENT]) {
      exports.tagRequest(resource, userAgentInfo);
    }

    return rest;
  };
};

exports.tagRequest = function (requestOptions, userAgentInfo) {
  var osInfo = `(${os.arch()}-${os.type()}-${os.release()})`;
  if(userAgentInfo.indexOf(osInfo) === -1){
    userAgentInfo.unshift(osInfo);
  }

  var runtimeInfo = `Node/${process.version}`;
  if(userAgentInfo.indexOf(runtimeInfo) === -1){
    userAgentInfo.unshift(runtimeInfo);
  }

  var nodeSDKSignature = `Azure-SDK-For-Node`;
  if(userAgentInfo.indexOf(nodeSDKSignature) === -1){
    var azureRuntime = `ms-rest-azure`;
    
    var insertIndex = userAgentInfo.indexOf(azureRuntime);
    // insert after azureRuntime, otherwise, insert last. 
    insertIndex = insertIndex < 0 ? userAgentInfo.length : insertIndex + 1;
    userAgentInfo.splice(insertIndex, 0, nodeSDKSignature);
  }
  
  requestOptions.headers[HeaderConstants.USER_AGENT] = userAgentInfo.join(' ');
};
