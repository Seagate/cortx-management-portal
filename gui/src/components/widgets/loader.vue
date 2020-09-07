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
  <v-overlay id="commonLoaderContainer" :value="show" opacity="0.75">
    <div class="loader-container">
      <div class="loader-header" v-if="title">
        <label>Header</label>
      </div>
      <div class="loader-body">
        <div class="loader-message" v-if="message">
          <label id="lblLoaderMessage">{{ message }}</label>
        </div>
        <v-progress-linear id="commonLoaderProgress" indeterminate color="csmprimary" background-color="csmdisabled"></v-progress-linear>
      </div>
    </div>
  </v-overlay>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "cortx-loader"
})
export default class CortxLoader extends Vue {
  @Prop({ required: true })
  public show!: boolean;

  @Prop({ required: false })
  public title!: string;

  @Prop({ required: false })
  public message!: string;
}
</script>
<style lang="scss" scoped>
.loader-container {
  background-color: #ffffff;
  min-width: 333px;
}
.loader-header {
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 26px;
  border-bottom: 1px solid var(--v-csmborder-base);
  color: #000000;
  padding: 24px;
}
.loader-body {
  padding: 10px;
}
.loader-message {
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  color: #000000;
  margin-bottom: 6px;
}
</style>
