## Environment Variables Setup

From an admin cmd console/terminal, at the root directory of your cloned repo, run the following for environment setup:
* **Windows**
```
set AZURE_SUBSCRIPTION_ID=<A Guid>
set CLIENT_ID=<A Guid>
set DOMAIN=<A Guid or the domain name of your org> contosoCorp.com
set USERNAME=<Your org-id user name> user@contosoCorp.com
set PASSWORD=<Your Password>
set NOCK_OFF=true
set AZURE_NOCK_RECORD=
```

* **OS X**, **Linux**
```
export AZURE_SUBSCRIPTION_ID=<A Guid>
export CLIENT_ID=<A Guid>
export DOMAIN=<A Guid or the domain name of your org> contosoCorp.com
export USERNAME=<Your org-id user name> user@contosoCorp.com
export PASSWORD=<Your Password>
export NOCK_OFF=true
export AZURE_NOCK_RECORD=
```

#### Note: Not all tests require all these environment variables, and if a required one is not set the test will fail and tell you which ones need to be set.
