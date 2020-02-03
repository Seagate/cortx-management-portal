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
      <div class="title mt-6" id="lblLDAPSetting">User Settings: LDAP</div>
    </div>
    <v-card class="col-10 pb-5 mt-10 elevation-0 pa-0" outlined tile>
      <div class="title ma-3" id="lblLDAPConfig">LDAP Configuration</div>
      <v-divider class="pa-0" />
      <div class="mt-3">
        <v-row class="col-12 py-0">
          <v-col class="py-0">
            <div class="font-weight-medium" id="lblLDAPUserSearch">
              User Search Base
            </div>
            <input
              class="input-text"
              type="text"
              name="usersearchbase"
              v-model="usersearchbase"
              id="txtLDAPUserBase"
            />
          </v-col>
        </v-row>
        <v-row class="col-7 pb-0">
          <v-col class="py-0">
            <div class="font-weight-medium">Server</div>
            <input
              class="input-text"
              type="text"
              name="server"
              v-model="server"
              id="txtLDAPServer"
            />
          </v-col>
          <v-col class="pa-0">
            <div class="font-weight-medium">Port</div>
            <input
              class="input-text"
              type="number"
              name="port"
              v-model="port"
              style="width:5em;"
              id="txtLDAPPort"
              min="0001"
              max="65535"
            />
          </v-col>
        </v-row>
        <v-row class="col-7 pb-0">
          <v-col class="py-0">
            <div class="font-weight-medium">Alt Server</div>
            <input
              class="input-text"
              type="text"
              name="altserver"
              v-model="altserver"
              id="txtLDAPaltServer"
            />
          </v-col>
          <v-col class="pa-0">
            <div class="font-weight-medium">Alt Port</div>
            <input
              class="input-text"
              type="number"
              name="altport"
              v-model="altport"
              style="width:5em;"
              id="txtLDAPaltPort"
              min="0001"
              max="65535"
            />
          </v-col>
        </v-row>
      </div>
    </v-card>

    <div class="mt-8">
      <p v-if="!isValid" class="red--text error-message">
        Please enter valid values.
      </p>
      <v-btn
        elevation="0"
        color="csmprimary"
        @click="gotToNextPage()"
        id="btnLDAPApplyContinueInterface"
      >
        <span class="white--text">Apply and Continue</span>
      </v-btn>
      <span
        class="csmprimary--text ml-8 pointer"
        @click="gotToPrevPage()"
        id="lblLDAPBackInerface"
        >Back to previous step</span
      >
    </div>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Ldap } from "./../../../../models/system-configuration";

@Component({
  name: "eos-user-setting-ldap"
})
export default class EosUserSettingLdap extends Vue {
  private data() {
    return {
      usersearchbase: "",
      server: "",
      port: 80,
      altserver: "",
      altport: 80,
      isValid: true
    };
  }
  private mounted() {
    const ldapConfiguration = this.$store.getters[
      "systemConfig/userConfigData"
    ];
    if (ldapConfiguration && ldapConfiguration.ldap) {
      this.$data.usersearchbase = ldapConfiguration.ldap.user_search_base;
      this.$data.server = ldapConfiguration.ldap.server;
      this.$data.port = ldapConfiguration.ldap.port;
      this.$data.altserver = ldapConfiguration.ldap.alt_server;
      this.$data.altport = ldapConfiguration.ldap.alt_port;
    }
  }
  private gotToNextPage() {
    this.setLDAP()
      .then((res: any) => {
        if (res) {
          this.$router.push("notifications");
        } else {
          this.$data.isValid = false;
        }
      })
      .catch(() => {
        // tslint:disable-next-line: no-console
        console.error("error");
      });
  }
  private gotToPrevPage() {
    if (this.$store.getters["systemConfig/isLocalUserStatus"] === true) {
      this.$router.push("usersettinglocal");
    } else {
      this.$router.push("usersetting");
    }
  }

  private setLDAP() {
    const queryParams: Ldap = {
      user_search_base: this.$data.usersearchbase,
      server: this.$data.server,
      port: this.$data.port,
      alt_server: this.$data.altserver,
      alt_port: this.$data.altport
    };
    return this.$store.dispatch(
      "systemConfig/updateLdapUserConfig",
      queryParams
    );
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

.actbtn {
  position: absolute;
  float: left;
}
#clear {
  font-size: 14px;
  color: var(--v-csmprimary-base);
  float: right;
}
#title {
  color: black;
}
.active {
  display: inline-block;
  color: var(--v-csmprimary-base) !important;
}
.notActive {
  opacity: 0;
}
.headerText {
  color: black;
}
.backoverview {
  position: relative;
  top: 1em;
  cursor: pointer;
}
.backoverviewimg {
  position: relative;
  display: inline-block;
}
.backoverviewtxt {
  position: relative;
  top: -0.3em;
}
.tableheader:hover {
  .notActive {
    opacity: 1;
  }
}
.largeAlert {
  border: 2px solid #e3e3e3;
}
tbody tr {
  background-color: #ffffff !important ;
}
tbody tr:hover {
  border-top: 2px solid darkgray !important;
  border-bottom: 2px solid darkgray !important;
}
tbody tr:active {
  border-top: 2px solid darkgray !important;
  border-bottom: 2px solid darkgray !important;
}
</style>
