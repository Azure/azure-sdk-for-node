var vscode = require('vscode');
var codegen = require('../codegen/codegen');

exports.createCommand = function createCommand() {
  vscode.commands.registerCommand('Azure-Node.template-deploy', function () {

    if (!vscode.window.activeTextEditor) {
      vscode.window.showInformationMessage(`please open a .js file in the editor and then use this code generator command.`);
      return;
    }

    // generate code to be inserted.
    var imports = codegen.importsForDeployTemplate();
    var code = codegen.deployTemplate();
    var callsite = codegen.deployTemplateCallSite();

    vscode.window.activeTextEditor.edit((builder) => {
      // insert import statements.
      var importPos = new vscode.Position(0, 0);
      for (var index = 0; index < imports.length; index++) {
        builder.insert(importPos, imports[index]);
      }

      // insert code for template deployment.
      const lineCount = vscode.window.activeTextEditor.document.lineCount;
      const range = new vscode.Range(new vscode.Position(lineCount, 0), new vscode.Position(lineCount + 1, 0));
      builder.replace(range, code);

      // fix callsite to invoke the function that was newly generated.
      const currentPos = new vscode.Position(vscode.window.activeTextEditor.selection.active.line, 0);
      builder.insert(currentPos, callsite);
    });

  });
};
