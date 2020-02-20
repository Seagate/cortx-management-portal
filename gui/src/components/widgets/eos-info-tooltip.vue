<template>
  <span class="d-flex">
    {{ label }}
    <v-tooltip right max-width="300">
      <template v-slot:activator="{ on }">
        <img
          class="eos-info-icon"
          v-on="on"
          :src="require('@/assets/actions/info-green.svg')"
        />
      </template>
      <span>{{ message }}</span>
    </v-tooltip>
  </span>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "eos-info-tooltip"
})
export default class EosInfoTooltip extends Vue {
  @Prop({ required: false })
  public label!: string;

  @Prop({ required: false })
  public message!: string;
}
</script>
<style lang="scss" scoped>
.eos-info-icon {
  cursor: pointer;
  height: 20px;
  padding-bottom: 2px;
}
</style>
