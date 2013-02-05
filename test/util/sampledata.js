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
var util = require('util');
var xmlbuilder = require('xmlbuilder');

// Sample data builder for XML parsing tests

var ATOM_NAMESPACE = 'http://www.w3.org/2005/Atom';
var SB_NAMESPACE = 'http://schemas.microsoft.com/netservices/2010/10/servicebus/connect';

function makeFeed(makeEntries) {
  var xml = xmlbuilder.create('feed').att('xmlns', ATOM_NAMESPACE);
  xml.ele('title', { type: 'text'}, 'Test feed');
  makeEntries(xml);
  return xml;
}

function makeEntry(parent, makePayload) {
  var entry;
  if (!parent) {
    entry = xmlbuilder.create('entry').att('xmlns', ATOM_NAMESPACE);
  } else {
    entry = parent.ele('entry', {xmlns: ATOM_NAMESPACE });
  }
  var content = entry.ele('content', {type: 'application.xml'});
  makePayload(content);
  return entry;
}

function nsd(name, region) {
  return function (entry) {
    entry.ele('NamespaceDescription', {xmlns: SB_NAMESPACE})
      .ele('Name', name)
      .up()
      .ele('Region', region);
  };
}

var format = { pretty: true, indent: '  ', newline: '\r\n' };

exports.singleEntry = makeEntry(null, nsd('onlynamespace', 'East US')).end(format);

exports.threeItemFeed = makeFeed(function (feed) {
  makeEntry(feed, nsd('aNamespace', 'West US'));
  makeEntry(feed, nsd('anotherNamespace', 'East US'));
  makeEntry(feed, nsd('namespacethe3rd', 'Western Europe'));
}).end(format);

exports.noEntryFeed = makeFeed(function () { }).end(format);

exports.oneEntryFeed = makeFeed(function (feed) {
  makeEntry(feed, nsd('namespaceallalone', 'Eastern Europe'));
}).end(format);
