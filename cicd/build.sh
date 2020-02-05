#!/bin/bash

set -e
BUILD_START_TIME=$(date +%s)
BASE_DIR=$(realpath "$(dirname $0)/..")
PROG_NAME=$(basename $0)
DIST=$(realpath $BASE_DIR/dist)
GUI_DIR="$BASE_DIR/src/eos/gui"
API_DIR="$BASE_DIR/src/web"

usage() {
    echo """
usage: $PROG_NAME [-v <csm version>]
                            [-b <build no>] [-k <key>]
                            [-p <product_name>]
                            [-c <all|backend|frontend>] [-t]
                            [-d]

Options:
    -v : Build rpm with version
    -b : Build rpm with build number
    -k : Provide key for encryption of code
    -p : Provide product name default eos
    -c : Build rpm for [all|backend|frontend]
    -t : Build rpm with test plan
    -d : Build dev env
        """ 1>&2;
    exit 1;
}

while getopts ":g:v:b:p:k:c:td" o; do
    case "${o}" in
        v)
            VER=${OPTARG}
            ;;
        b)
            BUILD=${OPTARG}
            ;;
        p)
            PRODUCT=${OPTARG}
            ;;
        k)
            KEY=${OPTARG}
            ;;
        c)
            COMPONENT=${OPTARG}
            ;;
        t)
            TEST=true
            ;;
        d)
            DEV=true
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
[ -z "$PRODUCT" ] && PRODUCT="eos"
[ -z "$KEY" ] && KEY="eos@ees@csm@pr0duct"
[ -z "$COMPONENT" ] && COMPONENT="all"
[ -z "$TEST" ] && TEST=false
[ -z "$DEV" ] && DEV=false

echo "Using VERSION=${VER} BUILD=${BUILD} PRODUCT=${PRODUCT} TEST=${TEST}..."

################### COPY FRESH DIR ##############################

# Create fresh one to accomodate all packages.
COPY_START_TIME=$(date +%s)
DIST="$BASE_DIR/dist"
TMPDIR="$DIST/tmp"
[ -d "$TMPDIR" ] && {
    rm -rf ${TMPDIR}
}
mkdir -p $DIST/csm/conf $TMPDIR

CONF=$BASE_DIR/src/conf/
cp -R $CONF/etc $CONF/service $DIST/csm/conf
cp $BASE_DIR/jenkins/csm.spec $TMPDIR
COPY_END_TIME=$(date +%s)

################### Backend ##############################

