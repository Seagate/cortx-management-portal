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
    <SgtDataTable
      ref="lrIAmUserDataTable"
      :headers="s3IAmUSerTable.headers"
      :records="accessList"
      :isMultiSelect="s3IAmUSerTable.isMultiSelect"
      :itemKey="s3IAmUSerTable.itemKey"
      :headerButton="s3IAmUSerTable.headerButton"
      @generate="generateNewKey"
    >
    </SgtDataTable>
    <LrS3Access/>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SgtDataTable from "@/lib/components/SgtDataTable/SgtDataTable.vue";
import { lrS3AccountConst } from "./LrS3.constant";
import { Api } from "@/services/Api";
import LrS3Access from "./LrS3Access.vue";

@Component({
  name: "LrIAmUser",
  components: { SgtDataTable, LrS3Access },
})
export default class LrIAmUser extends Vue {
  s3IAmUSerTable: any = JSON.parse(JSON.stringify(lrS3AccountConst.s3IAmUSerTable));
  accessList = [];

  mounted() {
    this.getAccessKeys();
  }
  getAccessKeys() {
    Api.getData("s3/iAmUser", { isDummy: true }).then((resp: any) => {
      this.accessList = resp["iAmUser"];
    });
  }

}
</script>
<style lang="scss" scoped>
</style>