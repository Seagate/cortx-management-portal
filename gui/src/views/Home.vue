<template>
  <span >Hello world</span>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "Home"
})
export default class Home extends Vue {}
</script>
<style lang="scss" scoped>
.page {
  position: relative;
 
}
</style>

