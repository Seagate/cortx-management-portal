#!/bin/bash

set -e

BASE_DIR=$(realpath "$(dirname $0)/..")
PROG_NAME=$(basename $0)
DIST=$(realpath $BASE_DIR/dist)
GUI_DIR="$BASE_DIR/src/eos/gui"
API_DIR="$BASE_DIR/src/web"


usage() {
    echo "usage: $PROG_NAME [-v <csm version>] [-b <build no>]" 1>&2;
    exit 1;
}

while getopts ":g:v:b:" o; do
    case "${o}" in
        v)
            VER=${OPTARG}
            ;;
        b)
            BUILD=${OPTARG}
            ;;
        *)
            usage
            ;;
    esac
done

cd $BASE_DIR
[ -z $"$BUILD" ] && BUILD="$(git rev-parse --short HEAD)" \
        || BUILD="${BUILD}_$(git rev-parse --short HEAD)"
[ -z "$VER" ] && VER=$(cat $BASE_DIR/VERSION)

echo "Using VERSION=${VER} BUILD=${BUILD} ..."
# Build UI code and web code 
echo  BASE_DIR $BASE_DIR
echo GUI_DIR $GUI_DIR
echo API_DIR $API_DIR

# Build GUI
#cd $GUI_DIR
echo $PWD
echo Running GUI build

# Delete dist folder
rm -rf $GUI_DIR/dist
cd $GUI_DIR
npm install
npm run build

# Build API
echo Running API build

# Delete dist folder
rm -rf $API_DIR/web-dist
cd $API_DIR
echo $PWD
npm install
npm run build-ts

cd $BASE_DIR
# Array of directories to include in package.
DIRS=($(ls -p | grep "/" | egrep -v "(dist|jenkins|experiments)" | cut -f1 -d'/'))
echo $DIRS

# Remove existing directory and create fresh one to accomodate all packages.
DIST="$BASE_DIR/dist"

mkdir -p $DIST/csm

# Copy all directories into a temporary directory.
echo "Copy files to CSM directory"
cp -R ${DIRS[*]} $BASE_DIR/__init__.py ${DIST}/csm

#Delete src folder from eos/gui and web
echo " Deleting web src and eos/gui directory--" ${DIST}/csm/web/src
rm -rf ${DIST}/csm/src/web/src 
rm -rf ${DIST}/csm/src/eos/gui/src 
# Remove existing directory tree and create fresh one.
\rm -rf ${DIST}/rpmbuild
mkdir -p ${DIST}/rpmbuild/SOURCES

cd ${DIST}
# Create tar for csm
tar -czvf ${DIST}/rpmbuild/SOURCES/csm-${VER}.tar.gz \
    $(find csm -type f | egrep -v "(test|eos)")
# Create tar for eos-csm
tar -czvf ${DIST}/rpmbuild/SOURCES/eos-csm-${VER}.tar.gz csm/src/eos
# Create tar for csm-test
tar -czvf rpmbuild/SOURCES/csm-test-${VER}.tar.gz \
    $(find csm/test -type f | grep -v eos)

# Create tar for eos-csm-test
tar -czvf rpmbuild/SOURCES/eos-csm-test-${VER}.tar.gz \
    csm/test/eos
cd -

# Remove temporary directory
\rm -rf ${DIST}/csm

# Generate RPMs
TOPDIR=$(realpath ${DIST}/rpmbuild)

# CSM RPM
echo rpmbuild --define "version $VER" --define "dist $BUILD" --define "_topdir $TOPDIR" -bb $BASE_DIR/jenkins/csm.spec
rpmbuild --define "version $VER" --define "dist $BUILD" --define "_topdir $TOPDIR" -bb --with python36 $BASE_DIR/jenkins/csm.spec

# EOS CSM RPM
echo rpmbuild --define "version $VER" --define "dist $BUILD" --define "_topdir $TOPDIR" -bb $BASE_DIR/jenkins/eos-csm.spec
rpmbuild --define "version $VER" --define "dist $BUILD" --define "_topdir $TOPDIR" -bb --with python36 $BASE_DIR/jenkins/eos-csm.spec

# CSM TEST RPM
echo rpmbuild --define "version $VER" --define "dist $BUILD" --define "_topdir $TOPDIR" -bb $BASE_DIR/jenkins/csm-test.spec
rpmbuild --define "version $VER" --define "dist $BUILD" --define "_topdir $TOPDIR" -bb --with python36 $BASE_DIR/jenkins/csm-test.spec

# EOS CSM TEST RPM
echo rpmbuild --define "version $VER" --define "dist $BUILD" --define "_topdir $TOPDIR" -bb $BASE_DIR/jenkins/eos-csm-test.spec
rpmbuild --define "version $VER" --define "dist $BUILD" --define "_topdir $TOPDIR" -bb --with python36 $BASE_DIR/jenkins/eos-csm-test.spec

\rm -rf ${DIST}/rpmbuild/BUILDROOT/* ${DIST}/rpmbuild/BUILD/*
find $BASE_DIR -name *.rpm

# TODO - Clean rpmbuild tree.
