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

exports = module.exports;

var Constants = {
  /**
  * Constant default http port.
  *
  * @const
  * @type {string}
  */
  DEFAULT_HTTP_PORT: 80,

  /**
  * Constant default https port.
  *
  * @const
  * @type {string}
  */
  DEFAULT_HTTPS_PORT: 443,

  /**
  * Constant manangement url.
  *
  * @const
  * @type {string}
  */
  DEFAULT_MANAGEMENTENDPOINT_URL: 'https://management.core.windows.net',

  /**
  * Constant hostname suffix.
  *
  * @const
  * @type {string}
  */
  DEFAULT_HOSTNAME_SUFFIX: '.azurewebsites.net',

  /**
  * Constant publishing profile download url.
  *
  * @const
  * @type {string}
  */
  DEFAULT_PUBLISHINGPROFILE_URL: 'http://go.microsoft.com/fwlink/?LinkId=254432',

  /**
  * Constant portal url.
  *
  * @const
  * @type {string}
  */
  DEFAULT_PORTAL_URL: 'http://go.microsoft.com/fwlink/?LinkId=254433'
};

module.exports = Constants;