# import provisioner
from csm.common.log import Log


class Provisioner:
    def __init__(self):
        self._provisioner = "provisioner"

    async def validate_package(self, file_path):
        # TODO: Provisioner api to validate package tobe implented here
        Log.debug(f"Validating package: f{file_path}")
        return {"version": "1.2.3",
                "file_path": file_path}

    async def trigger_firmware_upload(self):
        # TODO: Provisioner api to trigger firmware update tobe implented here
        return "Firmware update triggered succesfully"

    async def get_last_firmware_upgrade_status(self):
        # TODO: Provisioner api to get last firmware upgrade status.
        Log.debug("Getting last firmware upgrade status")
        return {"status": "Successful",
                "DateTime": "YYYY-MM-DD-HH:MM:SS",
                "version": "1.2.3"}
