<!--
* CORTX-CSM: CORTX Management web.
* Copyright (c) 2022 Seagate Technology LLC and/or its Affiliates
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
  <div>
    <div
      class="sgt-drop-container"
      :class="{ 'primary-box': value && value.length > 0 }"
      v-on:drop.prevent="dropHandler"
      v-on:dragover.prevent="dragHandler"
      @click="$refs.inputField.click()"
    >
      <img
        :src="
          require(`@/assets/icons/${
            value && value.length > 0 ? 'file-upload-green' : 'file-upload'
          }.svg`)
        "
        class="file-icon"
      />
      <label>
        <div v-if="value && value.length > 0">
          {{ value[0].name }}
          <SgtSvgIcon
            ref="closeIcon"
            icon="close-green.svg"
            hoverIcon="close-hover.svg"
            tooltip="Remove"
            class="cancel-icon"
            @click="removeFile($event)"
          />
        </div>
        <div v-else>Drag and drop or browse to choose a file</div>
      </label>
      <input
        id="input-field"
        ref="inputField"
        :name="fileName ? fileName : 'dropFile'"
        @change="processInput"
        type="file"
        hidden
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, ModelSync } from "vue-property-decorator";
import SgtSvgIcon from "../SgtSvgIcon/SgtSvgIcon.vue";
@Component({
  name: "SgtDropFile",
  components: { SgtSvgIcon },
})
export default class SgtDropFile extends Vue {
  @Prop({ required: false }) private fileName: string;
  @ModelSync("files", "change", {}) value: any;

  dropHandler(ev: any) {
    if (ev) {
      for (var i = 0; i < ev.dataTransfer.files.length; i++) {
        this.value.push(ev.dataTransfer.files[i]);
      }
    }
  }
  public dragHandler(ev: Event) {
    if (ev) {
      // console.log(`Dragging... ${JSON.stringify(ev)}`);
    }
  }

  processInput() {
    let src = this.$el.querySelector("#input-field");
    this.dropHandler({ dataTransfer: src });
  }

  removeFile(event: any) {
    event.stopPropagation();
    this.value = [];
  }
}
</script>
<style lang="scss" scoped>
.sgt-drop-container {
  height: 130px;
  border: 2px dashed $border;
  border-radius: 4px;
  width: 400px;
  text-align: center;
  color: $border;
  background-color: $backgroundGray;
  cursor: pointer;
  .file-icon {
    display: block;
    margin: 20px auto;
  }
  .cancel-icon {
    height: 20px;
  }
  label {
    cursor: pointer;
  }
}
.primary-box {
  color: $primary;
  border-color: $primary;
}
</style>