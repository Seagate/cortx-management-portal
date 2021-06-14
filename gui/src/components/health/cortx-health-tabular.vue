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
  <div v-feature="unsupportedFeatures.health">
          <cortx-data-table
            :headers="healthTableHeaderList" 
            :records="clusterHealthData.data"
            :hideFilter="hideFilter"
            :onSort={}
            :onFilter={} 
            :sortParams={}
            :rowsPerPage="[10, 20, 30, 50, 100, 150, 200]" 
            @update:items-per-page="getHealthData()"
            @update:page="getHealthData()"
          />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";
import { AuditLogQueryParam } from "../../models/download";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
import { unsupportedFeatures } from "../../common/unsupported-feature";
import CortxDataTable from "../widgets/cortx-data-table.vue";
import { healthTableHeaders } from "../../common/health-table-headers"

@Component({
  name: "cortx-auditlog",
  components: { CortxDataTable }
})
export default class CortxHealthTabular extends Vue {
  public unsupportedFeatures = unsupportedFeatures;
  public healthTableHeaders = healthTableHeaders;
  public hideFilter: boolean = true;
  public healthQueryParams: any = {};
  public healthTableHeaderList: any[] = [];
  public clusterHealthData: any = {};

  public mounted() {
    this.getHealthData();    
  }  

  public async getHealthData() {
    this.healthQueryParams = {
      response_format: 'flattened',
      offset: 1,
      limit: 0
    }
    this.$store.dispatch("systemConfig/showLoader", "Fetching health...");
    const res = await Api.getAll(apiRegister.health_cluster,
      this.healthQueryParams
    );
    this.clusterHealthData = res.data;
    this.healthTableHeaderList = healthTableHeaders.healthTableHeaderList;
    this.$store.dispatch("systemConfig/hideLoader");
  }
}
</script>
<style lang="scss" scoped></style>
