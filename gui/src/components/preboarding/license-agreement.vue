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
        <div class="cortx-modal cortx-license-modal">
          <div class="cortx-modal-header">
            <label id="agreement-title"> {{ agreementText.heading }}</label>
            <img
              id="license-cancelagreementicon"
              class="cortx-modal-close"
              :src="require('@/assets/close-green.svg')"
              @click="cancelAgreement"
            />
          </div>
          <div class="cortx-modal-body ">
            <div class="title-container pr-3" id="agreement-data">
              <div
                class="font-weight-bold text-center mb-5"
              >
                {{ agreementText.sub_heading }}
              </div>
              <template v-for="(section, index) in agreementText.sections">
                <div v-bind:key="index">
                  <div v-if="section.paragraph_text">
                    <label class="title-text" v-if="section.paragraph_text.title">
                      {{ section.paragraph_text.title }}
                    </label>
                    <p v-cortx-build-link>{{ section.paragraph_text.text }}</p>
                  </div>
                  <div v-if="section.bulleted_text">
                    <div class="mb-2" v-if="section.bulleted_text.title">
                      <label class="title-text">
                        {{ section.bulleted_text.title }}
                      </label>
                    </div>
                    <ol class="ordered-list pl-8">
                      <template v-for="(text_item, index) in section.bulleted_text.texts">
                        <li v-bind:key="index" :class="{'font-weight-bold': text_item.title}">
                          <span
                            style="text-decoration: underline;"
                          >
                            {{ text_item.title }}
                          </span>
                          <p class="cortx-font-weight-normal" v-for="(text, index) in text_item.texts" v-bind:key="index" v-cortx-build-link>{{ text }}</p>
                        </li>
                      </template>
                    </ol>
                  </div>
                </div>
              </template>
            </div>
            <div class="mt-5 nav-btn">
              <button
                id="license-acceptagreement"
                type="button"
                class="cortx-btn-primary mr-2"
                @click="acceptAgreement"
              >
                {{ $t("common.accept") }}
              </button>

              <button
                id="license-cancelagreementbtn"
                type="button"
                class="cortx-btn-tertiary"
                @click="cancelAgreement"
              >
                {{ $t("common.cancel") }}
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
import { agreementText } from "./../../common/license-agreement-text";
import { buildLinkDirective } from "../widgets/build-link-directive";
import i18n from "./preboarding.json";

@Component({
  name: "cortx-onboarding-finish",
  directives: { "cortx-build-link": buildLinkDirective },
   i18n: {
    messages: i18n
  }
})
export default class CortxOnboardingFinish extends Vue {
  private data() {
    return {
      agreementText
    };
  }
  private acceptAgreement() {
    this.$emit("accepted", true);
  }
  private cancelAgreement() {
    this.$emit("accepted", false);
  }
}
</script>

<style lang="scss" scoped>
.cortx-license-modal {
  width: 760px;
  min-height: 214px;
  height: 535px;
  position: fixed;
}
.nav-btn {
  text-align: right;
}
.title-container {
  height: 376px;
  overflow: auto;
  text-align: justify;
}
.ordered-list {
  list-style-type: upper-roman;
}
.cortx-font-weight-normal {
  font-weight: normal;
}
.title-text {
  font-weight: bold;
  text-decoration: underline;
}
</style>
