const fs = require('fs-extra');
const path = require('path');

const msRestInstallPath = path.join(__dirname, '../node_modules/ms-rest');
const msRestRuntimePath = path.join(__dirname, '../runtime/ms-rest');

const msRestAzureInstallPath = path.join(__dirname, '../node_modules/ms-rest-azure');
const msRestAzureRuntimePath = path.join(__dirname, '../runtime/ms-rest-azure');

const filterFunc = (src, dest) => {
  return src.match(/.*node_modules.*/i) === null;
}

fs.remove(msRestInstallPath, err => {
  if (err) return console.error(err)
  fs.copy(msRestRuntimePath, msRestInstallPath, { filter: filterFunc }, err => {
    if (err) return console.error(err);
  });
});

fs.remove(msRestAzureInstallPath, err => {
  if (err) return console.error(err)
  fs.copy(msRestAzureRuntimePath, msRestAzureInstallPath, { filter: filterFunc }, err => {
    if (err) return console.error(err);
  });
});
