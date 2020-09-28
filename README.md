<!--
CORTX-CSM: CORTX Management web and CLI interface.
Copyright (c) 2020 Seagate Technology LLC and/or its Affiliates
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.
You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
For any questions about this software or licensing,
please email opensource@seagate.com or cortx-questions@seagate.com.
-->

# CORTX Management Stack

### Directory Structure

cli     - Command Line Implementation  
ras     - RAS Functionality  
rest    - REST API Impementation  
gui     - Graphical User Interface  
auth    - Authentication platform  

### Required Environment
Nodejs 10.x or greater.

Installation steps  
Install NVM
-------------------
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash

Install nodejs
----------------------------
nvm install node  
node --version  
Python 3.6   

### Supported Package

pip3.6 install paramiko  
pip3.6 install toml  
pip3.6 install PyYAML  
pip3.6 install configparser  
pip3.6 install argparse  
pip3.6 install paramiko  
pip3.6 install aiohttp  

### Build

Run the command below to generate the rpm.  
$ ./jenkins/build.sh -b \<build-no\>

RPM would be created in dist/rpmbuild/RPMS folder.  

#### Install csm RPMs
yum localinstall -y csm-<version>.rpm  
yum localinstall -y csm-test-<version>.rpm  
yum localinstall -y cortx-csm-<version>.rpm  
yum localinstall -y cortx-csm-test-<version>.rpm  

### Setup CSM
csmcli setup init

### Unit Testing
Follow the commands given below to run unit tests for CLI.  
$ cd csm  
$ python -m unittest discover cli/test/  

#### Sanity Testing  
1. copy samples/csm/config to /etc/csm/config. Review/Edit/Update the same.

2. copy samples/cluster.yaml to /etc/csm/cluster.yaml  
   Edit /etc/csm/cluster.yaml and modify entries as per your test environment.

3. cp samples/components.yaml to /etc/csm/components.yaml

4. Make sure current user has read permission to /var/log folder.  
    If not, then run the following command:  
   $ chmod -R 755 /var/log

5. Edit test/args.yaml in case there are any specific test parameters to be added.

6. Run the test using the following command:  
   $ test/run_test.py -t /test/plans/<test-file>.pln
