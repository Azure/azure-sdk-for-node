# Contributing

## Setup

Clone the repository:
```
git clone https://github.com/Azure/azure-sdk-for-node azure-sdk-for-node
```

Navigate to the cloned directory

Install local dependencies:
```
npm install
```

## Build:

lib/services/powerbiembedded/lib is auto generated code. nothing to build.

## Generate code based on swagger:

Run generate.bat and see changes in lib/services/powerbiembedded/lib.
```
generate.bat
```

## Before running tests

```
npm install jshint -g
```

## Test

Tests should run from root of azure-sdk-for-node.
Navigate to root and run the following commands:
```
npm install
npm test
```

## Run Power BI tests only

Tests should run from root. Before running tests, you should edit testList file to contain Power BI tests only (don't check-in)
```
rem modify test\testlist.txt file to contain Power BI tests only.
npm test
npm -s run-script jshint && npm -s run-script unit
```
