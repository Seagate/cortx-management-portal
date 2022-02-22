<!--
* CORTX-CSM: CORTX Management web.
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
* please email opensource@seagate.com.
-->
<template>
  <v-dialog v-model="dialog" scrollable max-width="600px">
    <v-card>
      <v-card-title>
        <div class="title-container">
          {{modalTitle}}
          <img
            :src="require(`@/assets/icons/close-green.svg`)"
            @click="dialog = false"
            class="close-btn"
            alt="logo"
          />
        </div>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text style="height: 300px;">
        <v-treeview v-if="moreDetails.length" :items="moreDetails[0].children"></v-treeview>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";
import LrLabel from "../shared/LrLabel/LrLabel.vue";
@Component({
  name: "LrAlertDialog",
  components: {},
})
export default class LrAlertDialog extends Vue {
  @Prop({ required: true }) private modalData: any;
  @Prop({ required: true }) private modalTitle: string;
  @PropSync("showAlertDetailsDialog", { required: false, default: false })
  private dialog: boolean;

  moreDetails: any = [];
  mainIndex = 0;

  mounted() {
    this.moreDetails = [this.createTree(this.modalData, "details")];
  }

  createTree(data: any, name: string) {
    this.mainIndex = this.mainIndex + 1;
    let item: any = {
      id: this.mainIndex,
      name: name,
      children: [],
    };
    for (const prop in data) {
      this.mainIndex = this.mainIndex + 1;
      if (typeof data[prop] == "string" || typeof data[prop] == "number") {
        item.children.push({
          id: this.mainIndex,
          name: `${prop} - ${data[prop]}`,
        });
      } else if (typeof data[prop] == "object") {
        item.children.push(this.createTree(data[prop], prop));
      }
    }
    return item;
  }
}
</script>
<style lang="scss" scoped>
.title-container {
  width: 100%;
  .close-btn {
    cursor: pointer;
    float: right;
  }
}
</style>