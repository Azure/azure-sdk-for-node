::
:: Microsoft Azure SDK for Node - Generate library code
:: Copyright (C) Microsoft Corporation. All Rights Reserved.
::

@echo off
set autoRestVersion=0.14.0-Nightly20160125
if  "%1" == "" (
    set specFile="https://raw.githubusercontent.com/begoldsm/azure-rest-api-specs/master/arm-datalake-store/filesystem/2015-10-01-preview/swagger/filesystem.json"
) else (
    set specFile="%1"
)
set repoRoot=%~dp0..\..\..\
set generateFolder=%~dp0lib\filesystem

if exist %generateFolder% rd /S /Q  %generateFolder%
call "%repoRoot%\tools\autorest.gen.cmd" %specFile% Microsoft.Azure.Management.DataLake.Store %autoRestVersion% %generateFolder%