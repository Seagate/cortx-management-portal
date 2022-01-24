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
                    <div class="hover-btn hover-effect">
                      <template v-for="action in actionItems">
                        <img
                          :key="action.name"
                          :src="require(`@/assets/actions/${action.path}`)"
                          @click="$emit(action.name, item)"
                          alt="logo"
                        />
                      </template>
                    </div>
                    <template v-if="col.zoomIcon">
                      <img
                        class="hover-effect"
                        :src="require(`@/assets/zoom-in.svg`)"
                        @click="$emit('zoom', item)"
                        alt="logo"
                      />
                    </template>
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
import * as moment from "moment";

@Component({
  name: "lr-data-table",
  components: { CortxAdvanceSearch: CortxAdvanceSearch },
  filters: {
    formattedDate: function(date: string | number) {
      if (isNaN(+date)) return moment(date).format("DD-MM-YYYY hh:mm A");
      return moment(+date * 1000).format("DD-MM-YYYY hh:mm A");
    }
  }
})
export default class LrDataTable extends Vue {
  @Prop({ required: true }) headers: any[];
  @Prop({ required: true }) records: any[];
  @Prop({ required: false }) totalRecords: number;
  @Prop({ required: false }) searchConfig: AdvanceSearchConfig;
  @Prop({ required: false }) isMultiSelect: boolean;
  @Prop({ required: false }) multiSelectButtons: any[];

  selected = [];
  selectedItem = {};
  allActions = [
    { name: "comment", path: "comment-default.svg", tooltip: "" },
    { name: "edit", path: "edit-green.svg", tooltip: "edit" },
    { name: "delete", path: "delete-green.svg", tooltip: "delete" },
    { name: "notification", path: "alert-green.svg", tooltip: "notification" }
  ];
  actionItems = [];
  
  mounted() {
    let actions = this.headers.find(ele => ele.type && ele.type == "action");
    this.actionItems = this.allActions.filter(ele =>
      actions.actionList.includes(ele.name)
    );
  }

  resetSelected() {
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
.hover-effect:hover {
  cursor: pointer;
}
</style>