## Environment Variables Setup

From an admin cmd console/terminal, at the root directory of your cloned repo, run the following for environment setup:
* **Windows**
```
set AZURE_SUBSCRIPTION_ID=<A Guid>
set CLIENT_ID=<A Guid> # Application Id provided by Azure Active Directory (SPN for service principal auth)
set DOMAIN=<A Guid or the domain name of your org> contosoCorp.com
set AZURE_USERNAME=<Your org-id user name> user@contosoCorp.com # Only set this if you are using user authentication
set AZURE_PASSWORD=<Your Password> # Only set this if you are using user authentication
set APPLICATION_SECRET=<Your service principal password or secret> # Only set this if you are using service principal auth
set NOCK_OFF=true
set AZURE_NOCK_RECORD=
```

* **OS X**, **Linux**
```
export AZURE_SUBSCRIPTION_ID=<A Guid>
export CLIENT_ID=<A Guid> # Application Id provided by Azure Active Directory (SPN for service principal auth)
export DOMAIN=<A Guid or the domain name of your org> contosoCorp.com
export AZURE_USERNAME=<Your org-id user name> user@contosoCorp.com # Only set this if you are using user authentication
export AZURE_PASSWORD=<Your Password> # Only set this if you are using user authentication
export APPLICATION_SECRET=<Your service principal password or secret> # Only set this if you are using service principal auth
export NOCK_OFF=true
export AZURE_NOCK_RECORD=
```

#### Note: Not all tests require all these environment variables, and if a required one is not set the test will fail and tell you which ones need to be set.
