#!/usr/bin/env bash
if [ "$1" ];
then
    VERSION=$1
else
    VERSION=$(node -p "require('./package.json').version")
fi
    node sundry/updateDoc.ts $VERSION
    cd docs
    npm version $VERSION
    cd ..
    git add ./docs/*
    git commit -m "docs(release): v$VERSION"
    echo "Docs v$VERSION update succeeded!"