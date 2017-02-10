var esprima = require('esprima');
var escodegen = require('escodegen');

/**
 * Generates require('') statements to be inserted.
 * 
 * This scans through the current document and determines the minimal non-duplicated list
 * of imports we need to generate.
 * 
 * @param {any} document the current file
 * @returns a Set of require statements to be inserted.
 */
exports.generateRequireStatements = function generateRequireStatements(document, requiredModules) {
  var foundImportsGroup = false;
  var existingModules = new Set();
  var requireStatementMatcher = /var\s*\w+\s+=\s+require\(\'([a-zA-Z0-9_-]*)\'\);*\s*/;
  var insertionLine = 0;

  // gather modules that are already imported in the document
  for (var index = 0; index < document.lineCount; index++) {
    var line = document.lineAt(index);
    var matches = line.text.match(requireStatementMatcher);
    if (matches) {
      if (!foundImportsGroup) {
        foundImportsGroup = true;
      }
      // as long as it matches the require statement, collect the list of imported modules.
      existingModules.add(matches[1]);
    } else if (foundImportsGroup) {
      // we've already discovered a require statement previously and this new line no longer matches the pattern.
      // we've gone past the require statement group. Do not loop through entire source text.
      // record this line number, as we'll insert our require statements here. then, bail out of reading the source document.
      insertionLine = index;
      break;
    }
  }

  // difference between existing modules and ones we require, are the ones we need to insert.
  var modulesToInsert = requiredModules.filter(x => !existingModules.has(x));

  // generate code for importing modules.
  var requireStatements = new Set();
  for (var module of modulesToInsert) {
    var name = this.getNameAssignmentForModule(module);
    var statement = this.generateRequireStatement(name, module)
    requireStatements.add(statement);
  }

  var result = {
    line: insertionLine,
    code: requireStatements
  };

  return result;
};

/**
 * Generates a require('') statement with given information.
 * 
 * This will not perform any additional checks. If you need to generate only 
 * if module is not already imported, use `generateRequireStatements`
 */
exports.generateRequireStatement = function generateRequireStatement(name, packageName) {
  if (!name) {
    name = packageName;
  }

  var text = `var ${name} = require('${packageName}');\r\n`;
  return text;
};

// TODO: do this programmatically. Normalize 'name', strip dashes and other illegal chars. use pascal casing.
exports.getNameAssignmentForModule = function getNameAssignmentForModule(module) {
  switch (module) {
    case 'azure-arm-resource':
      return 'ResourceManagement';
    case 'ms-rest':
      return 'msRest';
    case 'ms-rest-azure':
      return 'msRestAzure';
    default:
      return;
  }
};

exports.generateNewLine = function generateNewLine() {
  return this.generateCode('\r\n');
};

// parse the text blob and emit code from the AST.
exports.generateCode = function generateCode(text) {
  var ast = esprima.parse(text, { raw: true, tokens: true, range: true, comment: true });
  ast = escodegen.attachComments(ast, ast.comments, ast.tokens);

  var codegenOptions = {
    comment: true,
    format: {
      indent: {
        style: '  '
      },
      preserveBlankLines: true,
    },
    sourceCode: text
  };

  var code = escodegen.generate(ast, codegenOptions);
  return code;
};
