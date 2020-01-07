/*****************************************************************************
 Filename:          eos-settings-menu.vue
 Description:       Settings menu component.

 Creation Date:     31/12/2019
 Author:            Sri Bhargav Metta

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <v-card width="900" flat class="card-layout">
    <v-container class="pl-0 pt-0">
      <v-row dense>
        <v-col cols="12">
          <v-card class="outlined pt-2" height="100" flat>
            <div class="pd-5">
              <v-card-title class="title font-weight-bold d-inline">Notifications</v-card-title>
              <v-card-actions class="d-inline float-right">
                <v-btn disabled text small color="csmprimary">Manage</v-btn>
              </v-card-actions>
            </div>
          </v-card>
          <v-divider></v-divider>
        </v-col>
        <v-col cols="12">
          <v-card class="outlined pt-2" height="100" flat>
            <div class="pd-5">
              <v-card-title class="title font-weight-bold d-inline">User</v-card-title>
              <v-card-actions class="d-inline float-right">
                <v-btn :to="'/settings/usersettinglocal'" text small color="csmprimary">Manage</v-btn>
              </v-card-actions>
            </div>
          </v-card>
          <v-divider></v-divider>
        </v-col>
        <v-col cols="12">
          <v-card class="outlined pt-2" height="100" flat>
            <div class="pd-5">
              <v-card-title class="title font-weight-bold d-inline">UDX</v-card-title>
              <v-card-actions class="d-inline float-right">
                <v-btn :to="'/settings/udx-registration'" text small color="csmprimary">Manage</v-btn>
              </v-card-actions>
            </div>
          </v-card>
          <v-divider></v-divider>
        </v-col>
        <v-col cols="12">
          <v-card class="outlined pt-2" height="100" flat>
            <div class="pd-5">
              <v-card-title class="title font-weight-bold d-inline">Updates</v-card-title>
              <v-card-actions class="d-inline float-right">
                <v-btn disabled text small color="csmprimary">Manage</v-btn>
              </v-card-actions>
            </div>
            <v-card-text>
              <div>
                <p>Up to date</p>
              </div>
            </v-card-text>
          </v-card>
          <v-divider></v-divider>
        </v-col>
        <v-col cols="12">
          <v-card class="outlined pt-2" height="90" flat>
            <div class="pd-5">
              <v-card-title class="title font-weight-bold d-inline">Privacy</v-card-title>
              <v-card-actions class="d-inline float-right">
                <v-btn disabled text small color="csmprimary">Details</v-btn>
              </v-card-actions>
            </div>
          </v-card>
          <v-divider></v-divider>
        </v-col>
        <v-col cols="12">
          <v-card class="outlined" height="50" flat>
            <v-card-actions>
              <v-btn text small color="csmprimary">Quit service</v-btn>
            </v-card-actions>
          </v-card>
          <v-divider></v-divider>
        </v-col>
        <v-col cols="12">
          <v-card class="outlined" height="50" flat>
            <v-card-actions>
              <v-btn text small color="csmprimary">Restart service</v-btn>
            </v-card-actions>
          </v-card>
          <v-divider></v-divider>
        </v-col>
        <v-col cols="12">
          <v-card class="outlined" height="50" flat>
            <v-card-actions>
              <v-btn text small color="csmprimary">About</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
 <script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

@Component({
  name: "eos-settings-menu"
})
export default class EosSettingsMenu extends Vue {}
</script>
<style lang="scss" scoped>
.card-layout {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}
</style>