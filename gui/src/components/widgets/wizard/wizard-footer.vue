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
  <div class="mt-8 mb-5">
    <v-btn
      @click="gotoNextPage()"
      v-if="this.$props.footerObj && this.$props.footerObj.nextBtnText"
      elevation="0"
      color="csmprimary"
      :disabled="!isValidData"
    >
      <span class="white--text">{{ this.$props.footerObj.nextBtnText }}</span>
    </v-btn>
    <span
      class="csmprimary--text ml-8 pointer"
      @click="gotoPrevPage()"
      v-if="this.$props.footerObj && this.$props.footerObj.prevBtnText"
      >{{ this.$props.footerObj.prevBtnText }}</span
    >
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { EVENT_BUS } from "./../../../main";

@Component({
  name: "cortx-wizard-footer",
  props: {
    footerObj: Object
  }
})
// Overall: EVENT_BUS is used here to have a comunication between footer and middle component (siblings)
// this.emit is used to have a communication between footer and wizard component (parent)
export default class CortxWizardFooter extends Vue {
  private mounted() {
    // Listen to middle components form validation event so that footer can enable or disable next button
    EVENT_BUS.$on("validForm", (res: any) => {
      this.$data.isValidData = res;
    });
  }
  private destroyed() {
    // Shut off the listener
    EVENT_BUS.$off("validForm");
  }
  private data() {
    return {
      isValidData: false
    };
  }
  private gotoNextPage(evt: Event) {
    const result = new Promise(resolve => {
      // emit event which will trigger onNext method of middle component
      // and get a callback response (res) once its work is finished
      this.$store.dispatch("systemConfig/showLoader", "Please wait");
      EVENT_BUS.$emit("emitOnNext", resolve); // Emit event to Middle Component (sibling)
    }).then(res => {
      if (res) {
        // Footer got message from Middle component saying;
        // its work is complete and wizard can move to next possible step
        this.$emit(
          "messageFromFooter",
          this.$props.footerObj.nextComponent,
          "goNext"
        ); // Emit event to Wizard Component (parent)
      }
      this.$store.dispatch("systemConfig/hideLoader");
    });
  }
  private gotoPrevPage() {
    // Footer got message from Middle component saying;
    // its work is complete and wizard can move to next possible step
    this.$emit(
      "messageFromFooter",
      this.$props.footerObj.prevComponent,
      "goPrev"
    ); // Emit event to Wizard Component (parent)
  }
}
</script>

<style lang="scss" scoped>
.pointer {
  cursor: pointer;
}
</style>
