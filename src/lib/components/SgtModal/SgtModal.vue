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
    <v-dialog value="true" scrollable :max-width="modalWidth">
      <v-card>
        <v-card-title>
          <div>
            {{ modalTitle }}
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="content-container">
          <div v-if="modalContentType === 'text'" class="text-content">
            <p>{{ modalContent }}</p>
          </div>
          <template v-else>
            <div v-html="modalContent"></div>
          </template>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="csmprimary"
            @click="$close('ok')"
            dark
            v-if="modalType !== 'prompt'"
            >{{ okButtonLabel }}</v-btn
          >
          <template v-else>
            <v-btn color="csmprimary" @click="$close('yes')" dark>{{
              yesButtonLabel
            }}</v-btn>
            <v-btn color="csmprimary" @click="$close('no')" dark outlined>{{
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

@Component({
  name: "SgtModal",
  components: {},
})
export default class SgtModal extends DialogComponent<boolean> {
  @PropSync("showModal", { required: false, default: false })
  private dialog: boolean;
  @Prop({ required: true, default: "info" }) private modalType:
    | "prompt"
    | "info"
    | "message";
  @Prop({ required: true }) private modalTitle: string;
  @Prop({ required: true }) private modalContent: string;
  @Prop({ required: false, default: "text" }) private modalContentType:
    | "text"
    | "html";
  @Prop({ required: false, default: "600px" }) private modalWidth: string;
  @Prop({ required: false, default: "Ok" }) public okButtonLabel: string;
  @Prop({ required: false, default: "Yes" }) public yesButtonLabel: string;
  @Prop({ required: false, default: "No" })
  public noButtonLabel: string;
}
</script>

<style lang="scss">
.content-container {
  min-height: 8rem;
}
</style>