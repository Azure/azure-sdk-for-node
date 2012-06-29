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

var assert = require('assert');

var generatePsm1 = require('../../../lib/cli/generate-psm1-utils');

suite('sharedkey-tests', function () {
  test('getNormalizedParameterName', function (done) {
    assert.equal(generatePsm1.getNormalizedParameterName('p#p#p'), 'ppp');
    assert.equal(generatePsm1.getNormalizedParameterName('p,p,p'), 'ppp');
    assert.equal(generatePsm1.getNormalizedParameterName('p(p(p'), 'ppp');
    assert.equal(generatePsm1.getNormalizedParameterName('p)p)p'), 'ppp');
    assert.equal(generatePsm1.getNormalizedParameterName('p{{p{{p'), 'ppp');
    assert.equal(generatePsm1.getNormalizedParameterName('p}}p}}p'), 'ppp');
    assert.equal(generatePsm1.getNormalizedParameterName('p[p[p'), 'ppp');
    assert.equal(generatePsm1.getNormalizedParameterName('p]p]p'), 'ppp');
    assert.equal(generatePsm1.getNormalizedParameterName('p&p&p'), 'ppp');
    assert.equal(generatePsm1.getNormalizedParameterName('p-p-p'), 'ppp');
    assert.equal(generatePsm1.getNormalizedParameterName('p\\p\\p'), 'ppp');
    assert.equal(generatePsm1.getNormalizedParameterName('p/p/p'), 'ppp');
    assert.equal(generatePsm1.getNormalizedParameterName('p$p$p'), 'ppp');
    assert.equal(generatePsm1.getNormalizedParameterName('p^p^p'), 'ppp');
    assert.equal(generatePsm1.getNormalizedParameterName('p;p;p'), 'ppp');
    assert.equal(generatePsm1.getNormalizedParameterName('p:p:p'), 'ppp');
    assert.equal(generatePsm1.getNormalizedParameterName('p"p"p'), 'ppp');
    assert.equal(generatePsm1.getNormalizedParameterName('p\'p\p'), 'ppp');
    assert.equal(generatePsm1.getNormalizedParameterName('p<p<p'), 'ppp');
    assert.equal(generatePsm1.getNormalizedParameterName('p>p>p'), 'ppp');
    assert.equal(generatePsm1.getNormalizedParameterName('p|p|p'), 'ppp');
    assert.equal(generatePsm1.getNormalizedParameterName('p?p?p'), 'ppp');
    assert.equal(generatePsm1.getNormalizedParameterName('p@p@p'), 'ppp');
    assert.equal(generatePsm1.getNormalizedParameterName('p`p`p'), 'ppp');
    assert.equal(generatePsm1.getNormalizedParameterName('p*p*p'), 'ppp');
    assert.equal(generatePsm1.getNormalizedParameterName('p%p%p'), 'ppp');
    assert.equal(generatePsm1.getNormalizedParameterName('p+p+p'), 'ppp');
    assert.equal(generatePsm1.getNormalizedParameterName('p=p=p'), 'ppp');
    assert.equal(generatePsm1.getNormalizedParameterName('p~p~p'), 'ppp');

    done();
  });
});