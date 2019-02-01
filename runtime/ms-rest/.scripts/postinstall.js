// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

const resetColor = "\x1b[0m";
const brightColor = "\x1b[1m";
const highlightColor = "\x1b[31m";

const customPackageMapping = {
    "azure-arm-sb": "@azure/arm-servicebus"
};

try {
    const packageConfig = require("../../../package.json");
    const packageName = packageConfig["name"];
    const typeScriptPackageName = customPackageMapping[packageName] || "@azure/" + packageName.replace("azure-", "");

    const firstLine = "This package will soon be deprecated.";
    const secondLine = `Please use ${highlightColor}${typeScriptPackageName}${resetColor}${brightColor} instead.`;
    const thirdLine = "Visit https://aka.ms/azure-sdk-for-js-migration for details.";

    const width = Math.max(firstLine.length, secondLine.length, thirdLine.length) + 4;

    const getPaddingLength = (str) => width - str.length - 4;

    const firstLinePaddingLength = getPaddingLength(firstLine);
    const secondLinePaddingLength = getPaddingLength(secondLine) + highlightColor.length + brightColor.length + resetColor.length;
    const thirdLinePaddingLength = getPaddingLength(thirdLine);
    const line = "#".repeat(width);

    const formatTextLine = (text, padding) => `# ${" ".repeat(Math.floor(padding / 2))}${text}${" ".repeat(Math.ceil(padding / 2))} #`;

    console.log(brightColor);
    console.log("\n" + line);
    console.log(formatTextLine(firstLine, firstLinePaddingLength));
    console.log(formatTextLine(secondLine, secondLinePaddingLength));
    console.log(formatTextLine(thirdLine, thirdLinePaddingLength));
    console.log(line + "\n");
    console.log(resetColor);
} catch (err) {
    // ignore
}
