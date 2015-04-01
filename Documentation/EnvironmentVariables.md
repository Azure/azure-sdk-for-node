## Environment Variables Setup

From an admin cmd console/terminal, at the root directory of your cloned repo, run the following for environment setup:
* **Windows**
```
set AZURE_APNS_CERTIFICATE_FILE=[path-to-your-certificatefile.pfx] 
set AZURE_APNS_CERTIFICATE_KEY=[your-certificate-key]
set AZURE_CERTIFICATE_FILE=[path-to-your-certificatefile.cer]
set AZURE_CERTIFICATE_KEY_FILE=[path-to-your-certificatefile.pfx]
set AZURE_MPNS_CERTIFICATE_FILE=[path-to-the.pfx]
set AZURE_MPNS_CERTIFICATE_KEY=[certificate-key]
set AZURE_SERVICEBUS_ACCESS_KEY=[your-access-key]
set AZURE_SERVICEBUS_ISSUER=owner 
set AZURE_SERVICEBUS_NAMESPACE=[your-servicebus-namespace]
set AZURE_STORAGE_ACCESS_KEY=[your-storage-account-access-key]
set AZURE_STORAGE_ACCOUNT=[your-storage-account-name]
set AZURE_SUBSCRIPTION_ID=[your-subscripotion-id {a guid}]
set AZURE_MANAGEMENT_HOST=management.core.windows.net
set AZURE_SQL_TEST_LOCATION=West US
set AZURE_STORAGE_DNS_SUFFIX=core.windows.net
set AZURE_SQL_DNS_SUFFIX=core.windows.net
set AZURE_WNS_PACKAGE_SID=package
set AZURE_WNS_SECRET_KEY=key
set AZURE_GCM_KEY=[your-GCMKey]
set NOCK_OFF=true 
```

* **OS X**, **Linux**
```
export AZURE_APNS_CERTIFICATE_FILE=[path-to-your-certificatefile.pfx] 
export AZURE_APNS_CERTIFICATE_KEY=[your-certificate-key]
export AZURE_CERTIFICATE_FILE=[path-to-your-certificatefile.cer]
export AZURE_CERTIFICATE_KEY_FILE=[path-to-your-certificatefile.pfx]
export AZURE_MPNS_CERTIFICATE_FILE=[path-to-the.pfx]
export AZURE_MPNS_CERTIFICATE_KEY=[certificate-key]
export AZURE_SERVICEBUS_ACCESS_KEY=[your-access-key]
export AZURE_SERVICEBUS_ISSUER=owner 
export AZURE_SERVICEBUS_NAMESPACE=[your-servicebus-namespace]
export AZURE_STORAGE_ACCESS_KEY=[your-storage-account-access-key]
export AZURE_STORAGE_ACCOUNT=[your-storage-account-name]
export AZURE_SUBSCRIPTION_ID=[your-subscripotion-id {a guid}]
export AZURE_MANAGEMENT_HOST=management.core.windows.net
export AZURE_SQL_TEST_LOCATION="West US"
export AZURE_STORAGE_DNS_SUFFIX=core.windows.net
export AZURE_SQL_DNS_SUFFIX=core.windows.net
export AZURE_WNS_PACKAGE_SID=package
export AZURE_WNS_SECRET_KEY=key
export AZURE_GCM_KEY=[your-GCMKey]
export NOCK_OFF=true 
```

#### Note: Not all tests require all these environment variables, and if a required one is not set the test will fail and tell you which ones need to be set.
