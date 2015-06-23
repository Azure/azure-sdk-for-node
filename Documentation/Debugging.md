Different ways to debug azure-sdk-for-node

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
* Assuming this is being executing in the cmd prompt from the root directory of the cloned repo "azure-sdk-for-node/"
  *   ```node-debug some-test-script-that-calls-your-service.js```
* A browser (Chrome/Opera) should pop up, or it can be manually browsed at this url - http://127.0.0.1:8080/debug?port=5858
* Now breakpoints can be set at desired location.
* It may happen that files with extension "._js" are not seen initially in the left pane. Please set a break point anywhere in lib\azure.js and keep on pressing "F10". After some time, files with extension "_.js" can be seen. Breakpoints can now be set at desired line in "*._js" file.

### For debugging tests:
Please follow the below mentioned steps for the debugger to accept breakpoints set in your test file:
* In the file azure-sdk-for-node/scripts/unit.js
```
modify the last line 
from  - require('../node_modules/mocha/bin/mocha');
to    - require('../node_modules/mocha/bin/_mocha');
```
* set a breakpoint at runTest() method of mocha's runner.
In the file "azure-sdk-for-node\node_modules\mocha\lib\runner.js" in the "runTest()" method around Line 378.
  * **Note**: "node_modules" directory is not a part of "azure-sdk-for-node" repository.  If the **"node_modules"** directory or the **"mocha"** directory inside **"node_modules"** directory is not present, then ```npm install``` needs to be executed from the root directory of the cloned "azure-sdk-for-node" repo.
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
* Set a breakpoint in your test which should be located under "azure-sdk-for-node/test/commands" directory


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

### For debugging the service:
  * Create a sample.js file that instantiates the service client you intend to debug.
  * Right Click the "azure-sdk-for-node\sample.js" file and set it as Node.js startup file.
  * Set breakpoints at desired locations and Press F5 for happy debugging
  * At times, files with extension "._js" do not hit the breakpoint. It is flaky and nothing can be done about it. At such times, console.log() is your best buddy :+1:

### For debugging the tests:
  * From the menu bar go to Project --> Properties and set the environment variables required for running tests.
    * The list of environment variables can be found over [here](./EnvironmentVariables.md)
    * If the need arises to add a new environment variable for tests please update the [Documentation](EnvironmentVariables.md) to keep the list current
    * Visual Studio can also be opened from **"Visual Studio Debugger Cmd Prompt"** usually located at "C:\Program Files (x86)\Microsoft Visual Studio 12.0\Common7\Tools\Shortcuts\Developer Command Prompt for VS2013.lnk" to set the environment variables. Then open the .sln file from the prompt.
  * In the Solution Explorer, click on a test that needs to be debugged. For example: "azure-sdk-for-node\test\services\sql\sqlmanagementservice-tests.js"
  * In the **Properties** pane select **"Mocha"** as the Test Framework. Save All the changes. 
  * The tests shall be seen in the "Test Explorer". Right Click on any Test and Select "Debug Selected Test".
