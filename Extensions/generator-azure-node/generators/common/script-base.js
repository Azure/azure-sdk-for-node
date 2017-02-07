'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var NamedGenerator = module.exports = function NamedGenerator() {
  yeoman.generators.NamedBase.apply(this, arguments);
  this.sourceRoot(path.join(__dirname, '../templates/empty-files/'));

  // this.namespace = function() {
  //   return require('./configuration').getNamespace(this.fs);
  // }.bind(this);
};

util.inherits(NamedGenerator, yeoman.generators.NamedBase);

NamedGenerator.prototype.generateTemplateFile = function(templateFile, extension, templateData) {
  // the target file is created from *name* property
  var targetFile = this.createTargetFile(extension);
  this.log('You called the subgenerator with the arg ' + chalk.green(this.arguments[0] || targetFile));
  if (templateData !== null) {
    this.fs.copyTpl(this.templatePath(templateFile), this.destinationPath(targetFile), templateData);
  } else {
    this.fs.copyTpl(this.templatePath(templateFile), this.destinationPath(targetFile));
  }
  this.log(chalk.green(targetFile) + ' created.');
};

/**
 * User can type supported extension together with filename
 * when generator is called.
 * Normalize a filename based on existing *name* property and
 * expected extenion.
 * Extension should start with a dot charactaer
 * @param  {String} extension
 * @return {String} a filename based on name property and extension
 */
NamedGenerator.prototype.createTargetFile = function(extension) {
  var targetFile = null;
  extension = this._normalizeExtension(extension);
  if(path.extname(this.name) === extension) {
    targetFile =  this.name;
  } else {
    targetFile = this.name + extension;
  }
  return targetFile;
};

/**
 * Creates class name based on name property
 * If user passed extension as part of filaname
 * removes that part from return class name
 * @param  {String} extension
 * @return {String} class name based on name property
 */
NamedGenerator.prototype.classNameWithoutExtension = function(extension) {
  extension = this._normalizeExtension(extension);
  if(path.extname(this.name) === extension) {
    return path.basename(this.name, extension);
  }
  return this.name;
};

/**
 * A little helper to normalize extension to '.XXXX'
 * @param  {String} extension
 * @return {String} normalized extenion
 */
NamedGenerator.prototype._normalizeExtension = function(extension) {
  if(extension && extension.charAt(0) !== '.') {
    extension = '.' + extension;
  }
  return extension;
};
