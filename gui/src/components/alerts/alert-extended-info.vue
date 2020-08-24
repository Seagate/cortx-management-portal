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
  <ul>
    <li v-for="(value, name) in alertExtendedInfo" :key="name">
      <div v-if="typeof value === 'object'">
        <div v-if="Array.isArray(value)">
          <label class="eos-key-label eos-text-md eos-text-bold">{{ name }}</label>
          <ul>
            <li v-for="(childItem, childIndex) in value" :key="childIndex">
              <label class="eos-text-md eos-text-bold">[{{ childIndex + 1 }}]</label>
              <eos-alert-extended-info :alertExtendedInfo="childItem" />
            </li>
          </ul>
        </div>
        <div v-else>
            <label class="eos-text-md eos-text-bold">{{ name }}</label>
            <eos-alert-extended-info :alertExtendedInfo="value" />
        </div>
      </div>
      <div v-else>
        <label class="eos-key-label eos-text-md eos-text-bold">{{ name }}</label>
        <label class="eos-text-md">&nbsp;- {{ value }}</label>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "eos-alert-extended-info"
})
export default class EosAlertExtendedInfo extends Vue {
  @Prop({ required: true })
  public alertExtendedInfo: any;
}
</script>

<style lang="scss" scoped >
ul {
  padding-left: 1em;
  line-height: 1.5em;
  list-style-type: dot;
}
.eos-key-label {
    display: inline-block;
}
.eos-key-label::first-letter{
    text-transform: uppercase;
}
</style>
