#!/bin/bash

set -e

BASE_DIR=$(realpath "$(dirname $0)/..")
PROG_NAME=$(basename $0)
DIST=$(realpath $BASE_DIR/dist)

usage() {
    echo "usage: $PROG_NAME [-g <git version>] [-v <csm version>]" 1>&2;
    exit 1;
}

while getopts ":g:v:" o; do
    case "${o}" in
        g)
            GIT_VER=${OPTARG}
            ;;
        v)
            VER=${OPTARG}
            ;;
        *)
            usage
            ;;
    esac
done

cd $BASE_DIR
[ -z "$GIT_VER" ] && GIT_VER=$(git rev-parse --short HEAD)
[ -z "$VER" ] && VER=$(cat $BASE_DIR/VERSION)

echo "Using VERSION=${VER} GIT_VER=${GIT_VER} ..."

# Array of directories to include in package.
DIRS=($(ls -p | grep "/" | egrep -v "(dist|jenkins|test)" | cut -f1 -d'/'))

# Remove existing directory and create fresh one to accomodate all packages.
DIST="$BASE_DIR/dist"
mkdir -p $DIST/csm

# Copy all directories into a temporary directory.
cp -R ${DIRS[*]} $BASE_DIR/__init__.py ${DIST}/csm

# Remove existing directory tree and create fresh one.
\rm -rf ${DIST}/rpmbuild
mkdir -p ${DIST}/rpmbuild/SOURCES

# Create tar of temporary directory.
cd ${DIST}
tar -czvf rpmbuild/SOURCES/csm-${VER}.tar.gz \
    $(find csm -name "*.py" -o -name "*.patch" -o -name "*.zip" -o -name "*.sh"| grep -v test) csm/config
cd -

# Remove temporary directory
\rm -rf ${DIST}/csm

# Generate RPMs
TOPDIR=$(realpath ${DIST}/rpmbuild)
echo rpmbuild --define "version $VER" --define "dist $GIT_VER" --define "_topdir $TOPDIR" -bb $BASE_DIR/jenkins/csm.spec
rpmbuild --define "version $VER" --define "dist $GIT_VER" --define "_topdir $TOPDIR" -bb $BASE_DIR/jenkins/csm.spec
\rm -rf ${DIST}/rpmbuild/BUILDROOT/* ${DIST}/rpmbuild/BUILD/*

# TODO - Clean rpmbuild tree.
