var fs = require('fs');
var path = require('path');
var vscode = require('vscode');
var codegen = require('../codegen/codgen.template-deploy');
var jsonEditor = require('../codegen/jsoneditor');

exports.createCommand = function createCommand() {
  vscode.commands.registerCommand('Azure-Node.template-deploy', function () {

    if (!vscode.window.activeTextEditor) {
      vscode.window.showInformationMessage(`please open a .js file in the editor and then use this code generator command.`);
      return;
    }

    // update package.json
    updatePackageJson();

    // generate code in current document
    return generateCodeInEditor();
  });
};

function updatePackageJson() {
  // TODO: search rootDir\package.json
  var filePath = path.join(vscode.workspace.rootPath, 'package.json');

  if (fs.existsSync(filePath)) {
    var packages = codegen.getPackageDependencies();
    jsonEditor.addDependenciesIfRequired(filePath, packages);
  }
};

function generateCodeInEditor() {
  // generate code to be inserted.
  const document = vscode.window.activeTextEditor.document;
  const lineCount = document.lineCount;
  var importsAndLineNumber = codegen.generateRequireStatements(document);
  var methodBody = codegen.deployTemplate();
  var callsite = codegen.deployTemplateCallSite();

  vscode.window.activeTextEditor.edit((builder) => {
    // insert import statements.
    // Insertion point is the line where import group ends.
    if (importsAndLineNumber) {
      var importPos = new vscode.Position(importsAndLineNumber.line, 0);
      var imports = importsAndLineNumber.code;
      for (var importStatement of imports) {
        builder.insert(importPos, importStatement);
      }
    }

    // insert code for template deployment.
    const range = new vscode.Range(new vscode.Position(lineCount, 0), new vscode.Position(lineCount + 1, 0));
    builder.replace(range, methodBody);

    // fix callsite to invoke the function that was newly generated.
    const currentPos = new vscode.Position(vscode.window.activeTextEditor.selection.active.line, 0);
    builder.insert(currentPos, callsite);
  });

  // format the entire document.
  // the code we inserted was generated as well-formatted but indenting is relative to the existing text
  // in the document. Since we didn't examine existing text and are unaware of the indent depth where 
  // generated code will be inserted, we have to reformat the whole document. If this leads to performance issues, we'll revisit this logic.
  return vscode.commands.executeCommand("editor.action.formatDocument");
};
