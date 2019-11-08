#!/usr/bin/env python3

"""
 ****************************************************************************
 Filename:          stats.py
 Description:       To retrive and aggregate elasticsearch Data

 Creation Date:     10/31/2019
 Author:            Ajay Paratmandali

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 ****************************************************************************
"""

import aiohttp
import asyncio

from csm.common.plugin import CsmPlugin

class StatsPlugin(CsmPlugin):
    """
    Stats plugin is used to aggregate elasticsearch data using kibana
    """
    def __init__(self, provider):
        """
        Initialize stats plugin
        """
        super().__init__()
        self._provider = provider

    def init(self):
        pass

    # TODO - directly cal provider from service
    async def process_request(self, stats_id, panel, from_t, duration_t,
                                metric_list=[], interval="auto",
                                output_format="gui", query=""):
        """
        Process request comming from csm stats api
        Parameter:
            stats_id: Request id for aggregation
            panel: Which type metric throughput, iops, etc.
            from_t: Starting time of stats
            duration_t: Ending time of stats
            metric_list: List of operation
            interval: Difference between two datapoint [default: auto]
            output_format: Json format either redable or gui. [default: gui]
            query: Optional direct query to timelion_api
        """
        res = await self._provider.process_request(stats_id, panel, from_t, duration_t,
                                    metric_list, interval,
                                    output_format, query)
        return res
