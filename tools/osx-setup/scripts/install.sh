#!/bin/sh
# Windows Azure CLI Installation Script
# Copyright (C) 2012 Microsoft Corporation. All Rights Reserved.

# This script is run as a postinstall step in the package.

pushd /usr/local/azure/

# Unpacking the Command Line Interface (CLI)
/usr/bin/tar -xf /usr/local/azure/azure.tar.gz
rm /usr/local/azure/azure.tar.gz

# Script entry point
if [ ! -d "/usr/local/bin" ]; then
	mkdir /usr/local/bin/
fi

mv /usr/local/azure/azure /usr/local/bin/
mv /usr/local/azure/azure-uninstall /usr/local/bin/

popd
