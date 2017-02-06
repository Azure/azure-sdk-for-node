# Authentication

All service APIs require authentication via a `credentials` object when being
instantiated. There are three ways of authenticating and creating the required
`credentials` via the SDK: basic authentication, interactive login, and service
principal authentication.

## Basic Authentication

Simply provide your username and password to authenticate with the API using your
Azure account. It is encouraged that your username and password be stored in
environment variables rather than in the source code for your project.

```js
const Azure = require('azure');
const MsRest = require('ms-rest-azure');

MsRest.loginWithUsernamePassword(process.env.AZURE_USER, process.env.AZURE_PASS, (err, credentials) => {
  if (err) throw err;

  let storageClient = Azure.createARMStorageManagementClient(credentials, 'subscription-id');

  // ..use the client instance to manage service resources.
});
```

## Interactive login

Interactive login will provide a link and a code that will allow the user to
authenticate from a browser. Use this method when multiple accounts are used by
the same script or when user intervention is preferred.

```js
const Azure = require('azure');
const MsRest = require('ms-rest-azure');

MsRest.interactiveLogin((err, credentials) => {
  if (err) throw err;

  let storageClient = Azure.createARMStorageManagementClient(credentials, 'subscription-id');

  // ..use the client instance to manage service resources.
});
```

## Service Principal Authentication

Interactive login, similar to how the CLI authenticates, is the easiest way to
authenticate; however, when using the Node.js SDK programmatically, you will need
to use service principal authentication. This essentially creates keys for your
Azure Active Directory account that you can provide to the SDK to authenticate
rather than requiring user intervention or username/password.

### Creating a Service Principal

There are two ways to create a Service Principal, the next sections will walk you
through each method.

#### 1. Azure Portal

Follow the steps outlined in the
[Azure Portal documentation](https://azure.microsoft.com/en-us/documentation/articles/resource-group-create-service-principal-portal/)
 to generate the necessary keys.

#### 2. Azure CLI

This method can be used with either the
[Azure Cross-Platform CLI (npm module)](https://github.com/Azure/azure-xplat-cli)
or the
[Azure CLI v2.0 (Python)](https://github.com/Azure/azure-cli).

_Using the Node.js cross-platform CLI_
```shell
$ azure login # or $ azure login -u user@domain.tld
$ azure ad sp create -n sp-name -p sp-password
```

This will create a new Service Principal and output the keys, copy the output for
use in your script. Note: you can retrieve the keys later by running
`$ azure ad sp list` in your terminal.

The important fields are marked below (the other required field is the password
that was provided when creating the service principal)

```shell
+ Creating application sp-name
+ Creating service principal for application **56894bd4-0fde-41d8-a0d7-5bsslccety2**
data:    Object Id:               weewrerer-e329-4e9b-98c6-7878787
data:    Display Name:            sp-name
data:    Service Principal Names:
data:                             **56894bd4-0fde-41d8-a0d7-5bsslccety2**
data:                             https://sp-name
info:    ad sp create command OK
```

_using the Python Azure CLI v2.0_
```shell
$ az ad sp create-for-rbac
```

Now you can use the Service Principal keys to authenticate in the SDK.

```js
const Azure = require('azure');
const MsRest = require('ms-rest-azure');

MsRest.loginWithServicePrincipalSecret(
  'clientId or appId',
  'secret or password',
  'domain or tenant',
  (err, credentials) => {
    if (err) throw err

    let storageClient = Azure.createARMStorageManagementClient(credentials, 'subscription-id');

    // ..use the client instance to manage service resources.
  }
);
```
