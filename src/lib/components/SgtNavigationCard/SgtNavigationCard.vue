 
 <!--
* CORTX-CSM: CORTX Management web.
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
* please email opensource@seagate.com.
-->
<template>
  <v-row class="pa-8">
    <v-col
      v-for="card in cardList"
      :key="card.name"
      cols="12"
      lg="3"
      md="4"
      sm="6"
    >
      <v-card
        class="pa-4 ma-2 sgt-card"
        tile
        :color="backgroundColor"
        height="22rem"
        width="18rem"
        @click="$emit('click', card.name)"
      >
        <div class="icon-container pa-4">
          <div class="icon-box">
            <SgtSvgIcon :icon="card.icon" class="pa-3" />
          </div>
        </div>
        <v-card-title class="card-title">{{ card.title }}</v-card-title>
        <v-card-subtitle class="card-subtitle">{{
          card.description
        }}</v-card-subtitle>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import SgtSvgIcon from "../SgtSvgIcon/SgtSvgIcon.vue";
@Component({
  name: "SgtNavigationCard",
  components: { SgtSvgIcon },
})
export default class SgtNavigationCard extends Vue {
  @Prop({ required: true }) private cardList: string;
  @Prop({ required: false, default: "#FFFFFF" })
  private backgroundColor: string;
}
</script>

<style lang="scss">
.sgt-card {
  border: 1px solid $primary !important;
  box-shadow: 1px 2px $primary !important;
  .icon-container {
    height: 50%;
    .icon-box {
      height: 5rem;
      width: 5rem;
      border: 1px solid $primary;
      border-radius: 5px;
      text-align: center;
    }
  }
  .card-title {
    color: $primary;
    font-size: 1.7rem;
    height: 30%;
  }
  .card-subtitle {
    color: $primary !important;
    padding-top: 1rem;
    font-size: 1.1rem;
    height: 20%;
  }
}

.sgt-card:hover {
  box-shadow: 2px 4px $primary !important;
  background-color: #F8FFF8 !important;
}
</style>