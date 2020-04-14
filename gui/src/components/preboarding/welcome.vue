 <template>
  <v-container class="pa-0 ma-0 col-12 black">
    <div height="70em" class="pl-10 py-5">
      <img src="../../assets/logo.png" />
    </div>
    <v-divider class="mx-0 grey darken-3"></v-divider>
    <v-container class="black px-10 pt-5" fluid>
      <div
        class="ml-4 white--text my-10"
        style="font-size: 26px;"
      >Welcome to the Storage Management Console.</div>
      <div class="ml-4 white--text">To set up your system, you must enter the License key.</div>
      <div class="ml-4 mt-1 mb-8 white--text">
       Click Get started to agree
        <span class="csmprimary--text">EULA.</span>
      </div>
      <v-row class="eos-form-group">
        <v-col>
          <label class="white--text" for="label">License Key</label>
        </v-col>
        <v-col>
          <input
            class="eos-form__input_text"
            type="text"
            maxlength="4"
            v-on:keyup="moveOnNext"
            v-model="key1"
          />
        </v-col>
        <v-col>
          <input
            class="eos-form__input_text"
            type="text"
            ref="key2"
            maxlength="4"
            v-on:keyup="moveOnNext"
            v-model="key2"
          />
        </v-col>
        <v-col>
          <input
            class="eos-form__input_text"
            type="text"
            ref="key3"
            maxlength="4"
            v-on:keyup="moveOnNext"
            v-model="key3"
          />
        </v-col>
        <v-col>
          <input
            class="eos-form__input_text"
            type="text"
            maxlength="4"
            ref="key4"
            v-on:keyup="moveOnNext"
            v-model="key4"
          />
        </v-col>
      </v-row>
      <button
        type="button"
        class="eos-btn-primary-dark ml-4"
        @click="addLicense"
        :disabled="!getStarted"
      >
        <span>Get started</span>
      </button>
      <LicenseAgreement @accepted="licenseAcceptedOrClosed" v-if="showLicenseAgreement"></LicenseAgreement>
    </v-container>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import LicenseAgreement from "./license-agreement.vue";

@Component({
  name: "eos-welcome",
  components: { LicenseAgreement }
})
export default class EosWelcome extends Vue {
  private data() {
    return {
      key1: "",
      key2: "",
      key3: "",
      key4: "",
      showLicenseAgreement: false,
      getStarted: false
    };
  }
  private moveOnNext() {
    if (this.$data.key1.length >= 4) {
      const inputRef: any = this.$refs.key2;
      inputRef.focus();
    }
    if (this.$data.key2.length >= 4) {
      const inputRef: any = this.$refs.key3;
      inputRef.focus();
    }
    if (this.$data.key3.length >= 4) {
      const inputRef: any = this.$refs.key4;
      inputRef.focus();
    }
    if (
      this.$data.key4.length >= 4 &&
      this.$data.key3.length >= 4 &&
      this.$data.key2.length >= 4 &&
      this.$data.key1.length >= 4
    ) {
      this.$data.getStarted = true;
    } else {
      this.$data.getStarted = false;
    }
  }
  private licenseAcceptedOrClosed(status: boolean) {
    if (status) {
      this.gotToNextPage();
    } else {
      this.$data.showLicenseAgreement = false;
    }
  }
  private gotToNextPage() {
    this.$router.push("adminuser");
  }
  private addLicense() {
    const licensekey = {
      csm_onboarding_license_key: this.$data.key1.concat(
        this.$data.key2,
        this.$data.key3,
        this.$data.key4
      )
    };
    try {
      this.$store
        .dispatch("userLogin/addLicenseKey", licensekey)
        .then((res: any) => {
          this.$data.showLicenseAgreement = true;
        });
    } catch (e) {
      // tslint:disable-next-line: no-console
      return e;
    }
  }
}
</script>
<style lang="scss" scoped>
.eos-form-group {
  width: 500px;
  min-height: 88px;
}
</style>