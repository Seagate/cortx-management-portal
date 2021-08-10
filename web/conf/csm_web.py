#!/bin/env python3

# Copyright (c) 2021 Seagate Technology LLC and/or its Affiliates
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

import crypt
import os
import pwd
import traceback
from cortx.utils.log import Log
from cortx.utils.conf_store import Conf
from cortx.utils.validator.v_path import PathV
from cortx.utils.kv_store.error import KvError
from cortx.utils.validator.error import VError
from cortx.utils.validator.v_pkg import PkgV
from cortx.utils.validator.v_confkeys import ConfKeysV
from cortx.utils.security.cipher import Cipher, CipherInvalidToken
from csm.web.conf.payload import Text
from csm.web.conf.process import SimpleProcess
#from payload import Text
#from process import SimpleProcess


class CSMWebSetupError(Exception):
    """
    Generic Exception with error code and output
    """
    def __init__(self, rc, message, *args):
        """
        Initializing CSMWebSetupError
        """
        self._rc = rc
        self._desc = message

    def __str__(self):
        """
        Return error in String
        """
        if self._rc == 0: return self._desc
        return f"error({self._rc}): {self._desc}\n\n {traceback.format_exc()}"

    @property
    def rc(self):
        return self._rc


class CSMWeb:
    """
    Represents CSMWeb and Performs setup related actions
    """
    CONSUMER_INDEX = "consumer"
    ENV_INDEX = "env_index"
    CSM_WEB_DIST_ENV_FILE_PATH  = "/opt/seagate/cortx/csm/web/web-dist/.env"
    NODE_JS_PATH = '/opt/nodejs/node-v12.13.0-linux-x64/bin/node'
    CSM_WEB_SERVICE = "/etc/systemd/system/csm_web.service"
    CSM_WEB_SERVICE_TMPL = "/opt/seagate/cortx/csm/conf/service/csm_web.service"
    
    def __init__(self, conf_url, **kwargs):
        """
        Initializing CSMWeb
        """
        Conf.init()
        Conf.load(CSMWeb.CONSUMER_INDEX, conf_url)
        Conf.load(self.ENV_INDEX, f"properties://{self.CSM_WEB_DIST_ENV_FILE_PATH }")
        Log.init(service_name = "csm_web_setup", log_path = "/tmp/csm/setup_logs",
                level="INFO")
        self.machine_id = CSMWeb._get_machine_id()
        self.server_node_info = f"server_node>{self.machine_id}"
        self.conf_url = conf_url
        self.pre_factory = kwargs.get("pre_factory")
        self.conf_store_keys = {}
        self._is_env_dev = False

    def post_install(self):
        """
        Performs post install operations for CSM Web as well as cortxcli.
        Raises exception on error.
        """
        Log.info("Executing post install")
        self._validate_nodejs_installed()
        self._validate_cortxcli()
        if os.environ.get("CLI_SETUP") == "true":
            CSMWeb._run_cmd(f"cli_setup post_install --config {self.conf_url}")
        self._prepare_and_validate_confstore_keys("post_install")
        self._set_service_user()
        self._config_user()
        self._configure_service_user()
        self._allow_access_to_pvt_ports()
        Log.info("Post install complete")
        return 0

    def prepare(self):
        """
        Performs post install operations.
        Raises exception on error
        """
        Log.info("Executing prepare")
        if os.environ.get("CLI_SETUP") == "true":
            CSMWeb._run_cmd(f"cli_setup prepare --config {self.conf_url}")
        self._prepare_and_validate_confstore_keys("prepare")
        self._get_cluster_id()
        self._set_deployment_mode()
        self._set_service_user()
        self._set_password_to_csm_user()
        Log.info("Prepare complete")
        return 0

    def config(self):
        """
        Performs configurations.
        Raises exception on error
        """
        Log.info("Executing config")
        if os.environ.get("CLI_SETUP") == "true":
            CSMWeb._run_cmd(f"cli_setup config --config {self.conf_url}")
        self._prepare_and_validate_confstore_keys("config")
        self._get_cluster_id()
        self._set_deployment_mode()
        self._configure_csm_web_keys()
        Log.info("Config complete")
        return 0

    def init(self):
        """
        Perform initialization.
        Raises exception on error
        """
        Log.info("Executing init")
        return 0

    def reset(self):
        """
        Performs Configuraiton reset.
        Raises exception on error
        """
        Log.info("Executing reset")
        return 0

    def pre_upgrade(self):
        """
        Performs Pre upgrade functionalitied.
        Raises exception on error
        """
        Log.info("Executing pre upgrade")
        return 0

    def post_upgrade(self):
        """
        Performs Post upgrade functionalitied.
        Raises exception on error
        """
        Log.info("Executing post upgrade")
        return 0

    def test(self, plan):
        """
        Perform configuration testing.
        Raises exception on error
        """
        Log.info("Executing test")
        return 0

    def cleanup(self):
        """
        Performs Configuraiton cleanup.
        Raises exception on error
        """
        Log.info("Executing cleanup")
        return 0
    
    @staticmethod
    def _get_machine_id():
        """
        Obtains current minion id. If it cannot be obtained, returns default node #1 id.
        """
        Log.info("Fetching Machine Id.")
        cmd = "cat /etc/machine-id"
        machine_id, _err, _returncode = CSMWeb._run_cmd(cmd)
        if _returncode != 0:
            raise CSMWebSetupError(rc=_returncode,message='Unable to obtain current machine id.')
        return machine_id.replace("\n", "")

    def _prepare_and_validate_confstore_keys(self, phase: str):
        """ Perform validtions. Raises exceptions if validation fails """
        if phase == "post_install":
            self.conf_store_keys.update({
                "csm_user_key": "cortx>software>csm>user"
                })
        elif phase == "prepare":
            self.conf_store_keys.update({
                "csm_user_key": "cortx>software>csm>user",
                "server_node_info":self.server_node_info,
                "cluster_id":f"{self.server_node_info}>cluster_id",
                "secret_key": "cortx>software>csm>secret"
            })
        elif phase == "config":
            self.conf_store_keys.update({
                "cluster_id":f"{self.server_node_info}>cluster_id"
            })
        if phase == "init":
            self.conf_store_keys.update({
                "csm_user_key": "cortx>software>csm>user",
                "cluster_id":f"{self.server_node_info}>cluster_id"
                })
        elif phase == "post_upgrade":
            self.conf_store_keys.update({
                "csm_user_key": "cortx>software>csm>user",
                "server_node_info":self.server_node_info,
                "data_public_fqdn":f"{self.server_node_info}>network>data>public_fqdn",
                "cluster_id":f"{self.server_node_info}>cluster_id",
            })

        self._validate_conf_store_keys(CSMWeb.CONSUMER_INDEX)
        return 0

    def _validate_conf_store_keys(self, index, keylist=None):
        Log.info(f"Validating confstore keys: {keylist}")
        if not keylist:
            keylist = list(self.conf_store_keys.values())
        if not isinstance(keylist, list):
            raise CSMWebSetupError(rc=-1, message="Keylist should be kind of list")
        ConfKeysV().validate("exists", index, keylist)
    
    def _validate_nodejs_installed(self):
        Log.info("Validating NodeJS 12.13.0")
        PathV().validate('exists', [f"file://{self.NODE_JS_PATH}"])

    def _validate_cortxcli(self):
        Log.info("Validating third party rpms")
        try:
            PkgV().validate("rpms", ["cortx-cli"])
            os.environ["CLI_SETUP"] = "true"            
        except VError as ve:
            os.environ["CLI_SETUP"] = "false"
            Log.error(f"cortx-cli package is not installed: {ve}")

    def _set_service_user(self):
        """
        This Method will set the username for service user to Self._user
        :return:
        """
        Log.info("Setting service user")
        self._user = Conf.get(self.CONSUMER_INDEX, self.conf_store_keys["csm_user_key"])
        
    def _get_cluster_id(self):
        """
        This Method will get the cluster ID and set to self._cluster_id
        :return:
        """
        Log.info("Setting cluster_id")
        self._cluster_id = Conf.get(self.CONSUMER_INDEX, self.conf_store_keys["cluster_id"])

    def _config_user(self):
        """
        Check user already exist and create if not exist
        If reset true then delete user
        """
        if not self._is_user_exist():
            Log.info("Creating Service User without password.")
            CSMWeb._run_cmd((f"useradd -M {self._user}"))
            Log.info("Adding Service User to Wheel Group.")
            CSMWeb._run_cmd(f"usermod -aG wheel {self._user}")
            Log.info("Enabling nologin for Service user.")
            CSMWeb._run_cmd(f"usermod -s /sbin/nologin {self._user}")
            if not self._is_user_exist():
                Log.error("Service User Creation Failed.")
                raise CSMWebSetupError(rc=-1, message=f"Unable to create {self._user} user")
        else:
            Log.info(f"User {self._user} already exist")

    def _is_user_exist(self):
        """
        Check if user exists
        """
        try:
            u = pwd.getpwnam(self._user)
            self._uid = u.pw_uid
            self._gid = u.pw_gid
            return True
        except KeyError as err:
            return False

    def _configure_service_user(self):
        """
        Configures the Service user in CSM web service files.
        :return:
        """
        Log.info(f"Update file for <USER>:{self._user}")
        service_file_data = Text(self.CSM_WEB_SERVICE).load()
        if not service_file_data:
            Log.warn(f"File {self.CSM_WEB_SERVICE} not updated.")            
        data = service_file_data.replace('<USER>', self._user)
        Text(self.CSM_WEB_SERVICE).dump(data)

    def _allow_access_to_pvt_ports(self):
        Log.info("Binding low ports to start a service as non-root")
        CSMWeb._run_cmd(f"setcap CAP_NET_BIND_SERVICE=+ep {self.NODE_JS_PATH}")

    @staticmethod
    def _run_cmd(cmd):
        """
        Run command and throw error if cmd failed
        """

        _err = ""
        Log.info(f"Executing cmd: {cmd}")
        _proc = SimpleProcess(cmd)
        _output, _err, _rc = _proc.run(universal_newlines=True)
        Log.info(f"Output: {_output}, \n Err:{_err}, \n RC:{_rc}")
        if _rc != 0:
            raise CSMWebSetupError(rc=_rc,message=f'Obtained non-zero response count for cmd: {cmd} Error: {_err} ')
        return _output, _err, _rc

    def _fetch_csm_user_password(self, decrypt=False):
        """
        This Method Fetches the Password for CSM User from Provisioner.
        :param decrypt:
        :return:
        """
        csm_user_pass = None
        if self._is_env_dev:
            decrypt = False
        Log.info("Fetching CSM User Password from Conf Store.")
        csm_user_pass = Conf.get(self.CONSUMER_INDEX, self.conf_store_keys["secret_key"])
        if decrypt and csm_user_pass:
            Log.info("Decrypting CSM Password.")
            try:
                password_decryption_key = self.conf_store_keys["secret_key"].split('>')[0]
                cipher_key = Cipher.generate_key(self._cluster_id, password_decryption_key)                
            except KvError as error:
                Log.error(f"Failed to Fetch Cluster Id. {error}")
                return None
            except Exception as e:
                Log.error(f"{e}")
                return None
            try:
                decrypted_value = Cipher.decrypt(cipher_key,
                                                 csm_user_pass.encode("utf-8"))
                return decrypted_value.decode("utf-8")
            except CipherInvalidToken as error:
                Log.error(f"Decryption for CSM Failed. {error}")
                raise CipherInvalidToken(f"Decryption for CSM Failed. {error}")
        return csm_user_pass

    def _set_deployment_mode(self):
        """ Setting deployment mode """
        Log.info("Setting deployment mode")
        if Conf.get(self.CONSUMER_INDEX, "DEPLOYMENT>mode") == 'dev':
            Log.info("Running Csm Setup for Dev Mode.")
            self._is_env_dev = True        

    def _set_password_to_csm_user(self):
        """Setting up password to service user"""
        Log.info("Setting up password to service user")
        if not self._is_user_exist():
            raise CSMWebSetupError(rc=-1, message=f"{self._user} not created on system.")
        Log.info("Fetch decrypted password.")
        _password = self._fetch_csm_user_password(decrypt=True)
        if not _password:
            Log.error("Service User Password Not Available.")
            raise CSMWebSetupError(rc=-1, message="Service Usergi Password Not Available.")
        _password = crypt.crypt(_password, "22")
        self._run_cmd(f"usermod -p {_password} {self._user}")

    def _fetch_management_ip(self):
        virtual_host_key = f"cluster>{self._cluster_id}>network>management>virtual_host"
        self._validate_conf_store_keys(self.CONSUMER_INDEX,[virtual_host_key])
        virtual_host = Conf.get(self.CONSUMER_INDEX, virtual_host_key)
        if not virtual_host and not self._is_env_dev:
            Log.error("Management IP is not provided hence raising error.")
            raise CSMWebSetupError(rc=-1, message="Management IP is not provided.")
        Log.info(f"Fetch Virtual host: {virtual_host}")
        return virtual_host
    
    def _fetch_key_value(self, key: str, default_value: any):
        key = f"cluster>{self._cluster_id}>network>management>{key}"
        value = default_value
        try:
            self._validate_conf_store_keys(self.CONSUMER_INDEX,[key])
            value = Conf.get(self.CONSUMER_INDEX, key)
        except VError as ve:
            Log.error("Protocol key does not exist. Set default port as protocol {ve}")
        
        Log.info(f"Fetch {key}: {value}")
        return value

    def _configure_csm_web_keys(self):
        self._run_cmd(f"cp {self.CSM_WEB_DIST_ENV_FILE_PATH} {self.CSM_WEB_DIST_ENV_FILE_PATH}_tmpl")
        Log.info("Configuring CSM Web keys")
        virtual_host = self._fetch_management_ip()
        https_port = self._fetch_key_value("https_port", 443)
        http_port = self._fetch_key_value("http_port", 80)
        server_protocol = self._fetch_key_value("protocol", "https")
        agent_host = self._fetch_key_value("agent_host", "localhost")
        agent_port = self._fetch_key_value("agent_port", "28101")
        agent_protocol = self._fetch_key_value("agent_protocol", "http")
        Log.info(f"Set MANAGEMENT_IP:{virtual_host} and Port: {https_port} to csm web config")
        Conf.set(self.ENV_INDEX, "MANAGEMENT_IP", virtual_host)
        Conf.set(self.ENV_INDEX, "HTTPS_NODE_PORT", https_port)
        Conf.set(self.ENV_INDEX, "HTTP_NODE_PORT", http_port)
        Conf.set(self.ENV_INDEX, "SERVER_PROTOCOL", server_protocol)
        Conf.set(self.ENV_INDEX, "CSM_AGENT_HOST", agent_host)
        Conf.set(self.ENV_INDEX, "CSM_AGENT_PORT", agent_port)
        Conf.set(self.ENV_INDEX, "CSM_AGENT_PROTOCOL", agent_protocol)
        Conf.save(self.ENV_INDEX)
