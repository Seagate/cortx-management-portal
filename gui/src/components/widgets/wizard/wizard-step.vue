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
  <span class="wrapper">
    <span class="arrow-steps clearfix">
      <span class="step first" :class="stepClass">
        <span :id="stepId">{{ stepName }}</span>
      </span>
    </span>
  </span>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "cortx-wizard-step",
  props: {
    stepName: String,
    stepClass: String,
    stepId: String
  }
})
export default class CortxWizardStep extends Vue {}
</script>

<style lang="scss" scoped>
.clearfix:after {
  clear: both;
  content: "";
  display: inline-block;
  height: 0;
}
.wrapper {
  width: 100%;
}
.nav {
  margin-top: 40px;
}
.pull-right {
  float: right;
}
a,
a:active {
  color: #212121;
  text-decoration: none;
}
a:hover {
  color: #999;
}
.arrow-steps .step {
  font-size: 14px;
  text-align: center;
  color: white;
  margin: 0 1px;
  padding: 5px 10px 10px 30px;
  min-width: 10em;
  float: left;
  position: relative;
  background-color: #b7b7b7;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  transition: background-color 0.2s ease;
}
.arrow-steps .step:after,
.arrow-steps .step:before {
  content: " ";
  position: absolute;
  top: 0;
  right: -17px;
  width: 0;
  height: 0;
  border-top: 19px solid transparent;
  border-bottom: 17px solid transparent;
  border-left: 17px solid #b7b7b7;
  z-index: 2;
  transition: border-color 0.2s ease;
}
.arrow-steps .step:before {
  right: auto;
  left: 0;
  border-left: 17px solid #ffffff;
  z-index: 0;
}
.arrow-steps .step:first-child:before {
  border: none;
}
.arrow-steps .step span {
  position: relative;
  top: 3px;
}
.arrow-steps .step.complete {
  color: #ffffff;
  background-color: #4b813d;
  cursor: pointer;
}
.arrow-steps .step.complete:after {
  border-left: 17px solid #4b813d;
}
.arrow-steps .step.current {
  color: #ffffff;
  background-color: #6ebe49;
  cursor: pointer;
}
.arrow-steps .step.current:after {
  border-left: 17px solid #6ebe49;
}
.arrow-steps .step.first:before {
  border-top: 19px solid transparent;
  border-bottom: 17px solid transparent;
  border-left: 17px solid white;
}
@media (max-width: 765px) {
  .arrow-steps .step {
    min-width: 1em;
  }
}
</style>
