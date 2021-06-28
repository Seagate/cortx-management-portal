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
  <div class="toggle-wrapper">
    <span class="label" v-if="label">{{label}}</span>
    <v-tooltip right :disabled="!tooltip">
        <template v-slot:activator="{ on, attrs }">
            <div
             class="toggle-container" 
             :class="{active: value}" 
             @click="callback ? callback(!value) : $emit('input', !value)" 
             v-bind="attrs"
             v-on="on"
            >
                <div class="toggle-bubble">
                    <div class="off-bubble"> </div>
                </div>
            </div>
        </template>
        <span>{{tooltip}}</span>
    </v-tooltip>
    
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component({
  name: "cortx-toggle-slider",
})
export default class CortxToggleSlider extends Vue {
  @Prop({ required: true }) private value: boolean;
  @Prop({ required: false }) private label: boolean;
  @Prop({ required: false, default: "" }) private tooltip: boolean;
  @Prop({ required: false }) private callback: boolean;
}

</script>

<style lang="scss" scoped>
.toggle-wrapper {
    display: flex;
    align-items: center;
}
.toggle-wrapper .label {
    margin-right: 5px;
}
.toggle-container {
    height: 16px;
    width: 32px;
    border-radius: 8px;
    border: 2px solid #9E9E9E;
    position: relative;
    cursor: pointer;
}
.toggle-container:hover {
    border-color: #454545;
}
.toggle-container:hover .toggle-bubble {
    background-color: #454545;
}
.toggle-bubble {
    height: 8px;
    width: 8px;
    border-radius: 50%;
    background-color: #9E9E9E;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 3px;
    transition: left 150ms linear;
}
.off-bubble {
    height: 3px;
    width: 3px;
    background-color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
div.toggle-container.active {
    border-color: #6EBE49;
}
div.toggle-container.active .toggle-bubble {
    left: calc(100% - 11px);
    background-color: #6EBE49 !important;
}
.active .off-bubble {
    display: none;
}
</style>
