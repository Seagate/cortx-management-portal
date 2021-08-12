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
  <v-overlay color="rgba(0, 0, 0, 0.75)" :value="value" id="cortx-info-dialog">
    <div class="cortx-msg-dialog-container">
      <div id="msg-dialog-header"
        :class="titleBackgroundClasses"
      >
        <label class="cortx-msg-dialog-header-title" id="msg-dialog-title">{{ titleLocal }}</label>
      </div>
      <div class="cortx-msg-dialog-body">
        <div class="cortx-msg-dialog-message" id="dialog-message">
          <label id="info-dialog-message-label" class="cortx-text-lg cortx-text-bold">{{ messageLocal }}</label>
        </div>
      </div>
      <div class="px-6 pt-3 pb-4">
        <button type="button" :class="okBtnClasses" @click="closeDialog()">{{ okBtnTitle }}</button>
      </div>
    </div>
    <span style="display: none;">{{ typeLocal }}</span>
  </v-overlay>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "cortx-info-dialog"
})
export default class CortxInfoDialog extends Vue {

    @Prop({ required: true })
    public value: boolean;

    @Prop({ required: false, default: "information" })
    public type: string;

    @Prop({ required: false, default: "Information" })
    public title: string;

    @Prop({ required: true })
    public message: string;

    @Prop({ required: false, default: "Ok" })
    public okBtnTitle: string;

    public showDialog: boolean = false;

    public titleBackgroundClasses: string = "";
    public okBtnClasses: string = "";

    public closeDialog() {
        this.$emit("input", false);
        this.$emit("close");
    }

    get typeLocal() {
      this.titleBackgroundClasses = `cortx-msg-dialog-header cortx-chip-${this.type}`;
      this.okBtnClasses = `cortx-btn-one cortx-btn-one-${this.type}`;
      return this.type;
    }

    get titleLocal() {
      return this.title;
    }

    get messageLocal() {
      return this.message;
    }
}
</script>
<style lang="scss" scoped>
.cortx-msg-dialog-container {
  background: #ffffff;
  width: 500px;
  max-height: 283px;
  margin-top: -50px;
}
.cortx-msg-dialog-header {
  height: 66px;
  display: flex;
  flex-wrap: nowrap;
  padding-top: 24px;
  padding-left: 24px;
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
</style>
