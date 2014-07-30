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

var exports = module.exports;

var GalleryClient = require('./galleryClient');
exports.GalleryClient = GalleryClient;

/**
* Creates a new {@link GalleryClient} object.
*
* @param {object} credentials            The credentials, typically a TokenCloudCredential
* @param {string} [baseUri]              The base uri.
* @param {array} [filters]               Extra request filters to add
* @return {GalleryClient}                A new GalleryClient object.
*/
exports.createGalleryClient = function (credentials, baseUri, filters) {
  return new exports.GalleryClient.GalleryClient(credentials, baseUri, filters);
};
