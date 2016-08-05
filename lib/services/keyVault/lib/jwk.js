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

'use strict';
/* jshint latedef:false */
/* jshint camelcase:false */

/** Constants that identify encryption algorithms.
  * @namespace 
  */
function JsonWebKeyEncryptionAlgorithms() {
}

/** @inner */
JsonWebKeyEncryptionAlgorithms.RSAOAEP = 'RSA-OAEP';
/** @inner */
JsonWebKeyEncryptionAlgorithms.RSA15 = 'RSA1_5';

/** Constants that identify signing algorithms.
  * @namespace
  */
function JsonWebKeySignatureAlgorithms() { 
}

/** @inner */
JsonWebKeySignatureAlgorithms.RS256 = 'RS256';
/** @inner */
JsonWebKeySignatureAlgorithms.RS384 = 'RS384';
/** @inner */
JsonWebKeySignatureAlgorithms.RS512 = 'RS512';
/** @inner */
JsonWebKeySignatureAlgorithms.RSNULL = 'RSNULL';

/** Constants that identify JWK (Json Web Key) types.
  * @namespace
  */
function JsonWebKeyType() {
}

/** @inner */
JsonWebKeyType.EC = 'EC';
/** @inner */
JsonWebKeyType.RSA = 'RSA';
/** @inner */
JsonWebKeyType.RSAHSM = 'RSA-HSM';
/** @inner */
JsonWebKeyType.OCT = 'oct';

/** @class
  */

var exports = module.exports;

exports.JsonWebKeyEncryptionAlgorithms = JsonWebKeyEncryptionAlgorithms;
exports.JsonWebKeySignatureAlgorithms = JsonWebKeySignatureAlgorithms;
exports.JsonWebKeyType = JsonWebKeyType;