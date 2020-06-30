/*****************************************************************************
 Filename:          eos-node-replacement.vue
 Description:       Replace nodes

 Creation Date:     25/06/2020
 Author:            Sri Bhargav Metta

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <div>
    <div class="eos-node-replacement-title">
      <label class="eos-text-lg eos-text-bold">Node replacement</label>
    </div>
    <div
      class="mt-4 pa-3 eos-last-upgrade-info-container eos-text-md"
      v-if="lastNodeReplacementStatus"
    >
      <label class="eos-text-bold">Last node replacement status</label>
      <button
        id="btnStartUpgrade"
        type="button"
        class="ml-3 eos-btn-secondary"
        @click="getLastNodeReplacementStatus()"
        style="height: 25px; padding-left: 10px; padding-right: 10px;"
      >Refresh</button>
      <v-divider class="mt-2 mb-4" />
      <label>Replacement of</label>
      <label>{{ " " + lastNodeReplacementStatus.node_id + " " }}</label>
      <label>is</label>
      <label>{{ " " + lastNodeReplacementStatus.status }}</label>
    </div>
    <div class="mt-3">
      <eos-dropdown :selectedOption.sync="selectedNode" :options="nodes" class="eos-float-l"></eos-dropdown>
      <button
        id="btnStartUpgrade"
        type="button"
        class="ml-5 eos-btn-primary eos-float-l"
        @click="replaceNode()"
        style="margin-top: 2px;"
        :disabled="!selectedNode.value"
      >Replace node</button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
import { LastNodeReplacementStatus } from "../../models/node-replacement";

@Component({
  name: "eos-node-replacement"
})
export default class EosNodeReplacement extends Vue {
  public lastNodeReplacementStatus: LastNodeReplacementStatus | null = null;
  public nodes: any[] = [];
  public selectedNode: any = {} as any;

  public async mounted() {
    await this.getLastNodeReplacementStatus();
    await this.getNodes();
  }

  public async getLastNodeReplacementStatus() {
    this.$store.dispatch(
      "systemConfig/showLoader",
      "Fetching last node replacement status..."
    );
    const res: any = await Api.getAll(apiRegister.node_replace);
    this.lastNodeReplacementStatus = res && res.data ? res.data : null;
    this.$store.dispatch("systemConfig/hideLoader");
  }

  public async getNodes() {
    this.$store.dispatch("systemConfig/showLoader", "Fetching nodes...");
    try {
      const res = await Api.getAll(apiRegister.node_status);
      if (res && res.data) {
        res.data.node_status.forEach((node: any) => {
          if (node.shutdown) {
            this.nodes.push({ label: node.name, value: node.name });
          }
        });
      }
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.error("err logger: ", e);
    }
    this.$store.dispatch("systemConfig/hideLoader");
  }

  public async replaceNode() {
    this.$store.dispatch(
      "systemConfig/showLoader",
      "Starting node replacement..."
    );
    const res: any = await Api.post(apiRegister.node_replace, {
      resource_name: this.selectedNode.value
    });
    this.$store.dispatch("systemConfig/hideLoader");
    await this.getLastNodeReplacementStatus();
  }
}
</script>

<style lang="scss" scoped>
.eos-node-replacement-title {
  height: 46px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
.eos-last-upgrade-info-container {
  border: 1px solid #e3e3e3;
  border-radius: 5px;
}
</style>
