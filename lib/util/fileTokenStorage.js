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

var _ = require('underscore');
var fs = require('fs');
var path = require('path');

/**
 * Constructs a new disk file based token storage.
 * @constructor
 *
 * @param {string} filename filename to store/retrieve data from
 *
 */
function FileTokenStorage(filename) {
  this._setFile(filename);
  //this._filename = filename;
}

_.extend(FileTokenStorage.prototype, {
  _save: function (entries, done) {
    var writeOptions = {
      encoding: 'utf8',
      mode: 384, // Permission 0600 - owner read/write, nobody else has access
      flag: 'w'
    };
    
    fs.writeFile(this._filename, JSON.stringify(entries), writeOptions, done);
  },
  
  _setFile: function (filename) {
    if (!fs.existsSync(filename)) {
      var dirname = path.dirname(filename);
      //create the directory if it does not exist
      if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname);
      }
      fs.writeFileSync(filename, JSON.stringify([]));
    }
    this._filename = filename;
  },
  
  loadEntries: function (callback) {
    var entries = [];
    var err;
    try {
      var content = fs.readFileSync(this._filename);
      entries = JSON.parse(content);
      entries.forEach(function (entry) {
        entry.expiresOn = new Date(entry.expiresOn);
      });
    } catch (ex) {
      if (ex.code !== 'ENOENT') {
        err = ex;
      }
    }
    callback(err, entries);
  },
  
  removeEntries: function (entriesToRemove, entriesToKeep, callback) {
    this._save(entriesToKeep, callback);
  },
  
  addEntries: function (newEntries, existingEntries, callback) {
    var entries = existingEntries.concat(newEntries);
    this._save(entries, callback);
  },

  clear: function (callback) {   
    this._save([], callback); 
  }
});

module.exports = FileTokenStorage;