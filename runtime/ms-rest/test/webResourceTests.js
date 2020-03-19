// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

var assert = require('assert');
var webResource =require('../lib/webResource')


describe('web resoure', function () {

  it('should support dash in parameter name', function (done) {
     var options = {
       headers:{
        "Content-Type": "application/x-www-form-urlencoded"
       },
       method:"get",
       url:"",
       pathTemplate:"/pet/{pet-name}/{one-friend-name}",
       pathParameters: {
         "pet-name":"tom",
         "one-friend-name":"jerry"
       }
     }
     var request = new webResource()
     request = request.prepare(options)
     assert.equal(request.url,"https://management.azure.com/pet/tom/jerry")
     done()
  });
});

