#!/bin/bash

currentDirectory="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $currentDirectory/..

docker run -it --rm --name solfege -v "$PWD":/project -w /project node npm $@
