Different ways to debug azure-xplat-cli commands

## Pre-requisites
Ensure following things have been done, before debugging the commands or tests:
* **Authentication**

```
* ARM Mode
    azure login -u $username (organizational account) -p $password (token based)

* ASM Mode
    azure login -u $username (organizational account) -p $password (token based)    
         OR
    azure account import $path-to-publish-settings-file (Cert based)
```

* **Setting the subscription**
```
* List all the subscriptions
    azure account list
* Set the subscription of your choice
   azure account set "$Subscription Name"
```

## Using the -vv option 
This provides the underlying REST requests that take place upon executing the xplat cli command. It provides more insight into the actual REST request where the error happens. 

For example: 
```
D:\sdk\xplat\azure-sdk-tools-xplat>azure site delete foozap1 -vv
info:    Executing command site delete
verbose: Attempting to locate site  foozap1
verbose: Getting locations
silly:   Providers to register via registerResourceNamespace:
silly:   requestOptions
silly:   {
silly:       rawResponse: false,
silly:       queryString: {},
silly:       method: 'GET',
silly:       headers: { user-agent: 'WindowsAzureXplatCLI/0.8.16', x-ms-version: '2014-04-01' },
silly:       url: 'https://management.core.windows.net/06b24a43-b85a-c7t7-bd74-82f3429d998c/services/WebSpaces'
silly:   }
silly:   returnObject
silly:   {
silly:       statusCode: 200,
silly:       header: {
silly:           content-type: 'application/xml; charset=utf-8',
silly:           strict-transport-security: 'max-age=31536000; includeSubDomains',
silly:           content-length: '114',
silly:           x-ms-servedbyregion: 'ussouth2',
silly:           x-aspnet-version: '4.0.30319',
silly:           cache-control: 'private',
silly:           date: 'Wed, 18 Mar 2015 23:44:03 GMT',
silly:           x-powered-by: 'ASP.NET',
silly:           x-ms-request-id: 'c4fc8f157c76847fsda2f56732ce77a3',
silly:           server: '1.0.6198.202 (rd_rdfe_stable.150307-1902) Microsoft-HTTPAPI/2.0'
silly:       },
silly:       body: '<WebSpaces xmlns="http://schemas.microsoft.com/windowsazure" xmlns:i="http://www.w3.org/2001/XMLSchema-instance"/>'
silly:   }
verbose: Getting sites
verbose: []
error:   Unable to locate site named foozap1
silly:   {
silly:       arguments: undefined,
silly:       type: undefined,
silly:       message: 'Unable to locate site named foozap1',
silly:       __frame: {
silly:           name: 'lookupSiteNameAndWebSpace__20',
silly:           line: 871,
silly:           file: 'C:\\Program Files (x86)\\Microsoft SDKs\\Azure\\CLI\\lib\\commands\\asm\\websites\\websitesclient.js',
silly:           prev: {
silly:               name: '__8',
silly:               line: 661,
silly:               file: 'C:\\Program Files (x86)\\Microsoft SDKs\\Azure\\CLI\\lib\\commands\\asm\\site.js',
silly:               prev: undefined,
silly:               calls: 1,
silly:               active: false,
silly:               offset: 14,
silly:               col: 15
silly:           },
silly:           calls: 2,
silly:           active: false,
silly:           offset: 12,
silly:           col: 9
silly:       },
silly:       rawStack: 'Error: Unable to locate site named foozap1
info:    Error information has been recorded to C:\Users\amzavery\.azure\azure.err
verbose: Error: Unable to locate site named foozap1
```

## Using console.log()
This is always handy and is guaranteed to work.
It is a good practice to use util.inspect() to dump well formatted objects.
In your script:
```
var util = require('util');
. . .
console.log(">>>>>>>>>>>>>> Some Identifier   " + util.inspect(some_object, {depth: null}));
. . .
```
Providing **{depth: null}** is optional. By default, it will dump object upto 3 levels deep. Setting depth  to null will dump the complete object.

##  Using node inspector
This will open a debugging session in a browser (chrome or opera). It is super easy to use.
Steps to get it working:

* ```npm install -g node-inspector```
* Assuming this is being executing in the cmd prompt from the root directory of the cloned repo "azure-xplat-cli/"
  *   ```node-debug bin\azure group create -l "West US" testgroup1```
