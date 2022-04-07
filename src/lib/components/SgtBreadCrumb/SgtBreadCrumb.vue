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
  <v-breadcrumbs class="bread-crumb-container" :items="pathList">
    <template v-slot:item="{ item }">
      <span
        class="path root-path"
        @click="$router.push({ path: item.to, replace: true })"
      >
        {{ item.text }}
      </span>
    </template>
    <template v-slot:divider>
      <img
        class="bread-crumb-delimiter"
        :src="require('@/assets/icons/bread-crumbs.svg')"
        alt=""
      />
    </template>
  </v-breadcrumbs>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { PathData } from "./SgtBreadCrumb.model";

@Component({
  name: "SgtBreadCrumb",
})
export default class SgtBreadCrumb extends Vue {
  @Prop({ required: false }) backupBasepath: string;
  @Prop({ required: false }) basePathList: string[];
  public pathList: Array<PathData> = [];
  public processPath = "";

  public populatePathList() {
    this.pathList = [];
    this.processPath = this.$route.path;
    if (
      this.backupBasepath &&
      this.basePathList.length > 0 &&
      !this.isBasePathPresent()
    ) {
      this.processPath = `${this.backupBasepath}${this.$route.path}`;
    }

    let pathItems = this.processPath.substring(1).split("/");
    let pathValue = "";
    pathItems.forEach((item) => {
      pathValue += `/${item}`;
      this.pathList.push({
        text: this.capitalizeFirstLetter(item),
        to: pathValue,
        disabled: false,
      });
    });
  }

  public isBasePathPresent() {
    return this.basePathList.some((path) => this.$route.path.includes(path));
  }

  public mounted() {
    this.populatePathList();
  }

  @Watch("$route")
  public routeChangeHandler() {
    this.populatePathList();
  }

  capitalizeFirstLetter = (value: string) => {
  return value.charAt(0).toUpperCase() + value.substring(1);
};
}
</script>

<style lang="scss" scoped>
.bread-crumb-container {
  padding: 0;
  margin-bottom: 1em;

  .path {
    cursor: pointer;
    &:last-child {
      color: $primary;
    }
  }
}
</style>
