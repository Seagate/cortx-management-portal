<template>
  <div>
    <v-container>
      <div class="eos-modal-container">
        <div class="eos-modal eos-modal-onboarding">
          <div class="eos-modal-header">
            <label>Success</label>
          </div>
          <div class="eos-modal-body">
            <div class="title">
              <img
                class="mr-2"
                :src="require('@/assets/status/healthy-icon.png')"
              />
              <span>Onboarding has been successfully completed.</span>
            </div>
            <div class="mt-8 nav-btn">
              <button
                type="button"
                class="eos-btn-primary"
                @click="$router.push('/dashboard')"
              >
                Go to dashboard
              </button>
              <button
                type="button"
                class="ml-6 eos-btn-secondary"
                @click="logout()"
              >
                Logout
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

@Component({
  name: "eos-onboarding-finish"
})
export default class EosOnboardingFinish extends Vue {
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
.eos-modal-onboarding {
  width: 550px;
  min-height: 214px;
}
.nav-btn {
  text-align: right;
}
</style>
