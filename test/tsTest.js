/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 */

const path = require('path');
const glob = require('glob');
const execSync = require('child_process').execSync;

let packagePaths = glob.sync(path.join(__dirname, '../lib/services', '/**/lib/*.d.ts'), 
{ ignore: '**/node_modules/**/*.d.ts' });

describe('tsc compilation:', function () {

  packagePaths.forEach(function (path) {
    it(`${path} should succeed.`, function (done) {
      let cmd = `tsc ${path}`;
      let result;
      try {
        result = execSync(cmd, { encoding: 'utf8' });
        done();
      } catch (err) {
        let output = '';
        if (err.stdout) output += err.stdout;
        if (err.stderr) output += err.stderr;
        done(output);
      }
    });
  });
});