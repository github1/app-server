#!/usr/bin/env bash

DIST="./dist"
rm -rf "${DIST}"
mkdir -p "${DIST}"
cp -R assets bin src templates package.json "${DIST}/"