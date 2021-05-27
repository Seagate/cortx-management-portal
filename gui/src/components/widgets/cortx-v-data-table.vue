<template>
    <div>
        <v-data-table
          :v-bind="computedProps"
          :v-on="listeners"
          :headers="modifiedHeaders"
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
              <template v-for="header in modifiedHeaders">
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
  name: "cortx-v-data-table",
  components: { cortxDropdownView }
})
export default class CortxVDataTable extends Vue {
  @Prop({required: true}) public records: any;
  @Prop({required: true}) public headers: any;
  
  public search: string = "";
  public hasSlot = !!this.$slots.default;
  public page: number = 1;

  public handleInput(input) {
    console.log("Page Input: ", input)
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
    return this.$props.footerProps["items-per-page-options"].map(item => ({label: `${item} rows`, value: item}))  
  }

  get displayPropOfHeaders() {
    const displayProps = {};
    this.headers.forEach(header => displayProps[header.field_id] = header.display);    
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
@import "./cortx-v-data-table.css"
</style>