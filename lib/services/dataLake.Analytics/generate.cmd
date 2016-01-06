::
:: Microsoft Azure SDK for Node - Generate library code
:: Copyright (C) Microsoft Corporation. All Rights Reserved.
::

@echo off

call "generateAccount.cmd"
call "generateJob.cmd"
call "generateCatalog.cmd"

:: TODO: This should be removed once all the manual fixes are part of the generation functionality.
:: Current manual fix up list:
::  Fix the dynamic host parameters (accountname and datalakejob and catalog service uri)
set repoRoot=%~dp0..\..\..\
call "powershell.exe" -Command "& %repoRoot%\tools\Fix-AdlGeneratedCode.ps1 -DataLakeAnalytics"