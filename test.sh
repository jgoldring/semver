#!/usr/bin/env bash

if [ -z "$(docker images | grep node | grep current-alpine3.10)" ]; then
    echo -e "${BLUE}Pulling down current node image${DEF}"
    docker pull node:current-alpine3.10
fi

if [ ! -d node_modules ]; then
    echo -e "${BLUE}Pulling down npm modules for test${DEF}"
    docker run --rm \
        --name semver-test-npm \
        -v $(pwd):/noderoot \
        --entrypoint="/bin/sh" \
        node:current-alpine3.10 \
        -c "cd /noderoot; npm install"
fi

docker run --rm \
    --name semver-unit-test \
    -v $(pwd):/noderoot \
    --entrypoint="/bin/sh" \
    node:current-alpine3.10 \
    -c "cd /noderoot; node_modules/mocha/bin/mocha test/unit/*.test.js"

docker run --rm \
    --name semver-acceptance-test \
    -v $(pwd):/noderoot \
    --entrypoint="/bin/sh" \
    node:current-alpine3.10 \
    -c "cd /noderoot; node_modules/mocha/bin/mocha --timeout 10000 test/acceptance/*.test.js"