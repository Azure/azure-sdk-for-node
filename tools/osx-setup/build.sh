#!/bin/sh
# Windows Azure OS X Package: Create packages script
# Copyright (C) 2012 Microsoft Corporation. All Rights Reserved.
#
# This builds the package as well as prepares the tarball file, etc.
# This script is only used at build time, it is not part of the package.
# 

CURRENT_NODE_DISTRIBUTION_VERSION=v0.6.17

# Check for Apple's PackageMaker
# ------------------------------
if [ ! -f /Applications/Utilities/PackageMaker.app/Contents/MacOS/PackageMaker ]; then
	echo PackageMaker needs to be installed in the Utilies folder on your Mac.
	echo If you do not yet have PackageMaker, please download it from the Apple Dev Center.
	echo 
	echo If you need to download it:
	echo open http://adcdownload.apple.com/Developer_Tools/auxiliary_tools_for_xcode__february_2012/auxiliary_tools_for_xcode.dmg
	echo
	echo If you already have it, just drag it into the Utilities folder since this is hard-coded in the script.
	echo 
	exit 1
fi

# Node.js validation
# ------------------
if [ ! -f /usr/local/bin/node ]; then
	echo Node.js is not installed on this machine.
	echo Please download and install it from http://nodejs.org/
	open http://nodejs.org/
	exit 1
fi

export NODE_VERSION=`/usr/local/bin/node -v`
echo The current Node.js version we are shipping is $CURRENT_NODE_DISTRIBUTION_VERSION

if [ ! "$NODE_VERSION" = "$CURRENT_NODE_DISTRIBUTION_VERSION" ]; then
	echo Your Node.js version $NODE_VERSION does not match the version to distribute.
	echo Aborting package preparation.
	exit 1
fi

# Ensure that all modules are present
# -----------------------------------
pushd ../../
echo Running npm update to make sure that all modules are present locally...
npm update
popd

# Tarball creation
# ----------------
scripts/createTarball.sh

# Node.js binary
# --------------

# Copy the OS node into our local out folder for packaging
cp /usr/local/bin/node out/
echo Copied your local Node.js binary version $NODE_VERSION into the output folder

# OS X Package creation
# ---------------------
echo Building "Windows Azure SDK.pkg"
/Applications/Utilities/PackageMaker.app/Contents/MacOS/PackageMaker --doc sdk.pmdoc --out "./out/Windows Azure SDK.pkg"

echo 
echo The package has been built and can be found in the ./out/ folder.

open ./out
