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
import { Component, Vue } from "vue-property-decorator";
import { Api } from "../services/Api";

@Component
export default class ClusterManagementMixin extends Vue {
  public operationRequestObj: any = {
    resource: "",
    loaderMsg: "",
    requestObj: {},
  };

  public isShowInfoDialog = false;
  public infoDialogType = "";
  public infoDialogTitle = "";
  public infoDialogMessage = "";

  public isShowPromptDialog = false;
  public promptDialogTitle = "";
  public promptDialogMessage = "";

  public async getHealthData(isTreeFormat: boolean) {
    let healthData;
    if (isTreeFormat) {
      const healthQueryParams = {
        depth: 0,
      };
      // this.$store.dispatch("systemConfig/showLoader", "Fetching health...");
      const res: any = await Api.getData("/health/health-graphical", {
        isDummy: true,
      });
      // this.$store.dispatch("systemConfig/hideLoader");
      healthData = res.data;
    }
    return healthData;
  }

  public showInfoDialog(type: string, title: string, message: string) {
    this.infoDialogType = type;
    this.infoDialogTitle = title;
    this.infoDialogMessage = message;
    this.isShowInfoDialog = true;
  }

  public showPromptDialog(title: string, message: string) {
    this.promptDialogTitle = title;
    this.promptDialogMessage = message;
    this.isShowPromptDialog = true;
  }

  public async performAction(resource: any, action: string) {
    switch (resource.resource) {
      case "cluster":
        break;
      case "node":
        await this.requestOperationOnNode(resource, action);
        break;
    }
  }

  public async requestOperationOnNode(resource: any, action: string) {
    switch (action) {
      case "start":
        await this.requestStartOperationOnNode(resource);
        break;
      case "stop":
        await this.requestStopOperationOnNode(resource, false);
        break;
      case "poweroff":
        await this.requestStopOperationOnNode(resource, true);
        break;
      case "powerandstorageoff":
        await this.requestStopOperationOnNode(resource, true, true);
        break;
    }
  }

  public async requestStartOperationOnNode(resource: any) {
    const requestObj: any = {
      operation: "start",
      arguments: {
        resource_id: resource.id,
      },
    };
    const loaderMsg: string = `Starting node ${resource.id}.`;
    this.buildOperationRequestObj("node", loaderMsg, requestObj);
    const promptMsg: string = `Are you sure you want to start node ${resource.id}?`;
    this.showPromptDialog("Confirmation", promptMsg);
  }

  public async requestStopOperationOnNode(
    resource: any,
    isPoweroff: boolean,
    isStorageOff?: boolean
  ) {
    const clusterStatus: any = await this.getNodeStopClusterStatus(resource.id);
    let warnMsgPrefix: string = "Stopping";
    const requestObj: any = {
      operation: "stop",
      arguments: {
        resource_id: resource.id,
        force: true,
      },
    };
    if (isPoweroff) {
      warnMsgPrefix = "Powering off";
      requestObj.operation = "poweroff";
      if (isStorageOff) {
        requestObj.arguments.storageoff = true;
      }
    }
    const loaderMsg: string = `${warnMsgPrefix} node ${resource.id}.`;
    this.buildOperationRequestObj("node", loaderMsg, requestObj);
    if (clusterStatus.status === "ok") {
      const promptMsg: string = `Are you sure you want to ${requestObj.operation} node ${resource.id}?`;
      this.showPromptDialog("Confirmation", promptMsg);
    } else {
      const warnMsg: string = `
                ${warnMsgPrefix} node ${resource.id} will bring the cluster offline.
                Are you sure you want to continue?
            `;
      this.showPromptDialog("Confirmation", warnMsg);
    }
  }

  public async promptDialogClosed(prompt: string) {
    this.clearPromptDialog();
    if (prompt === "yes") {
      this.$store.dispatch(
        "systemConfig/showLoader",
        this.operationRequestObj.loaderMsg
      );
      // API call should be made and the response has to be stored in the resp variable below
      const resp: any = {
        data: {
          message: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        },
      };
      this.$store.dispatch("systemConfig/hideLoader");
      this.showInfoDialog("success", "Success", resp.data.message);
    }
    this.clearOperationRequestObj();
  }

  public clearPromptDialog() {
    this.promptDialogTitle = "";
    this.promptDialogMessage = "";
  }

  public clearInfoDialog() {
    this.infoDialogType = "";
    this.infoDialogTitle = "";
    this.infoDialogMessage = "";
  }

  public async getNodeStopClusterStatus(node_id: string) {
    this.$store.dispatch(
      "systemConfig/showLoader",
      "Fetching cluster status..."
    );
    // API call should be made and the response has to be stored in the res variable below
    const res: any = { data: { status: "ok" } };
    this.$store.dispatch("systemConfig/hideLoader");
    return res.data;
  }

  public buildOperationRequestObj(
    resource: string,
    loaderMsg: string,
    requestObj: any
  ) {
    this.operationRequestObj.resource = resource;
    this.operationRequestObj.loaderMsg = loaderMsg;
    this.operationRequestObj.requestObj = requestObj;
  }

  public clearOperationRequestObj() {
    this.operationRequestObj.resource = "";
    this.operationRequestObj.loaderMsg = "";
    this.operationRequestObj.requestObj = {};
  }
}
