::
:: Microsoft Azure SDK for Node - Generate library code
:: Copyright (C) Microsoft Corporation. All Rights Reserved.
::

@echo off
set autoRestVersion=0.16.0-Nightly20160428
if  "%1" == "" (
    set specFile="https://raw.githubusercontent.com/fearthecowboy/azure-rest-api-specs/master/arm-servermanagement/2015-07-01-preview/servermanagement.json"
) else (
    set specFile="%1"
)
set repoRoot=%~dp0..\..\..\
set generateFolder=%~dp0lib

if exist %generateFolder% rd /S /Q  %generateFolder%
call "%repoRoot%\tools\autorest.gen.cmd" %specFile% Microsoft.Azure.Management.ServerManagement %autoRestVersion% %generateFolder% "-FT 2"