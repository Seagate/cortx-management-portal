#!/bin/bash

set -e

BASE_DIR=$(realpath "$(dirname $0)/..")
PROG_NAME=$(basename $0)
DIST=$(realpath $BASE_DIR/dist)

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

# Array of directories to include in package.
DIRS=($(ls -p | grep "/" | egrep -v "(dist|jenkins)" | cut -f1 -d'/'))

# Remove existing directory and create fresh one to accomodate all packages.
DIST="$BASE_DIR/dist"
mkdir -p $DIST/csm

# Copy all directories into a temporary directory.
cp -R ${DIRS[*]} $BASE_DIR/__init__.py ${DIST}/csm

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
