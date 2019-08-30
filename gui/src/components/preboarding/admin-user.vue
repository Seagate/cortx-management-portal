<template>
  <v-container class="white" fluid>
    <v-row align="center"  justify="center">
      <v-col cols="12">
        <v-row align="center" justify="center">
          <v-card class="elevation-0" width="800" height="700" tile>
            <div class="ma-4 title">INITIAL CONFIGURATION</div>
            <v-divider class="mx-4" />
            <div class="ma-4 subtitle-1 green--text">Admin User Configuration:</div>
            <div class="ma-4">Configure the username and password for the admin user of this system.</div>
            <div class="ml-4">ADMIN USER NAME</div>
            <v-card class="elevation-0 mt-4" width="25em">
                <v-text-field
                  full-width="true"
                  height="1em"
                  class="mx-4"
                  color="green"
                  outlined
                  flat="true"
                ></v-text-field>
             </v-card>
            <div class="ml-4">PASSWORD</div>
            <v-card class="elevation-0 mt-4" width="25em">
                <v-text-field
                  height="20px"
                  type="password"
                  class="mx-4"
                  color="green"
                  outlined
                  flat="true"
                ></v-text-field>
            </v-card>
            <div class="ml-4">CONFIRM PASSWORD</div>
           <v-card class="elevation-0 mt-4" width="25em">
                <v-text-field class="mx-4" type="password" color="green" outlined flat="true"></v-text-field>
           </v-card>
            <v-btn class="mx-4" height="35" tile color="green" dark>Apply and Continue</v-btn>
          </v-card>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "eos-admin-user"
})
export default class EosAdminUser extends Vue {}
</script>

<style lang="scss" scoped>
</style>


