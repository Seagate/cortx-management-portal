/*****************************************************************************
 Filename:          message-dialog.ts
 Description:       Message Dialog store

 Creation Date:     19/12/2019
 Author:            Sri Bhargav Metta

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
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
  public message: string = "Internal error occured";
  private timer: any;

  @Mutation
  public show(dialogPayload: any) {
    if (this.showDialog) {
      clearTimeout(this.timer);
    }
    if (dialogPayload) {
      this.title = dialogPayload.title ? dialogPayload.title : "Error";
      this.message = dialogPayload.message
        ? dialogPayload.message
        : "Internal error occured";
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
    this.title = "Error";
    this.message = "Internal error occured";
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
