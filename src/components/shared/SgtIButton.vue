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
  <div class="i-button-container">
    <div class="i-button-icon" @click="showInfo = !showInfo">
      <svg
        width="13"
        height="12"
        viewBox="0 0 13 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M12.235 5.9998C12.235 9.2859 9.57106 11.9498 6.28496 11.9498C2.99887 11.9498 0.334961 9.2859 0.334961 5.9998C0.334961 2.71371 2.99887 0.0498047 6.28496 0.0498047C9.57106 0.0498047 12.235 2.71371 12.235 5.9998ZM11.235 5.9998C11.235 8.73361 9.01877 10.9498 6.28496 10.9498C3.55115 10.9498 1.33496 8.73361 1.33496 5.9998C1.33496 3.266 3.55115 1.0498 6.28496 1.0498C9.01877 1.0498 11.235 3.266 11.235 5.9998ZM6.28555 6.04988C6.83783 6.04988 7.28555 6.49759 7.28555 7.04988V9.14988C7.28555 9.70216 6.83783 10.1499 6.28555 10.1499C5.73326 10.1499 5.28555 9.70216 5.28555 9.14988V7.04988C5.28555 6.49759 5.73326 6.04988 6.28555 6.04988ZM6.2856 4.94961C6.86549 4.94961 7.3356 4.47951 7.3356 3.89961C7.3356 3.31971 6.86549 2.84961 6.2856 2.84961C5.7057 2.84961 5.2356 3.31971 5.2356 3.89961C5.2356 4.47951 5.7057 4.94961 6.2856 4.94961Z"
          fill="#6EBE49"
        />
      </svg>
    </div>

    <ClickOutsideHOC @clicked-outside="showInfo = false">
      <div class="i-info-container" v-if="showInfo">
        <slot></slot>
        <div class="upward-pointer"></div>
      </div>
    </ClickOutsideHOC>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import ClickOutsideHOC from "./ClickOutsideHOC.vue";

@Component({
  name: "SgtIButton",
  components: {
    ClickOutsideHOC,
  },
})
export default class SgtIButton extends Vue {
  public showInfo = false;
}
</script>

<style lang="scss" scoped>
.i-button-container {
  position: relative;

  svg {
    cursor: pointer;
  }

  .i-info-container {
    min-width: 250px;
    padding: 0.5em 1em;
    background-color: #454545;
    color: white;
    position: absolute;
    top: 30px;
    left: -20px;
    border-radius: 4px;
    z-index: 10;

    .upward-pointer {
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-bottom: 8px solid #454545;
      position: absolute;
      top: -8px;
      left: 21px;
    }
  }
}
</style>
