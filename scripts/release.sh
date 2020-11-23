#!/usr/bin/env bash

set -e

rm -rf ./node_modules ./lib ./dist
yarn

git checkout .

npm version $1

git add .

git push

git push --tags

yarn run build

npm publish

