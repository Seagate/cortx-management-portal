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
    <div class="search-container">
      <v-row class="search-row ma-0">
        <v-col class="pl-0 margin-auto">
          <SgtAdvanceSearch
            v-if="searchConfig"
            :config="searchConfig"
            @filter-click="updateFilter($event)"
          />
        </v-col>
        <v-col cols="4" class="pr-0 margin-auto">
          <div v-if="isMultiSelect && selected.length > 0" class="multi-btn">
            <v-btn
              v-for="button in multiSelectButtons"
              class="ml-4"
              dark
              :key="button.name"
              :color="button.color ? button.color : 'csmprimary'"
              @click="$emit(button.name, selected)"
              >{{ button.label }}</v-btn
            >
          </div>
          <div v-if="headerButton && selected.length == 0" class="multi-btn">
            <v-btn
              class="ml-4"
              :dark="headerButton.disabled ? false : true"
              :key="headerButton.name"
              :color="headerButton.color ? headerButton.color : 'csmprimary'"
              :disabled="headerButton.disabled ? headerButton.disabled : false"
              @click="$emit(headerButton.name, selected)"
              >{{ headerButton.label }}</v-btn
            >
          </div>
        </v-col>
      </v-row>
    </div>
    <SgtChips
      v-if="chips && chips.length > 0"
      :chips="chips"
      class="pb-1"
      @remove-chip="updateFilterByChip($event)"
    />
    <v-data-table
      :headers="headers"
      :items="records"
      :show-select="isMultiSelect"
      :item-key="itemKey"
      :hide-default-footer="true"
      :hide-default-header="true"
      class="elevation-1 sgt-table-header"
      v-model="selected"
    >
      <template v-slot:header="{}">
        <tr>
          <th v-if="isMultiSelect">
            <v-simple-checkbox
              :value="selected.length == records.length"
              :indeterminate="
                selected.length > 0 && selected.length < records.length
              "
              :ripple="false"
              @click="toggleSelectAll"
            ></v-simple-checkbox>
          </th>
          <template v-for="header in headers">
            <th
              :key="header.text"
              :class="[
                'table-header',
                typeof header.sortable == 'boolean' && header.sortable === false
                  ? ''
                  : 'cursor-pointer',
              ]"
              :style="{
                'text-align': getTextAlign(header.align),
                width: header.width,
              }"
              @click="handleSorting(header)"
            >
              <span>
                {{ header.text }}
                <span
                  v-if="
                    !(
                      typeof header.sortable == 'boolean' &&
                      header.sortable === false
                    )
                  "
                  class="sort-icon"
                  :class="{
                    'sort-asc':
                      tableDataConfig.sort &&
                      header.value === tableDataConfig.sort.name &&
                      tableDataConfig.sort.dir === 'asc',
                    'sort-desc':
                      tableDataConfig.sort &&
                      header.value === tableDataConfig.sort.name &&
                      tableDataConfig.sort.dir === 'desc',
                  }"
                >
                  <svg
                    v-if="
                      !(
                        typeof header.sortable == 'boolean' &&
                        header.sortable === false
                      )
                    "
                    width="8"
                    height="13"
                    viewBox="0 0 8 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.42432 0L7.48247 5.25H1.36616L4.42432 0Z"
                      fill="#9E9E9E"
                    />
                    <path
                      d="M4.42432 13L7.48247 7.75H1.36616L4.42432 13Z"
                      fill="#9E9E9E"
                    />
                  </svg>
                </span>
              </span>
            </th>
          </template>
        </tr>
      </template>
      <template v-slot:body="{ items }">
        <tbody>
          <tr
            class="record"
            v-for="(item, rowIndex) in items"
            :key="rowIndex"
            @mouseover="$emit('onRowHover', rowIndex)"
            @mouseleave="$emit('onRowHover', -1)"
          >
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
              :style="{ 'text-align': getTextAlign(col.align) }"
            >
              <template v-if="col.type">
                <template v-if="col.type == 'date'">{{
                  item[col.value] | formattedDate
                }}</template>
                <template v-else-if="col.type == 'custom'">
                  <slot
                    v-bind:data="{
                      ...item,
                      rowIdx: rowIndex,
                    }"
                    :name="col.value"
                    >{{ item[col.value] }}</slot
                  >
                </template>
                <template v-else-if="col.type == 'action'">
                  <div v-if="selected.length < 1" class="action-col">
                    <div
                      class="hover-btn"
                      v-if="actionItems"
                      :style="{ right: col.zoomIcon ? '2rem' : '0rem' }"
                    >
                      <template v-for="action in actionItems">
                        <span :class="'action-btn'" :key="action.name">
                          <SgtSvgIcon
                            :icon="action.path"
                            :hoverIcon="action.hoverPath"
                            :tooltip="action.tooltip"
                            :refPath="action.refPath"
                            @click="$emit(action.name, item)"
                          />
                        </span>
                      </template>
                    </div>
                    <div v-if="col.zoomIcon" class="zoom-container">
                      <SgtSvgIcon
                        icon="zoom-in.svg"
                        hoverIcon="zoom-in-hover.svg"
                        tooltip="View"
                        @click="$emit('zoom', item)"
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

      <template v-slot:footer="{}" v-if="records.length > 0">
        <v-row
          justify="end"
          align="center"
          class="pr-3 py-4"
          v-if="isPagination"
        >
          <v-col class="text-right pa-0 pr-4 flex-grow-0">
            <v-pagination
              v-model="page"
              :length="paginationConfig.pageLength"
              :total-visible="paginationConfig.totalVisible"
              :color="paginationConfig.color"
              :next-icon="paginationConfig.nextIcon"
              :prev-icon="paginationConfig.prevIcon"
              @input="handlePageInput"
            ></v-pagination>
          </v-col>
          <div class="pt-1 pag-dropdown">
            <SgtDropdown
              :dropdownOptions="paginationConfig.pageSizeList"
              v-model="tableDataConfig.pagination.pageSize"
              @change="updatePageSize"
              height="10px"
            />
          </div>
        </v-row>
      </template>
    </v-data-table>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import SgtAdvanceSearch from "../SgtAdvanceSearch/SgtAdvanceSearch.vue";
