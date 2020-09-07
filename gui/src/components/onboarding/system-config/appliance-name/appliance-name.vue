<template>
  <v-container>
    <div class="pl-4 body-2">
      <div class="title mt-0 font-weight-bold" id="lblAppliance">
        Appliance name
      </div>
      <div class="mt-3" id="lblApplianceNameInfo">Add Appliance name</div>
      <v-divider class="mt-2" />
      <cortxApplianceNameConfig />
    </div>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import CortxApplianceNameConfig from "./appliance-name-config.vue";
@Component({
  name: "cortx-appliance-name",
  components: {
    cortxApplianceNameConfig: CortxApplianceNameConfig
  }
})
export default class CortxApplianceName extends Vue {}
</script>

<style lang="scss" scoped></style>
