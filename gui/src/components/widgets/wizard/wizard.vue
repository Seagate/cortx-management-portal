/*****************************************************************************
 Filename:          wizard.vue
 Description:       Wizard Component to manage Onboarding Steps

 Creation Date:     10/12/2019
 Author:            Sanjeevan Bhave

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <div>
    <div class="mt-3" v-if="!selectedComponent.hideHeader">
    <span v-for="step in steps" v-bind:key="step.id">
      <span v-if="step.header">
        <eosWizardStep
          v-if="!step.isByPassed"
          :stepName="step.header.name"
          :stepClass="step.header.state"
          :stepId="step.component"
        />
      </span>
    </span>
    </div>
    <div class="pt-5">
      <component v-if="loadComponent" :is="loadComponent"></component>
    </div>

    <eosWizardFooter
      :footerObj="footerObj"
      @messageFromFooter="messageReceivedFromFooter"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import EosWizardStep from "./wizard-step.vue";
import EosWizardFooter from "./wizard-footer.vue";

@Component({
  name: "eos-wizard",
  components: {
    eosWizardStep: EosWizardStep,
    eosWizardFooter: EosWizardFooter
  },
  props: {
    configData: Object,
    sortBy: String
  }
})
export default class EosWizard extends Vue {
  private messageReceivedFromFooter(
    nextConfiguredComponent: string,
    goWhere: string
  ) {
    this.nextComponentAsCurrentComponent(nextConfiguredComponent, goWhere);
  }
  private data() {
    return {
      goWhere: "",
      selectedComponent: ""
    };
  }
  get steps() {
    // Sort Wizard data based on sortBy prop
    const wizardSteps = this.$props.configData.steps.sort((a: any, b: any) => {
      return (
        a[this.$props.sortBy as keyof typeof String] -
        b[this.$props.sortBy as keyof typeof String]
      );
    });
    return wizardSteps;
  }
  // Set Next component as current component and let wizard change its step
  private nextComponentAsCurrentComponent(
    nextConfiguredComponent: string,
    goWhere: string
  ) {
    const wizardConfig = this.$props.configData;
    wizardConfig.currentComponent = nextConfiguredComponent;
    this.$data.goWhere = goWhere;
  }

  // Get Current Components Data
  get currentComponentData() {
    // Get sorted wizard steps
    const wizardSteps = this.steps;
    let currentComponentData = "";
    // Loop through steps data to fetch current component data
    wizardSteps.forEach((step: any, index: number) => {
      if (step.component === this.currentComponent && !step.isByPassed) {
        if (step.header) {
          step.header.state = "current";
        }
        currentComponentData = step;
        return true;
      } else if (step.component === this.currentComponent && step.isByPassed) {
        if (this.$data.goWhere === "goPrev") {
          while (index--) {
            if (!wizardSteps[index].isByPassed) {
              this.$props.configData.currentComponent =
                wizardSteps[index].component;
              currentComponentData = wizardSteps[index];
              this.$data.goWhere = "";
              break;
            }
          }
          return true;
        }
        if (this.$data.goWhere === "goNext") {
          while (wizardSteps[index].isByPassed) {
            index++;
            if (!wizardSteps[index].isByPassed) {
              this.$props.configData.currentComponent =
                wizardSteps[index].component;
              currentComponentData = wizardSteps[index];
              this.$data.goWhere = "";
              break;
            }
          }
          return true;
        }
      }
    });
    return JSON.stringify(currentComponentData);
  }
  // Get current component name
  get currentComponent() {
    const wizardConfig = this.$props.configData;
    const currentComponent = wizardConfig.currentComponent;
    return currentComponent;
  }
  get loadComponent() {
    const currentComponent = JSON.parse(this.currentComponentData);
    this.$data.selectedComponent = currentComponent;
    const compPath: string = currentComponent.path;
    const compName: string = currentComponent.component;
    if (compName) {
    const loadComponent = () =>
      import(/* webpackChunkName: [compName] */ `./../../${compPath}`);
    return loadComponent;
  }
  }
  get footerObj() {
    const component = JSON.parse(this.currentComponentData);
    return component.footer;
  }
}
</script>

<style lang="scss" scoped></style>
