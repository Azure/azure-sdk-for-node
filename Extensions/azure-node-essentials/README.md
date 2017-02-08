# Azure Node Essentials

This extension provides NodeJs tools for developers working with Azure SDKs.

## Feature List

1. Project and file scaffolding
1. Snippets for some common operations such as authentication, creating a service principal.
1. Code generation scenarios
   * generate code for template deployment

### Sample workflow

1. Open VS code with an empty workspace (no folder)
2. Bring up VS code command palette, invoke `yo`
3. Choose `azure-node` generator and invoke it.
4. Choose `* app` to invoke the main generator (the sub generators for files are listed at the root level)
5. Choose a Javascript project and proceed.
6. This should initialize your project and install npm dependencies
7. Meanwhile, open the folder in VSCode and navigate to index.js
8. Notice that package.json has been set up and index.js has boiler plate code for authentication.
9. Place caret on the line after `// TODO: Write your application logic here.`
9. From VS Code's command palette, invoke `>Azure-Node: Generate code for template deployment`
10. The extension generates code for template deployment.

## Dependencies

The following package/extension dependencies are auto installed when you install this extension.

1. [vscode yo](https://marketplace.visualstudio.com/items?itemName=samverschueren.yo)
1. [generator-azure-node](https://github.com/Azure/azure-sdk-for-node/tree/master/Extensions/generator-azure-node)
