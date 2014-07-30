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

var testutil = require('../../util/util');
var azure = testutil.libRequire('azure');

describe('Resource Management', function () {
  describe('create identity', function () {
    it('should work', function (done) {
      var identity = azure.createResourceIdentity('myresource',
        'Microsoft.Sql/servers/databases',
        '2014-04-01');

      identity.resourceProviderNamespace.should.equal('Microsoft.Sql');
      identity.resourceType.should.equal('databases');
      identity.resourceProviderApiVersion.should.equal('2014-04-01');
      identity.parentResourcePath.should.equal('');

      done();
    });
  });
});