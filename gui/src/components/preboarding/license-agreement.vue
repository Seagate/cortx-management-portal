<template>
  <div>
    <v-container>
      <div class="eos-modal-container">
        <div class="eos-modal eos-modal-onboarding">
          <div class="eos-modal-header">
            <label> {{ agreementText.title }}</label>
            <img
              class="eos-modal-close"
              :src="require('@/assets/close-green.svg')"
              @click="cancelAgreement"
            />
          </div>
          <div class="eos-modal-body ">
            <div class="title-container">
              {{ agreementText.description }}
            </div>
            <div class="mt-8  nav-btn">
              <button
                type="button"
                class="eos-btn-primary mr-2"
                @click="acceptAgreement"
              >
                Accept
              </button>

              <button
                type="button"
                class="eos-btn-tertiary"
                @click="cancelAgreement"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </v-container>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { agreementText } from "./../../common/license-agreement-text";
@Component({
  name: "eos-onboarding-finish"
})
export default class EosOnboardingFinish extends Vue {
  private data() {
    return { agreementText };
  }
  private acceptAgreement() {
    this.$emit("accepted", true);
  }
  private cancelAgreement() {
    this.$emit("accepted", false);
  }
}
</script>

<style lang="scss" scoped>
.eos-modal-onboarding {
  width: 700px;
  min-height: 214px;
  height: 470px;
  position: fixed;
}
.nav-btn {
  text-align: right;
}
.finish-text {
  vertical-align: center;
  float: left;
}
.success-img {
  margin-top: 3px;
  float: left;
}
.title-container {
  height: 300px;
  overflow: auto;
}
</style>