import { SgtAdvanceSearchConfig } from "../SgtAdvanceSearch/SgtAdvanceSearch.model";
import moment from "moment";
import { SgtDataTableConst } from "./SgtDataTable.constant";
import { SgtFilterObject } from "../SgtChips/SgtFilterObject.model";
import SgtChips from "../SgtChips/SgtChips.vue";
import SgtSvgIcon from "../SgtSvgIcon/SgtSvgIcon.vue";
import {
  SgtDataTableFilterSortPag,
  PaginationModel,
} from "./SgtDataTableFilterSortPag.model";

import SgtDropdown from "../SgtDropdown/SgtDropdown.vue";
@Component({
  name: "SgtDataTable",
  components: { SgtAdvanceSearch, SgtChips, SgtSvgIcon, SgtDropdown },
  filters: {
    formattedDate: function (date: string | number) {
      if (isNaN(+date)) return moment(date).format("DD-MM-YYYY hh:mm A");
      return moment(+date * 1000).format("DD-MM-YYYY hh:mm A");
    },
  },
})
export default class SgtDataTable extends Vue {
  @Prop({ required: true }) private headers: any[];
  @Prop({ required: true }) private records: any[];
  @Prop({ required: false }) private searchConfig: SgtAdvanceSearchConfig;
  @Prop({ required: false }) private isMultiSelect: boolean;
  @Prop({ required: false }) private multiSelectButtons: any[];
  @Prop({ required: false }) private chips: SgtFilterObject[];
  @Prop({ required: false }) private itemKey: string;
  @Prop({
    required: false,
    default: () => SgtDataTableConst.defaultTableConfig,
  })
  private tableDataConfig: SgtDataTableFilterSortPag;
  @Prop({
    required: false,
    default: () => SgtDataTableConst.defaultPaginationConfig,
  })
  private paginationConfig: PaginationModel;
  @Prop({ required: false }) private headerButton: any;
  @Prop({ required: false, default: true }) private isPagination: boolean;

  private selected: any[] = [];
  private selectedItem: any = {};
  private actionItems: any[] = [];
  private page = 1;
  private row = 5;

