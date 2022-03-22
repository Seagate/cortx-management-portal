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
    <v-navigation-drawer
      :mini-variant="syncedName"
      permanent
      fixed
      dark
      color="#000000"
      :mini-variant-width="minVariantWidth"
      class="nav-style"
    >
      <v-list nav dense>
        <v-tooltip
          :disabled="!syncedName"
          :open-on-focus="true"
          right
          v-for="navItem in navItems"
          :key="navItem.title"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-list-item
              link
              :class="{
                'sgt-nav-item-active': $route.path.includes(navItem.path),
              }"
              @click="navigate(navItem.path)"
              v-bind="attrs"
              v-on="on"
            >
              <v-list-item-icon>
                <img
                  :src="
                    require(`@/assets/${
                      $route.path.includes(navItem.path)
                        ? navItem.iconActive
                        : navItem.iconDefault
                    }`)
                  "
                />
              </v-list-item-icon>
              <v-list-item-title
                :id="navItem.title"
                :class="{ 'font-grey': !$route.path.includes(navItem.path) }"
              >{{ $t(navItem.title) }}</v-list-item-title>
            </v-list-item>
          </template>
          <span>{{ $t(navItem.title) }}</span>
        </v-tooltip>

        <v-list-item class="nav-brand">
          <v-list-item-icon class="nav-logo">
            <img v-if="brandLogo" :src="require(`@/assets/${brandLogo}`)" alt="logo" />
          </v-list-item-icon>
          <v-list-item-title v-if="brandName" class="logo-title">{{brandName}}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import router from "@/router";
import { SgtNavigationDrawerItem } from "./SgtNavigationDrawerItem.model";

@Component({
	name: "SgtNavigationDrawer",
	components: {},
})
export default class SgtNavigationDrawer extends Vue {
	@PropSync("drawer", { type: Boolean }) syncedName!: boolean;
	@Prop({ required: true }) navItems: SgtNavigationDrawerItem[];
	@Prop({ required: false }) brandLogo: string;
	@Prop({ required: false }) brandName: string;
	@Prop({ required: false, default: "4rem" }) minVariantWidth: string;

	activeRoute = "";

	navigate(path: string) {
		router.push(path);
		this.syncedName = true;
	}
}
</script>

<style lang="scss" scoped>
.nav-style {
	margin-top: 3.75em;
}
.nav-brand {
	position: fixed;
	bottom: 4em;
	.nav-logo {
		height: 27px;
	}
	.logo-title {
		color: #6cc04a;
		font-size: 1rem;
	}
}
.font-inherit {
	font-size: inherit;
}
.sgt-nav-item-active {
	background: #262626;
	color: #ffffff;
	border-bottom: 3px solid #6ebe49;
}
.font-grey {
	color: #9e9e9e;
}
</style>
