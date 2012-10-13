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

var should = require('should');
var assert = require('assert');

var testutil = require('../../util/util');
var azure = testutil.libRequire('azure');
var ServiceSettings = azure.ServiceSettings;

suite('servicesettings-tests', function () {
  test('parseAndValidateKeysInvalid', function (done) {
    var connectionString = 'FakeKey=FakeValue';
    var validKeys = [ 'ValidKey1', 'ValidKey2' ];

    assert.throws(
      function() {
        ServiceSettings.parseAndValidateKeys(connectionString, validKeys);
      },
      function(err) {
        if ((err instanceof Error) && err.message === 'Invalid connection string setting key "fakekey"') {
          return true;
        }
      },
      "unexpected error"
    );

    done();
  });


  test('parseAndValidateKeysInvalid', function (done) {
    var connectionString = 'ValidKey1=FakeValue';
    var validKeys = [ 'ValidKey1', 'ValidKey2' ];

    ServiceSettings.parseAndValidateKeys(connectionString, validKeys);
    done();
  });

  test('Setting', function (done) {
    var settingWithFunc = ServiceSettings.setting('mysettingname', true, false);
    settingWithFunc['SettingName'].should.not.be.null;
    settingWithFunc['SettingConstraint'].should.not.be.null;

    done();
  });
});