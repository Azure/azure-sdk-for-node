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

var fs = require('fs');
var path = require('path');
var utils = require('./utils');

var CacheUtils = {};

function getSpacesFile(context) {
  return path.join(utils.azureDir(), "spaces." + context.subscription + ".json");
}

function getSitesFile(context) {
  return path.join(utils.azureDir(), "sites." + context.subscription + ".json");
}

function getCommitIdsFile(context) {
  return path.join(utils.azureDir(), "commitids." + context.subscription + ".json");
}

function readSpaces(context, cb) {
  var cacheFile = getSpacesFile(context);
  if (utils.pathExistsSync(cacheFile)) {
    return fs.readFile(cacheFile, function (err, data) {
      return cb && cb(err, JSON.parse(data));
    });
  }

  return cb && cb(null, []);
}

function saveSpaces(context, spaces, cb) {
  var cacheFile = getSpacesFile(context);
  return fs.writeFile(cacheFile, JSON.stringify(spaces), function (err) {
    cb && cb(err, spaces);
  });
}

function readSite(context, cb) {
  var cacheFile = getSitesFile(context);
  if (utils.pathExistsSync(cacheFile)) {
    return fs.readFile(cacheFile, function (err, data) {
      if (!err) {
        var sites = JSON.parse(data);
        if (sites && sites.length) {
          for (var i = 0; i < sites.length; i++) {
            if (utils.ignoreCaseEquals(context.site.name, sites[i].Name)) {
              return cb && cb(err, sites[i]);
            }
          }
        }
      }

      return cb && cb(err, null);
    });
  }

  return cb && cb(null, null);
}

function saveSite(context, site, cb) {
  var cacheFile = getSitesFile(context);
  if (utils.pathExistsSync(cacheFile)) {
    return fs.readFile(cacheFile, function (err, data) {
      var sites = JSON.parse(data);
      if (sites && sites.length) {
        for (var i = 0; i < sites.length; i++) {
          if (utils.ignoreCaseEquals(site.Name, sites[i].Name)) { 
            sites[i] = site;
            return saveSites(context, sites, cb);
          }
        }
        sites.push(site);
        return saveSites(context, sites, cb);
      }
      return saveSites(context, [site], cb);
    });
  }

  return saveSites(context, [site], cb);
}

function deleteSite(context, cb) {
  var cacheFile = getSitesFile(context);
  if (utils.pathExistsSync(cacheFile)) {
    return fs.readFile(cacheFile, function (err, data) {
      var sites = JSON.parse(data);
      if (sites && sites.length) {
        for (var i = 0; i < sites.length; i++) {
          if (utils.ignoreCaseEquals(context.site.name, sites[i].Name)) {
            sites.splice(i, 1);
            return saveSites(context, sites, cb);
          }
        }
      }

      return cb && cb(err, null);
    });
  }

  return cb && cb(null, null);
}

function saveSites(context, sites, cb) {
  var cacheFile = getSitesFile(context);
  return fs.writeFile(cacheFile, JSON.stringify(sites), function (err) {
    cb && cb(err, sites);
  });
}

function saveCommitIds(context, deployments, cb) {
  var cacheFile = getCommitIdsFile(context);
  var commitIds = deployments.map(function (deployment) {
    return {
      shortId: deployment.shortId,
      id: deployment.id
    }; 
  });
  return fs.writeFile(cacheFile, JSON.stringify(commitIds), function (err) {
    cb && cb(err, deployments);
  });
}

function readCommitId(context, cb) {
  var cacheFile = getCommitIdsFile(context);
  if (utils.pathExistsSync(cacheFile)) {
    return fs.readFile(cacheFile, function (err, data) {
      var commitIds = JSON.parse(data);
      if (commitIds && commitIds.length) {
        for (var i = 0; i < commitIds.length; i++) {
          if (utils.ignoreCaseEquals(context.shortId, commitIds[i].shortId)
            || utils.ignoreCaseEquals(context.shortId, commitIds[i].id)) {
            return cb && cb(err, commitIds[i].id);
          }
        }
      }
      return cb && cb(err, null);
    });
  }

  return cb && cb(null, null);
}

function clear() {
  var isDeleted = false;
  if (utils.pathExistsSync(utils.azureDir())) {
    var cacheFiles = fs.readdirSync(utils.azureDir());
    for (var i = 0; i < cacheFiles.length; ++i) {
      if (/sites[.].+[.]json/.test(cacheFiles[i])
      || /spaces[.].+[.]json/.test(cacheFiles[i])
      || /commitids[.].+[.]json/.test(cacheFiles[i])) {
        fs.unlinkSync(path.join(utils.azureDir(), cacheFiles[i]));
        isDeleted = true;
      }
    }
  }
  return isDeleted;
};

CacheUtils.readSpaces = readSpaces;
CacheUtils.saveSpaces = saveSpaces;
CacheUtils.readSite = readSite;
CacheUtils.saveSite = saveSite;
CacheUtils.deleteSite = deleteSite;
CacheUtils.saveSites = saveSites;
CacheUtils.saveCommitIds = saveCommitIds;
CacheUtils.readCommitId = readCommitId;
CacheUtils.clear = clear;

module.exports = CacheUtils;