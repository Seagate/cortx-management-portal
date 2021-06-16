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
  <div>
    <div v-for="item in menuItems" :key="item.id">
      <div v-if="item.requiredAccess" v-feature="item.featureId">
        <cortx-has-access
          :to="
            $cortxUserPermissions[item.requiredAccess] +
              (item.requiredSubAccess
                ? $cortxUserPermissions[item.requiredSubAccess]
                : $cortxUserPermissions.list)
          "
        >
          <div class="cortx-menu-card-layout">
            <label :id="'menu-' + item.title"
              class="cortx-text-lg cortx-text-bold cortx-float-l cortx-menu-card-title"
            >
              {{ item.title }}</label
            >
            <button
              :id="item.actionClickFunction"
              type="button"
              class="cortx-btn-tertiary cortx-float-r"
              @click="$emit('clickFunctionHandler', item.actionClickFunction)"
              :disabled="item.disabled"
            >
              {{ item.actionName }}
            </button>
          </div>
        </cortx-has-access>
      </div>
      <div v-else v-feature="item.featureId">
        <div class="cortx-menu-card-layout">
          <label id="menu-itemlbl"
            class="cortx-text-lg cortx-text-bold cortx-float-l cortx-menu-card-title"
          >
            {{ item.title }}</label
          >
          <button
            id="menu-actionmanagebtn"
            type="button"
            class="cortx-btn-tertiary cortx-float-r"
            @click="$emit('clickFunctionHandler', item.actionClickFunction)"
            :disabled="item.disabled"
          >
            {{ item.actionName }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

@Component({
  name: "cortx-menu-list"
})
export default class CortxMenuList extends Vue {
  @Prop({ required: true, default: false })
  public menuItems!: object[];
}
</script>
<style lang="scss" scoped>
.cortx-menu-card-layout {
  height: 4em;
  width: 56.25em;
  padding: 1em 0.5em;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
