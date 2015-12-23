#!/bin/bash

cd $1
echo $2
if [ "$2" = "all" ]
then
   echo '哈哈哈 打包全部'
   git checkout dev
 #./gradlew assembleReleasels
else
  git checkout auto_package
  ./gradlew -Pchannels="$2" build
fi