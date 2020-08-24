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
