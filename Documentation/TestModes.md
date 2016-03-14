## Test Modes

Tests can be executed in three different modes as follows:
For Windows use **set** and for OSX, Linux use **export**
* **LIVE**
Tests will be run against the Live Service, no recording happens
To run the tests in **LIVE** mode, set the following environment variable:
```
set NOCK_OFF=true 
```

* **RECORD**
Tests will be run against the Live Service and the HTTP traffic will be recorded to a file at "azure-xplat-cli/tests/recordings/{test-suite}/{full-test-title}.nock.js"
To run the tests in **RECORD** mode, set the following environment variable:
```
set NOCK_OFF=
set AZURE_NOCK_RECORD=true
```

* **PLAYBACK**
Tests will run against the previously recorded HTTP traffic, vs a Live Service. The Travis CI runs tests in this mode.
To run tests in **PLAYBACK** mode, unset the following environment variables:
```
set NOCK_OFF=
set AZURE_NOCK_RECORD=
```
The recordings will get saved in azure-xplat-cli/test/recordings/{test-suite} directory

## Partial recordings

#### Recording tests related to a specific service/feature
If you plan on adding some tests / features and do not need to regenerate the full set of test recordings, you can open the file: 
```
tests/testlist.txt (if you are writing tests for clients in asm mode)
tests/testlistarm.txt (if you are writing tests for clients in arm mode)
```
and comment out the tests you do not wish to run during the recording process.

To do so, use a leading \# character. i.e.:

\# services/resourceManagement/resourceManagementClient-tests.js <br />
\# services/resourceManagement/authorizationClient-tests.js <br />
services/storageManagement/storageManagementClient-tests.js <br />
\# services/resourceManagement/featureClient-tests.js <br />

In the above example only the storageManagementClient-tests.js tests would be run.

#### Recording a particular test in a suite

A test-file can have multiple suites and multiple tests within a suite.

* Skipping an entire suite, will not execute the entire suite. This can de achieved by using the "skip" keyword 
```js
describe.skip('list', function () {
  it('should work', function (done) {
    service.listGeoRegions(function (err, geoRegions) {
        should.exist(geoRegions);
        geoRegions.length.should.be.above(0);
        geoRegions[0].Name.should.not.be.null;
        done();
    });
  });

  it('should not work', function (done) {
   service.listGeoRegions(function (err, geoRegions) {
        should.exist(geoRegions);
        geoRegions.length.should.be.above(0);
        geoRegions[0].Name.should.not.be.null;
        done();
    });
  });
});
```
* Skipping a particular test in a suite. This can be achieved by passing null as the second argument to the test.
```js
describe('list', function () {
  //The first test will not be run as null is provided as the second argument to the test function.
  it('should work', null, function (done) {
    service.listGeoRegions(function (err, geoRegions) {
        should.exist(geoRegions);
        geoRegions.length.should.be.above(0);
        geoRegions[0].Name.should.not.be.null;

        done();
    });
  });
  
  it('should not work', function (done) {
    service.listGeoRegions(function (err, geoRegions) {
        should.exist(geoRegions);
        geoRegions.length.should.be.above(0);
        geoRegions[0].Name.should.not.be.null;
        done();
    });
  });
});
```
