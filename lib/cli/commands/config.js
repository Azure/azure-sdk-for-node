/**
* Copyright 2011 Microsoft Corporation
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
var xml2js = require('xml2js');
var assert = require('assert');
var pfx2pem = require('../../util/certificates/pkcs').pfx2pem;

exports.init = function (cli) {

  var log = cli.output;

  var account = cli.category('account');

  var config = cli.category('config')
        .description('Manage tool local settings');

  config.command('list')
        .whiteListPowershell()
        .description('Display config settings')
        .action(function (options) {
          log.info('Displaying config settings');

          var cfg = account.readConfig();

          log.table(cfg, function (row, name) {
            row.cell('Setting', name);
            row.cell('Value', cfg[name]);
          });
        });

  config.command('set <name> <value>')

        .usage('<name> <value>')

        .whiteListPowershell()
        .description('Change a config setting')
        .action(function (name, value, options) {
          var cfg = account.readConfig();
          if(name === 'endpoint') {
            endpointInfo = validateEndpoint(value);
            log.info('Setting \'port\' to value \'' + endpointInfo.endpointPort + '\'');
            cfg['port'] = endpointInfo.endpointPort;
            value = endpointInfo.endpointHost;
          }

          log.info('Setting \'' + name + '\' to value \'' + value + '\'');
          cfg[name] = value;
          account.writeConfig(cfg);
          log.info('Changes saved.');
        });


  var azurePath = path.join(homeFolder(), '.azure');
  var azureConfigPath = path.join(azurePath, 'config.json');

  config.readConfig = function () {
    var cfg = {};
    log.silly('Reading config', azureConfigPath);

    if (path.existsSync(azureConfigPath)) {
      try {
        cfg = JSON.parse(fs.readFileSync(azureConfigPath));
      } catch (err) {
        log.warn('Unable to read settings');
        cfg = {};
      }
      log.json('silly', cfg);
    }

    return cfg;
  };

  config.writeConfig = function (cfg) {
    if (!path.existsSync(azurePath)) {
      log.silly('Creating folder', azurePath);
      fs.mkdirSync(azurePath, 502); //0766
    }

    log.silly('Writing config', azureConfigPath);
    fs.writeFileSync(azureConfigPath, JSON.stringify(cfg));
  };
  
  config.clearConfig = function() {
    log.silly('Removing', azureConfigPath);
    if (path.existsSync(azureConfigPath)) {
      fs.unlinkSync(azureConfigPath);
      return true;
    }
  };

  // added temporarily for back-compat
  cli.category('account').readConfig = config.readConfig;
  cli.category('account').writeConfig = config.writeConfig;
  cli.category('account').clearConfig = config.clearConfig;

  // apply any persistant switches at load-time
  function applyGlobalSettings() {
    var cfg = config.readConfig();
    if (!cfg) {
      return;
    }

    if (cfg.labels === 'off') {
      log.format({ terse: true });
    }

    if (cfg.logo === 'off') {
      log.format({ logo: 'off' });
    } else {
      log.format({ logo: 'on' });
    }
  }

  applyGlobalSettings();

  function homeFolder() {
    if (process.env.HOME !== undefined) {
      return process.env.HOME;
    }

    if (process.env.HOMEDRIVE && process.env.HOMEPATH) {
      return process.env.HOMEDRIVE + process.env.HOMEPATH;
    }

    throw new Error('No HOME path available');
  }
  
  function validateEndpoint(endpoint) {
    var parts = endpoint.split('://');
    var hostname = parts[0];
    if(parts.length > 2){
      throw Error('Invalid Url');
    } else if (parts.length === 2) {
       if(!parts[0]) {
        throw Error('Invalid Url');
       }

       if((parts[0] !== 'https') && (parts[0] !== 'HTTPS')) {
          throw Error('Only https protocol supported in the endpoint');
       }
       
       hostname = parts[1];
    } 

    var parts2 = hostname.split('/');

    // Check url contain path(s) after the hostname if so error
    // This will handle in case if user pass endpoint value starting
    // with / char
    if(parts2.length > 2 || (parts2.length === 2 && parts2[1])) {
      throw Error('Invalid Url');
    }

    var parts3 = (parts2[0]).split(':');

    port = 443;
    // Check host name contain ':', if so only one and it should be 
    // followed by a valid port number
    if(parts3.length > 2) {
      throw Error('Invalid Url');
    } else if(parts3.length === 2) {
      if(!parts3[1]) {
        throw Error('Invalid Url');
      }

      var intValue = parseInt(parts3[1], 10);
      if (intValue != parts3[1] || parts3[1] < 1 || parts3[1] > 65535) {
        throw Error('Port number should be a number in the range [1, 65535]');
      }
      
      port = intValue;
    }
    
    return {endpointHost: parts3[0], endpointPort: port};
  }
};
