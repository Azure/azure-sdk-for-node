# Regenerating Code

- Please execute `npm install` locally from the root of the cloned repo (This will install gulp locally for the repo).
- Please install gulp globally `npm install gulp -g`
- If you need the latest version of Autorest, then it needs to be specified in [gulpfile.js](https://github.com/Azure/azure-sdk-for-node/blob/master/gulpfile.js#L117)
  * Determining latest Autorest version
    * A beta version is published every night to a myget feed . Hence, set the autoRestVersion to yesterday's date. Always increment the version of Autorest by 1 from the publicly available version on [nuget](http://www.nuget.org/packages/AutoRest/). While this doc is being written the publicly available version is 0.14.0
    * ```var autoRestVersion=0.15.0-Nightly20160219```
- Make sure you have updated the [mappings object](https://github.com/Azure/azure-sdk-for-node/blob/master/gulpfile.js#L9) correctly for generating the source code for your service
- To list all the tasks execute `gulp -T` from the root of the repo
- Regenertion command options
  - If you want to regenerate all the services then execute `gulp codegen`
  - If you want to generate for your project then execute `gulp codegen --project <your project name a.k.a the key of the mappings object>`
  - If you want to use a local file then save the file locally say "D:\sdk" and make sure to have the same path as defined in the source of your project in the mappings object. Execute `gulp codegen --spec-root "D:\sdk" --project <your-project-name>`.
- If generation is successful then you will see the generated code in the lib folder under `lib/services/<YourServiceName>`
- Make sure you have License.txt (MIT), README.md and package.json file. Take a look at [StorageManagement2](https://github.com/Azure/azure-sdk-for-node/tree/master/lib/services/storageManagement2) as an example.
- **Please make sure to have accurate examples in README.md as that is what customers will see when they search for your client libraries on [npm](https://npmjs.com).**
- Please make sure that the version in your service's package.json is also reflected in the rollup package.json (i.e. azure-sdk-for-node/package.json)
- If you are adding a brand new client library or adding a new client to your library then please make sure that a function to create a client for your service is exported in the rollup azure file (azure-sdk-for-node/lib/azure.js). You can take a look at an exported function as an example over [here](https://github.com/Azure/azure-sdk-for-node/blob/master/lib/azure.js#L1640).

## Publishing to npm
- Once your PR is merged into the master branch, you can publish your package to npm by following the instructions in "step 6" over [here](https://github.com/Azure/adx-documentation-pr/blob/master/clis/azure-cli/guide.md#swagger-specs---using-autorest----node-sdk--------azure-cli)
