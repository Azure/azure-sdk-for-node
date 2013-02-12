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

// Module dependencies.
var xmlbuilder = require('xmlbuilder');

var Constants = require('../../../util/constants');
var ISO8061Date = require('../../../util/iso8061date');

// Expose 'ContainerAclResult'.
exports = module.exports = ContainerAclResult;

var ACL_MILLISECONDS_PADING = 7;

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
        if (startIsoString instanceof Date) {
          // Convert to expected ISO 8061 date format
          startIsoString = ISO8061Date.format(startIsoString, ACL_MILLISECONDS_PADING);
        }

        doc = doc
            .ele(Constants.START)
              .txt(startIsoString)
            .up();
      }

      if (signedIdentifier.AccessPolicy.Expiry) {
        var expiryIsoString = signedIdentifier.AccessPolicy.Expiry;
        if (expiryIsoString instanceof Date) {
          // Convert to expected ISO 8061 date format
          expiryIsoString = ISO8061Date.format(expiryIsoString, ACL_MILLISECONDS_PADING);
        }

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

  if (signedIdentifiersXml) {
    signedIdentifiersXml.forEach(function (signedIdentifier) {
      var si = {};
      si.Id = signedIdentifier.Id[0];
      if (signedIdentifier.AccessPolicy) {
        si.AccessPolicy = {};

        if (signedIdentifier.AccessPolicy[0].Start) {
          si.AccessPolicy.Start = signedIdentifier.AccessPolicy[0].Start[0];
        }

        if (signedIdentifier.AccessPolicy[0].Expiry) {
          si.AccessPolicy.Expiry = signedIdentifier.AccessPolicy[0].Expiry[0];
        }

        if (signedIdentifier.AccessPolicy[0].Permission) {
          si.AccessPolicy.Permission = signedIdentifier.AccessPolicy[0].Permission[0];
        }
      }

      signedIdentifiers.push(si);
    });
  }

  return signedIdentifiers;
};