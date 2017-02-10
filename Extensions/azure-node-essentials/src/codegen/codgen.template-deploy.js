var codegenerator = require('./codegen');

const deployTemplateFunctionName = 'deployTemplate';

// Generates NodeJs code for arm template deployment.
exports.deployTemplate = function deployTemplate() {
  var text = `function ${deployTemplateFunctionName}(credentials, callback){\
      // TODO: initialize these variables
      var subscriptionId;\
      var resourceGroupName;\
      var deploymentName;\
      var templateFilePath;\
      var templateParametersFilePath;\
      var template;\
      var templateParameters;\
      var parameters = {\
        template: template,\
        parameters: templateParameters,\
        mode: \'Complete\'\
      };\
      \r\n
      try {\
        template = JSON.parse(fs.readFileSync(templateFilePath));\
        templateParameters = JSON.parse(fs.readFileSync(templateParametersFilePath));\
      } catch (error) {\
        console.error('Encountered error parsing template file:', error);\
      }\
      \r\n
      var resourceClient = new ResourceManagement.ResourceManagementClient(credentials, subscriptionId);\
      resourceClient.deployments.createOrUpdate(resourceGroupName, deploymentName, parameters, callback);\
    }`;

  return codegenerator.generateCode(text);
};

exports.generateRequireStatements = function generateRequireStatements(document) {
  const requiredModules = ['fs', 'azure-arm-resource', 'ms-rest', 'ms-rest-azure'];
  return codegenerator.generateRequireStatements(document, requiredModules);
};

exports.deployTemplateCallSite = function deployTemplateCallSite() {
  var text = `${deployTemplateFunctionName}(credentials, function(err, result){ });`;
  return codegenerator.generateCode(text);
};

exports.getPackageDependencies = function getPackageDependencies() {
  return ['azure-arm-resource', 'ms-rest', 'ms-rest-azure'];
}
