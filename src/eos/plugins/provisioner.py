# import provisioner

class ProvisionerPlugin():
    def __init__(self):
        self._provisioner = "provisioner"

    async def validate_package(self, file_path):
        # TODO: Provisioner api to validate package tobe implented here            
        return "1.2.3"
    
    async def trigger_firmware_upload(self):
        # TODO: Provisioner api to trigger firmware update tobe implented here
        return "Firmware update triggered succesfully"