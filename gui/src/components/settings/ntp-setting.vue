<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="title mt-0 font-weight-bold" id="lblDTSetDateTime">
        Test data for Network time protocol (NTP) settings
      </div>
      <eosDateTimeConfig/>
      <button
        type="button"
        class="eos-btn-primary eos-float-l ml-3"
        >Apply
      </button>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import EosDateTimeConfig from "../onboarding/system-config/date-time/date-time-config.vue";

@Component({
  name: "eos-date-time",
  components: {
    eosDateTimeConfig: EosDateTimeConfig

  }
})

export default class EosNtpSetting extends Vue {
}
</script>

<style lang="scss" scoped>
</style>
