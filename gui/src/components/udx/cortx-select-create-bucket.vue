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
    <v-row v-if="!isCreateBucket">
      <v-col class="py-0 pr-0">
        <cortx-dropdown
          title="-- Select Bucket --"
          :selectedOption.sync="registrationForm.bucketName"
          :options="bucketList"
        ></cortx-dropdown>
        <br />
        <button
          class="cortx-btn-tertiary create-new-bucket"
          @click="isCreateBucket = true"
          type="button"
        >
          Create new Bucket
        </button>
        <br />
        <button class="cortx-btn-primary" @click="createBucket()">
          Continue
        </button>
      </v-col>
    </v-row>
    <v-row v-if="isCreateBucket">
      <v-col class="py-0 pr-0">
        <div
          class="cortx-form-group"
          :class="{
            'cortx-form-group--error': $v.registrationForm.bucketName.$error
          }"
        >
          <label
            class="cortx-form-group-label"
            for="bucketName"
            id="udx-bucket-namelbl"
          >
            <cortx-info-tooltip
              label="Bucket name*"
              :message="bucketNameTooltipMessage"
            />
          </label>
          <div class="cortx-bucket-input-prefix">
            <label>ldp-</label>
          </div>
          <input
            class="cortx-form__input_text cortx-bucket-input"
            type="text"
            id="bucketName"
            name="bucketName"
            v-model.trim="registrationForm.bucketName"
            @input="$v.registrationForm.bucketName.$touch"
          />
          <div class="cortx-form-group-label cortx-form-group-error-msg">
            <label
              id="udx-bucketname-required"
              v-if="
                $v.registrationForm.bucketName.$dirty &&
                  !$v.registrationForm.bucketName.required
              "
              >{{ $t("udx-registration.bucket-required") }}</label
            >
            <label
              id="udx-bucketname-invalid"
              v-else-if="
                $v.registrationForm.bucketName.$dirty &&
                  !$v.registrationForm.bucketName.udxBucketNameRegex
              "
              >{{ $t("udx-registration.invalid-bucketname") }}</label
            >
          </div>
        </div>
        <button class="cortx-btn-primary" @click="createBucket()">
          Create bucket
        </button>
        <button
          class="cortx-btn-secondary cortx-btn-cancel"
          @click="isCreateBucket = false"
        >
          Cancel
        </button>
      </v-col>
    </v-row>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
import { Validations } from "vuelidate-property-decorators";
import { required, helpers, sameAs, email } from "vuelidate/lib/validators";
import {
  udxBucketNameRegex,
  udxBucketNameTooltipMessage
} from "../../common/regex-helpers";

@Component({
  name: "cortx-select-create-bucket"
})
export default class CortxSelectCreateBucket extends Vue {
  public bucketNameTooltipMessage: string = udxBucketNameTooltipMessage;
  private isCreateBucket: boolean = false;
  private bucketList: any[] = [];

  @Prop({ required: true, default: "" })
  public authToken: string;

  public registrationForm = {
    bucketName: ""
  };

  @Validations()
  public validations = {
    registrationForm: {
      bucketName: { required, udxBucketNameRegex }
    }
  };

  public async mounted() {
    const config: any = {
      headers: {
        auth_token: this.authToken
      }
    };
    this.$store.dispatch("systemConfig/showLoader", "Fetching butcket list...");
    const res = await Api.getAllWithConfig(apiRegister.s3_bucket, config);
    if (res && res.data) {
      this.bucketList = res.data;
    }
    this.$store.dispatch("systemConfig/hideLoader");
  }

  private createBucket() {
    this.$emit("onChange", this.registrationForm.bucketName);
  }
}
</script>
<style lang="scss" scoped>
.cortx-bucket-input-prefix {
  height: 40px;
  padding-top: 8px;
  float: left;
}
.cortx-bucket-input {
  width: 290px;
  float: left;
}
.create-new-bucket {
  padding: 0;
  text-decoration: underline;
}
.cortx-btn-cancel {
  margin-left: 15px;
}
</style>
