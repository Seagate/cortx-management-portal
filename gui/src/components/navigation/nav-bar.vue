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
  <v-card height="100%" class="black" width="8.750em" tile>
    <v-navigation-drawer permanent class="black" tile floating>
      <v-list nav class="pa-0 ma-0">
        <v-list-item-group v-model="selectedMenu" active-class="border">
          <v-list-item
            v-for="(item, itemIndex) in items"
            :key="item.title"
            :to="item.path"
            link
            :disabled="item.disabled"
            @click="onSelectedMenu(itemIndex)"
            class="pb-2 ma-0"
          >
            <v-list-item-icon class="my-3 mr-2 ml-0">
              <v-img :src="require('@/assets/navigation/' + item.icon)" width="23" height="23"></v-img>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title
                class="font-weight-medium condensed subtitle-2"
                :class="[(itemIndex === selectedMenu) ? activeClass: inactiveClass]"
              >{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
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
  public onSelectedMenu(itemIndex: any) {
    this.$data.selectedMenu = itemIndex;
  }

  private data() {
    return {
      items: [
        {
          title: "Dashboard",
          path: "/dashboard",
          icon: "dashboard-green.png"
        },
        {
          title: "Provisioning",
          path: "/provisioning-submenu",
          icon: "storage-green.png"
        },
        {
          title: "Settings",
          path: "/settings-submenu",
          icon: "settings-green.png"
        },
        {
          title: "Maintenance",
          icon: "maintenance-green.png",
          disabled: true
        }
      ],
      right: null,
      selectedMenu: null,
      activeClass: "white--text",
      inactiveClass: "grey--text text--darken-1"
    };
  }
}
</script>
<style lang="scss" scoped>
.menuActive {
  color: #ffffff;
}
.defaultMenu {
  color: #757575;
}
.border {
  background: #333333;
}
</style>
