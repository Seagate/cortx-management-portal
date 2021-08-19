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
  <div class="cortx-option-container">
    <v-menu left offset-y nudge-bottom="5">
      <template v-slot:activator="{ on, attrs }">
        <div
          v-bind="attrs"
          v-on="on"
          class="cortx-icon-btn cortx-option-icon"
        ></div>
      </template>

      <ul class="options-menu">
        <template v-for="option in menuOptions">
          <li
            class="menu-item"
            :class="{disabled: option.condition && option.condition(option.status)}"
            @click="actionsCallback[option.id](recordInfo)"
            :key="option.id"
          >
            <span class="cortx-menu-icon" :class="option.iconClass"></span
            ><span class="label">{{ option.label }}</span>
          </li>
        </template>
      </ul>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "cortx-options"
})
export default class CortxOptions extends Vue {
  @Prop({ required: true }) public menuOptions: {
    id: string;
    iconClass: string;
    label: string;
  }[];
  @Prop({ required: true }) public actionsCallback: any;
  @Prop({ required: true }) public recordInfo: any;
  public showMenu: boolean = false;
}
</script>

<style scoped>
.cortx-option-container {
  margin: 0 8px;
  height: 28px;
  width: 28px;
  /* position: relative; */
}
.options-menu {
  /* position: absolute;
  transform: translateX(-300px);
  left: 0; */
  min-width: 300px;
  border: 1px solid #6ebe49;
  list-style: none;
  padding: 0;
  background-color: white;
}
.menu-item {
  padding: 10px 15px;
  cursor: pointer;
  display: flex;
}
.menu-item.disabled {
  opacity: 0.5;
  pointer-events: none;
}
.menu-item:hover {
  background-color: #f4f4f4;
}
.label {
  margin-left: 10px;
}
</style>
