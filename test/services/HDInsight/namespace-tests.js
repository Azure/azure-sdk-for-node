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

// Test functions
var azureUtil = require('../../../lib/common/lib/util/util');

// Test includes
var should = require('should');

describe('HDInsight Namespace Test', function() {

  it('GetNameSpace should properly create namespaces', function (done) {
    var subscriptionId = '0bf0b5da-dc38-4795-8595-3170ffefec48';
    var expected = 'hdinsightC2D4FSA77HSYSQLRU4V73NKI3YH2OYHQXACMRGPECIHSH7FXTUAQ-East-US';
    var result = azureUtil.getNameSpace(subscriptionId, 'hdinsight', 'East US');
    result.should.be.equal(expected);

    subscriptionId = 'c72f7fde-36ec-4cdf-93bf-43f90fe5373a';
    expected = 'hdinsightGTUVH76U5MNNGTJEFMKSGQMQO7AFBW52LMZPQ22R6UUXVWBDRBVA-East-US';
    result = azureUtil.getNameSpace(subscriptionId, 'hdinsight', 'East US');
    result.should.be.equal(expected);

    subscriptionId = '04066490-336b-4732-adfa-90ba5422cc84';
    expected = 'hdinsightXVS5S5SBDTTR7OJ4IOKGRTFM2M3P33KWPGP5SPYDJZYUMY73KOIQ-East-US';
    result = azureUtil.getNameSpace(subscriptionId, 'hdinsight', 'East US');
    result.should.be.equal(expected);

    subscriptionId = '3cfbb7fc-1347-4eff-bf07-2e1f43084b00';
    expected = 'hdinsightVXFY2XGLQTT5PCJCDRKJXWE2W2PQZOJK3NLO4QSNHEKS32E6RM5A-East-US';
    result = azureUtil.getNameSpace(subscriptionId, 'hdinsight', 'East US');
    result.should.be.equal(expected);

    subscriptionId = 'ee3733c1-5ebd-4a20-95ce-17dba36a071a';
    expected = 'hdinsightLDBRGOYTMVIJZ2ZAJZZTFFJD7N3MNFCJGONZO53VLK2V5GIEU2SQ-East-US';
    result = azureUtil.getNameSpace(subscriptionId, 'hdinsight', 'East US');
    result.should.be.equal(expected);

    subscriptionId = 'ee3733c1-5ebd-4a20-95ce-17dba36a071a';
    expected = 'hdinsightLDBRGOYTMVIJZ2ZAJZZTFFJD7N3MNFCJGONZO53VLK2V5GIEU2SQ-East-US-2';
    result = azureUtil.getNameSpace(subscriptionId, 'hdinsight', 'East US 2');
    result.should.be.equal(expected);

    done();
  });
});
