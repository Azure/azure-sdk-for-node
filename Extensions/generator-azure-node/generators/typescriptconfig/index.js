'use strict';
var util = require('util');
var ScriptBase = require('../common/script-base-basic.js');

var Generator = module.exports = function Generator() {
  ScriptBase.apply(this, arguments);
};

util.inherits(Generator, ScriptBase);

Generator.prototype.createItem = function() {
  this.generateStandardFile('tsconfig.json', 'tsconfig.json');
};
