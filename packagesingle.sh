#!/bin/bash

cd $1
git checkout auto_package
echo $2
./gradlew -Pchannels="$1" build
 
