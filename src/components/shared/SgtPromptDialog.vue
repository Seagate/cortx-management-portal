<!--
* CORTX-CSM: CORTX Management web.
* Copyright (c) 2022 Seagate Technology LLC and/or its Affiliates
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
* please email opensource@seagate.com.
-->
<template>
  <v-overlay color="rgba(0, 0, 0, 0.75)" :value="value" id="sgt-prompt-dialog">
    <div class="sgt-msg-dialog-container">
      <div id="msg-dialog-header" class="sgt-msg-dialog-header">
        <label id="msg-dialog-title">{{ titleLocal }}</label>
      </div>
      <div class="sgt-msg-dialog-body">
        <div class="sgt-msg-dialog-message" id="dialog-message">
          <label
            id="prompt-dialog-message-label"
            class="sgt-text-lg sgt-text-bold"
            >{{ messageLocal }}</label
          >
        </div>
      </div>
      <div class="px-6 pt-3 pb-4">
        <button
          type="button"
          id="prompt-dialog-btn-yes"
          class="sgt-btn-one sgt-btn-one-success"
          @click="closeDialog('yes')"
        >
          {{ yesBtnTitle }}
        </button>
        <button
          type="button"
          id="prompt-dialog-btn-no"
          class="ml-4 sgt-btn-two"
          @click="closeDialog('no')"
        >
          {{ noBtnTitle }}
        </button>
      </div>
    </div>
  </v-overlay>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "SgtPromptDialog",
})
export default class SgtPromptDialog extends Vue {
  @Prop({ required: true })
  public value: boolean;

  @Prop({ required: false, default: "Information" })
  public title: string;

  @Prop({ required: true })
  public message: string;

  @Prop({ required: false, default: "Yes" })
  public yesBtnTitle: string;

  @Prop({ required: false, default: "No" })
  public noBtnTitle: string;

  public closeDialog(prompt: string) {
    this.$emit("input", false);
    this.$emit("close", prompt);
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
.sgt-msg-dialog-container {
  background: #ffffff;
  width: 500px;
  max-height: 283px;
  margin-top: -50px;
}
.sgt-msg-dialog-header {
  height: 66px;
  display: flex;
  flex-wrap: nowrap;
  padding-top: 24px;
  padding-left: 24px;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 26px;
  border-bottom: 1px solid #9e9e9e;
  color: #000000;
}
.sgt-msg-dialog-body {
  max-height: 217px;
  padding: 24px;
}
.sgt-msg-dialog-message {
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.87);
  overflow: auto;
  word-wrap: break-word;
}
</style>
