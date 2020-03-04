<template>
  <div class="eos-p-2">
    <h1>About</h1>
    <p>
      Version: eos1.0.0
    </p>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "eos-about"
})
export default class EosAbout extends Vue {}
</script>
<style lang="scss" scoped></style>
