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
  <div v-if="show" class="cortx-modal-container">
    <div class="cortx-modal cortx-modal-confirmation">
      <div class="cortx-modal-header">
        <label :id="title">{{ title }}</label>
        <img
          id="confirmation-dialogclose"
          class="cortx-modal-close"
          :src="require('@/assets/close-green.svg')"
          @click="$emit('closeDialog', false)"
        />
      </div>
      <div class="cortx-modal-body">
        <div class="title title-container">
          <img class="severity-img mr-2" :src="severityIcons[severity]" />
          <span v-if="isMessageInHTML" class="finish-text" v-html="message"></span>
          <span v-else class="finish-text" :id="cofirmation-msg">{{ message }}</span>
        </div>
        <br />
        <div>
          <span class="submessage-text">{{ submessage }}</span>
        </div>
        <div class="mt-8 nav-btn">
          <button
           id="confirmation-dialogbox-btn"
            type="button"
            class="cortx-btn-primary"
            v-if="confirmButtonText"
            :disabled="confirmButtonDisabled"
            :class="
              severity === 'danger' ? 'cortx-btn-danger' : 'cortx-btn-primary'
            "
            @click="$emit('closeDialog', true)"
          >
            {{ confirmButtonText }}
          </button>
          <button
            id="confirmation-dialog-cancel-btn"
            type="button"
            v-if="cancelButtonText"
            :disabled="cancelButtonDisabled"
            class="cortx-btn-tertiary"
            @click="$emit('closeDialog', false)"
          >
            {{ cancelButtonText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "cortx-confirmation-dialog"
})
export default class CortxConfirmationDialog extends Vue {
  @Prop({ required: true, default: false })
  public show!: boolean;

  @Prop({ required: false, default: "Confirmation" })
  public title!: string;

  @Prop({ required: false })
  public message!: string;

  @Prop({ required: false, default: false })
  public isMessageInHTML!: boolean;

  @Prop({ required: false })
  public submessage!: string;

  // Severity has three levels: 'info', 'warning', 'danger'
  @Prop({ required: false, default: "info" })
  public severity!: string;

  @Prop({ required: false, default: "Yes" })
  public confirmButtonText!: string;

  @Prop({ required: false, default: false })
  public confirmButtonDisabled!: boolean;

  @Prop({ required: false, default: "Cancel" })
  public cancelButtonText!: string;

  @Prop({ required: false, default: false })
  public cancelButtonDisabled!: boolean;

  public data() {
    return {
      severityIcons: {
        info: require("@/assets/actions/info-green.svg"),
        warning: require("@/assets/actions/warning-orange.svg"),
        danger: require("@/assets/actions/danger-red.svg")
      }
    };
  }
}
</script>
<style lang="scss" scoped>
.cortx-info-icon {
  cursor: pointer;
  height: 20px;
  padding-bottom: 2px;
}
.cortx-modal-confirmation {
  width: 600px;
  min-height: 214px;
}
.nav-btn {
  text-align: right;
}
.finish-text {
  vertical-align: center;
}
.title-container {
  display: flex;
  overflow: auto;
}
.submessage-text {
  font-weight: 400;
  font-size: small;
  color: red;
}
.severity-img {
  align-self: flex-start;
}
</style>
