# import provisioner

class ProvisionerPlugin():
    def __init__(self):
        self._provisioner = "provisioner"

    async def validate_package(self, file_path):
        with open(file_path, 'r') as fp:
            # print(fp.read())
            return "1.2.3"
    
    async def trigger_firmware_upload(self):
        
        return "Firmware update triggered succesfully"