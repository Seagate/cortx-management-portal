 
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
  <v-row class="pa-8 nav-card-container">
    <v-col
      v-for="card in cardList"
      :key="card.name"
      cols="12"
      lg="3"
      md="3"
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
            <img
              :src="require(`@/assets/icons/${card.icon}`)"
              class="pa-3"
              width="96"
              height="96"
            />
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
@Component({
  name: "SgtNavigationCard",
  components: {},
})
export default class SgtNavigationCard extends Vue {
  @Prop({ required: true }) private cardList: string;
  @Prop({ required: false, default: "#FFFFFF" })
  private backgroundColor: string;
}
</script>

<style lang="scss">
.nav-card-container {
  max-width: 1440px;
  .sgt-card {
    border: 1px solid $primary !important;
    box-shadow: 1px 2px $primary !important;
    &:hover {
      box-shadow: 2px 4px $primary !important;
      background-color: #f8fff8 !important;
    }
    .icon-container {
      height: 50%;
      .icon-box {
        height: 6rem;
        width: 6rem;
        border: 1px solid $primary;
        border-radius: 5px;
        text-align: center;
      }
    }
    .card-title {
      color: $primary;
      font-size: 1.7rem;
      height: 30%;
      word-break: inherit;
    }
    .card-subtitle {
      color: $primary !important;
      padding-top: 1rem;
      font-size: 1.1rem;
      height: 20%;
    }
  }
}
</style>