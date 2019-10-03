#!/usr/bin/env bash

rm -rf ./Build

pushd .
mkdir -p Build/Release
cd Build/Release
cmake ../.. -DCMAKE_BUILD_TYPE=Release
make all
popd

pushd .
mkdir -p Build/Debug
cd Build/Debug
cmake ../.. -DCMAKE_BUILD_TYPE=Debug
make all
popd
