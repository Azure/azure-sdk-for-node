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

var _ = require('underscore');
var xmlbuilder = require('xmlbuilder');
var util = require('util');

var js2xml = require('./js2xml');
var Constants = require('./constants');

exports = module.exports;

function parseEntryResult(entry, contentElementName) {
  delete entry.content[contentElementName][Constants.XML_METADATA_MARKER];
  var result = entry.content[contentElementName];

  if (result) {
    result[Constants.ATOM_METADATA_MARKER] = {};

    for (var property in entry) {
      if (property !== 'content' && property !== Constants.XML_METADATA_MARKER) {
        result[Constants.ATOM_METADATA_MARKER][property] = entry[property];
      }
    }
  }

  return result;
}

function parseFeedResult(feed, contentElementName) {
  var result = [];
  if (feed.entry) {
    if (_.isArray(feed.entry)) {
      _.each(feed.entry, function (entry) {
        result.push(parseEntryResult(entry, contentElementName));
      });
    } else {
      result.push(parseEntryResult(feed.entry, contentElementName));
    }
  }
  return result;
}

exports.parse = function (xml, contentElementName) {
  if (!xml) {
    return;
  }

  if (xml.feed) {
    return parseFeedResult(xml.feed, contentElementName);
  }

  if (xml.entry) {
    return parseEntryResult(xml.entry, contentElementName);
  }

  throw new Error('Unrecognized result ' + util.inspect(xml));
};

/**
* @param {object} content     The content payload as it is to be serialized by js2xml. It should include any root node(s).
* @param {array}  namespaces  An array of top level namespaces to be defined.
*/
exports.serializeEntry = function (content, namespaces) {
  var doc = xmlbuilder.create();

  doc = doc.begin('entry', { version: '1.0', encoding: 'utf-8', standalone: 'yes' })
    .att('xmlns', 'http://www.w3.org/2005/Atom');

  _.each(namespaces, function (namespace) {
    doc = doc.att('xmlns:' + namespace.key, namespace.url);
  });

  doc = doc
    .ele('updated', new Date().toISOString())
    .up();

  content[Constants.XML_METADATA_MARKER] = { 'type': 'application/xml' };

  doc = js2xml._writeElementValue(doc, 'content', content);

  return doc.doc().toString();
};