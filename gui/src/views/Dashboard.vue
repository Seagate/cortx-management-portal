<template>
  <eos-alert-medium />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import EosAlertMedium from "./../components/dashboard/AlertMedium.vue";

@Component({
  name: "Dashboard",
  components: {
    eosAlertMedium: EosAlertMedium
  }
})
export default class Home extends Vue {}
</script>
<style lang="scss" scoped>
.page {
  position: relative;
}
</style>

