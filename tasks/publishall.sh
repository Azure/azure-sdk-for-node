#!/bin/bash

if [[ $(pwd) == *tasks ]]; then
    cd ../
fi
cd lib/services
published=""
failed=""
for p in $(ls -d */); do
    cd $p
    ret=$(npm publish)
    if [ ret == 0 ]; then
        published="$published, $p"
    else
        failed="$failed, $p"
    fi
    cd ..
done
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color
echo -e "${GREEN}Published packages:${NC} $published"
echo -e "${RED}Failed packages:${NC} $failed"
