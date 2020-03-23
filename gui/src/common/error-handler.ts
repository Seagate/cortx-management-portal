/*****************************************************************************
 Filename:          error-handler.ts
 Description:       Global error handler.

 Creation Date:     19/12/2019
 Author:            Sri Bhargav Metta

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
import store from "../store/store";

export function errorHandler(err: any, vm: any, info: any) {
  store.dispatch("systemConfig/hideLoader");
  if (err.error) {
    store.commit("messageDialog/show", {
      title: "Error",
      message:
        err.data && err.data.message ? err.data.message : err.error.message
    });
  } else {
    store.commit("messageDialog/show");
  }
}
