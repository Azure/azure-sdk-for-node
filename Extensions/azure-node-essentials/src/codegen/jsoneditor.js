var fs = require('fs');
var npm = require('npm');

/**
 * Removes byte order marker. This catches EF BB BF (the UTF-8 BOM)
 * because the buffer-to-string conversion in `fs.readFile()`
 * translates it to FEFF, the UTF-16 BOM.
 */
exports.stripBOM = function stripBOM(content) {
  if (Buffer.isBuffer(content)) {
    content = content.toString();
  }

  if (content.charCodeAt(0) === 0xFEFF || content.charCodeAt(0) === 0xFFFE) {
    content = content.slice(1);
  }

  return content;
};

/**
 * Provides a parsed JSON from the given local file path
 */
exports.parseJson = function parseJson(filePath) {
  let result = null;
  if (!filePath || (filePath && typeof filePath.valueOf() !== 'string')) {
    let err = new Error('a local file path to package.json is required and must be of type string.');
    return Promise.reject(err);
  }
  try {
    result = JSON.parse(this.stripBOM(fs.readFileSync(filePath, 'utf8')));
    return Promise.resolve(result);
  } catch (err) {
    return Promise.reject(err);
  }
};

/**
 * add given list of dependencies to package.json
 */
exports.addDependenciesIfRequired = function addDependenciesIfRequired(filePath, packages) {
  this.parseJson(filePath).then(function (jsonObject) {
    if (jsonObject) {
      var existingPackages = new Set();
      for (var item in jsonObject.dependencies) {
        existingPackages.add(item);
      }

      var packagesToInsert = packages.filter(x => !existingPackages.has(x));
      var promises = packagesToInsert.map((pkgName) => updateDependency(pkgName));

      Promise.all(promises).then(function (entries) {
        if (!jsonObject.dependencies) {
          jsonObject.dependencies = {};
        }

        for (var item in entries) {
          var kvp = entries[item].split(':');
          jsonObject.dependencies[kvp[0]] = kvp[1];
        }

        fs.writeFileSync(filePath, JSON.stringify(jsonObject, null, '  '));
      }).catch(function (err) {
        return console.error(err);
      });
    }
  });
};

/**
 * Given a package name as string, pings npm about the package and 
 * returns a well formed package dependency entry that can be inserted in package.json
 */
function updateDependency(pkgName) {
  var promise = new Promise(function (resolve, reject) {
    npm.load(function (err) {
      if (err) {
        return reject(err);
      }

      npm.commands.view([pkgName, 'name', 'version'], true, function (err, info) {
        if (err) {
          return reject(err);
        }

        var json = JSON.parse(JSON.stringify(info));
        var dependency = json[Object.keys(json)[0]];
        var entry = `${dependency.name}:^${dependency.version}`;
        return resolve(entry);
      });
    });
  });

  return promise;
};
