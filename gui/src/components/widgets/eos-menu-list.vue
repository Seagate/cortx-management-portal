<template>
  <div>
    <div v-for="item in menuItems" :key="item.id">
      <div class="eos-menu-card-layout">
        <label
          class="eos-text-lg eos-text-bold eos-float-l eos-menu-card-title"
        >
          {{ item.title }}</label
        >
        <button
          type="button"
          class="eos-btn-tertiary eos-float-r"
          @click="$emit('clickFunctionHandler', item.actionClickFunction)"
          :disabled="item.disabled"
        >
          {{ item.actionName }}
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

@Component({
  name: "eos-menu-list"
})
export default class EosMenuList extends Vue {
  @Prop({ required: true, default: false })
  public menuItems!: object[];
}
</script>
<style lang="scss" scoped>
.eos-menu-card-layout {
  height: 4em;
  width: 56.25em;
  padding: 1em 0.5em;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
