/*****************************************************************************
 Filename:          loader.vue
 Description:       Loader widget Component

 Creation Date:     20/11/2019
 Author:            Sri Bhargav Metta

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
 <v-dialog v-model="show" persistent width="300">
    <v-card color="success">
        <v-card-text>
            <span class="white--text" v-if="message">{{ message }}</span>
            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
    </v-card>
</v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "eos-loader"
})
export default class EosLoader extends Vue {

    @Prop({required: true})
    public show!: boolean;

    @Prop({required: false})
    public message!: string;
}
</script>
<style lang="scss" scoped>
</style>
