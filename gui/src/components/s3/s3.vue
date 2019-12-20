<template>
  <div class="pr-4">
    <div id="s3-configuration-title-container" class="mb-4 s3-configuration-page-title">
      <label id="s3-account-form-title" class="headline font-weight-bold">S3 configuration</label>
      <div class="mt-1" style="color: #454545;font-size: 14px;">
        <label>Use this table to create IAM users that have access to the buckets you create in the next step. You can add as many as you like. The access key and secret key for each user will be shown once you click continue. You will have the oppurtunity to download a CSV at that point.</label>
      </div>
    </div>
    <v-tabs color="csmprimary" class="mb-2" style="border-bottom: 1px solid lightgrey;">
      <v-tab @click="switchTab('account')">
        <label class="tab-label">Account</label>
      </v-tab>
      <v-tab @click="switchTab('iamuser')">
        <label class="tab-label">IAM user</label>
      </v-tab>
      <v-tab @click="switchTab('bucket')">
        <label class="tab-label">Bucket</label>
      </v-tab>
    </v-tabs>
    <S3Account v-if="showAccountTab" />
    <IAMUser v-if="showIAMUserTab" />
    <S3Bucket v-if="showBucketTab" />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import S3Account from "./account-management.vue";
import IAMUser from "./iam-user-management.vue";
import S3Bucket from "./bucket-creation.vue";

@Component({
  name: "eos-s3-management",
  components: { S3Account, IAMUser, S3Bucket }
})
export default class EosS3Management extends Vue {
  private showAccountTab: boolean = true;
  private showIAMUserTab: boolean = false;
  private showBucketTab: boolean = false;

  public switchTab(tab: string) {
    switch (tab) {
      case "account":
        this.showAccountTab = true;
        this.showIAMUserTab = false;
        this.showBucketTab = false;
        break;
      case "iamuser":
        this.showAccountTab = false;
        this.showIAMUserTab = true;
        this.showBucketTab = false;
        break;
      case "bucket":
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
