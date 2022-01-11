/*
* CORTX-CSM: CORTX Management web and CLI interface.
* Copyright (c) 2020 Seagate Technology LLC and/or its Affiliates
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published
* by the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU Affero General Public License for more details.
* You should have received a copy of the GNU Affero General Public License
* along with this program. If not, see <https://www.gnu.org/licenses/>.
* For any questions about this software or licensing,
* please email opensource@seagate.com or cortx-questions@seagate.com.
*/
export abstract class ResourceConfig {

    public static getActionsOfResource(resource: string, status: string) {
        let actions;
        switch (resource) {
            case "cluster" :
                actions = [];
                break;
            case "site" :
                actions = [];
                break;
            case "rack" :
                actions = [];
                break;
            case "node" :
                actions = [
                    {
                        action: "start",
                        title: "Start",
                        icon: require(`@/assets/health/node/${status}/operations/start.svg`),
                        isEnabled: status === "offline" || status === "failed"
                    },
                    {
                        action: "stop",
                        title: "Stop",
                        icon: require(`@/assets/health/node/${status}/operations/stop.svg`),
                        isEnabled: status === "online"
                    },
                    {
                        action: "poweroff",
                        title: "Power off",
                        icon: require(`@/assets/health/node/${status}/operations/poweroff.svg`),
                        isEnabled: status === "online"
                    },
                    {
                        action: "powerandstorageoff",
                        title: "Power and storage off",
                        icon: require(`@/assets/health/node/${status}/operations/powerandstorageoff.svg`),
                        isEnabled: status === "online"
                    }
                ];
                break;
        }
        return actions;
    }
}

export const COLOR_CODES: any = {
    online: {
        color: {
            dark: "#6EBE49",
            light: "#F8FCF6"
        }
    },
    offline: {
        color: {
            dark: "#DC1F2E",
            light: "#FDF4F5"
        }
    },
    failed: {
        color: {
            dark: "#DC1F2E",
            light: "#FDF4F5"
        }
    },
    degraded: {
        color: {
            dark: "#F7A528",
            light: "#FFFAF4"
        }
    },
    unknown: {
        color: {
            dark: "#B7B7B7",
            light: "#F9F9F9"
        }
    }
};

export const STATUS_CONTAINER_WIDTH: any = {
    online: 74,
    offline: 79,
    failed: 70,
    degraded: 94,
    unknown: 92
};
