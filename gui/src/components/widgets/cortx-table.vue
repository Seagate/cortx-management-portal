<template>
    <div>
        <v-data-table
          :v-bind="computedProps"
          :v-on="listeners"
          :items="records"
          calculate-widths
          :hide-default-header="true" 
        >
          <template #top>
            <v-container class="ma-0 pl-0">
              <v-row class="ma-0">
                <v-col sm="2" class="pl-0">
                  <v-text-field
                    outlined
                    hide-details
                    placeholder="Search"
                    height="50px"
                    color="csmprimary"
                    v-model="search"
                    append-icon="mdi-magnify"
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
                   :items="['Remote IP', 'Path','Method', 'User Agent']" 
                   label="Filters" 
                   class="d-inline" 
                   ></v-select>
                </v-col>
                  
              </v-row>
            </v-container>
          </template>

          <template v-slot:header="{}" >
            <tr>
              <th
                v-for="header in headers"
                :key="header.text"
                :class="[
                  'tableheader',
                  header.sortable ? 'cortx-cursor-pointer' : ''
                ]"
              >
                <span>{{ header.text }}</span>
              </th>
            </tr>
          </template>

          <!-- <template v-slot:item.timestamp="props">
            {{ props.item.timestamp | timeago }}
          </template> -->

          <template v-slot:item="{ item }">
            <tr>
                <td
                v-for="[key, value] in Object.entries(item)"
                :key="item.request_id"
                >
                {{ value }}
                </td>
            </tr>
          </template>

          <!-- <template #footer="{props}">
            <v-container>
              <v-row justify="end" align="center">
                <v-col sm="4" class="text-right">
                    <v-pagination
                      v-model="page"
                      color="csmprimary"
                      class="my-1"
                      total-visible="7"
                      page.sync="3"
                      :length="props.pagination.pageCount"
                      next-icon="mdi-chevron-double-right"
                      prev-icon="mdi-chevron-double-left"
                      @input="handleInput"
                    ></v-pagination>
                </v-col>
                <cortx-dropdown
                  id="auditlog-component"
                  :options="itemsPerPageOptions"
                  :title="component ? component : undefined"
                  :menuOnTop="true"
                ></cortx-dropdown>
              </v-row>
            </v-container>
            <pre>{{props}}</pre>
          </template> -->
        </v-data-table>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { VDataTable } from "vuetify/lib";
import cortxDropdownView from "./dropdown/cortx-dropdown-view.vue";

@Component(
  {
  name: "CortxTable",
  extends: VDataTable,
  components: { cortxDropdownView }
})
export default class CortxTable extends Vue {
  @Prop({required: true}) public records: any;
  
  public search: string;
  public hasSlot = !!this.$slots.default;
  public page: number = 1;

  public handleInput(input) {
    console.log("Page Input: ", input)
  }
  
  get itemsPerPageOptions() {
    return this.$props.footerProps["items-per-page-options"].map(item => ({label: `${item} rows`, value: item}))  
  }

  get computedProps() {
    return {
      ...this.$props,
      footerProps: this.$props.footerProps
      ? this.$props.footerProps
      : { "items-per-page-options": [50, 100, 150, 200] }
    };
  }

  get listeners() {
    return {
      ...this.$listeners,
    };
  }
}

// :options="[{label:'50 rows', value: 50}, {label:'100 rows', value: 100}, {label:'150 rows', value: 50}]"
</script>
