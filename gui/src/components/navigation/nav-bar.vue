/*****************************************************************************
 Filename:          nav-bar.vue
 Description:       Navigation Component

 Creation Date:     30/08/2019
 Author:            Sanjeevan Bhave

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <v-card height="800" width="256" class="mx-auto grey darken-3">
    <v-navigation-drawer permanent class="grey darken-3">
      <v-list dense nav>
        <v-list-item v-for="item in items" :key="item.title" link>
          <v-list-item-icon>
            <v-img :src="require('@/assets/navigation/'+item.icon)" width="23" height="23"></v-img>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="white--text">{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "eos-nav-bar"
})
export default class EosNavBar extends Vue {
  private data() {
    return {
      items: [
        {
          title: "Dashboard",
          icon: "dashboard-green.png"
        },
        { title: "Provisioning", icon: "storage-green.png" },
        { title: "Settings", icon: "settings-green.png" },
        { title: "Maintenance", icon: "maintenance-green.png" }
      ],
      right: null
    };
  }
}
</script>
<style lang="scss" scoped>
#alert-img1 {
  width: 20px;
  height: 20px;
  border: 1px solid red;
  background: url("./../../assets/info-alert-green.png") no-repeat;
}
</style>
