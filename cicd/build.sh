#!/bin/bash

set -e
BUILD_START_TIME=$(date +%s)
BASE_DIR=$(realpath "$(dirname $0)/..")
PROG_NAME=$(basename $0)
DIST=$(realpath $BASE_DIR/dist)
API_DIR="$BASE_DIR/src/web"
CORTX_PATH="/opt/seagate/cortx/"
CSM_PATH="${CORTX_PATH}csm"
DEBUG="DEBUG"
INFO="INFO"
PROVISIONER_CONFIG_PATH="${CORTX_PATH}provisioner/generated_configs"

usage() {
    echo """
usage: $PROG_NAME [-v <csm version>]
                            [-b <build no>] [-k <key>]
                            [-p <product_name>]
                            [-c <all|backend|frontend>] [-t]
                            [-d][-i]
                            [-q <true|false>]

Options:
    -v : Build rpm with version
    -b : Build rpm with build number
    -k : Provide key for encryption of code
    -p : Provide product name default cortx
    -c : Build rpm for [all|backend|frontend]
    -t : Build rpm with test plan
    -d : Build dev env
    -i : Build csm with integration test
    -q : Build csm with log level debug or info.
        """ 1>&2;
    exit 1;
}

while getopts ":g:v:b:p:k:c:tdiq" o; do
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
        i)
            INTEGRATION=true
            ;;
        q)
            QA=true
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
[ -z "$PRODUCT" ] && PRODUCT="cortx"
[ -z "$KEY" ] && KEY="cortx@ees@csm@pr0duct"
[ -z "$COMPONENT" ] && COMPONENT="all"
[ -z "$TEST" ] && TEST=false
[ -z "$INTEGRATION" ] && INTEGRATION=false
[ -z "$DEV" ] && DEV=false
[ -z "$QA" ] && QA=false

echo "Using VERSION=${VER} BUILD=${BUILD} PRODUCT=${PRODUCT} TEST=${TEST}..."

################### COPY FRESH DIR ##############################

# Create fresh one to accomodate all packages.
COPY_START_TIME=$(date +%s)
DIST="$BASE_DIR/dist"
TMPDIR="$DIST/tmp"
[ -d "$TMPDIR" ] && {
    rm -rf ${TMPDIR}
}
mkdir -p $TMPDIR

CONF=$BASE_DIR/src/conf/

cp $BASE_DIR/jenkins/csm_agent.spec $BASE_DIR/jenkins/csm_web.spec $TMPDIR
COPY_END_TIME=$(date +%s)

################### Dependency ##########################

# install dependency
bash -x "$BASE_DIR/jenkins/cicd/csm_dep.sh" "$DEV"
################### Backend ##############################

