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
  <div>
    <v-container>
      <div class="cortx-modal-container">
        <div class="cortx-modal cortx-modal-onboarding">
          <div class="cortx-modal-header">
            <label>Success</label>
          </div>
          <div class="cortx-modal-body ">
            <div class="title title-container">
              <img
                class="mr-2 success-img"
                :src="require('@/assets/resolved-default.svg')"
              />
              <span class="finish-text"
                >{{ $t("onboarding.completed") }}</span
              >
            </div>
            <div class="mt-8 nav-btn">
              <button
               id="finish-onboarding-setting"
                type="button"
                class="cortx-btn-primary"
                @click="$router.push('/dashboard')"
              >
                {{ $t("onboarding.goToDashboard") }}
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
import i18n from "./../../i18n";

@Component({
  name: "cortx-onboarding-finish"
})
export default class CortxOnboardingFinish extends Vue {
  private logout() {
    // Invalidate session from Server, remove localStorage token and re-route to login page
    this.$store
      .dispatch("userLogin/logoutAction")
      .then((res: any) => {
        if (res === 200) {
          // tslint:disable-next-line: no-console
          console.log("Logout Success");
        }
      })
      .catch(() => {
        // tslint:disable-next-line: no-console
        console.error("Logout Action Failed");
      });
    localStorage.removeItem(this.$data.constString.access_token);
    this.$router.push("/login");
  }
  private data() {
    return {
      constString: require("./../../common/const-string.json")
    };
  }
}
</script>

<style lang="scss" scoped>
.cortx-modal-onboarding {
  width: 500px;
  min-height: 214px;
}
.nav-btn {
  text-align: right;
}
.finish-text {
  vertical-align: center;
  float: left;
}
.success-img {
  float: left;
}
.title-container{
  height: 30px
}
</style>
