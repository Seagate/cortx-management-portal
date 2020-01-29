<template>
  <v-container class="mt-6 body-2">
    <v-img
      id="alert-img"
      :src="require('./../../assets/onboarding-wizard.png')"
      width="780px"
      height="70px"
    ></v-img>
    <v-divider />
    <div>
      <div class="title mt-6 csmprimary--text">S3 configuration-summary</div>
    </div>
    <div class="mt-4">
      <div
        class="font-weight-regular black--text"
      >This is summary of initial configuration. You can create an additional S3 account and add additional IAM users of Buckets.</div>
      <v-divider class="mt-5" />
      <v-row v-for="item in Account" :key="item.name">
        <v-col class="pl-5 col-3">{{item.user}}</v-col>
        <v-col class="pl-5 col-9">{{item.accountname}}</v-col>
      </v-row>
    </div>
    <v-divider class="mt-8" />
    <div class="mt-3">
      <v-dialog v-model="dialog" width="700">
        <template v-slot:activator="{ on }">
          <v-btn elevation="0" color="csmprimary" @click="gotToNextPage()" v-on="on">
            <span class="white--text">Finish configuration</span>
          </v-btn>
        </template>
        <v-card height="500">
          <v-card-title class="headline grey lighten-2" primary-title></v-card-title>
          <div class="ml-10">
            <v-card-text>
              <div class="title mt-6 csmprimary--text">
                <v-icon class="csmprimary--text" size="20">mdi-check-circle-outline</v-icon>
                <span>Success-validation in progress</span>
              </div>
              <v-divider class="mt-3 mb-10" />
              <div class="font-weight-regular black--text mb-10">Message about What`s Happning</div>
              <v-btn tile large width="10em" levation="0" color="csmprimary">
                <span class="white--text">Ok</span>
              </v-btn>
            </v-card-text>
          </div>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "eos-bucketconfigsummary"
})
export default class EOSConfigurationSummary extends Vue {
  private data() {
    return {
      Account: [
        {
          user: "S3 ACCOUNT CREATED",
          accountname: "ACCOUNT NO159"
        },
        {
          user: "IMA USER CREATEDS",
          accountname: "USER NAME 237"
        },
        {
          user: "BUCKET CREATED",
          accountname: " BUCKET NAME 62"
        }
      ]
    };
  }
}
</script>

<style lang="scss" scoped>
table {
  font-size: 12px;
}
td {
  border: none;
  text-align: left;
  padding: 11px;
}
</style>
