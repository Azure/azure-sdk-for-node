::
:: Microsoft Azure SDK for Net - Generate library code
:: Copyright (C) Microsoft Corporation. All Rights Reserved.
::

@echo off
<<<<<<< HEAD
set autoRestVersion=0.14.0-Nightly20151216
=======
set autoRestVersion=0.13.0-Nightly20151211
>>>>>>> 30a173169a0a98fe37d62d27141e84970cc92961
if  "%1" == "" (
    set specFile="https://raw.githubusercontent.com/Azure/azure-rest-api-specs/master/arm-network/2015-06-15/swagger/network.json"
) else (
    set specFile="%1"
)
set repoRoot=%~dp0..\..\..\
set generateFolder=%~dp0lib

if exist %generateFolder% rd /S /Q  %generateFolder%
call "%repoRoot%\tools\autorest.gen.cmd" %specFile% Microsoft.Azure.Management.Network %autoRestVersion% %generateFolder% "-FT 1"
