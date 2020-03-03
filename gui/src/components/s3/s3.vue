<template>
  <div>
    <div id="s3-configuration-title-container" class="mb-4 s3-configuration-page-title">
      <label id="s3-account-form-title" class="headline font-weight-bold">S3 configuration</label>
      <div class="mt-1" style="color: #454545;font-size: 14px;">
        <label>
          Use this table to create IAM users that have access to the buckets
          you create in the next step. You can add as many as you like. The
          access key and secret key for each user will be shown once you click
          continue. You will have the opportunity to download a CSV at that
          point.
        </label>
      </div>
    </div>
    <eos-tabs :tabsInfo="tabsInfo" />
    <eos-has-access :to="$eosUserPermissions.s3accounts + $eosUserPermissions.list">
      <S3Account v-if="showAccountTab" />
    </eos-has-access>
    <eos-has-access :to="$eosUserPermissions.s3iamusers + $eosUserPermissions.list">
      <IAMUser v-if="showIAMUserTab" />
    </eos-has-access>
    <eos-has-access :to="$eosUserPermissions.s3buckets + $eosUserPermissions.list">
      <S3Bucket v-if="showBucketTab" />
    </eos-has-access>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import EosTabs, { TabsInfo } from "../widgets/eos-tabs.vue";
import S3Account from "./account-management.vue";
import IAMUser from "./iam-user-management.vue";
import S3Bucket from "./bucket-creation.vue";

@Component({
  name: "eos-s3-management",
  components: { EosTabs, S3Account, IAMUser, S3Bucket }
})
export default class EosS3Management extends Vue {
  public tabsInfo: TabsInfo = {
    tabs: [
      {
        id: 1,
        label: "Account",
        show: false,
        requiredAccess: "s3accounts"
      },
      {
        id: 2,
        label: "IAM user",
        show: false,
        requiredAccess: "s3iamusers"
      },
      {
        id: 3,
        label: "Bucket",
        show: false,
        requiredAccess: "s3buckets"
      }
    ],
    selectedTab: 1
  };

  private showAccountTab: boolean = true;
  private showIAMUserTab: boolean = false;
  private showBucketTab: boolean = false;

  public mounted() {
    /*
    Set `show` property to true/false based on the user access
    We can directly use Vue prototype method using `this`, but the linter
    shows this as an error e.g. `Property '$hasAccessToCsm' does not exist on type 'Vue'`
    That is why we need to create `vueInstance` constant with `any` type and use the
    methods or global variables declared using `Vue.prototype`.
    */

    const vueInstance: any = this;
    this.tabsInfo.tabs = this.tabsInfo.tabs.map((tab: any) => {
      tab.show = vueInstance.$hasAccessToCsm(
        vueInstance.$eosUserPermissions[tab.requiredAccess] +
          vueInstance.$eosUserPermissions.list
      );
      return tab;
    });
  }
  @Watch("tabsInfo.selectedTab")
  public onPropertyChanged(value: number, oldValue: number) {
    switch (value) {
      case 1:
        this.showAccountTab = true;
        this.showIAMUserTab = false;
        this.showBucketTab = false;
        break;
      case 2:
        this.showAccountTab = false;
        this.showIAMUserTab = true;
        this.showBucketTab = false;
        break;
      case 3:
        this.showAccountTab = false;
        this.showIAMUserTab = false;
        this.showBucketTab = true;
        break;
    }
  }
}
</script>
<style lang="scss" scoped>
.tab-label {
  cursor: pointer;
  text-transform: none;
  font-weight: bold;
}
</style>
