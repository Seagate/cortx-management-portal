/*****************************************************************************
 Filename:          message-dialog.vue
 Description:       Message Dialog Component

 Creation Date:     19/12/2019
 Author:            Sri Bhargav Metta

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <v-overlay color="rgba(0, 0, 0, 0.75)" :value="$store.state.messageDialog.showDialog">
    <div class="eos-msg-dialog-container">
      <div
        class="eos-msg-dialog-header"
        :class="{ 'eos-chip-warning': $store.state.messageDialog.type === 'warning', 'eos-chip-alert': $store.state.messageDialog.type === 'error' }"
      >
        <label class="eos-msg-dialog-header-title">{{ $store.state.messageDialog.title }}</label>
        <div class="eos-msg-dialog-close" @click="closeDialog()"></div>
      </div>
      <div class="eos-msg-dialog-body">
        <div class="eos-msg-dialog-message">
          <label>{{ $store.state.messageDialog.message }}</label>
        </div>
      </div>
    </div>
  </v-overlay>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "eos-message-dialog"
})
export default class EosMessageDialog extends Vue {
  public closeDialog() {
    this.$store.commit("messageDialog/hide");
  }
}
</script>
<style lang="scss" scoped>
.eos-msg-dialog-container {
  background: #ffffff;
  width: 424px;
  max-height: 283px;
}
.eos-msg-dialog-header {
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
.eos-msg-dialog-body {
  max-height: 217px;
  padding: 24px;
}
.eos-msg-dialog-message {
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.87);
}
.eos-msg-dialog-header-title {
  width: 347px;
}
.eos-msg-dialog-close {
  width: 28px;
  height: 28px;
  position: relative;
  transform: rotate(45deg);
  -ms-transform: rotate(45deg); /* IE 9 */
  -webkit-transform: rotate(45deg); /* Safari and Chrome */
  cursor: pointer;
}

.eos-msg-dialog-close:before,
.eos-msg-dialog-close:after {
  content: "";
  position: absolute;
  z-index: -1;
  background: #ffffff;
}

.eos-msg-dialog-close:before {
  top: 6px;
  left: 13px;
  width: 2px;
  height: 16px;
}

.eos-msg-dialog-close:after {
  top: 13px;
  left: 6px;
  height: 2px;
  width: 16px;
}
</style>
