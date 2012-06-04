#!/bin/sh
# Windows Azure OS X Package: Tarball Creation Script #2
# Copyright (C) 2012 Microsoft Corporation. All Rights Reserved.
#
# This script prepares an 'archive' folder that contains the CLI 
# that is to be packaged in the Mac installer, as well as shipped
# to the Windows Azure site as a .tar.gz source package.
#
# This script is not packaged or bundled, but rather used when 
# building the package.
#

if [ ! -f ./scripts/azure ]; then
	echo Please run this from the osx folder: scripts/createLinuxTarball.sh
	exit 1
fi

if [ ! -d ./out ]; then
	mkdir ./out
fi

if [ ! -d ./out/linux ]; then
	mkdir ./out/linux
fi

# Remove old files
if [ -f ./out/linux/azure.tar.gz ]; then
	rm ./out/linux/azure.tar.gz
	echo Removing old Azure tar.gz file
fi

# Create a place to store this staging work.
if [ -d /tmp/ait ]; then
	echo Removing old installer staging area in /tmp/ait
	rm -rf /tmp/ait
fi

if [ -f /tmp/azure.tar.gz ]; then
	rm /tmp/azure.tar.gz
fi

if [ -f /tmp/azure.tar ]; then
	rm /tmp/azure.tar
fi

mkdir /tmp/ait

echo Preparing the temporary staging area by copying the repo...

# Copy the enlistment
cp -R ../../ /tmp/ait/
rm -rf /tmp/ait/.git #lazy
rm -rf /tmp/ait/tools/osx-setup/out #mac installer and linux staging
rm -rf /tmp/ait/node_modules #modules that npm will install

# Makefile and install text
cp ../linux/* /tmp/ait/

# Prepare a tarball
pushd /tmp/ait/
tar -cf ../azure.tar .
cd ..
gzip azure.tar
popd

mv /tmp/azure.tar.gz out/linux/
