<template>
    <div>
        <v-data-table
          :v-bind="computedProps"
          :v-on="listeners"
          :headers="headers"
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
              <template v-for="header in headers">
                <th
                  v-if="header.display"
                  :key="header.text"
                  :class="[
                    'tableheader',
                    header.sortable ? 'cortx-cursor-pointer' : ''
                  ]"
                >
                  <span>{{ header.text }}</span>
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
        </v-data-table>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import cortxDropdownView from "./dropdown/cortx-dropdown-view.vue";

@Component(
  {
  name: "CortxTable",
  components: { cortxDropdownView }
})
export default class CortxTable extends Vue {
  @Prop({required: true}) public records: any;
  @Prop({required: true}) public headers: any;
  
  public search: string = "";
  public hasSlot = !!this.$slots.default;
  public page: number = 1;

  public handleInput(input) {
    console.log("Page Input: ", input)
  }
  
  get itemsPerPageOptions() {
    return this.$props.footerProps["items-per-page-options"].map(item => ({label: `${item} rows`, value: item}))  
  }

  get displayPropOfHeaders() {
    const displayProps = {};
    this.headers.forEach(header => displayProps[header.value] = header.display);
    return displayProps;
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

</script>

<style>
/*Table CSS*/
.cortx-table {
  margin-top: 15px;
}
.tableheader {
  height: 32px !important;
  min-width: 64px;
  background-color: #e8e8e8;
  left: 0.5px;
  right: 0.5px;
  top: 0%;
  bottom: 0%;
  border: 1px solid #ffffff;
  border-radius: 7px 7px 0 0;
  font-style: normal;
  font-weight: bold !important;
  font-size: 14px !important;
  line-height: 20px;
  padding-top: 5px !important;
  display: table-cell;
  align-items: center;
  flex: none;
  order: 0;
  align-self: center;
  margin: 2px 0px;
  color: rgba(0, 0, 0, 0.87);
}
tbody tr {
  background-color: #ffffff !important;
  border-top: 0px solid #e8e8e8 !important;
}
tbody tr:hover {
  background: linear-gradient(
    270deg,
    #fafafa 0%,
    #fafafa 94.67%,
    rgba(250, 250, 250, 0) 101.98%
  ) !important;
}

.cortx-cursor-pointer {
  cursor: pointer;
}
</style>