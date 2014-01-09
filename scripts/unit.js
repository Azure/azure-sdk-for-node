#!/usr/bin/env node
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

var fs = require('fs');
var path = require('path');

var args = (process.ARGV || process.argv);

var coverageOption = Array.prototype.indexOf.call(args, '-coverage');

if (coverageOption !== -1) {
  args.splice(coverageOption, 1);
}

var reporter = 'list';
var xunitOption = Array.prototype.indexOf.call(args, '-xunit');
if (xunitOption !== -1) {
  reporter = 'xunit';
  args.splice(xunitOption, 1);
}

var testList = args.pop();

var fileContent;
var root = false;

if  (!fs.existsSync) {
  fs.existsSync = require('path').existsSync;
}

if (fs.existsSync(testList)) {
  fileContent = fs.readFileSync(testList).toString();
} else {
  fileContent = fs.readFileSync('./test/' + testList).toString();
  root = true;
}

var files = fileContent.split('\n');

args.push('-u');
args.push('tdd');

// TODO: remove this timeout once tests are faster
args.push('-t');
args.push('200000');

files.forEach(function (file) {
  if (file.length > 0 && file.trim()[0] !== '#') {
    // trim trailing \r if it exists
    file = file.replace('\r', '');

    if (root) {
      args.push('test/' + file);
    } else {
      args.push(file);
    }
  }
});

if (coverageOption !== -1) {
  args.push('-R');
  args.push('html-cov');
} else {
  args.push('-R');
  args.push(reporter);
}

var defaultStorageAccount = 'ciserversdk';
var defaultServiceBusAccount = 'ciserversb';
var defaultSubscription = 'db1ab6f0-4769-4b27-930e-01e2ef9c123c';
var defaultAccessToken = 'access_token';

if (!process.env.AZURE_APNS_CERTIFICATE && process.env.AZURE_APNS_CERTIFICATE_FILE) {
  process.env.AZURE_APNS_CERTIFICATE = new Buffer(fs.readFileSync(process.env['AZURE_APNS_CERTIFICATE_FILE'])).toString('base64');
} else if (process.env.AZURE_APNS_CERTIFICATE && process.env.AZURE_APNS_CERTIFICATE_FILE) {
  throw new Error('Only one of AZURE_APNS_CERTIFICATE or AZURE_APNS_CERTIFICATE_FILE can be set. Not both.');
}

if (!process.env.AZURE_APNS_CERTIFICATE_KEY && process.env.AZURE_APNS_CERTIFICATE_KEY_FILE) {
  process.env.AZURE_APNS_CERTIFICATE_KEY = fs.readFileSync(process.env['AZURE_APNS_CERTIFICATE_KEY_FILE']).toString();
} else if (process.env.AZURE_APNS_CERTIFICATE_KEY && process.env.AZURE_APNS_CERTIFICATE_KEY_FILE) {
  throw new Error('Only one of AZURE_APNS_CERTIFICATE_KEY or AZURE_APNS_CERTIFICATE_KEY_FILE can be set. Not both.');
}

if (!process.env.AZURE_MPNS_CERTIFICATE && process.env.AZURE_MPNS_CERTIFICATE_FILE) {
  process.env.AZURE_MPNS_CERTIFICATE = new Buffer(fs.readFileSync(process.env['AZURE_MPNS_CERTIFICATE_FILE'])).toString('base64');
} else if (process.env.AZURE_MPNS_CERTIFICATE && process.env.AZURE_MPNS_CERTIFICATE_FILE) {
  throw new Error('Only one of AZURE_MPNS_CERTIFICATE or AZURE_MPNS_CERTIFICATE_FILE can be set. Not both.');
}

if (!process.env.AZURE_MPNS_CERTIFICATE_KEY && process.env.AZURE_MPNS_CERTIFICATE_KEY_FILE) {
  process.env.AZURE_MPNS_CERTIFICATE_KEY = fs.readFileSync(process.env['AZURE_MPNS_CERTIFICATE_KEY_FILE']).toString();
} else if (process.env.AZURE_MPNS_CERTIFICATE_KEY && process.env.AZURE_MPNS_CERTIFICATE_KEY_FILE) {
  throw new Error('Only one of AZURE_MPNS_CERTIFICATE_KEY or AZURE_MPNS_CERTIFICATE_KEY_FILE can be set. Not both.');
}

if (!process.env.AZURE_ACCESS_TOKEN) {
  process.env.AZURE_ACCESS_TOKEN = defaultAccessToken;
}

if (!process.env.AZURE_CERTIFICATE_PEM_FILE) {
  process.env.AZURE_CERTIFICATE_PEM_FILE = path.join(__dirname, '../test/data/certificate.pem');
}

if (!process.env.NOCK_OFF && !process.env.AZURE_NOCK_RECORD) {
  process.env.AZURE_APNS_CERTIFICATE = 'fake_certificate';
  process.env.AZURE_APNS_CERTIFICATE_KEY = 'fake_certificate_key';

  process.env.AZURE_WNS_PACKAGE_SID = 'sid';
  process.env.AZURE_WNS_SECRET_KEY = 'key';

  process.env.AZURE_GCM_KEY = 'fakekey'.toString('base64');

  process.env.AZURE_MPNS_CERTIFICATE = 'fake_certificate';
  process.env.AZURE_MPNS_CERTIFICATE_KEY = 'fake_certificate_key';

  if (process.env.AZURE_STORAGE_ACCOUNT !== defaultStorageAccount) {
    process.env.AZURE_STORAGE_ACCOUNT = defaultStorageAccount;
  }

  process.env.AZURE_STORAGE_ACCESS_KEY = new Buffer('fake_key').toString('base64');

  if (process.env.AZURE_SERVICEBUS_NAMESPACE !== defaultServiceBusAccount) {
    process.env.AZURE_SERVICEBUS_NAMESPACE = defaultServiceBusAccount;
    process.env.AZURE_SERVICEBUS_ACCESS_KEY = new Buffer('fake_key').toString('base64');
  }

  if (process.env.AZURE_SUBSCRIPTION_ID !== defaultSubscription) {
    process.env.AZURE_SUBSCRIPTION_ID = defaultSubscription;
    process.env.AZURE_CERTIFICATE = 'fake_certificate';
    process.env.AZURE_CERTIFICATE_KEY = 'fake_certificate_key';
  }
} else {
  if (!process.env.NOCK_OFF && process.env.AZURE_NOCK_RECORD) {
    // If in record mode, and environment variables are set, make sure they are the expected one for recording
    // NOTE: For now, only the Core team can update recordings. For non-core team PRs, the recordings will be updated
    // after merge
    if (process.env.AZURE_STORAGE_ACCOUNT && process.env.AZURE_STORAGE_ACCOUNT !== defaultStorageAccount) {
      throw new Error('Storage recordings can only be made with the account ' + defaultStorageAccount);
    }

    if (process.env.AZURE_SERVICEBUS_NAMESPACE && process.env.AZURE_SERVICEBUS_NAMESPACE !== defaultServiceBusAccount) {
      throw new Error('Service Bus recordings can only be made with the namespace ' + defaultServiceBusAccount);
    }

    if (process.env.AZURE_SUBSCRIPTION_ID && process.env.AZURE_SUBSCRIPTION_ID !== defaultSubscription) {
      throw new Error('Service Management recordings can only be made with the subscription ' + defaultSubscription);
    }
  }
}

require('../node_modules/mocha/bin/mocha');