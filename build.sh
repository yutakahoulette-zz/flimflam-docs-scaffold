#!/bin/bash

echo "creating docs folder if it does not exist..."
mkdir -p docs 

echo "copying index.html..."
cp index.html docs 

echo "running postcss..."
postcss -c postcss.page.js -l 

echo "copying page.min.css..."
cp page.min.css docs

echo "browserifying and uglifying page.js..."
browserify -t babelify page.js | uglifyjs > docs/page.js

echo "browserifying index.js..."
browserify -t babelify index.js > build.js

