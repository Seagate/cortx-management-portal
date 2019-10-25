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
      <div class="title mt-6">
        Set Date and Time
        <v-icon class="green--text" size="20">mdi-help-circle-outline</v-icon>
      </div>
    </div>
    <div class="mt-4">
      <input type="radio" name="ntp" v-model="source" value="ntp" />
      <span class="ml-2 font-weight-bold black--text">Network Time Protocol (NTP)</span>
      <input class="ml-6" type="radio" name="manual" value="manual" v-model="source" />
      <span class="ml-2 font-weight-bold black--text">Manual</span>
    </div>
    <div class="mt-4" v-if="source === 'ntp'">
      <div class="font-weight-medium black--text">Network server address</div>
      <div>
        <input class="input-text" type="text" name="hostname" v-model="hostname" />
      </div>

      <div class="mt-5 font-weight-medium black--text">NTP time zone offset</div>
      <div>
        <select name="zone" id="cmdZone" class="input-text">
          <option value="GMT">GMT-07:00 Mountain Time (US & Canada)</option>
        </select>
      </div>
    </div>
    <div class="mt-4" v-if="source === 'manual'">
      <div class="font-weight-medium black--text">Date</div>
      <div>
        <input class="input-text" type="date" name="date" v-model="date" />
      </div>
      <v-row>
        <v-col class="col-1">
          <div class="mt-5 font-weight-medium black--text">Hour</div>
          <div>
            <input class="input-text col-12" type="number" name="date" v-model="date" />
          </div>
        </v-col>
        <v-col class="col-1">
          <div class="mt-5 font-weight-medium black--text">Minute</div>
          <div>
            <input class="input-text col-12" type="number" name="date" v-model="date" />
          </div>
        </v-col>
        <v-col class="col-1">
          <div class="mt-5 font-weight-medium black--text">Clock</div>
          <div>
            <select name="clock" id="cmdClock" class="input-text" style="width: 7em;">
              <option value="24hrs">24 Hrs</option>
              <option value="12hrs">12 Hrs</option>
            </select>
          </div>
        </v-col>
      </v-row>
      <div class="mt-2">Daylight saving time adjustment is not supported.</div>
      <v-btn elevation="0" color="green" class="mt-5">
        <span class="white--text" @click="gotToNextPage()">Set Now</span>
      </v-btn>
    </div>
    <v-divider class="mt-8" />
    <div class="mt-3">
      <v-btn elevation="0" color="green">
        <span class="white--text" @click="gotToNextPage()">Apply and Continue</span>
      </v-btn>
      <span class="green--text ml-8 pointer" @click="gotToPrevPage()">Back to previous step</span>
    </div>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "eos-date-time"
})
export default class EosDateTime extends Vue {
  public gotToNextPage() {
    this.$router.push("usersetting");
  }
  public gotToPrevPage() {
    this.$router.push("dnsconfig");
  }
  private data() {
    return {
      source: "ntp"
    };
  }
}
</script>
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
