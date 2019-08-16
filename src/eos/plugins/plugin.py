#!/usr/bin/python

"""
 ****************************************************************************
 Filename:          plugin.py
 Description:       Contains functionality for various plugins like Alerts, S3 etc.

 Creation Date:     09/08/2019
 Author:            Pawan Kumar Srivastava

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 ****************************************************************************
"""

from abc import ABC, ABCMeta, abstractmethod
from csm.common.errors import CsmError
import errno

class CsmPlugin(metaclass=ABCMeta):
    """
    This is an abstract class. Various plugins will implement this interface i.e. Alert plugin, S3 plugin etc.
    """
    @abstractmethod
    def init(self):
        raise CsmError(errno.ENOSYS, 'init not implemented for Plugin class')

    @abstractmethod
    def process_request(self, **kwargs):
        """
        This method will handle GET/POST calls. 
        """
        raise CsmError(errno.ENOSYS, 'process_request not implemented for Plugin class') 
