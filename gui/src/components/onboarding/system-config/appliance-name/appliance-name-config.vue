<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="row ma-0">
        <div class="col-2 body-2 column">
          <div class="mt-2 font-weight-bold">
            <div class="cortx-form-group">
              <label id="lblDAddAppliance">{{ $t("onBoarding.systemName") }}*:</label>
            </div>
          </div>
        </div>
        <div class="col-4 body-2 column mr-5">
          <div
            class="cortx-form-group"
            :class="{
              'cortx-form-group--error': $v.appliance.$error
            }"
          >
            <input
              class="cortx-form__input_text"
              type="text"
              name="appliancename"
              v-model.trim="appliance"
              id="txtappliancename"
              @input="$v.appliance.$touch"
              :placeholder="$t('onBoarding.systemName')"
            />
            <div class="cortx-form-group-label cortx-form-group-error-msg">
              <label v-if="$v.appliance.$dirty && !$v.appliance.required"
                >{{ $t("onBoarding.systemNameIsReq") }}</label
              >
              <label
                v-else-if="
                  $v.appliance.$dirty && !$v.appliance.applianceNameRegex
                "
                >{{ $t("onBoarding.enterValidSystemName") }}</label
              >
              <label v-else-if="$v.appliance.$dirty && !$v.appliance.minLength"
                >{{ $t("onBoarding.minimumTwoChartSystemName") }}</label
              >
              <label v-else-if="$v.appliance.$dirty && !$v.appliance.maxLength"
              >{{ $t("onBoarding.maxChartSystemName") }}</label>
            </div>
          </div>
        </div>
      </div>
      <span class="d-none">{{ isValidForm }}{{ managementNetworkGetter }}</span>
    </div>
    <button
     id="appliance-appybtn"
      type="button"
      v-if="$route.path !== '/onboarding'"
      :disabled="$v.$invalid"
      @click="applySettings()"
      class="cortx-btn-primary cortx-float-l my-10"
    >
      {{ $t("common.apply") }}
    </button>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { SystemConfigObject } from "./../../../../models/system-configuration";
import { EVENT_BUS } from "./../../../../main";
import { Validations } from "vuelidate-property-decorators";
import {
  required,
  helpers,
  minLength,
  maxLength
} from "vuelidate/lib/validators";
import { applianceNameRegex } from "./../../../../common/regex-helpers";
import i18n from "../../onboarding.json";

@Component({
  name: "cortx-appliance-name-config",
  i18n: {
    messages: i18n
  }
})
export default class CortxApplianceNameConfig extends Vue {
  @Validations()
  private validations = {
    appliance: {
      required,
      applianceNameRegex,
      minLength: minLength(2),
      maxLength: maxLength(250)
    }
  };
  private data() {
    return {
      appliance: ""
    };
  }
  private mounted() {
    // WizardHook: Open a listener for onNext event
    // So when wizard footer clicks on the Next Button this component can perform its own workflow
    EVENT_BUS.$on("emitOnNext", (res: any) => {
      this.createManagementNetworkObj().then((result: any) => {
        this.setApplianceName();
        res(true);
      });
    });
  }
  private destroyed() {
    // WizardHook: shut off on exit event listener
    EVENT_BUS.$off("emitOnNext");
  }
  get isValidForm() {
    // WizardHook: Emit event to sibling wizard footer component
    // to send information about data validation to enable/disable wizard footer
    EVENT_BUS.$emit("validForm", !this.$v.$invalid);
    return true;
  }
  get managementNetworkGetter() {
    const systemConfigDetails = this.$store.getters[
      "systemConfig/systemconfig"
    ];
    if (systemConfigDetails.appliance_name) {
      this.$data.appliance = systemConfigDetails.appliance_name;
    }
    return true;
  }
  private setApplianceName() {
    return this.$store.dispatch(
      "systemConfig/updateApplianceConfig",
      this.$data.appliance
    );
  }
  private applySettings() {
    this.$emit("apply-settings", this.$data.appliance);
  }
  private createManagementNetworkObj() {
    return this.$store.dispatch("systemConfig/createManagementNetworkObj");
  }
}

</script>
<style lang="scss" scoped></style>
