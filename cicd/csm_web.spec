
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

Name: <RPM_NAME>
Version: %{version}
Release: %{dist}
Summary: CSM Tools
License: Seagate
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
mkdir -p ${RPM_BUILD_ROOT}<CSM_PATH>/gui ${RPM_BUILD_ROOT}<CSM_PATH>/conf/service/
cp -rp ./* ${RPM_BUILD_ROOT}<CSM_PATH>
exit 0

%post
CSM_DIR=<CSM_PATH>
CFG_DIR=$CSM_DIR/conf
PRODUCT=<PRODUCT>
[ -d "${CSM_DIR}/gui" ] && {
    cp -f $CFG_DIR/service/csm_web.service /etc/systemd/system/csm_web.service

    ENV=$CSM_DIR/web/web-dist/.env
    sed -i "s|CSM_UI_PATH=\"/\"|CSM_UI_PATH=\"${CSM_DIR}/gui/ui-dist\"|g" $ENV
    sed -i "s/NODE_ENV=\"development\"/NODE_ENV=\"production\"/g" $ENV
}

# Move binary file
[ -d "${CSM_DIR}/web/csm/lib" ] && {
    ln -sf $CSM_DIR/web/csm/lib/csm_setup /usr/bin/csm_web_setup
    ln -sf $CSM_DIR/web/csm/lib/csm_setup $CSM_DIR/csm/bin/csm_web_setup    
}
exit 0

%preun
[ $1 -eq 1 ] && exit 0
systemctl disable csm_web
systemctl stop csm_web

%postun
[ $1 -eq 1 ] && exit 0
rm -f /usr/bin/csm_web 2> /dev/null;
rm -rf /etc/systemd/system/csm_web.service 2> /dev/null;
systemctl daemon-reload
exit 0

%clean

%files
# TODO - Verify permissions, user and groups for directory.
%defattr(-, root, root, -)
<CSM_PATH>/*

%changelog
* Mon Jul 29 2019 Ajay Paratmandali <ajay.paratmandali@seagate.com> - 1.0.0
- Initial spec file
