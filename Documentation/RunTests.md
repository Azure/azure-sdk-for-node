## Running Xplat CLI Tests

#### Pre-requisite

* [Setup Environment Variables](./EnvironmentVariables.md)
* [Authentication and Account setup](./Authentication.md)

#### Run Tests
* Running tests for both the modes: ARM, ASM
This will execute all the tests mentioned in tests/testlist.txt and tests/testlistarm.txt
```
npm test
```

* Running **ASM** tests:
This will execute all the tests mentioned in tests/testlist.txt
```
npm -s run-script unit
```

* Running **ARM** tests:
This will execute all the tests mentioned in tests/testlistarm.txt
```
npm -s run-script unit-arm
```

#### Test Logs
Logs for each test run can be found in a time stamped .lof file under the **"/test/output/"** directory.
For example - **"/test/output/test_log_2015_3_25_14_14_26.log"**
