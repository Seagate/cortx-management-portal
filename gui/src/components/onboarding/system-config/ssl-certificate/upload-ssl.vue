<template>
  <v-container>
    <div class="pl-4 body-2">
      <v-card class="col-10 pb-5 mt-10 elevation-0" outlined tile>
         <v-row class="resource-container mt-5">
          <v-col>
            <label
              class="eos-form-group-label ml-10 mt-5"
              for="Resource"
              style=" font-size: 1em;"
            >Upload SSL Certificate</label>
          </v-col>
          <v-col>
            <v-btn elevation="0" color="csmprimary" id="btnDTSetNow">
              <span class="white--text" @click="startResource()">Upload</span>
            </v-btn>
          </v-col>
        </v-row>
         <v-row class="resource-container mt-5">
          <v-col>
            <label
              class="eos-form-group-label ml-10 mt-5"
              for="Resource"
              style=" font-size: 1em;"
            >Upload Key Certificate</label>
          </v-col>
          <v-col>
            <v-btn elevation="0" color="csmprimary" id="btnDTSetNow">
              <span class="white--text" @click="Clusterresource()">Upload</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </div>
    
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import {
  SystemConfigObject,
  DnsNetworkSettings
} from "./../../../../models/system-configuration";
import { EVENT_BUS } from "./../../../../main";
import { Validations } from "vuelidate-property-decorators";
import {
  required,
  helpers,
  sameAs,
  ipAddress,
  requiredIf
} from "vuelidate/lib/validators";
@Component({
  name: "uploade-ssl"
})
export default class EOSUploadSSL extends Vue {
  private mounted() {
    // WizardHook: Open a listener for onNext event
    // So when wizard footer clicks on the Next Button this component can perform its own workflow
    EVENT_BUS.$on("emitOnNext", (res: any) => {
      // this.updateDNSconfig().then(result => {
        res(true);
      // });
    });
  }
   private destroyed() {
    // WizardHook: shut off on exit event listner
    EVENT_BUS.$off("emitOnNext");
  }
  private data() {
    return {
    
    };
  } 
}
</script>
<style lang="scss" scoped>
</style>
