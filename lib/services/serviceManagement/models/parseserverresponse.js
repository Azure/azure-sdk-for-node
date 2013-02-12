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

// Parsing of the server results - pulled out separately to facilitate testing
var util = require('util');
var _ = require('underscore');
var xml2js = require('xml2js');

var Constants = require('../../../util/constants');

//
// Parsing functions for the various return values
//

function parseResult(body) {
  if (!body) {
    return;
  }

  var result = body;

  if( _.isArray(body)) {
    if (body.length === 1 && !_.isUndefined(body[0]) && !_.isObject(body[0])) {
      result = body[0];
    } else {
      result = [ ];

      _.each(body, function (entry) {
        result.push(parseResult(entry));
      });
    }
  } else if (_.isObject(body)) {
    result = { };
    _.each(_.keys(body), function (entry) {
      if (entry !== Constants.XML_METADATA_MARKER) {
        result[entry] = parseResult(body[entry]);
      }
    });
  }

  return result;
}

module.exports = parseResult;