if [ "$COMPONENT" == "all" ] || [ "$COMPONENT" == "backend" ]; then
    # Build CSM Backend
    CORE_BUILD_START_TIME=$(date +%s)
    mkdir -p $DIST/csm/conf/service
    cp $CONF/setup.yaml $DIST/csm/conf
    cp -R $CONF/etc $DIST/csm/conf
    cp -R $CONF/service/csm_agent.service $DIST/csm/conf/service
    cd $TMPDIR

    # Copy Backend files
    mkdir -p $DIST/csm/lib $DIST/csm/bin $DIST/csm/conf $TMPDIR/csm
    cp -rs $BASE_DIR/src/* $TMPDIR/csm
    cp -rs $BASE_DIR/test/ $TMPDIR/csm

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
    python3 -m PyInstaller --clean -y --distpath "${DIST}/csm" --key "${KEY}" "${PYINSTALLER_FILE}"
    CORE_BUILD_END_TIME=$(date +%s)
fi

################### WEB & UI ##############################

if [ "$COMPONENT" == "all" ] || [ "$COMPONENT" == "frontend" ]; then
    WEB_BUILD_START_TIME=$(date +%s)

    # Copy frontend files
    GUI_DIR=$DIST/csm_gui
    mkdir -p $GUI_DIR/eos/gui/ $GUI_DIR/conf/service/
    cp -R $BASE_DIR/src/web $GUI_DIR/
    cp -R $CONF/service/csm_web.service $GUI_DIR/conf/service/
    cp -R $BASE_DIR/src/eos/gui/.env $GUI_DIR/eos/gui/.env
    echo "Running Web Build"
    cd $GUI_DIR/web/
    npm install --production
    npm run build-ts

    #Delete src folder from web
    echo " Deleting web src and eos/gui directory--" ${DIST}/csm/web/src
    cp -R  $GUI_DIR/web/.env $GUI_DIR/web/web-dist
    rm -rf $GUI_DIR/web/src
    WEB_BUILD_END_TIME=$(date +%s)

    UI_BUILD_START_TIME=$(date +%s)
    echo "Running UI Build"
    cd $BASE_DIR/src/eos/gui
    npm install
    npm run build
    cp -R  $GUI_DIR/eos/gui/.env $GUI_DIR/eos/gui/ui-dist

    UI_BUILD_END_TIME=$(date +%s)
fi

################## Add CSM_PATH #################################

# Genrate spec file for CSM
sed -i -e "s/<RPM_NAME>/${PRODUCT}-csm_agent/g" \
    -e "s|<CSM_PATH>|${CSM_PATH}|g" \
    -e "s/<PRODUCT>/${PRODUCT}/g" $TMPDIR/csm_agent.spec

sed -i -e "s/<RPM_NAME>/${PRODUCT}-csm_web/g" \
    -e "s|<CSM_PATH>|${CSM_PATH}|g" \
    -e "s/<PRODUCT>/${PRODUCT}/g" $TMPDIR/csm_web.spec

sed -i -e "s|<CORTX_PATH>|${CORTX_PATH}|g" $DIST/csm/schema/commands.yaml
sed -i -e "s|<CSM_PATH>|${CSM_PATH}|g" $DIST/csm/conf/etc/csm/csm.conf
sed -i -e "s|<CSM_PATH>|${CSM_PATH}|g" $DIST/csm/conf/etc/rsyslog.d/2-emailsyslog.conf.tmpl
sed -i -e "s|<CSM_PATH>|${CSM_PATH}|g" $DIST/csm_gui/conf/service/csm_web.service
sed -i -e "s|<CSM_PATH>|${CSM_PATH}|g" $DIST/csm/conf/setup.yaml
sed -i -e "s|<PROVISIONER_CONFIG_PATH>|${PROVISIONER_CONFIG_PATH}|g" $DIST/csm/conf/etc/csm/csm.conf

if [ "$QA" == true ]; then
    sed -i -e "s|<LOG_LEVEL>|${DEBUG}|g" $DIST/csm/conf/etc/csm/csm.conf
else
    sed -i -e "s|<LOG_LEVEL>|${INFO}|g" $DIST/csm/conf/etc/csm/csm.conf
fi

################### TAR & RPM BUILD ##############################

# Remove existing directory tree and create fresh one.
TAR_START_TIME=$(date +%s)
cd $BASE_DIR
\rm -rf ${DIST}/rpmbuild
mkdir -p ${DIST}/rpmbuild/SOURCES

cd ${DIST}
# Create tar for csm
echo "Creating tar for csm build"
tar -czf ${DIST}/rpmbuild/SOURCES/${PRODUCT}-csm_agent-${VER}.tar.gz csm
tar -czf ${DIST}/rpmbuild/SOURCES/${PRODUCT}-csm_web-${VER}.tar.gz csm_gui
TAR_END_TIME=$(date +%s)

# Generate RPMs
RPM_BUILD_START_TIME=$(date +%s)
TOPDIR=$(realpath ${DIST}/rpmbuild)

# CSM Backend RPM
if [ "$COMPONENT" == "all" ] || [ "$COMPONENT" == "backend" ]; then
    echo rpmbuild --define "version $VER" --define "dist $BUILD" --define "_topdir $TOPDIR" \
            -bb $BASE_DIR/jenkins/csm_agent.spec
    rpmbuild --define "version $VER" --define "dist $BUILD" --define "_topdir $TOPDIR" -bb $TMPDIR/csm_agent.spec
fi

if [ "$COMPONENT" == "all" ] || [ "$COMPONENT" == "frontend" ]; then
    # CSM Frontend RPM
    echo rpmbuild --define "version $VER" --define "dist $BUILD" --define "_topdir $TOPDIR" \
            -bb $BASE_DIR/jenkins/csm_web.spec
    rpmbuild --define "version $VER" --define "dist $BUILD" --define "_topdir $TOPDIR" -bb $TMPDIR/csm_web.spec
fi
RPM_BUILD_END_TIME=$(date +%s)

# Remove temporary directory
\rm -rf ${DIST}/csm
\rm -rf ${DIST}/csm_gui
\rm -rf ${TMPDIR}
BUILD_END_TIME=$(date +%s)

echo "CSM RPMs ..."
find $BASE_DIR -name *.rpm

[ "$INTEGRATION" == true ] && {
    INTEGRATION_TEST_START=$(date +%s)
    bash $BASE_DIR/jenkins/cicd/csm_cicd.sh $DIST/rpmbuild/RPMS/x86_64 $BASE_DIR $CSM_PATH
    RESULT=$(cat /tmp/result.txt)
    cat /tmp/result.txt
    echo $RESULT
    [ "Failed" == $RESULT ] && {
        echo "CICD Failed"
        exit 1
    }
    INTEGRATION_TEST_STOP=$(date +%s)
}

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