if [ "$COMPONENT" == "all" ] || [ "$COMPONENT" == "backend" ]; then
    # Build CSM Backend
    CORE_BUILD_START_TIME=$(date +%s)
    cd $TMPDIR

    # Copy Backend files
    mkdir -p $DIST/csm/lib $DIST/csm/bin $DIST/csm/conf $TMPDIR/csm
    cp -rs $BASE_DIR/src/* $TMPDIR/csm
    cp -rs $BASE_DIR/test/ $TMPDIR/csm

    # Check python package
    req_file=$BASE_DIR/jenkins/pyinstaller/requirment.txt
    echo "Installing python packages..."
    pip3 install --user -r $req_file  > /dev/null || {
        echo "Unable to install package from $req_file"; exit 1;
    };

    echo " $BASE_DIR $DIST"
    [ "$DEV" == true ] && {
        echo """
        ******* Create Dev env *********
        Follow Instruction for Dev env
            Copy $BASE_DIR/cli/schema to /opt/seagate/csm/cli
            Copy $BASE_DIR/schema to /opt/seagate/csm/
            Copy $BASE_DIR/src/conf/etc/csm/ to /etc/csm/
        Dev env is created at $DIST/tmp/csm
        """  1>&2;
        exit
    }

    CONF=$BASE_DIR/src/conf/
    cp -R $BASE_DIR/schema $DIST/csm/
    cp -R $BASE_DIR/templates $DIST/csm/
    mkdir -p  $DIST/csm/cli/
    cp -R $BASE_DIR/src/cli/schema $DIST/csm/cli/

    # Create spec for pyinstaller
    [ "$TEST" == true ] && {
        PYINSTALLER_FILE=$TMPDIR/${PRODUCT}_csm_test.spec
        cp $BASE_DIR/jenkins/pyinstaller/product_csm_test.spec ${PYINSTALLER_FILE}
        mkdir -p $DIST/csm/test
        cp -R $BASE_DIR/test/plans $BASE_DIR/test/test_data $DIST/csm/test
    } || {
        PYINSTALLER_FILE=$TMPDIR/${PRODUCT}_csm.spec
        cp $BASE_DIR/jenkins/pyinstaller/product_csm.spec ${PYINSTALLER_FILE}
    }

    sed -i -e "s|<PRODUCT>|${PRODUCT}|g" \
        -e "s|<CSM_PATH>|${TMPDIR}/csm|g" ${PYINSTALLER_FILE}
    pyinstaller --clean -y --distpath ${DIST}/csm --key ${KEY} ${PYINSTALLER_FILE}
    CORE_BUILD_END_TIME=$(date +%s)
fi

################### WEB & UI ##############################

if [ "$COMPONENT" == "all" ] || [ "$COMPONENT" == "frontend" ]; then
    WEB_BUILD_START_TIME=$(date +%s)

    # Copy frontend files
    mkdir -p $DIST/csm/eos/gui/
    cp -R $BASE_DIR/src/web ${DIST}/csm
    cp -R $BASE_DIR/src/eos/gui/.env ${DIST}/csm/eos/gui/.env

    echo "Running Web Build"
    cd ${DIST}/csm/web/
    npm install --production
    npm run build-ts

    #Delete src folder from web
    echo " Deleting web src and eos/gui directory--" ${DIST}/csm/web/src
    cp -R  ${DIST}/csm/web/.env ${DIST}/csm/web/web-dist
    rm -rf ${DIST}/csm/web/src
    WEB_BUILD_END_TIME=$(date +%s)

    UI_BUILD_START_TIME=$(date +%s)
    echo "Running UI Build"
    cd $GUI_DIR
    npm install
    npm run build
    cp -R  ${DIST}/csm/eos/gui/.env ${DIST}/csm/eos/gui/ui-dist

    UI_BUILD_END_TIME=$(date +%s)
fi

################### TAR & RPM BUILD ##############################

# Remove existing directory tree and create fresh one.
TAR_START_TIME=$(date +%s)
cd $BASE_DIR
\rm -rf ${DIST}/rpmbuild
mkdir -p ${DIST}/rpmbuild/SOURCES

# Genrate spec file for CSM
sed -i -e "s/<RPM_NAME>/${PRODUCT}_csm/g" \
    -e "s/<PRODUCT>/${PRODUCT}/g" $TMPDIR/csm.spec

cd ${DIST}
# Create tar for csm
echo "Creating tar for csm build"
tar -czf ${DIST}/rpmbuild/SOURCES/${PRODUCT}-csm-${VER}.tar.gz csm
TAR_END_TIME=$(date +%s)

# Generate RPMs
RPM_BUILD_START_TIME=$(date +%s)
TOPDIR=$(realpath ${DIST}/rpmbuild)

# CSM RPM
echo rpmbuild --define "version $VER" --define "dist $BUILD" --define "_topdir $TOPDIR" -bb $BASE_DIR/jenkins/csm.spec
rpmbuild --define "version $VER" --define "dist $BUILD" --define "_topdir $TOPDIR" -bb $TMPDIR/csm.spec
RPM_BUILD_END_TIME=$(date +%s)

# Remove temporary directory
\rm -rf ${DIST}/csm
\rm -rf ${TMPDIR}
BUILD_END_TIME=$(date +%s)

echo "CSM RPMs ..."
find $BASE_DIR -name *.rpm

COPY_DIFF=$(( $COPY_END_TIME - $COPY_START_TIME ))
printf "COPY TIME!!!!!!!!!!!!"
printf "%02d:%02d:%02d\n" $(( COPY_DIFF / 3600 )) $(( ( COPY_DIFF / 60 ) % 60 )) $(( COPY_DIFF % 60 ))

if [ "$COMPONENT" == "all" ] || [ "$COMPONENT" == "backend" ]; then
    CORE_DIFF=$(( $CORE_BUILD_END_TIME - $CORE_BUILD_START_TIME ))
    printf "CORE BUILD TIME!!!!!!!!!!!!"
    printf "%02d:%02d:%02d\n" $(( CORE_DIFF / 3600 )) $(( ( CORE_DIFF / 60 ) % 60 )) $(( CORE_DIFF % 60 ))
fi

if [ "$COMPONENT" == "all" ] || [ "$COMPONENT" == "frontend" ]; then
    WEB_DIFF=$(( $WEB_BUILD_END_TIME - $WEB_BUILD_START_TIME ))
    printf "Web Build TIME!!!!!!!!!!!!"
    printf "%02d:%02d:%02d\n" $(( WEB_DIFF / 3600 )) $(( ( WEB_DIFF / 60 ) % 60 )) $(( WEB_DIFF % 60 ))

    UI_DIFF=$(( $UI_BUILD_END_TIME - $UI_BUILD_START_TIME ))
    printf "UI Build time !!!!!!!!!!!!"
    printf "%02d:%02d:%02d\n" $(( UI_DIFF / 3600 )) $(( ( UI_DIFF / 60 ) % 60 )) $(( UI_DIFF % 60 ))
fi

TAR_DIFF=$(( $TAR_END_TIME - $TAR_START_TIME ))
printf "Time taken in creating TAR !!!!!!!!!!!!"
printf "%02d:%02d:%02d\n" $(( TAR_DIFF / 3600 )) $(( ( TAR_DIFF / 60 ) % 60 )) $(( TAR_DIFF % 60 ))

RPM_DIFF=$(( $RPM_BUILD_END_TIME - $RPM_BUILD_START_TIME ))
printf "Time taken in creating RPM !!!!!!!!!!!!"
printf "%02d:%02d:%02d\n" $(( RPM_DIFF / 3600 )) $(( ( RPM_DIFF / 60 ) % 60 )) $(( RPM_DIFF % 60 ))

DIFF=$(( $BUILD_END_TIME - $BUILD_START_TIME ))
h=$(( DIFF / 3600 ))
m=$(( ( DIFF / 60 ) % 60 ))
s=$(( DIFF % 60 ))

printf "%02d:%02d:%02d\n" $h $m $s
echo "Build took %02d:%02d:%02d\n" $h $m $s
