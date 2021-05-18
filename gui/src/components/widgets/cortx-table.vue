<template>
    <div>
        <v-data-table
          :v-bind="computedProps"
          :v-on="listeners"
          calculate-widths
          :items="records"
          class="cortx-table"
          id="auditLog-datatable"
          :hide-default-header="true"
        >
          <slot v-if="hasSlot"></slot>
          <!-- <slot name="header" v-if="hasSlot()"></slot>
          <slot name="item" v-if="hasSlot()"></slot> -->
          <template v-slot:header="{}" v-if="!hasSlot">
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
          <template v-slot:item="{ item }" v-if="!hasSlot">
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
