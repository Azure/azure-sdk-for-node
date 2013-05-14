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

var _ = require('underscore');

var azureutil = require('./util');
var check = require('validator').check;

exports = module.exports;

/**
* Creates a anonymous function that check if the given uri is valid or not.
*
* @param {string} uri The uri to validate.
* @return {function}
*/
exports.isValidUri = function (uri) {
  try {
    // Check will throw if it is not valid.
    check(uri).isUrl();
    return true;
  } catch (e) {
    throw new Error('The provided URI "' + uri + '" is invalid.');
  }
};

/**
* Creates a anonymous function that check if a given key is base 64 encoded.
*
* @param {string} key The key to validate.
* @return {function}
*/
exports.isBase64Encoded = function (key) {
  var isValidBase64String = key.match('^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$');

  if (isValidBase64String) {
    return true;
  } else {
    throw new Error('The provided account key ' + key + ' is not a valid base64 string.');
  }
};

/**
* Validates a function.
*
* @param {object} function The function to validate.
* @return {function}
*/
exports.isValidFunction = function (functionObject, functionName) {
  if (!functionObject || !_.isFunction(functionObject)) {
    throw new Error(functionName + ' must be specified.');
  }
};

/**
* Validates that a Service Bus namespace name
* is legally allowable. Does not check availability.
*
* @param {string} name the name to check
*
* @return nothing. Throws exception if name is invalid, message
*                  describes what validity criteria it violates.
*/

exports.namespaceNameIsValid = function (name, callback) {
  var validNameRegex = /^[a-zA-Z][a-zA-Z0-9\-]*$/;
  var illegalEndings = /(-|-sb|-mgmt|-cache|-appfabric)$/;

  var fail;

  if (callback) {
    fail = function (err) {
      callback(new Error(err));
      return false;
    };
  } else {
    fail = function (err) {
      throw new Error(err);
    };
    callback = function () {};
  }

  if (name.length < 6 || name.length > 50) {
    return fail('Service Bus namespace names must be 6 to 50 characters long.');
  }
  if (!validNameRegex.test(name)) {
    return fail('Service Bus namespace names must start with a letter and include only letters, digits, and hyphens');
  }
  if (illegalEndings.test(name)) {
    return fail('Service Bus namespace names may not end with "-", "-sb", "-mgmt", "-cache", or "-appfabric"');
  }

  callback();
  return true;
};

/**
* Validates a container name.
*
* @param {string} containerName The container name.
* @return {undefined}
*/
exports.containerNameIsValid = function (containerName, callback) {
  var fail;

  if (callback) {
    fail = function (err) {
      callback(new Error(err));
      return false;
    };
  } else {
    fail = function (err) {
      throw new Error(err);
    };
    callback = function () {};
  }

  if (!azureutil.objectIsString(containerName) || azureutil.stringIsEmpty(containerName)) {
    return fail('Container name must be a non empty string.');
  }

  if (containerName === '$root') {
    return true;
  }

  if (containerName.match('^[a-z0-9][a-z0-9-]*$') === null) {
    return fail('Container name format is incorrect.');
  }

  if (containerName.indexOf('--') !== -1) {
    return fail('Container name format is incorrect.');
  }

  if (containerName.length < 3 || containerName.length > 63) {
    return fail('Container name format is incorrect.');
  }

  if (containerName.substr(containerName.length - 1, 1) === '-') {
    return fail('Container name format is incorrect.');
  }

  callback();
  return true;
};

/**
* Validates a blob name.
*
* @param {string} containerName The container name.
* @param {string} blobname      The blob name.
* @return {undefined}
*/
exports.blobNameIsValid = function (containerName, blobName, callback) {
  var fail;

  if (callback) {
    fail = function (err) {
      callback(new Error(err));
      return false;
    };
  } else {
    fail = function (err) {
      throw new Error(err);
    };
    callback = function () {};
  }

  if (!blobName) {
    return fail( 'Blob name is not specified.');
  }

  if (containerName === '$root' && blobName.indexOf('/') !== -1) {
    return fail('Blob name format is incorrect.');
  }

  callback();
  return true;
};

/**
* Validates a table name.
*
* @param {string} table  The table name.
* @return {undefined}
*/
exports.tableNameIsValid = function (name, callback) {
  var fail;

  if (callback) {
    fail = function (err) {
      callback(new Error(err));
      return false;
    };
  } else {
    fail = function (err) {
      throw new Error(err);
    };
    callback = function () {};
  }

  if (!azureutil.objectIsString(name) || azureutil.stringIsEmpty(name)) {
    return fail('Table name must be a non empty string.');
  }

  callback();
  return true;
};

// common functions for validating arguments

function throwMissingArgument(name, func) {
  throw new Error('Required argument ' + name + ' for function ' + func + ' is not defined');
}

function ArgumentValidator(functionName) {
  this.func = functionName;
}

_.extend(ArgumentValidator.prototype, {
  string: function (val, name) {
    if (typeof val != 'string' || val.length === 0) {
      throwMissingArgument(name, this.func);
    }
  },
  object: function (val, name) {
    if (!val) {
      throwMissingArgument(name, this.func);
    }
  },
  value: function (val, name) {
    if (!val) {
      throwMissingArgument(name, this.func);
    }
  },
  callback: function (val) {
    this.object(val, 'callback');
  },
  tableNameIsValid: exports.tableNameIsValid,
  containerNameIsValid: exports.containerNameIsValid,
  blobNameIsValid: exports.blobNameIsValid
});

function validateArgs(functionName, validationRules) {
  var validator = new ArgumentValidator(functionName);
  validationRules(validator);
}

exports.ArgumentValidator = ArgumentValidator;
exports.validateArgs = validateArgs;