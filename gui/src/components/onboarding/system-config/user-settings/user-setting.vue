<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="title mt-0 font-weight-bold" id="lblUserSetting">
        User settings
      </div>
      <div class="mt-4">
        <div class="font-weight-regular black--text" id="lblUsrSettingMsg">
          You have already set up a user for managing this system. Use the
          following screens to add additional user to more finely control access
          to this system.
        </div>

        <div class="mt-5 font-weight-regular black--text">
          Choose the user options below that apply to your administration
          environment.
        </div>
        <v-divider class="mt-5" />
        <div class="mt-5">
          <input
            type="checkbox"
            v-model="isLocalUserStatus"
            :disabled="isUserSettingSkipStatus"
            name="local"
            id="chkUsrSettingLocal"
          />
          <span class="ml-3 font-weight-bold">Local</span>
          <div class="mt-5 font-weight-regular black--text">
            Selecting Local Users will allow you to create and manage any users
            that can access this system. You can control which users have access
            to make configuration changes to the system, control which users can
            access certain interfaces, and setup user attributes specific to
            individual users.
          </div>
        </div>
        <div class="mt-5">
          <input
            type="checkbox"
            v-model="isSkip"
            :disabled="isLocalUserStatus || isLdapUserStatus"
            name="skip"
            id="chkUsrSettingSkip"
          />
          <span class="ml-3 font-weight-bold">Skip this step</span>
          <div
            class="mt-5 font-weight-regular black--text"
            id="lblUsrSettingConfigSkip"
          >
            If you intend to configure later, you may skip to the next step.
          </div>
        </div>
      </div>
    </div>
    <span class="d-none">{{ isValidForm }}</span>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { EVENT_BUS } from "./../../../../main";

@Component({
  name: "eos-user-setting"
})
export default class EosUserSetting extends Vue {
  public data() {
    return {
      isSkip: false
    };
  }
  public mounted() {
    // WizardHook: Open a listener for onNext event
    // So when wizard footer clicks on the Next Button this component can perform its own workflow
    EVENT_BUS.$on("emitOnNext", (res: any) => {
      res(true);
    });
  }
  public destroyed() {
    // WizardHook: shut off on exit event listener
    EVENT_BUS.$off("emitOnNext");
  }
  get isValidForm() {
    // WizardHook: Emit event to sibling wizard footer component
    // to send information about data validation to enable/disable wizard footer
    EVENT_BUS.$emit(
      "validForm",
      this.isLocalUserStatus || this.isLdapUserStatus || this.$data.isSkip
    );
    return true;
  }
  private setUserSettings() {
    const queryParams = {};
    this.$store
      .dispatch("systemConfig/createUserConfig", queryParams)
      .then((res: any) => {
        // tslint:disable-next-line: no-console
        console.log("TCL: EosUserSetting -> setUserSettings -> res", res);
      })
      .catch(() => {
        // tslint:disable-next-line: no-console
        console.error("Save user settings Failed");
      });
  }
  public get isLocalUserStatus(): any {
    return this.$store.getters["systemConfig/isLocalUserStatus"];
  }
  public set isLocalUserStatus(status: any) {
    this.$store.commit("systemConfig/setUser", {
      type: "local",
      flag: status
    });
  }

  public get isLdapUserStatus(): any {
    return this.$store.getters["systemConfig/isLdapUserStatus"];
  }

  public set isLdapUserStatus(status: any) {
    this.$store.commit("systemConfig/setUser", {
      type: "ldap",
      flag: status
    });
  }

  public get isUserSettingSkipStatus(): any {
    return this.$store.getters["systemConfig/isUserSettingSkipStatus"];
  }

  public set isUserSettingSkipStatus(status: any) {
    this.$store.commit("systemConfig/setUser", {
      type: "skip",
      flag: status
    });
  }
}
</script>
<style lang="scss" scoped>
.input-text {
  border-style: solid;
  border-width: 1px;
  border-color: #e3e3e3;
  width: 20em;
  height: 2.5em;
}
.pointer {
  cursor: pointer;
}
</style>
