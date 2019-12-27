/*****************************************************************************
 Filename:          wizard-footer.vue
 Description:       Wizard Steps Footer Component to manage Onboarding Steps

 Creation Date:     10/12/2019
 Author:            Sanjeevan Bhave

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <div class="mt-8">
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
import { EventBus } from "./../../../main";

@Component({
  name: "eos-wizard-footer",
  props: {
    footerObj: Object
  }
})
// Overall: EventBus is used here to have a comunication between footer and middle component (siblings)
// this.emit is used to have a communication between footer and wizard component (parent)
export default class EosWizardFooter extends Vue {
  private mounted() {
    // Listen to middle components form validation event so that footer can enable or disable next button
    EventBus.$on("validForm", (res: any) => {
      this.$data.isValidData = res;
    });
  }
  private destroyed() {
    // Shut off the listener
    EventBus.$off("validForm");
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
      this.$store.dispatch("systemConfig/showLoaderMessage", {
        show: true,
        message: "Please wait"
      });
      EventBus.$emit("emitOnNext", resolve); // Emit event to Middle Component (sibling)
    }).then(res => {
      if (res) {
        // Footer got message from Middle component saying;
        // its work is complete and wizard can move to next possible step
        this.$store.dispatch("systemConfig/showLoaderMessage", {
          show: false
        });
        this.$emit(
          "messageFromFooter",
          this.$props.footerObj.nextComponent,
          "goNext"
        ); // Emit event to Wizard Component (parent)
      }
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
