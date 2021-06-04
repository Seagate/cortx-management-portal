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
            <v-container class="ma-0 pl-0">
              <v-row class="ma-0">
                <v-col sm="2" class="pl-0">
                  <v-text-field
                    label="Search"
                    placeholder="Hit enter to search"
                    outlined
                    dense
                    hide-details
                    height="50px"
                    color="csmprimary"
                    v-model="search"
                    append-icon="mdi-magnify"
                    @keyup.enter="onFilter(filterFields, search)"
                  >
                  </v-text-field>
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
                   @blur="onFilter(filterFields, search)"
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
                  @click="onSort(header)"
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
              <template v-for="[key, value] in Object.entries(item)">
                  <td
                    v-if="displayPropOfHeaders[key]"
                  >
                    {{ value }}
                  </td>
              </template>
            </tr>
          </template>

          <template v-slot:footer="{props}">
            <v-container>
              <v-row justify="end" align="center">
                <v-col sm="4" class="text-right pa-0 pr-4">
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
                    title="Rows per page"
                    width="175px"
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
import { Component, Vue, Prop } from "vue-property-decorator";
import cortxDropdownView from "./dropdown/cortx-dropdown-view.vue";
import { CortxDropdownOption } from "./dropdown/cortx-dropdown"

@Component(
  {
  name: "cortx-data-table",
  components: { cortxDropdownView }
})
export default class CortxDataTable extends Vue {
  @Prop({required: true}) public records: any[];
  @Prop({required: true}) public headers: any[];
  @Prop({required: false, default: false}) public hideFilter: boolean;
  @Prop({required: true}) public onSort: any;
  @Prop({required: true}) public onFilter: any;
  @Prop({required: true}) public sortParams: any;
  @Prop({required: false, default: [10, 20, 30, 50]}) public rowsPerPage: Array<string | number>;
  
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

  get modifiedHeaders(){
    return this.headers.map(header => {
      const modHeader = {...header}
      modHeader.text = header.label;
      modHeader.value = header.field_id;
      return modHeader;
    });
  }
  
  get itemsPerPageOptions() {
    return this.rowsPerPage.map((item: string | number) => ({label: `${item} rows`, value: item}))  
  }

  get displayPropOfHeaders() {
    const displayProps: {[key: string]: boolean} = {};
    this.headers.forEach((header: any) => displayProps[header.field_id] = header.display);    
    return displayProps;
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
}

</script>

<style>
@import "./cortx-data-table.css"
</style>