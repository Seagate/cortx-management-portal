BUILD_START_TIME=$(date +%s)
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


# Array of directories to include in package.
DIRS=($(ls -p | grep "/" | egrep -v "(dist|jenkins|experiments|src)" | cut -f1 -d'/'))

# Remove existing directory and create fresh one to accomodate all packages.
DIST="$BASE_DIR/dist"
COPY_START_TIME=$(date +%s)
mkdir -p $DIST/csm

# Copy all directories into a temporary directory.
echo "Copy files to CSM directory"
cp -R ${DIRS[*]} $BASE_DIR/__init__.py ${DIST}/csm
rsync --exclude=gui/ --exclude=node_modules/ -av --progress src ${DIST}/csm
cp -R ${DIST}/csm/schema ${DIST}/csm/src/
COPY_END_TIME=$(date +%s)

WEB_BUILD_START_TIME=$(date +%s)
cd ${DIST}/csm/src/web/
echo "Running Web Build"
npm install --production
npm run build-ts

#Delete src folder from web
echo " Deleting web src and eos/gui directory--" ${DIST}/csm/web/src
cp -R  ${DIST}/csm/src/web/.env ${DIST}/csm/src/web/web-dist
rm -rf ${DIST}/csm/src/web/src
WEB_BUILD_END_TIME=$(date +%s)
UI_BUILD_START_TIME=$(date +%s)
echo "Running UI Build"
cd $GUI_DIR
npm install
npm run build

UI_BUILD_END_TIME=$(date +%s)


TAR_START_TIME=$(date +%s)
cd $BASE_DIR
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
TAR_END_TIME=$(date +%s)


# Remove temporary directory
\rm -rf ${DIST}/csm

RPM_BUILD_START_TIME=$(date +%s)
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
RPM_BUILD_END_TIME=$(date +%s)

BUILD_END_TIME=$(date +%s)

COPY_DIFF=$(( $COPY_END_TIME - $COPY_START_TIME ))
printf "COPY TIME!!!!!!!!!!!!"
printf "%02d:%02d:%02d\n" $(( COPY_DIFF / 3600 )) $(( ( COPY_DIFF / 60 ) % 60 )) $(( COPY_DIFF % 60 ))

WEB_DIFF=$(( $WEB_BUILD_END_TIME - $WEB_BUILD_START_TIME ))
printf "Web Build TIME!!!!!!!!!!!!"
printf "%02d:%02d:%02d\n" $(( WEB_DIFF / 3600 )) $(( ( WEB_DIFF / 60 ) % 60 )) $(( WEB_DIFF % 60 ))

UI_DIFF=$(( $UI_BUILD_END_TIME - $UI_BUILD_START_TIME ))
printf "UI Build time !!!!!!!!!!!!"
printf "%02d:%02d:%02d\n" $(( UI_DIFF / 3600 )) $(( ( UI_DIFF / 60 ) % 60 )) $(( UI_DIFF % 60 ))

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
