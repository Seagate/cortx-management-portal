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
      <div class="title mt-6" id="lblDTSetDateTime">Set Date and Time</div>
    </div>
    <div class="mt-4">
      <input type="radio" name="ntp" v-model="source" value="ntp" id="rbtnDTNtp" />
      <span class="ml-2 font-weight-bold black--text" id="lblNetworkTimeProto">Network Time Protocol (NTP)</span>
      <input class="ml-6" type="radio" name="manual" value="manual" v-model="source" id="rbtnDTManual" />
      <span class="ml-2 font-weight-bold black--text" id="lblDTManual">Manual</span>
    </div>
    <div class="mt-4" v-if="source === 'ntp'">
      <div class="font-weight-medium black--text" id="lblDTNetworkServeradd">Network server address</div>
      <div>
        <input class="input-text" type="text" name="hostname" v-model="networkserveraddress" id="txtDTHostname" />
      </div>

      <div class="mt-5 font-weight-medium black--text" id="lblDTNtpTimeZone">NTP time zone offset</div>
      <div>
        <select name="zone" id="cmdZone" class="input-text" v-model="Ntptimezone">
          <option value="GMT">GMT-07:00 Mountain Time (US & Canada)</option>
        </select>
      </div>
    </div>
    <div class="mt-4" v-if="source === 'manual'">
      <div class="font-weight-medium black--text" id="lblDTDate">Date</div>
      <div>
        <input class="input-text" type="date" name="date" v-model="date" id="txtDTDate" />
      </div>
      <v-row>
        <v-col class="col-1">
          <div class="mt-5 font-weight-medium black--text" id="lblDTHour">Hour</div>
          <div>
            <input
              class="input-text col-12"
              type="number"
              name="hours"
              v-model="hours"
              id="txtDTNumber"
              style="width: 7em;"
            />
          </div>
        </v-col>
        <v-col class="col-1">
          <div class="mt-5 font-weight-medium black--text" id="lblDTMinute">Minute</div>
          <div>
            <input
              class="input-text col-12"
              type="number"
              name="minute"
              v-model="minute"
              id="txtDTDate"
              style="width: 7em;"
            />
          </div>
        </v-col>
        <v-col class="col-1">
          <div class="mt-5 font-weight-medium black--text" id="lblDTClock">Clock</div>
          <div>
            <select name="clock" id="cmdClock" class="input-text" style="width: 7em;" v-model="clock">
              <option value="24hrs">24 Hrs</option>
              <option value="12hrs">12 Hrs</option>
            </select>
          </div>
        </v-col>
      </v-row>
      <div class="mt-2">Daylight saving time adjustment is not supported.</div>
      <v-btn elevation="0" color="csmprimary" class="mt-5" id="btnDTSetNow">
        <span class="white--text" @click="setTimeZone()">Set Current Date and Time</span>
      </v-btn>
    </div>
    <v-divider class="mt-8" />
    <div class="mt-3">
      <v-btn elevation="0" color="csmprimary" @click="gotToNextPage()" id="btnDTApplyContinue">
        <span class="white--text">Apply and Continue</span>
      </v-btn>
      <span class="csmprimary--text ml-8 pointer" @click="gotToPrevPage()" id="lblDTBack">Back to previous step</span>
    </div>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { SystemConfigObject, DateTimeSettings, Ntp, DateTime } from "./../../../../models/system-configuration";
@Component({
  name: "eos-date-time"
})
export default class EosDateTime extends Vue {
  public gotToNextPage() {
    this.setNetworkTimeProtoCall();
    this.$router.push("usersetting");
  }
  public mounted() {
    this.managementNetworkGetter();
  }
  public managementNetworkGetter() {
    const dateTime = this.$store.getters["systemConfig/systemconfig"];
    if (dateTime.date_time_settings && dateTime.date_time_settings.ntp) {
      this.$data.networkserveraddress = dateTime.date_time_settings.ntp.ntp_server_address;
      this.$data.Ntptimezone = dateTime.date_time_settings.ntp.ntp_timezone_offset;
    }
  }
  setNetworkTimeProtoCall() {
    const queryParams: DateTimeSettings = {
      is_ntp: true,
      ntp: {
        ntp_server_address: this.$data.networkserveraddress,
        ntp_timezone_offset: this.$data.Ntptimezone
      },
      date_time: {
        date: this.$data.date,
        hour: this.$data.hours,
        minute: this.$data.minute,
        clock: this.$data.clock
      }
    };
    console.log("TCL: EosDateTime -> setNetworkTimeProtoCall -> queryParams", queryParams);
    this.$store.dispatch("systemConfig/updateNTPSetting", queryParams);
  }
  public gotToPrevPage() {
    this.$router.push("dnsconfig");
  }
  setTimeZone() {
    const toDateInputValue = function() {
      var local = new Date();
      local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
      return local.toJSON().slice(0, 10);
    };

    const localDate = new Date();
    this.$data.hours = localDate.getHours();
    this.$data.minute = localDate.getMinutes();
    this.$data.date = toDateInputValue();
  }
  private data() {
    return {
      source: "ntp",
      networkserveraddress: "",
      Ntptimezone: "",
      minute: "",
      hours: "",
      date: "",
      clock: ""
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
