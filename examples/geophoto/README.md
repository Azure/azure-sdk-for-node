# Azure Table Storage and Blob based Pushpin Application

This example allows you to create pins on the Bing Map with optional image upload for given pin. The pins data is stored using Table service, while the optional image is stored with Blog service.

## Installation

You will need:
- access keys to your Azure Storage account
- access key to your Bing Maps account

1) Make your own configuration `config.json`

Copy a `config.default.json` template configuration to new `config.json` and provide your own credentials both for Azure Storage and Bing Maps services.

```json
{
  "AZURE_STORAGE_ACCOUNT": "somestorageaccount",
  "AZURE_STORAGE_ACCESS_KEY": "somebase64encodedaccesskey",
  "BING_MAPS_CREDENTIALS": "somehashedbingmapsaccesskey"
}
```

2) Install dependencies:
```
npm install
```

The step 1) is optional, as example provides a `setup` action to allow you to enter required credentials, but example works best if you use preconfigured `config.json` file.

3) Run example:

```
node server.js
```
