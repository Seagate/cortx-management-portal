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
    <LrAlertInformation
      v-if="alertDetails && alertDetails.alert_uuid"
      :alert="alertDetails"
    />
    <v-divider></v-divider>
    <h2 class="alert-title-container pt-2 pb-2">
      Occurrences
      <SgtTooltipIcon>
        <template #default>
          <div class="i-content">
            Displays all the alerts which are generated.
          </div>
        </template>
      </SgtTooltipIcon>
    </h2>
    <v-divider></v-divider>
    <LrAlert :alertId="alertId" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { lrAlertConst } from "./LrAlert.constant";
import LrAlert from "./LrAlert.vue";
import LrAlertInformation from "./LrAlertInformation.vue";
import { Api } from "../../services/Api";
import SgtTooltipIcon from "@/lib/components/SgtTooltipIcon/SgtTooltipIcon.vue";
@Component({
  name: "LrAlertDetails",
  components: { LrAlert, LrAlertInformation, SgtTooltipIcon },
})
export default class LrAlertDetails extends Vue {
  @Prop({ required: true }) private alertId: string;
  alertDetails: any = null;
  mounted() {
    Api.getData("alerts/list", { isDummy: true }).then((resp: any) => {
      const alertsList: any[] = resp["list"];
      this.alertDetails = alertsList.find(
        (ele) => ele.alert_uuid === this.alertId
      );
    });
  }
}
</script>
<style lang="scss" scoped>
.alert-title-container {
  font-weight: bold;
}
</style>