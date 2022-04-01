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
  <div>
    <v-dialog
      value="true"
      scrollable
      :max-width="modalWidth"
      :persistent="persistent"
    >
      <v-card>
        <v-card-title :class="infoType">
          <div class="title-container">
            <div class="title-content">{{ getModalTitle }}</div>
            <v-icon
              class="close-btn"
              :color="invertedColor"
              @click="$close('close')"
              >mdi-close</v-icon
            >
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="sgt-content-container">
          <div v-if="modalContentType === 'text'" class="text-content">
            <p>{{ modalContent }}</p>
          </div>
          <template v-else>
            <div class="text-content" v-html="modalContent"></div>
          </template>
        </v-card-text>
        <v-card-actions class="sgt-button-container">
          <v-btn
            :color="dialogColor"
            @click="$close('ok')"
            dark
            v-if="modalType !== 'prompt'"
            >{{ okButtonLabel }}</v-btn
          >
          <template v-else>
            <v-btn :color="dialogColor" @click="$close('yes')" dark>{{
              yesButtonLabel
            }}</v-btn>
            <v-btn :color="dialogColor" @click="$close('no')" dark outlined>{{
              noButtonLabel
            }}</v-btn>
          </template>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";
import { DialogComponent } from "vue-modal-dialogs";
import { SgtDialogConst } from "./SgtDialog.constant";

@Component({
  name: "SgtDialog",
  components: {},
})
export default class SgtDialog extends DialogComponent<boolean> {
  @PropSync("showModal", { required: false, default: false })
  private dialog: boolean;
  @Prop({ required: true, default: "message" }) private modalType:
    | "prompt"
    | "message";
  @Prop({ required: false }) private modalTitle: string;
  @Prop({ required: true }) private modalContent: string;
  @Prop({ required: false, default: "neutral" }) private infoType:
    | "success"
    | "alert"
    | "warning"
    | "neutral";
  @Prop({ required: false, default: "text" }) private modalContentType:
    | "text"
    | "html";
  @Prop({ required: false, default: SgtDialogConst.modalWidth })
  private modalWidth: string;
  @Prop({ required: false, default: SgtDialogConst.okButtonLabel })
  private okButtonLabel: string;
  @Prop({ required: false, default: SgtDialogConst.yesButtonLabel })
  private yesButtonLabel: string;
  @Prop({ required: false, default: SgtDialogConst.noButtonLabel })
  private noButtonLabel: string;
  @Prop({ required: false, default: true }) private persistent: boolean;

  private dialogConst = SgtDialogConst;

  get dialogColor() {
    return this.dialogConst.infoTypeColors[this.infoType];
  }
  get invertedColor() {
    return this.infoType === "neutral"
      ? this.dialogConst.infoTypeColors.neutral
      : "#FFFFFF";
  }

  get getModalTitle() {
    return this.modalTitle
      ? this.modalTitle
      : this.dialogConst.infoTypeTitle[this.infoType];
  }
}
</script>

<style lang="scss">
.title-container {
  width: 100%;
  .close-btn {
    cursor: pointer;
    float: right;
  }
  .title-content {
    display: inline-block;
  }
}
.sgt-content-container {
  min-height: 6rem;
  padding: 2rem 1.5rem !important;
}

.sgt-button-container {
  padding: 1.5rem !important;
}

.alert {
  background-color: $error;
  color: $light;
}
.warning {
  background-color: $warning;
  color: $light;
}
.success {
  background-color: $success;
  color: $light;
}
.neutral {
  background-color: $light;
  color: $dark;
}
</style>
