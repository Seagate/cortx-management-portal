<template>
    <div>
        <v-data-table
          :v-bind="computedProps"
          :v-on="listeners"
          :items="records"
          calculate-widths
          class="cortx-table"
          id="auditLog-datatable"
          :hide-default-header="true"
        >
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
          <template v-slot:item="{ item }">
            <tr>
                <td
                v-for="value in Object.values(item)"
                :key="value"
                >
                {{ value }}
                </td>
            </tr>
          </template>
        </v-data-table>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { VDataTable } from "vuetify/lib";

@Component({
  name: "CortxTable",
  extends: VDataTable
})
export default class CortxTable extends Vue {
  @Prop({required: true}) public records: any;
  public hasSlot = !!this.$slots.default

  get computedProps() {
    console.log("$props: ", this.$props);
    console.log("$listeners: ", this.$listeners);
    console.log("$slots: ", this.$slots);
    console.log("hasSlot: ", !!this.$slots.default);
    console.log("headers: ", this.$props.headers);
    console.log("items: ", this.$props.items);
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
