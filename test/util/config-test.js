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

'use strict';

var should = require('should');

var Config = require('../index');

describe('Config', function () {
  it('should be creatable by new', function () {
    var c = new Config();
    should.exist(c);
  });

  it('should return a unique object for named environments', function () {
    var c = new Config();
    var dev = c('dev');
    var prod = c('prod');

    should.exist(dev);
    should.exist(prod);

    dev.should.not.equal(prod);
  });

  it('should return itself if invoked without environment', function () {
    var c = new Config();
    c().should.equal(c);
  });

  it('should return same object for same environment', function () {
    var c = new Config();
    var d1 = c('dev');
    var d2 = c('dev');

    d1.should.equal(d2);
  });

  it('should store settings by name', function () {
    var c = new Config();
    c.configure(function (c) {
      c.set('settingOne', 'aValue');
      c.set('secondSetting', 37);
    });

    c.get('settingOne').should.equal('aValue');
    c.get('secondSetting').should.equal(37);
  });

  it('should store settings in environments', function () {
    var c = new Config();

    c.configure('dev', function (c) {
      c.set('settingOne', 'devOne');
      c.set('secondSetting', 37);
    });

    c.configure('prod', function (c) {
      c.set('settingOne', 'prodOne');
      c.set('secondSetting', 42);
    });

    c('dev').get('settingOne').should.equal('devOne');
    c('prod').get('settingOne').should.equal('prodOne');
    should.not.exist(c.get('settingOne'));

    c('dev').get('secondSetting').should.equal(37);
    c('prod').get('secondSetting').should.equal(42);
    should.not.exist(c.get('secondSetting'));
  });

  it('should set values in subenvironments', function () {
    var c = new Config();

    c.configure('dev', function (c) {
      c.configure('dev2', function (c) {
        c.set('settingOne', 'dev2Setting');
      });
      c.configure('dev3', function (c) {
        c.set('settingOne', 'dev3Setting');
      });
      c.set('settingOne', 'devSetting');
    });

    should.not.exist(c.get('settingOne'));
    c('dev').get('settingOne').should.equal('devSetting');
    c('dev')('dev2').get('settingOne').should.equal('dev2Setting');
    c('dev')('dev3').get('settingOne').should.equal('dev3Setting');
  });

  it('should look up parent configs to find setting', function () {
    var c = new Config();

    c.configure(function (c) {
      c.set('settingOne', 'defaultValue');
      c.configure('dev', function (c) {
        c.set('settingTwo', 'devValue');
      });
    });

    c('dev').get('settingTwo').should.equal('devValue');
    c('dev').get('settingOne').should.equal('defaultValue');
    should.not.exist(c('dev').get('settingThree'));
  });
});

describe('Config and environment', function () {
  var c;
  var originalEnv;

  beforeEach(function () {
    originalEnv = process.env.NODE_ENV;
    c = new Config();
    c.configure(function (c) {
      c.set('settingOne', 'fromRoot')
        .set('settingTwo', 'fromRoot')
        .set('settingThree', 'fromRoot');
    });

    c.configure('dev', function (c) {
      c.set('settingTwo', 'fromDev');
      c.set('devOnly', 'fromDev');
    });

    c.configure('prod', function (c) {
      c.set('settingOne', 'fromProd');
      c.set('settingTwo', 'fromProd');
      c.set('prodOnly', 'fromProd');
    });
  });

  it('should have default environment from NODE_ENV', function () {
    process.env.NODE_ENV = 'prod';

    c.default.get('settingTwo').should.equal('fromProd');

    process.env.NODE_ENV = 'dev';

    c.default.get('settingTwo').should.equal('fromDev');
  });

  it('should look up to parent config when using default', function () {
    process.env.NODE_ENV = 'dev';

    c.default.get('settingOne').should.equal('fromRoot');
    c.default.get('settingTwo').should.equal('fromDev');

    process.env.NODE_ENV = 'prod';

    c.default.get('settingOne').should.equal('fromProd');
    c.default.get('settingTwo').should.equal('fromProd');
  });

  it('should use root environment as default if NODE_ENV not given', function () {
      delete process.env.NODE_ENV;
      c.default.should.equal(c);

      c.default.get('settingOne').should.equal('fromRoot');
      c.default.get('settingTwo').should.equal('fromRoot');
  });

  it('should have setting based on hierarchy', function () {
    c('prod').has('settingTwo').should.be.true;
    c('dev').has('settingTwo').should.be.true;
    c('dev').has('settingThree').should.be.true;
    c('dev').has('prodOnly').should.be.false;
    c('prod').has('prodOnly').should.be.true;
    c('prod').has('devOnly').should.be.false;
    c('prod').has('settingThree').should.be.true;
  });

  it('should list environments', function () {
    c.environments.should.include('dev');
    c.environments.should.include('prod');
  });

  it('should list settings across hierarchy', function () {
    var expected = ['prodOnly', 'settingTwo', 'settingOne', 'settingThree'];
    expected.forEach(function (setting) {
      c('prod').settings.should.include(setting, 'expected setting ' + setting + ' but it was not found');
    });
  });
});
