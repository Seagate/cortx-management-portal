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
    <v-container>
      <div class="wrapper pt-3">
        <div class="arrow-steps clearfix">
          <div class="step first complete">
            <router-link :to="'onboarding'">Start</router-link>
          </div>
        </div>
      </div>
    </v-container>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "eos-homebase"
})
export default class EosHomebase extends Vue {}
</script>

<style lang="scss" scoped>
.clearfix:after {
  clear: both;
  content: "";
  display: block;
  height: 0;
}
.wrapper {
  width: 100%;
}
.nav {
  margin-top: 40px;
}
.pull-right {
  float: right;
}
a,
a:active {
  color: #212121;
  text-decoration: none;
}
a:hover {
  color: #999;
}
.arrow-steps .step {
  font-size: 14px;
  text-align: center;
  color: white;
  margin: 0 1px;
  padding: 5px 10px 10px 30px;
  min-width: 12em;
  float: left;
  position: relative;
  background-color: #b7b7b7;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  transition: background-color 0.2s ease;
}
.arrow-steps .step:after,
.arrow-steps .step:before {
  content: " ";
  position: absolute;
  top: 0;
  right: -17px;
  width: 0;
  height: 0;
  border-top: 19px solid transparent;
  border-bottom: 17px solid transparent;
  border-left: 17px solid #b7b7b7;
  z-index: 2;
  transition: border-color 0.2s ease;
}
.arrow-steps .step:before {
  right: auto;
  left: 0;
  border-left: 17px solid #ffffff;
  z-index: 0;
}
.arrow-steps .step:first-child:before {
  border: none;
}
.arrow-steps .step span {
  position: relative;
}
.arrow-steps .step.complete {
  color: #ffffff;
  background-color: #4b813d;
  cursor: pointer;
}
.arrow-steps .step.complete:after {
  border-left: 0px solid #4b813d;
}

// .arrow-steps .step.first:before {
//   border-top: 19px solid transparent;
//   border-bottom: 17px solid transparent;
//   border-left: 17px solid white;
// }
@media (max-width: 765px) {
  .arrow-steps .step {
    min-width: 1em;
  }
}
</style>
