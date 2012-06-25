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

var testCase = require('nodeunit').testCase;

// Test includes
var testutil = require('./util');

// Lib includes
var Base64 = testutil.libRequire('util/base64');

var testBase64Text = '<samlp:AuthnRequest ID="00djbrv5ais82fb92yhcg56dek71czk1vk6o" Version="2.0" IssueInstant="2011-09-07T00:54:48.617Z" xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"><Issuer xmlns="urn:oasis:names:tc:SAML:2.0:assertion">http://henryr.schakra.com:60100/</Issuer></samlp:AuthnRequest>';
var testBase64Coded = 'PHNhbWxwOkF1dGhuUmVxdWVzdCBJRD0iMDBkamJydjVhaXM4MmZiOTJ5aGNnNTZkZWs3MWN6azF2azZvIiBWZXJzaW9uPSIyLjAiIElzc3VlSW5zdGFudD0iMjAxMS0wOS0wN1QwMDo1NDo0OC42MTdaIiB4bWxuczpzYW1scD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOnByb3RvY29sIj48SXNzdWVyIHhtbG5zPSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6YXNzZXJ0aW9uIj5odHRwOi8vaGVucnlyLnNjaGFrcmEuY29tOjYwMTAwLzwvSXNzdWVyPjwvc2FtbHA6QXV0aG5SZXF1ZXN0Pg==';

module.exports = testCase(
{
  setUp: function (callback) {
    callback();
  },

  tearDown: function (callback) {
    // clean up
    callback();
  },

  testEncode64: function (done) {
    var enc = Base64.encode64(testBase64Text);
    assert.equal(enc, testBase64Coded);
    done();
  },

  testDecode64: function (done) {
    var dec = Base64.decode64(testBase64Coded);
    assert.equal(dec, testBase64Text);
    done();
  }
});