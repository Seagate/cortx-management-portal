/*****************************************************************************
 Filename:          eos-settings.vue
 Description:       Settings container component.

 Creation Date:     31/12/2019
 Author:            Jayshree .A. More

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <v-container>
    <div class="pl-4 body-2">
      <v-card class="col-10 pb-5 mt-10 elevation-0" outlined tile>
        <v-row class="resource-container pt-10">
          <v-col>
            <label
              class="eos-form-group-label ml-10 mt-5"
              for="Resource"
              style=" font-size: 1em;"
            >Stop Resource</label>
          </v-col>
          <v-col>
            <div>
              <select
                name="resource"
                id="resource"
                class="eos-form__input_text"
                v-model="stopresource"
              >
                <option>Node0</option>
                <option>Node1</option>
                <option>Cluster</option>
              </select>
            </div>
          </v-col>
          <v-col>
            <v-btn elevation="0" color="csmprimary" id="btnDTSetNow">
              <span class="white--text" @click="stopresource()">Apply</span>
            </v-btn>
          </v-col>
        </v-row>
        <v-row class="resource-container mt-5">
          <v-col>
            <label
              class="eos-form-group-label ml-10 mt-5"
              for="Resource"
              style=" font-size: 1em;"
            >Start Resource</label>
          </v-col>
          <v-col>
            <div>
              <select
                name="resource"
                id="resource"
                class="eos-form__input_text"
                v-model="startresource"
              >
                <option>Node0</option>
                <option>Node1</option>
                <option>Cluster</option>
              </select>
            </div>
          </v-col>
          <v-col>
            <v-btn elevation="0" color="csmprimary" id="btnDTSetNow">
              <span class="white--text" @click="startResource()">Apply</span>
            </v-btn>
          </v-col>
        </v-row>
        <v-row class="resource-container mt-5">
          <v-col>
            <label
              class="eos-form-group-label ml-10 mt-5"
              for="Resource"
              style=" font-size: 1em;"
            >Shutdown Resource</label>
          </v-col>
          <v-col>
            <div>
              <select
                name="resource"
                id="resource"
                class="eos-form__input_text"
                v-model="shutdownresource"
              >
                <option>Node0</option>
                <option>Node1</option>
                <option>Cluster</option>
              </select>
            </div>
          </v-col>
          <v-col>
            <v-btn elevation="0" color="csmprimary" id="btnDTSetNow">
              <span class="white--text" @click="Clusterresource()">Apply</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </div>
  </v-container>
</template>
 <script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
@Component({
  name: "eos-resource"
})
export default class EosMaintenance extends Vue {
  data() {
    return {
      stopresource: "",
      startresource: "",
      shutdownresource: ""
    };
  }
  private mounted() {}
  private SwitchResource() {
    this.$store
      .dispatch("maintanance/maintenanceAction", this.$data.resource)
      .then((res: any) => {})
      .catch(() => {
        console.error("resource  Fails");
      });
  }
}
</script>
<style lang="scss" scoped>
.resource-container {
  display: flex;
}
</style>