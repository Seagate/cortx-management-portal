<template>
  <v-container class="pa-0 ma-0 col-12 black">
    <div height="70em" class="pl-10 py-5">
      <img :src="require('@/assets/seagate-green.svg/')" />
      <div class="eos-brand-div">
        <img class="ml-3" :src="require('@/assets/lyve-drive-green.svg/')" />
        <span class="ml-1 eos-brand-label">RACK EDGE</span>
      </div>
    </div>
    <v-divider class="mx-0 grey darken-3"></v-divider>
    <v-container class="black px-10 pt-5" fluid>
      <div class="ml-4 white--text my-10" style="font-size: 26px;">
        Welcome to LyveDrive Rack Edge.
      </div>
      <div class="ml-4 mt-1 mb-8 white--text">
        Click on Start to proceed with on onboarding steps.
      </div>
      <button
        type="button"
        class="eos-btn-primary-dark ml-4"
        @click="$router.push('gdpr')"
      >
        <span>Start</span>
      </button>
    </v-container>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "eos-get-started"
})
export default class EosWelcome extends Vue {}
</script>

<style lang="scss" scoped></style>
