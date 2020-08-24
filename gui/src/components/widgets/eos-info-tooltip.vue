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
  <span class="d-flex">
    {{ label }}
    <v-tooltip right max-width="305">
      <template v-slot:activator="{ on }">
        <img
          class="eos-info-icon"
          v-on="on"
          :src="require('@/assets/actions/info-green.svg')"
        />
      </template>
      <span>{{ message }}</span>
    </v-tooltip>
  </span>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "eos-info-tooltip"
})
export default class EosInfoTooltip extends Vue {
  @Prop({ required: false })
  public label!: string;

  @Prop({ required: false })
  public message!: string;
}
</script>
<style lang="scss" scoped>
.eos-info-icon {
  cursor: pointer;
  height: 20px;
  padding-bottom: 2px;
}
</style>
