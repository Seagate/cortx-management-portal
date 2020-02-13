Name: <RPM_NAME>
Version: %{version}
Release: %{dist}
Summary: CSM Tools
License: Seagate Proprietary
URL: http://gitlab.mero.colo.seagate.com/eos/csm
Source0: <PRODUCT>-csm_web-%{version}.tar.gz
%define debug_package %{nil}

%description
CSM Tools

%prep
%setup -n csm_gui
# Nothing to do here

%build

%install
mkdir -p ${RPM_BUILD_ROOT}/opt/seagate/csm/eos/gui ${RPM_BUILD_ROOT}/opt/seagate/csm/conf/service/
cp -rp ./* ${RPM_BUILD_ROOT}/opt/seagate/csm
exit 0

%post
CSM_DIR=/opt/seagate/csm
CFG_DIR=$CSM_DIR/conf
PRODUCT=<PRODUCT>

[ -d "${CSM_DIR}/${PRODUCT}/gui" ] && {
    [ -f /etc/systemd/system/csm_web.service ] || {
        cp -f $CFG_DIR/service/csm_web.service /etc/systemd/system/csm_web.service
    }

    ENV=$CSM_DIR/web/web-dist/.env
    sed -i "s|CSM_UI_PATH=\"/\"|CSM_UI_PATH=\"${CSM_DIR}/${PRODUCT}/gui/ui-dist\"|g" $ENV
    sed -i "s/NODE_ENV=\"development\"/NODE_ENV=\"production\"/g" $ENV
}
exit 0

%postun
[ $1 -eq 1 ] && exit 0
rm -f /usr/bin/csm_web 2> /dev/null;
exit 0

%clean

%files
# TODO - Verify permissions, user and groups for directory.
%defattr(-, root, root, -)
/opt/seagate/csm/*

%changelog
* Mon Jul 29 2019 Ajay Paratmandali <ajay.paratmandali@seagate.com> - 1.0.0
- Initial spec file
