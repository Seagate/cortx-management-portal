<template>
    <div>
        <v-data-table
          calculate-widths
          :headers="headers"
          :items="records"
          :footer-props="{
            'items-per-page-options': [50, 100, 150, 200]
          }"
          class="cortx-table"
          id="auditLog-datatable"
          :hide-default-header="true"
        >
          <template v-slot:header="{}">
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

@Component({
  name: "CortxTable",
})

export default class CortxAuditLog extends Vue {
  @Prop({ required: true })
  public headers: any;
  @Prop({ required: true })
  public records: any;
}

</script>
