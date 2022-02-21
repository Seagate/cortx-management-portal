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
  <ul class="bread-crumb-container">
    <template v-for="(path, index) in pathList">
      <li :key="index">
        <span
          class="path root-path"
          @click="$router.push({ path: path.value, replace: true })"
          >{{ path.displayPath }}</span
        >
        <img
          class="bread-crumb-delimiter"
          :src="require('@/assets/icons/bread-crumbs.svg')"
          alt=""
          v-if="++index < pathList.length"
        />
      </li>
    </template>
  </ul>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import ClickOutsideHOC from "../shared/ClickOutsideHOC.vue";
import { capitalizeFirstLetter } from "../../utils/CommonUtilFunctions";
import { PathData } from "./LrBreadCrumb.model";
import { basePathList } from "./LrBreadCrumb.data";

@Component({
  name: "LrBreadCrumb",
  components: { ClickOutsideHOC },
})
export default class LrBreadCrumb extends Vue {
  public pathList: Array<PathData> = [];
  public processPath = "";

  public populatePathList() {
    this.pathList = [];
    if (this.isBasePathPresent()) {
      this.processPath = this.$router.currentRoute.path;
    } else {
      this.processPath = `/dashboard${this.$router.currentRoute.path}`;
    }

    let pathItems = this.processPath.substring(1).split("/");
    let pathValue = "";
    pathItems.forEach((item) => {
      pathValue += `/${item}`;
      this.pathList.push({
        displayPath: capitalizeFirstLetter(item),
        value: pathValue,
      });
    });
  }

  public isBasePathPresent() {
    return basePathList.some((path) =>
      this.$router.currentRoute.path.includes(path)
    );
  }

  public mounted() {
    this.populatePathList();
  }

  @Watch("$route")
  public routerChanged() {
    this.populatePathList();
  }
}
</script>

<style lang="scss" scoped>
.bread-crumb-container {
  padding: 0;
  margin-bottom: 1em;
  display: flex;
  align-items: center;

  .path {
    cursor: pointer;
    &:last-child {
      color: $primary;
    }
  }

  .bread-crumb-delimiter {
    margin: 0 0.5em;
  }
}
</style>
