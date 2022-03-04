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
  <div>
    <div class="search-container">
      <v-row class="search-row">
        <v-col class="ma-2 pb-2">
          <LrAdvanceSearch
            v-if="searchConfig"
            :config="searchConfig"
            v-on="$listeners"
          />
        </v-col>
        <v-col cols="4">
          <div v-if="isMultiSelect && selected.length > 0" class="multi-btn">
            <v-btn
              v-for="button in multiSelectButtons"
              class="ma-2"
              dark
              :key="button.name"
              :color="button.color"
              @click="$emit(button.name, selected)"
              >{{ button.label }}</v-btn
            >
          </div>
        </v-col>
      </v-row>
    </div>
    <LrChips
      v-if="chips && chips.length > 0"
      :chips="chips"
      class="pb-1"
      v-on="$listeners"
    />
    <v-data-table
      :headers="headers"
      :items="records"
      :show-select="isMultiSelect"
      :item-key="itemKey"
      class="elevation-1"
      v-model="selected"
    >
      <template v-slot:body="{ items }">
        <tbody>
          <tr class="record" v-for="item in items" :key="item.id">
            <td v-if="isMultiSelect">
              <v-checkbox
                multiple
                v-model="selected"
                :value="item"
                style="margin: 0px; padding: 0px"
                hide-details
              />
            </td>
            <td
              v-for="(col, i) in headers"
              :key="i"
              :class="{ 'action-button': col.type == 'action' }"
            >
              <template v-if="col.type">
                <template v-if="col.type == 'date'">{{
                  item[col.value] | formattedDate
                }}</template>
                <template v-else-if="col.type == 'custom'">
                  <slot v-bind:value="item[col.value]" :name="col.value">{{
                    item[col.value]
                  }}</slot>
                </template>
                <template v-else-if="col.type == 'action'">
                  <div v-if="selected.length < 1" class="action-col">
                    <div class="hover-btn" v-if="actionItems">
                      <template v-for="action in actionItems">
                        <span :class="'action-btn'" :key="action.name">
                          <img
                            :src="require(`@/assets/icons/${action.path}`)"
                            @click="$emit(action.name, item)"
                            class="action-btn-block"
                            alt="logo"
                          />
                          <img
                            :src="require(`@/assets/icons/${action.hoverPath}`)"
                            @click="$emit(action.name, item)"
                            class="action-btn-hover"
                            alt="logo"
                          />
                        </span>
                      </template>
                    </div>
                    <div v-if="col.zoomIcon" class="zoom-container">
                      <img
                        :src="require(`@/assets/icons/zoom-in.svg`)"
                        @click="$emit('zoom', item)"
                        class="zoom-icon vertical-middle"
                        alt="logo"
                      />
                      <img
                        :src="require(`@/assets/icons/zoom-in-hover.svg`)"
                        @click="$emit('zoom', item)"
                        class="zoom-icon-hover vertical-middle"
                        alt="logo"
                      />
                    </div>
                  </div>
                </template>
                <template v-else>{{ item[col.value] }}</template>
              </template>
              <template v-else>{{ item[col.value] }}</template>
            </td>
          </tr>
        </tbody>
      </template>
    </v-data-table>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import LrAdvanceSearch from "../LrAdvanceSearch/LrAdvanceSearch.vue";
import { LrAdvanceSearchConfig } from "../LrAdvanceSearch/LrAdvanceSearch.model";
import moment from "moment";
import { lrDataTableConst } from "./LrDataTable.constant";
import { LrFilterObject } from "../LrChips/LrFilterObject.model";
import LrChips from "../LrChips/LrChips.vue";

@Component({
  name: "LrDataTable",
  components: { LrAdvanceSearch, LrChips },
  filters: {
    formattedDate: function (date: string | number) {
      if (isNaN(+date)) return moment(date).format("DD-MM-YYYY hh:mm A");
      return moment(+date * 1000).format("DD-MM-YYYY hh:mm A");
    },
  },
})
export default class LrDataTable extends Vue {
  @Prop({ required: true }) private headers: any[];
  @Prop({ required: true }) private records: any[];
  @Prop({ required: false }) private totalRecords: number;
  @Prop({ required: false }) private searchConfig: LrAdvanceSearchConfig;
  @Prop({ required: false }) private isMultiSelect: boolean;
  @Prop({ required: false }) private multiSelectButtons: any[];
  @Prop({ required: false }) private chips: LrFilterObject[];
  @Prop({ required: false }) private itemKey: string;

  private selected: any[] = [];
  private selectedItem: any = {};
  private actionItems: any[] = [];

  mounted() {
    const allActions = lrDataTableConst.buttonList;
    const actions = this.headers.find(
      (ele) => ele.type && ele.type === "action"
    );
    this.actionItems = allActions.filter((ele) =>
      actions.actionList.includes(ele.name)
    );
  }

  public resetSelected() {
    this.selected = [];
  }
}
</script>
<style lang="scss" scoped>
.search-container {
  min-height: 4rem;
  .search-row {
    width: 100%;
  }
}
.multi-btn {
  display: flex;
  justify-content: flex-end;
}
.action-button {
  text-align: right;
  min-width: 100px;
}

.action-col {
  position: relative;
}

.hover-btn {
  display: none;
}

.record:hover {
  .hover-btn {
    display: flex;
    position: absolute;
    right: 2rem;
  }
}

.zoom-container {
  .zoom-icon {
    display: inline-block;
  }
  .zoom-icon-hover {
    display: none;
  }
}
.zoom-container:hover {
  cursor: pointer;
  .zoom-icon {
    display: none;
  }
  .zoom-icon-hover {
    display: inline-block;
  }
}
.action-btn {
  cursor: pointer;
  .action-btn-block {
    display: block;
  }
  .action-btn-hover {
    display: none;
  }
}
.action-btn:hover {
  cursor: pointer;
  .action-btn-block {
    display: none;
  }
  .action-btn-hover {
    display: block;
  }
}
.vertical-middle {
  vertical-align: middle;
}
</style>
