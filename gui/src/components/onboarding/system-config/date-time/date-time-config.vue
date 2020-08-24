/*
* CORTX-CSM: CORTX Management web and CLI interface.
* Copyright (c) 2020 Seagate Technology LLC and/or its Affiliates
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published
* by the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU Affero General Public License for more details.
* You should have received a copy of the GNU Affero General Public License
* along with this program. If not, see <https://www.gnu.org/licenses/>.
* For any questions about this software or licensing,
* please email opensource@seagate.com or cortx-questions@seagate.com.
*/
<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="mt-2" v-if="source === 'ntp'">
        <div class="row ma-0">
          <div class="col-2 body-2 column">
            <div class="mt-2 font-weight-bold">
              <div class="eos-form-group">
                <label id="lblDTNetworkServerAdd">NTP server address*: </label>
              </div>
              <div class="eos-form-group">
                <label id="lblNTPTimeZoneAdd">NTP time zone offset*:</label>
              </div>
            </div>
          </div>
          <div class="col-4 body-2 column mr-5">
            <div
              class="eos-form-group"
              :class="{
                'eos-form-group--error': $v.setDateTime.NtpServerAddress.$error
              }"
            >
              <input
                class="eos-form__input_text"
                type="text"
                name="hostname"
                v-model.trim="setDateTime.NtpServerAddress"
                id="txtDTHostname"
                @input="$v.setDateTime.NtpServerAddress.$touch"
                placeholder="time.seagate.com"
              />
              <div class="eos-form-group-label eos-form-group-error-msg">
                <label
                  v-if="
                    $v.setDateTime.NtpServerAddress.$dirty &&
                      !$v.setDateTime.NtpServerAddress.required
                  "
                  >NTP server is required.</label
                >
              </div>
            </div>
            <!---->
            <div class="eos-form-group">
              <eos-dropdown
                @update:selectedOption="handleDropdownSelect"
                :options="createOptionsForDropdown(timezoneList)"
                :title="NtpTimezone ? NtpTimezone : undefined"
              ></eos-dropdown>
            </div>
          </div>
        </div>
      </div>
      <span class="d-none">{{ isValidForm }}{{ managementNetworkGetter }}</span>
    </div>
    <button
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
import {
  SystemConfigObject,
  DateTimeSettings,
  Ntp
} from "./../../../../models/system-configuration";
import { EVENT_BUS } from "./../../../../main";
import * as moment from "moment-timezone";
import { Validations } from "vuelidate-property-decorators";
import { required, helpers } from "vuelidate/lib/validators";

@Component({
  name: "eos-date-time-config"
})
export default class EosDateTimeConfig extends Vue {
  @Validations()
  private validations = {
    setDateTime: {
      NtpServerAddress: { required }
    }
  };

  private data() {
    return {
      timezoneList: [],
      source: "ntp",
      setDateTime: {
        NtpServerAddress: ""
      },
      NtpTimezone: "",
      isValid: true
    };
  }
  private mounted() {
    // WizardHook: Open a listener for onNext event
    // So when wizard footer clicks on the Next Button this component can perform its own workflow
    EVENT_BUS.$on("emitOnNext", (res: any) => {
      this.setNTP().then((result: any) => {
        res(true);
      });
    });
    this.$data.NtpTimezone = `(GMT${moment
      .tz(moment.tz.guess())
      .format("Z")}) ${moment.tz.guess()}`;
    this.$data.timezoneList = moment.tz
      .names()
      .map(e => {
        return `(GMT${moment.tz(e).format("Z")}) ${e}`;
      })
      .sort();
  }
  private destroyed() {
    // WizardHook: shut off on exit event listener
    EVENT_BUS.$off("emitOnNext");
  }
  get isValidForm() {
    const validate = true;
    // WizardHook: Emit event to sibling wizard footer component
    // to send information about data validation to enable/disable wizard footer
    EVENT_BUS.$emit("validForm", !this.$v.$invalid);
    return validate;
  }
  get managementNetworkGetter() {
    const dateTime = this.$store.getters["systemConfig/systemconfig"];
    if (
      dateTime &&
      dateTime.date_time_settings &&
      dateTime.date_time_settings.ntp
    ) {
      this.$data.setDateTime.NtpServerAddress =
        dateTime.date_time_settings.ntp.ntp_server_address;
      this.$data.NtpTimezone =
        dateTime.date_time_settings.ntp.ntp_timezone_offset;
    }
    return true;
  }
  private setNTP() {
    const queryParams: DateTimeSettings = {
      is_ntp: true,
      ntp: {
        ntp_server_address: this.$data.setDateTime.NtpServerAddress,
        ntp_timezone_offset: this.$data.NtpTimezone
      }
    };
    return this.$store.dispatch("systemConfig/updateNTPSetting", queryParams);
  }
  private applySettings() {
    const queryParams: DateTimeSettings = {
      is_ntp: true,
      ntp: {
        ntp_server_address: this.$data.setDateTime.NtpServerAddress,
        ntp_timezone_offset: this.$data.NtpTimezone
      }
    };
    this.$emit("apply-settings", queryParams);
  }
  private createOptionsForDropdown(list: string[]) {
    return list.map((e: string) => {
      return { label: e, value: e };
    });
  }
  private handleDropdownSelect(selected: any) {
    this.$data.NtpTimezone = selected.value;
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
