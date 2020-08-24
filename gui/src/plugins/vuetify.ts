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
import "@mdi/font/css/materialdesignicons.css";
import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "mdi",
  },
  theme: {
    options: {
      customProperties: true
    },
    themes: {
      light: {
        csmprimary: "#6EBE49",
        csmdisabled: "#B7B7B7",
        csmborder: "#9E9E9E",
        csmheader: "#E8E8E8",
        csmtooltip: "#454545",
        csmerror: "#DC1F2E",
        csmwarning: "#F7A528",
        csmsuccess: "#6EBE49",
        csminfo: "#00A1DD",
        csmoverlay: "#9E9E9E",
      },
    },
  }
});
