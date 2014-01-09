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

// Module dependencies.
var _ = require('underscore');

var azureCommon = require('azure-common');
var xmlbuilder = azureCommon.xmlbuilder;
var azureutil = azureCommon.util;
var Constants = azureCommon.Constants;
var ISO8061Date = azureCommon.ISO8061Date;

function ContainerAclResult(signedIdentifiers) {
  if (signedIdentifiers) {
    this.signedIdentifiers = signedIdentifiers;
  }
}

/**
* Builds an XML representation for container acl permissions.
*
* @param  {array}  entity The signed identifiers.
* @return {string} The XML container acl permissions.
*/
ContainerAclResult.serialize = function (signedIdentifiersJs) {
  var doc = xmlbuilder.create();
  doc = doc.begin(Constants.SIGNED_IDENTIFIERS_ELEMENT, { version: '1.0', encoding: 'utf-8' });

  if (Array.isArray(signedIdentifiersJs) && signedIdentifiersJs.length > 0) {
    signedIdentifiersJs.forEach(function (signedIdentifier) {
      doc = doc
        .ele(Constants.SIGNED_IDENTIFIER_ELEMENT)
          .ele(Constants.ID)
            .txt(signedIdentifier.Id)
          .up()
          .ele(Constants.ACCESS_POLICY);

      if (signedIdentifier.AccessPolicy.Start) {
        var startIsoString = signedIdentifier.AccessPolicy.Start;
        if (!_.isDate(startIsoString)) {
          startIsoString = new Date(startIsoString);
        }

        // Convert to expected ISO 8061 date format
        startIsoString = ISO8061Date.format(startIsoString);

        doc = doc
            .ele(Constants.START)
              .txt(startIsoString)
            .up();
      }

      if (signedIdentifier.AccessPolicy.Expiry) {
        var expiryIsoString = signedIdentifier.AccessPolicy.Expiry;
        if (!_.isDate(expiryIsoString)) {
          expiryIsoString = new Date(expiryIsoString);
        }

        // Convert to expected ISO 8061 date format
        expiryIsoString = ISO8061Date.format(expiryIsoString);

        doc = doc
            .ele(Constants.EXPIRY)
              .txt(expiryIsoString)
            .up();
      }

      if (signedIdentifier.AccessPolicy.Permissions) {
        doc = doc
            .ele(Constants.PERMISSION)
              .txt(signedIdentifier.AccessPolicy.Permissions)
            .up();
      }

      doc = doc.up().up();
    });
  }

  return doc.doc().toString();
};

ContainerAclResult.parse = function (signedIdentifiersXml) {
  var signedIdentifiers = [];

  signedIdentifiersXml = azureutil.tryGetValueChain(signedIdentifiersXml, [ 'SignedIdentifiers', 'SignedIdentifier' ]);
  if (signedIdentifiersXml) {
    if (!_.isArray(signedIdentifiersXml)) {
      signedIdentifiersXml = [ signedIdentifiersXml ];
    }

    signedIdentifiersXml.forEach(function (signedIdentifier) {
      var si = {};
      si.Id = signedIdentifier.Id;
      if (signedIdentifier.AccessPolicy) {
        si.AccessPolicy = {};

        if (signedIdentifier.AccessPolicy.Start) {
          si.AccessPolicy.Start = ISO8061Date.parse(signedIdentifier.AccessPolicy.Start);
        }

        if (signedIdentifier.AccessPolicy.Expiry) {
          si.AccessPolicy.Expiry = ISO8061Date.parse(signedIdentifier.AccessPolicy.Expiry);
        }

        if (signedIdentifier.AccessPolicy.Permission) {
          si.AccessPolicy.Permission = signedIdentifier.AccessPolicy.Permission;
        }
      }

      signedIdentifiers.push(si);
    });
  }

  return signedIdentifiers;
};

module.exports = ContainerAclResult;