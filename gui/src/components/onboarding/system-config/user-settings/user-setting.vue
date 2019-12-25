<template>
  <v-container class="mt-6 body-2">
    <v-img
      id="alert-img"
      :src="require('./../../../../assets/onboarding-wizard.png')"
      width="780px"
      height="70px"
    ></v-img>
    <v-divider />
    <div>
      <div class="title mt-6" id="lblUserSetting">User Settings</div>
    </div>
    <div class="mt-4">
      <div class="font-weight-regular black--text" id="lblUsrSetingMsg">
        You have already set up a user for managing this system. Use the following screens to add additional user to
        more finely control accress to this system. You can set up LDAP user groups in the following screens. You have
        the option to skip this step if you intend to configure LDAP later using the User settings in the Settings menu.
      </div>

      <div class="mt-5 font-weight-regular black--text">
        Choose the user options below that apply to your administration environment.
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
        <span class="ml-3 font-weight-medium">Local</span>
        <div class="mt-5 font-weight-regular black--text">
          Selecting Local Users will allow you to create and manage any users that can access this system. You can
          control which users have access to make configuration changes to the system, control which users can access
          certain interfaces, and setup user attributes specific to individual users.
        </div>
      </div>
      <div class="mt-5">
        <input
          type="checkbox"
          v-model="isLdapUserStatus"
          name="ldap"
          :disabled="isUserSettingSkipStatus"
          id="chkUsrSettingLdap"
        />
        <span class="ml-3 font-weight-medium">LDAP</span>
        <div class="mt-5 font-weight-regular black--text">
          Selecting LDAP Users will allow you to integrate this system into a network utilizing LDAP (Lightweight
          Directory Access Protocol). This configuration screen will allow you to access an LDAP server in your network
          and configure groups of users that can be authenticated through your LDAP environment.
        </div>
      </div>
      <div class="mt-5">
        <input
          type="checkbox"
          v-model="isUserSettingSkipStatus"
          :disabled="isLocalUserStatus || isLdapUserStatus"
          name="skip"
          id="chkUsrSettingSKip"
        />
        <span class="ml-3 font-weight-medium">Skip this step</span>
        <div class="mt-5 font-weight-regular black--text" id="lblUsrSettingCongiLDAP">
          If you intend to configure LDAP later, you may skip to the next step.
        </div>
      </div>
    </div>
    <v-divider class="mt-8" />
    <div class="mt-3">
      <v-btn
        elevation="0"
        color="csmprimary"
        id="btnUsrSettingContinue"
        :disabled="!isLocalUserStatus && !isLdapUserStatus && !isUserSettingSkipStatus"
      >
        <span class="white--text" @click="gotToNextPage()">Continue</span>
      </v-btn>
      <span class="csmprimary--text ml-8 pointer" @click="gotToPrevPage()" id="lblUsrSettingBack"
        >Back to previous step</span
      >
    </div>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "eos-user-setting"
})
export default class EosUserSetting extends Vue {
  public mounted() {
    this.$store
      .dispatch("systemConfig/getDataAction")
      .then((res: any) => {
        console.log("TCL: EosUserSetting -> mounted -> res", res);
      })
      .catch(() => {
        // tslint:disable-next-line: no-console
        console.error("Save LDAP settings Failed");
      });
  }
  public gotToNextPage() {
    //this.setUserSettings();
    if (this.isLocalUserStatus === true) {
      this.$router.push("usersettinglocal");
    } else if (this.isLdapUserStatus === true) {
      this.$router.push("usersettingldap");
    } else if (
      this.isLocalUserStatus === false &&
      this.isLdapUserStatus === false
    ) {
      this.$router.push("notifications");
    }
  }
  private setUserSettings() {
    const queryParams = { };
    this.$store
      .dispatch("systemConfig/createUserConfig", queryParams)
      .then((res: any) => {
        console.log("TCL: EosUserSetting -> setUserSettings -> res", res);                
      })
      .catch(() => {
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

  public gotToPrevPage() {
    this.$router.push("datetime");
  }
  private data() {
    return {
      source: "ntp"
    };
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
