## Environment Variables Setup

From an admin cmd console/terminal, at the root directory of your cloned repo, run the following for environment setup:
* **Windows**
```
set AZURE_GITHUB_PASSWORD=github password/access token
set AZURE_GITHUB_REPOSITORY=username/reponame
set AZURE_GITHUB_USERNAME=github_username
set AZURE_GIT_USERNAME=git_username
set AZURE_ARM_TEST_STORAGEACCOUNT=storage_account_name_created_in_the_subscription
set AZURE_ARM_TEST_LOCATION=South Central US
set AZURE_STORAGE_TEST_LOCATION=West US
set AZURE_STORAGE_ACCESS_KEY=access-key_of_the_storage_account
set AZURE_STORAGE_ACCOUNT=storage_account_name_created_in_the_subscription
set AZURE_SITE_TEST_LOCATION=West US
set AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=storage_account;AccountKey=access_key
set AZURE_SCM_SITE_SUFFIX=.scm.azurewebsites.net
set AZURE_AD_TEST_PASSWORD=your_password
```

* **OS X**, **Linux**
```
export AZURE_GIT_USERNAME=git_username
export AZURE_GITHUB_PASSWORD=github password/access token
export AZURE_GITHUB_REPOSITORY=username/reponame
export AZURE_GITHUB_USERNAME=github_username
export AZURE_ARM_TEST_STORAGEACCOUNT=storage_account_name_created_in_the_subscription
export AZURE_ARM_TEST_LOCATION="South Central US"
export AZURE_STORAGE_TEST_LOCATION="West US"
export AZURE_STORAGE_ACCESS_KEY=access-key_of_the_storage_account
export AZURE_STORAGE_ACCOUNT=storage_account_name_created_in_the_subscription
export AZURE_SITE_TEST_LOCATION="West US"
export AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=storage_account;AccountKey=access_key
export AZURE_SCM_SITE_SUFFIX=.scm.azurewebsites.net
export AZURE_AD_TEST_PASSWORD=your_password
```

### Running VM Tests
Following environment variables need to be set for running vm tests:
* **Windows**
```
set AZURE_COMMUNITY_IMAGE_ID=vmdepot-40432-1-1 (Select any Image ID from deployment script of any image selected from https://vmdepot.msopentech.com)
set AZURE_STORAGE_ACCESS_KEY=storage account access key
set AZURE_STORAGE_ACCOUNT=storage account name
set BLOB_SOURCE_PATH=path to the disk in a blob
set SSHCERT=path to the pem file
```

* **OS X**, **Linux**
```
export AZURE_COMMUNITY_IMAGE_ID=vmdepot-40432-1-1 (Select any Image ID from deployment script of any image selected from https://vmdepot.msopentech.com)
export AZURE_STORAGE_ACCESS_KEY=storage account access key
export AZURE_STORAGE_ACCOUNT=storage account name
export BLOB_SOURCE_PATH=path to the disk in a blob
export SSHCERT=path to the pem file
```

#### Note: Not all tests require all these environment variables, and if a required one is not set the test will fail and tell you which ones need to be set.