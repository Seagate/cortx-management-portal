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
        <v-data-table
          :v-bind="computedProps"
          :v-on="listeners"
          :headers="modifiedHeaders"
          :items="records"
          :page="page"
          :items-per-page="itemsPerPage"
          class="cortx-table"
          calculate-widths
          :hide-default-header="true" 
          :hide-default-footer="true" 
        >
          <template #top v-if="!hideFilter">
            <v-container class="ma-0 pl-0 pt-0">
              <v-row class="ma-0 align-center">
                <v-col class="pl-0 flex-grow-0">
                  <cortx-search placeHolder="Search" :modelValue.sync="search" :callBack="filterRecords"/>
                </v-col>

                <v-col sm="3" class="d-flex">
                  <v-icon
                    v-if="filterFields.length > 0"
                    color="csmprimary"
                    class="mr-2"
                    @click="removeFilters()"
                  >
                    mdi-filter-remove
                  </v-icon>
                  <v-select
                   multiple 
                   outlined
                   hide-details 
                   dense 
                   color="csmprimary"
                   :items="filterableProps" 
                   label="Filters" 
                   class="d-inline"
                   v-model="filterFields" 
                   @blur="search && filterRecords()"
                  ></v-select>
                </v-col>
                  
              </v-row>
            </v-container>
          </template>

          <template v-slot:header="{}" >
            <tr>
              <template v-for="header in modifiedHeaders">
                <th
                  v-if="header.display"
                  :key="header.text"
                  :class="[
                    'table-header',
                    header.sortable ? 'cortx-cursor-pointer' : ''
                  ]"
                  @click="header.sortable ? handleSorting(header) : null"
                >
                  <span>
                    {{ header.text }} 
                    <span
                     v-if="header.sortable"
                     class="sort-icon"
                     :class="{
                      'sort-asc': sortParams.sortby === header.value && sortParams.dir === 'asc',
                      'sort-desc': sortParams.sortby === header.value && sortParams.dir === 'desc'
                     }"
                    >
                      <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.42432 0L7.48247 5.25H1.36616L4.42432 0Z" fill="#9E9E9E"/>
                        <path d="M4.42432 13L7.48247 7.75H1.36616L4.42432 13Z" fill="#9E9E9E"/>
                      </svg>
                    </span>
                  </span>
                </th>
              </template>
            </tr>
          </template>

          <template v-slot:item="{item}">
            <tr>
              <template v-for="(value, key) in displayPropOfHeaders">
                  <td 
                    v-if="value"
                    class="data-cell"
                  >
                    <div v-if="(valuePropOfHeaders[key] && valuePropOfHeaders[key]['type']) === 'date'">{{ item[key] | formattedDate }}</div>
                    <div
                     v-else-if="(valuePropOfHeaders[key] && valuePropOfHeaders[key]['type']) === 'image'" 
                     :class="`${valuePropOfHeaders[key]['mapValueToClassName'][item[key]]}`"
                     :title="item[key]"
                    ></div>
                    <div v-else>{{ getTextForDataCell(item[key]) }}</div>
                  </td>
              </template>
              <template v-if="actionHeaders.length">
                <td  class="d-flex align-center">
                  <div v-for="(action, index) in actionHeaders" :key="index">
                    <v-tooltip left v-if="action.condition ? action.condition(item) : true">
                      <template v-slot:activator="{ on, attrs }">
                        <div
                          :class="`cortx-icon-btn ${action.iconClass}`"
                          v-bind="attrs"
                          v-on="on"
                          @click="actionsCallback[action.id]($event, item)"
                        >
                        </div>
                      </template>
                      <span>{{action.tooltip}}</span>
                    </v-tooltip>
                  </div>
                </td>
              </template>
            </tr>
          </template>

          <template v-slot:footer="{props}" v-if="records.length > 0">
            <v-container>
              <v-row justify="end" align="center">
                <v-col class="text-right pa-0 pr-4 flex-grow-0">
                    <v-pagination
                      :value="page"
                      color="csmprimary"
                      class="my-1 font-weight-bold"
                      total-visible="7"
                      page.sync="3"
                      :length="pageCount ? pageCount: props.pagination.pageCount"
                      next-icon="mdi-chevron-double-right"
                      prev-icon="mdi-chevron-double-left"
                      @input="handlePageInput"
                      @next="handlePageInput"
                      @previous="handlePageInput"
                    ></v-pagination>
                </v-col>
                  <cortx-dropdown
                    width="175px"
                    :title="itemsPerPage ? `${itemsPerPage} rows` : 'Rows per page'"
                    :options="itemsPerPageOptions"
                    :menuOnTop="true"
                    @update:selectedOption="handleItemsPerPage" 
                  ></cortx-dropdown>
              </v-row>
            </v-container>
          </template>

        </v-data-table>
    </div>
