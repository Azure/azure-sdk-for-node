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

var exports = module.exports;

/**
* SQL service exports.
*/

var SqlService = require('./sqlservice');
exports.SqlService = SqlService;

/**
*
* Creates a new SqlService object
* @class
* The SqlService object allows you to perform management operations against databases
* created using Windows Azure SQL Database.
* @constructor
* @param {string} serverName                   The SQL server name.
* @param {string} administratorLogin           The SQL Server administrator login.
* @param {string} administratorLoginPassword   The SQL Server administrator login password.
* @param {string} [host]                       The host for the service.
* @param {string} [acsHost]                    The acs host.
* @param {object} [authenticationProvider]     The authentication provider.
*/
exports.createSqlService = function (serverName, administratorLogin, administratorLoginPassword, host, acsHost, authenticationProvider) {
	return new SqlService(serverName, administratorLogin, administratorLoginPassword, host, acsHost, authenticationProvider);
};