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
import Vue from "vue";
import Vuex from "vuex";
import { Module, VuexModule, Mutation } from "vuex-module-decorators";

Vue.use(Vuex);

@Module({
  namespaced: true
})
export default class MessageDialog extends VuexModule {
  public showDialog: boolean = false;
  public title: string = "Error";
  public message: string = "Internal error occurred";
  public type: "warning" | "error" = "error";
  private timer: any;

  @Mutation
  public show(dialogPayload: any) {
    if (this.showDialog) {
      clearTimeout(this.timer);
    }
    if (dialogPayload) {
      this.type = dialogPayload.type ? dialogPayload.type : "error";
      this.title = dialogPayload.title ? dialogPayload.title : "Error";
      this.message = dialogPayload.message
        ? dialogPayload.message
        : "Internal error occurred";
      this.showDialog = true;
      this.timer = setTimeout(() => {
        this.showDialog = false;
      }, 10000);
    }
  }

  @Mutation
  public hide() {
    clearTimeout(this.timer);
    this.showDialog = false;
    this.type = "error";
    this.title = "Error";
    this.message = "Internal error occurred";
  }

  @Mutation
  public setTitle(title: string) {
    this.title = title;
  }

  @Mutation
  public setMessage(message: string) {
    this.message = message;
  }
}
