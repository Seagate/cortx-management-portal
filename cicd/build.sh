# CORTX-CSM: CORTX Management web and CLI interface.
# Copyright (c) 2020 Seagate Technology LLC and/or its Affiliates
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published
# by the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Affero General Public License for more details.
# You should have received a copy of the GNU Affero General Public License
# along with this program. If not, see <https://www.gnu.org/licenses/>.
# For any questions about this software or licensing,
# please email opensource@seagate.com or cortx-questions@seagate.com.

set -e
BUILD_START_TIME=$(date +%s)
BASE_DIR=$(realpath "$(dirname $0)/..")
PROG_NAME=$(basename $0)
DIST=$(realpath $BASE_DIR/dist)
API_DIR="$BASE_DIR/web"
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
                            [-n <brand_name>]
                            [-l <brand_path>]
                            [-c <all|backend|frontend>] [-t]
                            [-d][-i]
                            [-q <true|false>]

Options:
    -v : Build rpm with version
    -b : Build rpm with build number
    -k : Provide key for encryption of code
    -p : Provide product name default cortx
    -n : Provide Brand name default cortx
    -l : Provide path to copy resources (e.g /root/) default path is null
    -c : Build rpm for [all|backend|frontend]
    -t : Build rpm with test plan
    -d : Build dev env
    -i : Build csm with integration test
    -q : Build csm with log level debug or info.
        """ 1>&2;
    exit 1;
}

while getopts ":g:v:b:p:n:l:k:c:tdiq" o; do
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
        n)
            BRAND=${OPTARG}
            ;;
        l)
            BRANDPATH=${OPTARG}
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
[ -z "$BRAND" ] && BRAND="CORTX"
[ -z "$BRANDPATH" ] && BRANDPATH=""
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

CONF=$BASE_DIR/conf/

cp $BASE_DIR/cicd/csm_web.spec $TMPDIR
COPY_END_TIME=$(date +%s)

################### WEB & UI ##############################

if [ "$COMPONENT" == "all" ] || [ "$COMPONENT" == "frontend" ]; then
    WEB_BUILD_START_TIME=$(date +%s)

    # Copy frontend files
    GUI_DIR=$DIST/csm_gui
    mkdir -p $GUI_DIR/gui/ $GUI_DIR/conf/service/
    cp -R $BASE_DIR/web $GUI_DIR/
    cp -R $CONF/csm_web.service $GUI_DIR/conf/service/
    cp -R $BASE_DIR/gui/.env $GUI_DIR/gui/.env
    echo "Running Web Build"
    cd $GUI_DIR/web/

    mkdir -p "$GUI_DIR/web/bin" "$GUI_DIR/web/lib"
    cp -f "$BASE_DIR/web/conf/csm_web_setup.py" "$GUI_DIR/web/lib/csm_web_setup"
    chmod +x "$GUI_DIR/web/lib/"*

    npm install --production
    npm run build-ts

    #Delete src folder from web
    echo " Deleting web src and gui directory--" ${DIST}/csm/web/src
    cp -R  $GUI_DIR/web/.env $GUI_DIR/web/web-dist
    rm -rf $GUI_DIR/web/src
    WEB_BUILD_END_TIME=$(date +%s)

    UI_BUILD_START_TIME=$(date +%s)
    echo "Running UI Build"
    # update .env file
    sed -i '/#/!s/\(VUE_APP_BRANDNAME[[:space:]]*=[[:space:]]*\)\(.*\)/\1"'$BRAND'"/' $BASE_DIR/gui/.env
    cp -R $BASE_DIR/gui/.env $GUI_DIR/gui/ui-dist
    cd $BASE_DIR/gui
    # if branadh path is valid, copy branding all files
    if [[ $BRANDPATH ]]; then
        if [ -d "$BRANDPATH" ]; then
            cp -R "$BRANDPATH/"*.* "$BASE_DIR/gui/public/"
            echo "All files copied to gui/public/ folder"
            cp -R "$BRANDPATH/public/"*.* "$BASE_DIR/gui/src/locales/"
            echo "All files copied to gui/src/locales/ folder"
            cp -R "$BRANDPATH/src/license-agreement-text.ts" "$BASE_DIR/gui/src/common/license-agreement-text.ts"
            echo "Replace gui/src/common/license-agreement-text.ts file"
        else
            echo "Invalid path: $BRANDPATH"
        fi
    fi
    npm install
    npm run build

    UI_BUILD_END_TIME=$(date +%s)
fi
#exit
################## Add CSM_PATH #################################

sed -i -e "s/<RPM_NAME>/${PRODUCT}-csm_web/g" \
    -e "s|<CSM_PATH>|${CSM_PATH}|g" \
    -e "s/<PRODUCT>/${PRODUCT}/g" $TMPDIR/csm_web.spec

sed -i -e "s|<CSM_PATH>|${CSM_PATH}|g" $DIST/csm_gui/conf/service/csm_web.service

################### TAR & RPM BUILD ##############################

# Remove existing directory tree and create fresh one.
TAR_START_TIME=$(date +%s)
cd $BASE_DIR
\rm -rf ${DIST}/rpmbuild
mkdir -p ${DIST}/rpmbuild/SOURCES

cd ${DIST}
# Create tar for csm
echo "Creating tar for csm build"
tar -czf ${DIST}/rpmbuild/SOURCES/${PRODUCT}-csm_web-${VER}.tar.gz csm_gui
git reset --hard
TAR_END_TIME=$(date +%s)

# Generate RPMs
RPM_BUILD_START_TIME=$(date +%s)
TOPDIR=$(realpath ${DIST}/rpmbuild)
if [ "$COMPONENT" == "all" ] || [ "$COMPONENT" == "frontend" ]; then
    # CSM Frontend RPM
    echo rpmbuild --define "version $VER" --define "dist $BUILD" --define "_topdir $TOPDIR" \
            -bb $BASE_DIR/cicd/csm_web.spec
    rpmbuild --define "version $VER" --define "dist $BUILD" --define "_topdir $TOPDIR" -bb $TMPDIR/csm_web.spec
fi
RPM_BUILD_END_TIME=$(date +%s)

# Remove temporary directory
\rm -rf ${DIST}/csm_gui
\rm -rf ${TMPDIR}
BUILD_END_TIME=$(date +%s)

echo "CSM RPMs ..."
find $BASE_DIR -name *.rpm

COPY_DIFF=$(( $COPY_END_TIME - $COPY_START_TIME ))
printf "COPY TIME!!!!!!!!!!!!"
printf "%02d:%02d:%02d\n" $(( COPY_DIFF / 3600 )) $(( ( COPY_DIFF / 60 ) % 60 )) $(( COPY_DIFF % 60 ))

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
