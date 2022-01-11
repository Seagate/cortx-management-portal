/* * CORTX-CSM: CORTX Management web and CLI interface. * Copyright (c) 2020
Seagate Technology LLC and/or its Affiliates * This program is free software:
you can redistribute it and/or modify * it under the terms of the GNU Affero
General Public License as published * by the Free Software Foundation, either
version 3 of the License, or * (at your option) any later version. * This
program is distributed in the hope that it will be useful, * but WITHOUT ANY
WARRANTY; without even the implied warranty of * MERCHANTABILITY or FITNESS FOR
A PARTICULAR PURPOSE. See the * GNU Affero General Public License for more
details. * You should have received a copy of the GNU Affero General Public
License * along with this program. If not, see <https://www.gnu.org/licenses/>.
* For any questions about this software or licensing, * please email
opensource@seagate.com or cortx-questions@seagate.com. */
<template>
  <v-card class="card-container pa-3" :v-bind="computedProps" :v-on="listeners">
    <div class="title-section">
      <p class="widget-title cortx-text-lg cortx-text-bold">{{ $t(title) }}</p>
      <div
        v-if="zoomIconCallback"
        class="cortx-zoom-icon"
        @click="zoomIconCallback"
      ></div>
    </div>
    <slot></slot>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "cortx-card"
})
export default class CortxCard extends Vue {
  @Prop({ required: true }) public title: string;
  @Prop({ required: false }) public zoomIconCallback: () => void;

  get computedProps() {
    return {
      ...this.$props
    };
  }

  get listeners() {
    return {
      ...this.$listeners
    };
  }
}
</script>

<style lang="scss" scoped>
.card-container {
  height: 100%;
}
.title-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.title-section .widget-title {
  margin: 0;
}
.title-section > .cortx-zoom-icon {
  height: 20px;
  width: 20px;
  cursor: pointer;
}
</style>
