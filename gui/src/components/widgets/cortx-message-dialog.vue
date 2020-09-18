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
<template>
  <v-overlay color="rgba(0, 0, 0, 0.75)" :value="$store.state.messageDialog.showDialog" id="show-msg-diagogbox">
    <div class="cortx-msg-dialog-container">
      <div id="msg-dialog-header"
        class="cortx-msg-dialog-header"
        :class="{ 'cortx-chip-warning': $store.state.messageDialog.type === 'warning', 'cortx-chip-alert': $store.state.messageDialog.type === 'error' }"
      >
        <label class="cortx-msg-dialog-header-title" id="msg-dialog-title">{{ $store.state.messageDialog.title }}</label>
        <div class="cortx-msg-dialog-close" @click="closeDialog()" id="close-msg-dialogbox"></div>
      </div>
      <div class="cortx-msg-dialog-body">
        <div class="cortx-msg-dialog-message" id="dialog-message">
          <label id="dialog-message-label">{{ $store.state.messageDialog.message }}</label>
        </div>
      </div>
    </div>
  </v-overlay>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "cortx-message-dialog"
})
export default class CortxMessageDialog extends Vue {
  public closeDialog() {
    this.$store.commit("messageDialog/hide");
  }
}
</script>
<style lang="scss" scoped>
.cortx-msg-dialog-container {
  background: #ffffff;
  width: 500px;
  max-height: 283px;
}
.cortx-msg-dialog-header {
  height: 66px;
  display: flex;
  flex-wrap: nowrap;
  padding-top: 24px;
  padding-left: 33px;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 26px;
}
.cortx-msg-dialog-body {
  max-height: 217px;
  padding: 24px;
}
.cortx-msg-dialog-message {
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.87);
  overflow: auto;
  word-wrap: break-word;
}
.cortx-msg-dialog-header-title {
  width: 415px;
}
.cortx-msg-dialog-close {
  width: 28px;
  height: 28px;
  position: relative;
  transform: rotate(45deg);
  -ms-transform: rotate(45deg); /* IE 9 */
  -webkit-transform: rotate(45deg); /* Safari and Chrome */
  cursor: pointer;
}

.cortx-msg-dialog-close:before,
.cortx-msg-dialog-close:after {
  content: "";
  position: absolute;
  z-index: -1;
  background: #ffffff;
}

.cortx-msg-dialog-close:before {
  top: 6px;
  left: 13px;
  width: 2px;
  height: 16px;
}

.cortx-msg-dialog-close:after {
  top: 13px;
  left: 6px;
  height: 2px;
  width: 16px;
}
</style>
