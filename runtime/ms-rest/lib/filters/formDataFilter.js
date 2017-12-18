// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information. 

'use strict';

const HeaderConstants = require('../constants').HeaderConstants;
/**
 * formDataFilter - This filter is resposnsible for setting the form property on the 
 * request object if the Content-Type header is 'application/x-www-form-urlencoded'
 */
exports.create = function () {
  return function handle (resource, next, callback) {
    if (resource && resource.headers) {
      let headers = resource.headers;
      let contentType = headers['Content-Type'] || headers['content-type'];
      if (contentType === HeaderConstants.FORM_URL_ENCODED && resource.formData) {
        let form = resource.formData;
        resource.form = form;
        delete resource.formData;
      }
    }
    return next(resource, function (err, response, body) {
      return callback(err, response, body);
    });
  };
};