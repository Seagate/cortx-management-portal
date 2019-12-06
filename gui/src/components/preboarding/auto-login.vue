<template>
  <span>Redirecting...</span>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { UserLoginQueryParam } from "./../../models/user-login";

@Component({
  name: "eos-auto-login"
})
export default class EosAutoLogin extends Vue {
  private data() {
    return {
      conststr: require("./../../common/const-string.json")
    };
  }
  private mounted() {
    // TODO: User Name and password are for Demo; UDX Redirection workflow
    const queryParams: UserLoginQueryParam = {
      username: "clouduser",
      password: "Seagate@1"
    };
    this.$store
      .dispatch("userLogin/loginAction", queryParams)
      .then((res: any) => {
        if (res.authorization) {
          const user: any = {
            username: queryParams.username
          };
          this.$store.commit("userLogin/setUser", user);
          localStorage.setItem(
            this.$data.conststr.access_token,
            res.authorization
          );
          this.$router.push("/dashboard");
        }
      })
      .catch(() => {
        // tslint:disable-next-line: no-console
        console.error("Login Action Failed");
      });
  }
}
</script>

<style lang="scss" scoped>
</style>
