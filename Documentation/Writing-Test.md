#### Where to put a test in the repository

- **ASM** mode:
  -  Test file should be put here - "/test/commands/"
  -  Add a reference to the testfile in "/test/testlist.txt"
- **ARM** mode:
  - Test file should be put here - "/test/commands/arm/{category-of-the-command}"
    - For example: All the tests related to the group category ```azure group -h" were put here "/test/commands/arm/group"
  - Add a  reference to the testfile in "/test/testlist**arm**.txt"

#### Structure of a test
A sample test to explain the test structure. Please pay close attention to the comments in the following test snippet.

```javascript
'use strict';
//"should.js" (http://unitjs.com/guide/should-js.html) is used for asserting the outcomes.
var should = require('should');

//"/test/framework/arm-cli-test.js" is the suite used for writing tests in "ARM" mode.
//"/test/framework/cli-test.js" is the suite used for writing tests in "ASM" mode.
var CLITest = require('../../../framework/arm-cli-test');

//Always provide a testPrefix. This would be the name of the directory
//in which the test recordings would be stored for playback purposes
//for example: "/test/recordings/arm-cli-location-tests/*"
var testprefix = 'arm-cli-location-tests';

var sitename;
var createdSites = [];

//List of requiredEnvironment variables for this test. If the envt. variable is not set 
//and a default value is provided then it will be used in the test, else the test will 
//throw an error letting the user know the list of required envt variables that need to be set.
var requiredEnvironment = [
  { name: 'AZURE_SITE_TEST_LOCATION', defaultValue: 'East US'},
  'AZURE_STORAGE_ACCESS_KEY'
];

//We are using a poplular javascript testing framework named "mocha" (http://mochajs.org/) for writing tests.
//As per mocha, describe() defines a "test-suite" and it() defines a "test" in a test-suite.
describe('arm', function () {
  describe('location', function () {
    var suite;
    //before is executed once at the start of the this test-suite.
    before(function (done) {
      suite = new CLITest(testprefix, requiredEnvironment);
      //setupSuite is a hook provided for the developer to perform steps that 
      //need to be performed once before the first test gets executed.
      //A. If nothing needs to be performed then setupSuite() needs to be called as follows:
      suite.setupSuite(done);
      
      //B. Let us assume that a new site needs to be created once, that will be used by every test. 
      //Then we shall do something like this:
      suite.setupSuite(function () {
        
        //During RECORD mode, generateId will write the random test id to the recording file.
        //This id will be read from the file during PLAYBACK mode
        sitename = suite.generateId(
          "test-site" /*some good site prefix for you to identify the sites created by your test*/, 
          createdSites /*An array to maintain the list of created sites. 
                       This is useful to delete the list of created sites in teardown*/ );
        
        suite.execute("site create --location %s %s --json" /*Azure command to execute*/, 
              process.env.AZURE_SITE_TEST_LOCATION, 
              sitename, 
              function (result) {
          //test to verify the successful execution of the command
          result.exitStatus.should.equal(0);
          //done is an important callback that signals mocha that the current phase in the 
          //test is complete and the mocha runner should move to the next phase in the test 
          done();
        });
      });
    });
    
    //after is execute once at the end of this test-suite
    after(function (done) {
      //teardownSuite is a hook provided for the developer to perform steps that 
      //need to be performed once after the execution of the entire test-suite is complete.
      //A. If nothing needs to be performed then setupSuite() needs to be called as follows:
      suite.teardownSuite(done);
      
      //B. The created artifacts in setupSuite() need to be deleted, so that the suite leaves the 
      //environment in a consistent state.
      //Then we shall do something like this:
      suite.teardownSuite(function () {
        //delete all the artifacts that were created during setup
        createdSites.forEach(function (item) {
          suite.execute('site delete %s -q --json', item, function (result) {
            result.exitStatus.should.equal(0);
          });
        });
        done();
      });
    });

    //beforeEach is executed everytime before the test starts
    beforeEach(function (done) {
      //setupTest is a hook provided for the developer to perform steps that 
      //need to be performed before every test
      //Mechanism to add custom steps for setupTest() is the same that is explained above in setupSuite()
      suite.setupTest(done);
    });
    
    //afterEach is executed everytime after the test execution is complete,
    //irrespective of success or failure
    afterEach(function (done) {
      //teardownTest is a hook provided for the developer to perform steps that 
      //need to performed after every test
      //Mechanism to add custom steps for teardownTest() is the same that is explained above in teardownSuite()
      suite.teardownTest(done);
    });

    describe('list', function () {
      //positive test
      it('should work', function (done /*Always provide the done callback as a parameter*/) {
        //execute the command
        //It is very important to use the --json switch as it becomes easy to parse the output.
        suite.execute('location list --json', function (result) {
        //check for zero exit code if you are expecting a success or 1 if you are expecting a failure
          result.exitStatus.should.equal(0);
          //parse the expected output from the text property of the result
          var allResources = JSON.parse(result.text);
          allResources.some(function (res) {
            return res.name.match(/Microsoft.Sql\/servers/gi);
          }).should.be.true;
          //do not forget the done() callback.
          done();
        });
      });
      
      //negative test
      it('should fail when an invalid resource group is provided', function (done /*Always provide the done callback as a parameter*/) {
        suite.execute('group log show -n %s --json', 'random_group_name', function (result) {
          result.exitStatus.should.equal(1);
          //errorText property of result will contain the expected error message. Doing a Regex match 
          //is always the best option, as one need not change the test if there is a minor modification
          //in the error message from the server side.
          result.errorText.should.match(/.*Resource group \'random_group_name\' could not be found.*/ig);
          //do not forget the done() callback.
          done();
        });
      });
    });
  });
});
```

#### Test Recording Structure

Steps to set the **RECORD** mode and selective test recording can be found [here](./TestModes.md).

- **Suite**
  - There is a **"suite-*"** recording file for the test file.
  - Ids of the artifacts generated during setupSuite() are recorded in this file and retrieved during playback
  - Test Recording is **not done** during setupSuite() and teardownSuite(). Random ids generated for the created artifacts during this phase, are stored in the suite recording file and are retrieved during playback.
- **Test**
  - Every test is recorded in a separate file. This makes it easier to re-record selective tests due to failures or server side changes.
    - **Note** If the test is using an artifact, created during **setupSuite()** then all the tests in that suite will have to be re-recorded
