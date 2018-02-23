// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

var assert = require('assert');
var url = require('url');

var FormDataFilter = require('../lib/filters/formDataFilter');
var HeaderConstants = require('../lib/constants').HeaderConstants;

describe('FormData filter', function () {
  it('should set the form property of the request object when content-type is application/x-www-form-urlencoded', function (done) {
    let request = {
      url: 'https://foo.example.com/v1/pet/puppy?api-version=2017-12-01',
      method: 'POST',
      formData: {
        id: 101,
        name: 'myPuppy',
        color: 'red'
      },
      headers:{
        'Content-Type': HeaderConstants.FORM_URL_ENCODED
      }
    };
    var callback = function () { done(); };
    var mocknext = function (err, response, body) {
      let form = {
        id: 101,
        name: 'myPuppy',
        color: 'red'
      };
      assert.equal(request.formData, undefined);
      assert.deepEqual(request.form, form);
      return callback();
    };
    var formDataFilter = FormDataFilter.create();
    formDataFilter(request, mocknext, callback);
  });

  it('should NOT set the form property of the request object when content-type is multipart/form-data', function (done) {
    let request = {
      url: 'https://foo.example.com/v1/pet/puppy?api-version=2017-12-01',
      method: 'POST',
      formData: {
        id: 101,
        name: 'myPuppy',
        color: 'red'
      },
      headers:{
        'Content-Type': 'multipart/form-data'
      }
    };
    var callback = function () { done(); };
    var mocknext = function (err, response, body) {
      let formData = {
        id: 101,
        name: 'myPuppy',
        color: 'red'
      };
      assert.equal(request.form, undefined);
      assert.deepEqual(request.formData, formData);
      return callback();
    };
    var formDataFilter = FormDataFilter.create();
    formDataFilter(request, mocknext, callback);
  });
});
