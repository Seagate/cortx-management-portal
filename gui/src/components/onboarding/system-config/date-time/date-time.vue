<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="title mt-0 font-weight-bold" id="lblDTSetDateTime">
        Set date and time
      </div>
      <div class="mt-4">
        <input
          type="radio"
          name="ntp"
          v-model="source"
          value="ntp"
          id="rbtnDTNtp"
        />
        <span class="ml-2 font-weight-bold black--text" id="lblNetworkTimeProto"
          >Network time protocol (NTP)</span
        >
      </div>
      <div class="mt-4" v-if="source === 'ntp'">
        <div class="font-weight-medium black--text" id="lblDTNetworkServeradd">
          NTP server address
        </div>
        <div>
          <input
            class="input-text"
            type="text"
            name="hostname"
            v-model="NtpServerAddress"
            id="txtDTHostname"
          />
        </div>
        <div class="mt-5 font-weight-medium black--text" id="lblDTNtpTimeZone">
          NTP time zone offset
        </div>
        <div>
          <select
            name="zone"
            id="cmdZone"
            class="input-text"
            v-model="NtpTimezone"
          >
            <option
              v-for="option in timezoneList"
              :key="option"
              :value="option"
              >{{ option }}</option
            >
          </select>
        </div>
      </div>
      <div class="mt-4" v-if="source === 'manual'">
        <div class="font-weight-medium black--text" id="lblDTDate">Date</div>
        <div>
          <input
            class="input-text"
            type="date"
            name="date"
            v-model="date"
            id="txtDTDate"
          />
        </div>
        <v-row>
          <v-col class="col-1">
            <div class="mt-5 font-weight-medium black--text" id="lblDTHour">
              Hour
            </div>
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
            <div class="mt-5 font-weight-medium black--text" id="lblDTMinute">
              Minute
            </div>
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
            <div class="mt-5 font-weight-medium black--text" id="lblDTClock">
              Clock
            </div>
            <div>
              <select
                name="clock"
                id="cmdClock"
                class="input-text"
                style="width: 7em;"
                v-model="clock"
              >
                <option value="24hrs">24 Hrs</option>
                <option value="12hrs">12 Hrs</option>
              </select>
            </div>
          </v-col>
        </v-row>
        <div class="mt-2">
          Daylight saving time adjustment is not supported.
        </div>
        <v-btn elevation="0" color="csmprimary" class="mt-5" id="btnDTSetNow">
          <span class="white--text" @click="setTimeZone()"
            >Set Current Date and Time</span
          >
        </v-btn>
      </div>
      <span class="d-none">{{ isValidForm }}</span>
    </div>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import {
  SystemConfigObject,
  DateTimeSettings,
  Ntp,
  DateTime
} from "./../../../../models/system-configuration";
import { EVENT_BUS } from "./../../../../main";
import * as moment from "moment-timezone";

@Component({
  name: "eos-date-time"
})
export default class EosDateTime extends Vue {
  private data() {
    return {
      timezoneList: [],
      source: "ntp",
      NtpServerAddress: "",
      NtpTimezone: moment.tz.guess(),
      minute: "",
      hours: "",
      date: "",
      clock: "",
      isValid: true
    };
  }
  public mounted() {
    this.managementNetworkGetter();
    // WizardHook: Open a listener for onNext event
    // So when wizard footer clicks on the Next Button this component can perform its own workflow
    EVENT_BUS.$on("emitOnNext", (res: any) => {
      this.setNTP().then((result: any) => {
        res(true);
      });
    });
    this.$data.timezoneList = moment.tz.names();
  }
  public destroyed() {
    // WizardHook: shut off on exit event listener
    EVENT_BUS.$off("emitOnNext");
  }
  get isValidForm() {
    const validate = true;
    // WizardHook: Emit event to sibling wizard footer component
    // to send information about data validation to enable/disable wizard footer
    EVENT_BUS.$emit("validForm", validate);
    return validate;
  }
  public managementNetworkGetter() {
    const dateTime = this.$store.getters["systemConfig/systemconfig"];
    if (dateTime.date_time_settings && dateTime.date_time_settings.ntp) {
      this.$data.NtpServerAddress =
        dateTime.date_time_settings.ntp.ntp_server_address;
      this.$data.NtpTimezone =
        dateTime.date_time_settings.ntp.ntp_timezone_offset;
    }
  }
  public setNTP() {
    const queryParams: DateTimeSettings = {
      is_ntp: true,
      ntp: {
        ntp_server_address: this.$data.NtpServerAddress,
        ntp_timezone_offset: this.$data.NtpTimezone
      },
      date_time: {
        date: this.$data.date,
        hour: this.$data.hours,
        minute: this.$data.minute,
        clock: this.$data.clock
      }
    };
    return this.$store.dispatch("systemConfig/updateNTPSetting", queryParams);
  }
  public setTimeZone() {
    const toDateInputValue = () => {
      const local = new Date();
      local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
      return local.toJSON().slice(0, 10);
    };

    const localDate = new Date();
    this.$data.hours = localDate.getHours();
    this.$data.minute = localDate.getMinutes();
    this.$data.date = toDateInputValue();
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