</template>


<script lang="ts">
import * as moment from "moment";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import cortxDropdownView from "./dropdown/cortx-dropdown-view.vue";
import { CortxDropdownOption } from "./dropdown/cortx-dropdown";
import CortxSearch from "./cortx-search.vue";

@Component({
  name: "cortx-data-table",
  components: { cortxDropdownView, CortxSearch },
  filters: { 
    formattedDate:(date: string | number) => {
      if(isNaN(+date)) return moment.default(date).format("DD-MM-YYYY hh:mm A");
      return moment.default(+date * 1000).format("DD-MM-YYYY hh:mm A")
    }
  }
})
export default class CortxDataTable extends Vue {
  @Prop({required: true}) public records: any[];
  @Prop({required: true}) public headers: any[];
  @Prop({required: false, default: false}) public hideFilter: boolean;
  @Prop({required: false}) public onSort: any;
  @Prop({required: false}) public onFilter: any;
  @Prop({required: false}) public onPaginate: any;
  @Prop({required: false, default: () => ({})}) public sortParams: any;
  @Prop({required: false, default: () => [10, 20, 30, 50]}) public rowsPerPage: Array<string | number>;
  @Prop({required: false}) public actionsCallback: any[];
  @Prop({required: false}) public totalRecords: number;
  
  public search: string = "";
  public filterFields: string[] = [];
  public page: number = 1;
  public itemsPerPage: any = 10;

  public async handlePageInput(input: number) {
    if (input) this.page = input;
    if (this.onPaginate && this.totalRecords) await this.onPaginate(this.page, this.itemsPerPage);
  }

  public async handleItemsPerPage(noOfPages: CortxDropdownOption) {
    this.itemsPerPage = noOfPages.value;
    this.page = 1;
    if (this.onPaginate && this.totalRecords) await this.onPaginate(this.page, this.itemsPerPage);
  }

  public async handleSorting(header: string) {
    await this.onSort(header);
  }

  public getTextForDataCell(value: any) {
    if (Array.isArray(value)) {
      let text = "";
      for (let i = 0; i<value.length; i++) {
        text += i === 0 ? value[i] : `, ${value[i]}`;
      }
      return text;
    }
    return value;
  }

  get pageCount() {
    if (this.onPaginate && this.totalRecords) {
      return Math.ceil(this.totalRecords / this.itemsPerPage);
    }
    return 0
  }

  get modifiedHeaders(){
    return this.headers.map(header => {
      const modHeader = {...header}
      modHeader.text = header.label;
      modHeader.value = header.field_id;
      return modHeader;
    });
  }
  
  get actionHeaders() {
      const actionHeader = this.headers.filter(header => (header.value && header.value.type) === "buttons");
      const actionDetails = actionHeader[0] ? actionHeader[0].actionDetails : [];
      return actionDetails
  }
  
  get itemsPerPageOptions() {
    return this.rowsPerPage.map((item: string | number) => ({label: `${item} rows`, value: item}))  
  }

  get displayPropOfHeaders() {
    const displayProps: {[key: string]: boolean} = {};
    this.headers.forEach((header: any) => {
      if ((header.value && header.value.type) !== "buttons") {
        displayProps[header.field_id] = header.display
      }
    });    
    return displayProps;
  }

  get valuePropOfHeaders() {
    const valueProps: {[key: string]: boolean} = {};
    this.headers.forEach((header: any) => valueProps[header.field_id] = header.value);    
    return valueProps;
  }

  get filterableProps() {
    const filterableProps: any[] = [];
    this.headers.forEach((header: any) => header.display && header.filterable && filterableProps.push(
      {
        text: header.label,
        value: header.field_id
      }
    ));
    return filterableProps;
  }

  get computedProps() {
    return {
      ...this.$props,
    };
  }

  get listeners() {
    return {
      ...this.$listeners,
    };
  }

  public debounce(func: any, timeout = 1000) {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }

  public async filterRecords() {
      await this.onFilter(this.filterFields, this.search);
  }

  public debouncedFilterCallback = this.debounce(this.filterRecords);

  @Watch("search")
  public makeDebouncedFilterCall() {
    this.debouncedFilterCallback();
  }

  public async removeFilters() {
    this.filterFields = [];
    if (this.search) {
      await this.onFilter(this.filterFields, this.search);
    }
  }
}

</script>

<style scoped>
@import "./cortx-data-table.css";
</style>