Test Configuration Instructions
================================

In Live Mode
------------

WARNING: When running this test in live mode, it takes a long time, as waiting is built in to accommodate the length of time
it takes to start up the machines and perform operations on them. This waiting is not done in replay mode.
Expect this suite to take around 10 minutes when run in live mode (and when run exclusive of the other test suites).

Note, if you wish to run this test suite exclusive of the other client tests, the environment variables AZURE_SUBSCRIPTION_ID, CLIENT_ID and APPLICATION_SECRET will need to
be set regardless. However they can be set to any random values, as they will not actually be tested.

In order to test (and record) against a specific Batch Account, set the following variables:
AZURE_BATCH_ACCOUNT (just the account name)
AZURE_BATCH_ACCOUNT_KEY (shared auth key)
AZURE_BATCH_ENDPOINT (full account url)
NOCK_OFF=true
   

In Capture Mode
---------------

- The same auth configuration as above.
- set NOCK_OFF to <blank>
- set AZURE_NOCK_RECORD to true
- When in capture mode, the recording configuration (account, key, url),
  should be automatically updated in records/batchService/suite.batchservice-tests.nock.js


In Replay Mode
---------------

- set NOCK_OFF to <blank>
- set AZURE_NOCK_RECORD to <blank>
