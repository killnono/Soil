#!/bin/bash

cd ~/Desktop/WorkSpace_Guanghe/repository/YCMath345-Android/
git checkout auto_package
echo $1
./gradlew -Pchannels="$1" build
 