* A browser (Chrome/Opera) should pop up, or it can be manually browsed at this url - http://127.0.0.1:8080/debug?port=5858
* Now breakpoints can be set at desired location.
* It may happen that files with extension "._js" are not seen initially in the left pane. Please set a break point anywhere in lib\cli.js and keep on pressing "F10". After some time, files with extension "_.js" can be seen. Breakpoints can now be set at desired line in "*._js" file.
* A breakpoint can also be set in the underlying azure-sdk-for-node which has the management clients making the REST calls to the server. 
These can be seen inside the directories starting with name "azure" or "azure-*" inside the node_modules directory. 
(node_modules will be present after executing ```npm install``` from the root directory "azure-xplat-cli" of the cloned repo.)

### For debugging tests:
Please follow the below mentioned steps for the debugger to accept breakpoints set in your test file:
* In the file azure-xplat-cli/scripts/unit.js
```
modify the last line 
from  - require('../node_modules/mocha/bin/mocha');
to    - require('../node_modules/mocha/bin/_mocha');
```
* set a breakpoint at runTest() method of mocha's runner.
In the file "azure-xplat-cli\node_modules\mocha\lib\runner.js" in the "runTest()" method around Line 378.
  * **Note**: "node_modules" directory is not a part of "azure-xplat-cli" repository.  If the **"node_modules"** directory or the **"mocha"** directory inside **"node_modules"** directory is not present, then ```npm install``` needs to be executed from the root directory of the cloned "azure-xplat-cli" repo.
```
Runner.prototype.runTest = function(fn){
  var test = this.test
    , self = this;

  if (this.asyncOnly) test.asyncOnly = true;

  try {
    test.on('error', function(err){
      self.fail(test, err);
    });
    test.run(fn); <<<<<<<<<<<<<<<<<<<<<<<-------- set a breakpoint here
  } catch (err) {
    fn(err);
  }
};
```
* Set a breakpoint in your test which should be located under "azure-xplat-cli/test/commands" directory


## Using Visual Studio
The Visual Studio plugin for node.js can be downloaded from [here](http://nodejstools.codeplex.com/).

### Setting up the project
* File --> New --> Project
* On the left pane Installed --> Templates --> Javascript --> Node.js
* From the available options Select "From Existing Node.js Code"
  * Provide a name to your project "xplat" and a name to the solution "xplat"
  * The location of the project would be the location of your cloned repo. Example - "D:\sdk\xplat\azure-sdk-tools-xplat"
* Next --> Enter the filter to include files: In the end append the following string "; *._js"
* Next --> Including node_modules in the project is optional. (It can always be include later, if the need arises).
* Next --> Location for the project file - "D:\sdk\xplat\azure-sdk-tools-xplat\xplat.njsproj" --> Finish
* In some time the solution explorer shows the source code files.
* For better performance, it is advisable to **disable** intellisense in VisualStudio for Node.js projects by going to
  * Tools --> Options --> TextEditor --> Node.js --> Intellisense -->No Intellisense.
* Set the Tab size and Indentation to 2 spaces by going to 
  * Tools --> Options --> TextEditor --> Node.js --> Tabs --> [Tab size: 2, Indent size: 2]
  * Tools --> Options --> TextEditor --> Javascript --> Tabs --> [Tab size: 2, Indent size: 2]

### For debugging the commands:
  * Right Click the "azure-xplat-cli\bin\azure.js" file and set it as Node.js startup file.
  * From the menu bar go to Project --> Properties
    * Script arguments should contain the command to execute - group list
    * Save the changes.
  * Set breakpoints at desired locations and Press F5 for happy debugging
  * At times, files with extension "._js" do not hit the breakpoint. It is flaky and nothing can be done about it. At such times, console.log() is your best buddy :+1:

### For debugging the tests:
  * From the menu bar go to Project --> Properties and set the environment variables required for running tests.
    * The list of environment variables can be found over [here](https://github.com/Azure/azure-xplat-cli/wiki/Setting-up-environment-variables-for-running-xplat-cli-tests)
    * If the need arises to add a new environment variable for tests please update the [wiki](https://github.com/Azure/azure-xplat-cli/wiki/Setting-up-environment-variables-for-running-xplat-cli-tests) to keep the list current
    * Visual Studio can also be opened from **"Visual Studio Debugger Cmd Prompt"** usually located at "C:\Program Files (x86)\Microsoft Visual Studio 12.0\Common7\Tools\Shortcuts\Developer Command Prompt for VS2013.lnk" to set the environment variables. Then open the .sln file from the prompt.
  * In the Solution Explorer, click on a test that needs to be debugged. For example: "azure-xplat-cli\test\commands\cli.account.affinitygroup-tests.js"
  * In the **Properties** pane select **"Mocha"** as the Test Framework. Save All the changes. 
  * The tests shall be seen in the "Test Explorer". Right Click on any Test and Select "Debug Selected Test".