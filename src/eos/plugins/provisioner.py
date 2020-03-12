"""
 ****************************************************************************
 Filename:          provisioner.py
 Description:       Contains the implementation of Provisioner plugin.

 Creation Date:     03/12/2020
 Author:            Alexander Nogikh

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 ****************************************************************************
"""

# import provisioner
from csm.common.log import Log
from csm.common.errors import InvalidRequest
from csm.core.data.models.upgrade import PackageInformation


class PackageValidationError(InvalidRequest):
    pass


class ProvisionerPlugin:
    # TODO: implement the plugin
    def __init__(self):
        pass

    async def validate_hotfix_package(self, path) -> PackageInformation:
        Log.debug(f"Validating package: f{path}")
        validation_result = PackageInformation()
        validation_result.version = '1.2.3'
        return validation_result

    async def trigger_software_upgrade(self, path):
        Log.debug(f"Validating package: f{path}")
        pass

    async def get_software_upgrade_status(self):
        Log.debug("Getting last firmware upgrade status")
        pass