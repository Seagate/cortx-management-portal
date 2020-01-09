/*****************************************************************************
 Filename:          loader.vue
 Description:       Loader widget Component

 Creation Date:     20/11/2019
 Author:            Sri Bhargav Metta

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <v-overlay :value="show" opacity="0.75">
    <div class="loader-container">
      <div class="loader-header" v-if="title">
        <label>Header</label>
      </div>
      <div class="loader-body">
        <div class="loader-message" v-if="message">
          <label>{{ message }}</label>
        </div>
        <v-progress-linear
          indeterminate
          color="csmprimary"
          background-color="csmdisabled"
        ></v-progress-linear>
      </div>
    </div>
  </v-overlay>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "eos-loader"
})
export default class EosLoader extends Vue {
  @Prop({ required: true })
  public show!: boolean;

  @Prop({ required: false })
  public title!: string;

  @Prop({ required: false })
  public message!: string;
}
</script>
<style lang="scss" scoped>
.loader-container {
  background-color: #ffffff;
  min-width: 333px;
}
.loader-header {
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 26px;
  border-bottom: 1px solid var(--v-csmborder-base);
  color: #000000;
  padding: 24px;
}
.loader-body {
  padding: 10px;
}
.loader-message {
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  color: #000000;
  margin-bottom: 6px;
}
</style>
