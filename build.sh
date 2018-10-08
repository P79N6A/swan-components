#!/bin/sh

npm install
npm run build

rm -fr output
cd dist
zip -r box.zip ./*
mkdir ../output
mv ./box.zip ../output/