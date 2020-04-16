<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="title mt-0 font-weight-bold" id="lblDTSetDateTime">
        Network time protocol (NTP) settings
      </div>
      <div class="mt-3" id="lblMandatoryMsg">
        Fields marked with * are mandatory.
      </div>
      <v-divider class="mt-2" />
      <eosDateTimeConfig />
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import EosDateTimeConfig from "./date-time-config.vue";

@Component({
  name: "eos-date-time",
  components: {
    eosDateTimeConfig: EosDateTimeConfig
  }
})
export default class EosDateTime extends Vue {}
</script>

<style lang="scss" scoped></style>
