/*****************************************************************************
 Filename:          store.ts
 Description:       Root Store

 Creation Date:     30/08/2019
 Author:            Sanjeevan Bhave

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
import Vue from "vue";
import Vuex from "vuex";
import alertNotification from "./modules/alert-notification";
import alerts from "./modules/alerts";
import systemConfig from "./modules/system-configuration";
import userLogin from "./modules/user-login";
import bucket from "./modules/s3-bucket";
import performanceStats from "./modules/performance-stats";
import messageDialog from "./modules/message-dialog";
import firmware from "./modules/firmware";

import download from "./modules/download";
import maintenance from "./modules/maintenance";
import sslupload from "./modules/ssl-upload";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        alertNotification,
        alerts,
        systemConfig,
        userLogin,
        bucket,
        performanceStats,
        messageDialog,
        firmware,
        download,
        maintenance,
        sslupload
    }
});
