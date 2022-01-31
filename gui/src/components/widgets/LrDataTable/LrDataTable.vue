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
    <div class="search-container">
      <v-row>
        <v-col class="ma-2">
          <cortx-advance-search v-if="searchConfig" :config="searchConfig" v-on="$listeners"></cortx-advance-search>
        </v-col>
        <v-col cols="4">
          <div v-if="isMultiSelect && selected.length>0" class="multi-btn">
            <v-btn
              v-for="button in multiSelectButtons"
              class="ma-2"
              dark
              :key="button.name"
              :color="button.color"
              @click="$emit(button.name, selected)"
            >{{button.label}}</v-btn>
          </div>
        </v-col>
      </v-row>
    </div>
    <v-data-table
      :headers="headers"
      :items="records"
      class="elevation-1"
      :show-select="isMultiSelect"
      item-key="name"
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
                style="margin:0px;padding:0px"
                hide-details
              />
            </td>
            <td v-for="(col,i) in headers" :key="i" :class="{'action-button': col.type=='action'}">
              <template v-if="col.type">
                <template v-if="col.type == 'custom'">
                  <slot v-bind:value="item[col.value]" :name="col.value">{{item[col.value]}}</slot>
                </template>
                <template v-if="col.type == 'date'">{{item[col.value] | formattedDate }}</template>
                <template v-else-if="col.type == 'action'">
                  <div v-if="selected.length<1" class="action-col">
                    <div class="hover-btn" v-if="actionItems">
                      <template v-for="action in actionItems">
                        <span :class="'action-btn'" :key="action.name">
                          <img
                            :src="require(`@/assets/${action.path}`)"
                            @click="$emit(action.name, item)"
                            alt="logo"
                            class="action-btn-block"
                          />
                          <img
                            :src="require(`@/assets/${action.hoverPath}`)"
                            @click="$emit(action.name, item)"
                            alt="logo"
                            class="action-btn-hover"
                          />
                        </span>
                      </template>
                    </div>
                    <div v-if="col.zoomIcon" class="zoom-container">
                      <img
                        class="zoom-icon"
                        :src="require(`@/assets/zoom-in.svg`)"
                        @click="$emit('zoom', item)"
                        alt="logo"
                      />
                      <img
                        class="zoom-icon-hover"
                        :src="require(`@/assets/zoom-in-hover.svg`)"
                        @click="$emit('zoom', item)"
                        alt="logo"
                      />
                    </div>
                  </div>
                </template>
              </template>
              <template v-else>{{item[col.value]}}</template>
            </td>
          </tr>
        </tbody>
      </template>
    </v-data-table>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import CortxAdvanceSearch from "../cortx-advance-search/cortx-advance-search.vue";
import { AdvanceSearchConfig } from "../cortx-advance-search/cortx-advance-search-config.model";
import moment from "moment";
import { lrDataTableConst } from "./LrDataTable.constant";

@Component({
  name: "LrDataTable",
  components: { CortxAdvanceSearch: CortxAdvanceSearch },
  filters: {
    formattedDate: function(date: string | number) {
      if (isNaN(+date)) return moment(date).format("DD-MM-YYYY hh:mm A");
      return moment(+date * 1000).format("DD-MM-YYYY hh:mm A");
    }
  }
})
export default class LrDataTable extends Vue {
  @Prop({ required: true }) private headers: any[];
  @Prop({ required: true }) private records: any[];
  @Prop({ required: false }) private totalRecords: number;
  @Prop({ required: false }) private searchConfig: AdvanceSearchConfig;
  @Prop({ required: false }) private isMultiSelect: boolean;
  @Prop({ required: false }) private multiSelectButtons: any[];

  private selected: any[] = [];
  private selectedItem: any = {};
  private actionItems: any[] = [];

  mounted() {
    const allActions = lrDataTableConst.buttonList;
    const actions = this.headers.find(ele => ele.type && ele.type === "action");
    this.actionItems = allActions.filter(ele =>
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
</style>