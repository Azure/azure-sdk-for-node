'use strict';
var util = require('util');
var ScriptBase = require('../common/script-base.js');

var NamedGenerator = module.exports = function NamedGenerator() {
  ScriptBase.apply(this, arguments);
};

util.inherits(NamedGenerator, ScriptBase);

NamedGenerator.prototype.createNamedItem = function() {
  this.generateTemplateFile(
    'typescript.ts',
    '.ts'
  );
};
