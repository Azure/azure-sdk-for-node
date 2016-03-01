::
:: Microsoft Azure SDK for Node - Generate library code
:: Copyright (C) Microsoft Corporation. All Rights Reserved.
::

@echo off
set autoRestVersion=0.15.0-Nightly20160222
if  "%1" == "" (
    set specFile="https://raw.githubusercontent.com/begoldsm/azure-rest-api-specs/master/arm-datalake-store/account/2015-10-01-preview/swagger/account.json"
) else (
    set specFile="%1"
)
set repoRoot=%~dp0..\..\..\
set generateFolder=%~dp0lib\account

if exist %generateFolder% rd /S /Q  %generateFolder%
call "%repoRoot%\tools\autorest.gen.cmd" %specFile% Microsoft.Azure.Management.DataLake.Store %autoRestVersion% %generateFolder% 