<template>
    <div class="cortx-search-container">
        <input
         type="text" 
         :placeholder="placeHolder" 
         :value="modelValue" 
         @input="$emit('update:modelValue', $event.target.value)" 
         @keyup.enter="callBack"
        />
        <div class="search-image" :class="{active: modelValue.length > 0}" @click="callBack"></div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "cortx-search",
})
export default class CortxSearch extends Vue {
    @Prop({required: true}) public modelValue: string;
    @Prop({required: true}) public placeHolder: string;
    @Prop({required: true}) public callBack: () => void;
}
</script>

<style scoped>
.cortx-search-container {
    position: relative;
    display: inline-block;
}
.cortx-search-container input{
    display: block;
    height: 40px;
    width: 300px;
    border: 1px solid #9E9E9E;
    padding: 1em 50px 1em 1em;
    border-radius: 4px;
}
input:focus {
    border: 1px solid #6ebe49;
}
.search-image {
    height: 40px;
    width: 40px;
    background-image: url('../../assets/search-icon-disabled.png');
    position: absolute;
    top:0;
    right:0;
    cursor:not-allowed;
}
.search-image.active{
    cursor: pointer;
    background-image: url('../../assets/search-icon-active.png');
}
</style>