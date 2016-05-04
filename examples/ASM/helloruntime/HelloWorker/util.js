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

var azure = require('azure');

var RoleEnvironment = azure.RoleEnvironment;

var DiagnosticStoreKey = "DiagnosticStore";
var PathKey = "path";

exports = module.exports;

/**
* Return the path to the diagnostic store.
*
* @param {function(error, path)} callback: The completion callback.
*/
exports.getDiagnosticPath = function(callback) {
    exports.getLocalResourcePath(DiagnosticStoreKey, callback);	
}

/**
* Returne the path to the named local resource.
*
* @param {string} resourceName:  Name of the local storage resource.
* @param {function(error, path)} callback:  The completion callback.
*/
exports.getLocalResourcePath = function(resourceName, callback) {
	RoleEnvironment.getLocalResources(function( error, resources) {
		if (error) {
			callback(error, null);
		}
		else {
			if (resources[resourceName] && resources[resourceName][PathKey]) {
			    callback(null, resources[resourceName][PathKey]);
		    } else {
		        callback("Could not find resource '"+ resourceName + "'\r\n"); 
		    }
		}
	});
}

/**
* Get a specific role configuration setting.
*
* @param {string} key: The name of the configuration setting.
* @param {function(error, setting)} callback:  The completion callback.
*/
exports.getConfigurationSetting = function(key, callback) {
	RoleEnvironment.getConfigurationSettings( function(error, settings) {
		if (!error) {
			callback(null, settings[key]);
		} else {
			callback(error, null);
		}
		
	});
}

/**
* Get the hostname and port associated with the given endpoint for this role instance.
*
* @param {string} endpointName:  The name of the endpoint in the service definition file.
* @param {function(error, host, port)} callback:  The completion callback.
*/
exports.getListenAddress = function(endpointName, callback) {
	RoleEnvironment.getCurrentRoleInstance(function( inErr, instance) {
		if (inErr || !instance['endpoints'] || ! instance['endpoints'][endpointName]) {
			callback("Error, could not get current role instance endpoint '"+ endpointName + "', error: " + inErr + "\r\n", null, null);
		} else {
            var currentEndpoint = instance['endpoints'][endpointName];
            callback(null, currentEndpoint['address'], currentEndpoint['port']);
        }
    }); 
}