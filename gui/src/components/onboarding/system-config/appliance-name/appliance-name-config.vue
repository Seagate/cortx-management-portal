<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="row ma-0">
        <div class="col-2 body-2 column">
          <div class="mt-2 font-weight-bold">
            <div class="eos-form-group">
              <label id="lblDAddAppliance">Appliance name*:</label>
            </div>
          </div>
        </div>
        <div class="col-4 body-2 column mr-5">
          <div
            class="eos-form-group"
            :class="{
              'eos-form-group--error': $v.appliance.$error
            }"
          >
            <input
              class="eos-form__input_text"
              type="text"
              name="appliancename"
              v-model.trim="appliance"
              id="txtappliancename"
              @input="$v.appliance.$touch"
              placeholder="Appliance name"
            />
            <div class="eos-form-group-label eos-form-group-error-msg">
              <label v-if="$v.appliance.$dirty && !$v.appliance.required"
                >Appliance name is required.</label
              >
              <label
                v-else-if="
                  $v.appliance.$dirty && !$v.appliance.applianceNameRegex
                "
                >Enter valid appliance name.</label
              >
              <label v-else-if="$v.appliance.$dirty && !$v.appliance.minLength"
                >Minimum 4 characters are required.</label
              >
              <label v-else-if="$v.appliance.$dirty && !$v.appliance.maxLength"
                >max 255 characters allow.</label
              >
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
      class="eos-btn-primary eos-float-l my-10"
    >
      Apply
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

@Component({
  name: "eos-appliance-name-config"
})
export default class EosApplianceNameConfig extends Vue {
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
