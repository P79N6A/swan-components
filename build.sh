#!/bin/sh

npm install --registry http://registry.npm.baidu-int.com @baidu/events-emitter@^1.0.15
npm install --registry http://registry.npm.baidu-int.com
npm run build

rm -fr output
cd dist
zip -r box.zip ./*
mkdir -p ../output/dist/
mv ./box.zip ../output/dist/
cd ../
cp ./package.json ./output
cp ./tools/removeScript.js ./output
cp ./.npmrc ./output
