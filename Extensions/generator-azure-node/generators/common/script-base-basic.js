'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var Generator = module.exports = function Generator() {
  yeoman.generators.Base.apply(this, arguments);
  this.sourceRoot(path.join(__dirname, '../templates/empty-files/'));

  // this.namespace = function() {
  //   return require('./configuration').getNamespace(this.fs);
  // }.bind(this);
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.generateStandardFile = function(sourceFile, targetFile) {
  this.log('You called the subgenerator with the arg: ' + chalk.green(this.arguments[0] || targetFile));
  this.fs.copy(this.templatePath(sourceFile), this.destinationPath(targetFile));
  this.log(chalk.green(targetFile) + ' created.');
};

Generator.prototype.generateTemplateFile = function(templateFile, targetFile, templateData) {
  this.log('You called the subgenerator with the arg ' + templateFile);
  if (templateData !== null) {
    this.fs.copyTpl(this.templatePath(templateFile), this.destinationPath(targetFile), templateData);
  } else {
    this.fs.copyTpl(this.templatePath(templateFile), this.destinationPath(targetFile));
  }
  this.log(targetFile + ' created.');
};
