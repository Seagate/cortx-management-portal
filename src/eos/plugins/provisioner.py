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
from csm.core.data.upgrade import PackageInformation


class PackageValidationError(Exception):
    pass


class ProvisionerPlugin:
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
        # TODO: Provisioner api to get last firmware upgrade status.
        Log.debug("Getting last firmware upgrade status")
        return {"status": "Successful",
                "DateTime": "YYYY-MM-DD-HH:MM:SS",
                "version": "1.2.3"}