  mounted() {
    this.updateActionItems();
  }

  /**
   * get text align to align the header and data label.
   * @param align | undefined
   * @returns left | center | right
   */
  getTextAlign(align?: string) {
    if (!align || align == "start") return "left";
    else if (align == "end") return "right";
    else return "center";
  }
  /**
   * get existing sort direction.
   * @returns asc | desc | false
   */
  get getSortDir() {
    return this.tableDataConfig.sort ? this.tableDataConfig.sort.dir : false;
  }
  /**
   * To update the action buttons, custom buttons
   */
  updateActionItems() {
    const allActions = SgtDataTableConst.buttonList;
    const actions = this.headers.find(
      (ele) => ele.type && ele.type === "action"
    );
    if (!actions) return [];
    this.actionItems = allActions.filter((ele) =>
      actions.actionList.includes(ele.name)
    );
    if (actions.customActionList)
      this.actionItems.push(...actions.customActionList);
  }

  /**
   * reset selected records
   * To be used from parent component to reset checkboxes.
   */
  resetSelected() {
    this.selected = [];
  }

  /**
   * Toggle select all checkbox on table header.
   */
  toggleSelectAll() {
    if (this.selected.length < this.records.length)
      this.selected = this.records;
    else this.selected = [];
  }

  /**
   * Pagination page change.
   * @param currentPage
   */
  handlePageInput(currentPage: number) {
    this.tableDataConfig.pagination.currentPage = currentPage;
    this.updateRecord();
  }

  /**
   * Pagination page size update.
   */
  updatePageSize() {
    this.updateRecord();
  }

  /**
   * On filter update. event emitted from advance search component.
   */
  updateFilter(filterList: SgtFilterObject[]) {
    this.tableDataConfig.filterList = filterList;
    this.updateRecord();
  }

  /**
   * On chip cancel button click. event emitted from chips component.
   */
  updateFilterByChip(chip: SgtFilterObject) {
    const ind = this.tableDataConfig.filterList.findIndex(
      (ele) => ele.name == chip.name
    );
    if (ind >= 0) {
      this.tableDataConfig.filterList.splice(ind, 1);
      this.updateRecord();
    }
  }

  /**
   * Sort click action.
   */
  handleSorting(header: any) {
    if (!(typeof header.sortable == "boolean" && header.sortable === false)) {
      if (
        this.tableDataConfig.sort &&
        this.tableDataConfig.sort.name === header.value
      ) {
        this.tableDataConfig.sort.dir === "asc"
          ? (this.tableDataConfig.sort.dir = "desc")
          : (this.tableDataConfig.sort = null);
      } else {
        this.tableDataConfig.sort = { name: header.value, dir: "asc" };
      }
      this.updateRecord();
    }
  }

  /**
   * Emits object tableDataConfig when filter, sort, pagination is updated.
   */
  updateRecord() {
    this.$emit("update-record", this.tableDataConfig);
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
.sgt-table-header{
  border: 1px solid #DFE0EB;
}
.margin-auto {
  margin: auto;
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
  min-height: 1.5rem;
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

.vertical-middle {
  vertical-align: middle;
}

::v-deep .v-pagination__item {
  font-size: 1rem;
  height: 2.4rem;
  min-width: 3rem;
  padding: 0 5px;
  text-decoration: none;
  transition: 0.3s cubic-bezier(0, 0, 0.2, 1);
  width: auto;
  border-radius: 0px;
  margin: 0;
  border: 0.5px solid grey;
  box-shadow: none;
}
::v-deep .v-pagination__navigation {
  border-radius: 0;
  min-width: 4rem;
  min-width: 3rem;
  min-height: 2.4rem;
  border: 1px solid grey;
  box-shadow: none;
  margin: 0;
}
.cursor-pointer {
  cursor: pointer;
}
.table-header {
  padding: 0 1rem;
  height: 3rem;
  .sort-icon {
    margin-left: 5px;
  }
  .sort-icon.sort-asc path:first-child {
    fill: #000;
  }
  .sort-icon.sort-desc path:last-child {
    fill: #000;
  }
}

.pag-dropdown {
  width: 8rem;
  height: 3rem;
}
</style>
