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
                    color="csmprimary"
                    class="mr-2"
                  >
                    mdi-filter
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
                   @blur="filterRecords"
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
                    'tableheader',
                    header.sortable ? 'cortx-cursor-pointer' : ''
                  ]"
                  @click="header.sortable ? onSort(header) : null"
                >
                  <span>
                    {{ header.text }} 
                    <span>
                      <img
                        v-if="sortParams.sortby === header.value"
                        id="alert-desc"
                        :src="require('@/assets/widget/table-sort-desc.svg/')"
                        class="d-inline-block"
                        :class="sortParams.dir === 'asc' && 'sort-asc'"
                        style="vertical-align: bottom; margin-left: -0.3em;"
                        height="20"
                        width="20"
                      />
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
                  >
                    <div v-if="(valuePropOfHeaders[key] && valuePropOfHeaders[key]['type']) === 'date'">{{ item[key] | formattedDate }}</div>
                    <div
                     v-else-if="(valuePropOfHeaders[key] && valuePropOfHeaders[key]['type']) === 'image'" 
                     :class="`image-data ${valuePropOfHeaders[key]['mapValueToClassName'][item[key]]}`"
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

          <template v-slot:footer="{props}">
            <v-container>
              <v-row justify="end" align="center">
                <v-col class="text-right pa-0 pr-4">
                    <v-pagination
                      :value="page"
                      color="csmprimary"
                      class="my-1 font-weight-bold"
                      total-visible="7"
                      page.sync="3"
                      :length="props.pagination.pageCount"
                      next-icon="mdi-chevron-double-right"
                      prev-icon="mdi-chevron-double-left"
                      @input="handlePageInput"
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
import { Component, Vue, Prop } from "vue-property-decorator";
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
  @Prop({required: false, default: () => ({})}) public sortParams: any;
  @Prop({required: false, default: () => [10, 20, 30, 50]}) public rowsPerPage: Array<string | number>;
  @Prop({required: false}) public actionsCallback: any[];
  
  public search: string = "";
  public filterFields: string[] = [];
  public page: number = 1;
  public itemsPerPage: any = 10;

  public handlePageInput(input: number) {
    this.page = input;
  }

  public handleItemsPerPage(noOfPages: CortxDropdownOption) {
    this.itemsPerPage = noOfPages.value
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
    this.headers.forEach((header: any) => header.filterable && filterableProps.push(
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

  public filterRecords() {
    if (this.search.length > 0) this.onFilter(this.filterFields, this.search);
  }
}

</script>

<style>
@import "./cortx-data-table.css"
</style>