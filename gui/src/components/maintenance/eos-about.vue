<template>
  <div class="eos-p-2">
    <div class="eos-text-lg eos-text-bold" id="lblAbout">About us</div>
    <div style="display: inline-block;">
      <img
        class="eos-brand-logo mt-2"
        :src="require('@/assets/seagate-green.svg/')"
      />
      <img :src="require('@/assets/lyve-drive-green.svg/')" class="ml-2 mb-2" />
    </div>
    <v-divider class="mt-2 mb-5" />
    <v-container>
      <div class="body-2"></div>
      <div class="mt-3 pa-3 eos-last-upgrade-info-container eos-text-md">
        <table>
          <tr>
            <td style="width: 100px;">
              <label class="eos-text-bold">Name:</label>
            </td>
            <td style="padding-top: 2px;">
              <label>{{ versionDetails.NAME }}</label>
            </td>
          </tr>
          <tr>
            <td>
              <label class="eos-text-bold">Version:</label>
            </td>
            <td style="padding-top: 2px;">
              <label>{{ versionDetails.VERSION }}</label>
            </td>
          </tr>
          <tr>
            <td>
              <label class="eos-text-bold">Build:</label>
            </td>
            <td style="padding-top: 2px;">
              <label>{{ versionDetails.BUILD }}</label>
            </td>
          </tr>
          <tr>
            <td>
              <label class="eos-text-bold">Release:</label>
            </td>
            <td style="padding-top: 2px;">
              <label>{{ versionDetails.RELEASE }}</label>
            </td>
          </tr>
        </table>
      </div>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";

@Component({
  name: "eos-about",
})
export default class Eosaboutpage extends Vue {
  public versionDetails: any = null;

  public async mounted() {
    await this.getVersion();
  }

  public async getVersion() {
    const res = await Api.getAll(apiRegister.version);
    this.versionDetails = res.data;
  }
}
</script>
<style lang="scss" scoped></style>
