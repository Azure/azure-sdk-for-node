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

//
// Parsing functions for the various return values
//

function parseResult(body, contentElementName) {
  if (!body) {
    return;
  }

  var parser = new xml2js.Parser({explicitRoot: true});
  var parsedResult;
  parser.addListener('end', function (result) {
    parsedResult = result;
  });

  parser.parseString(body);

  if (parsedResult.feed) {
    return parseFeedResult(parsedResult.feed, contentElementName);
  }
  if (parsedResult.entry) {
   return parseEntryResult(parsedResult.entry, contentElementName);
  }

  throw new Error("Unrecognized result " + util.inspect(parsedResult));
}

function parseFeedResult(feed, contentElementName) {
  var result = [];
  if (feed.entry) {
    if( _.isArray(feed.entry)) {
      _.each(feed.entry, function (entry) {
        result.push(parseEntryResult(entry, contentElementName));
      });
    } else {
      result.push(parseEntryResult(feed.entry, contentElementName));
    }
  }
  return result;
}

function parseEntryResult(entry, contentElementName) {
  delete entry.content[contentElementName]['@'];
  return entry.content[contentElementName];
}

module.exports = parseResult;
