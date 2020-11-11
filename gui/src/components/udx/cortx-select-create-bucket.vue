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
  <div class="bucket-container">
    <v-row v-if="!isCreateBucket">
      <v-col class="py-0 pr-0">
        <cortx-dropdown
          title="-- Select Bucket --"
          :selectedOption.sync="registrationForm.bucketName"
          :options="bucketList"
        ></cortx-dropdown>
        <div v-if="!bucketList.length">
          {{ $t("udx-registration.noBucketFound") }}
        </div>
        <div>
          <button
            class="cortx-btn-tertiary create-new-bucket"
            @click="isCreateBucket = !isCreateBucket"
            type="button"
          >
            {{ $t("udx-registration.createNewBucket") }}
          </button>
        </div>
        <button class="cortx-btn-primary" type="button" @click="createBucket()"
        :disabled="$v.registrationForm.bucketName.$invalid"
        >
          {{ $t("common.continue") }}
        </button>
        <button
          class="cortx-btn-secondary ml-5"
          type="button"
          @click="backToPreviousStep()"
        >
          {{ $t("common.back") }}
        </button>
      </v-col>
    </v-row>
    <v-row v-else>
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
            <label>{{ $t("udx-registration.ldp") }}</label>
          </div>
          <input
            class="cortx-form__input_text cortx-bucket-input"
            type="text"
            id="bucketName"
            name="bucketName"
            v-model.trim="registrationForm.createBucketName"
            autocomplete="off"
            @input="$v.registrationForm.createBucketName.$touch"
          />
          <div class="cortx-form-group-label cortx-form-group-error-msg">
            <label
              id="udx-bucketname-required"
              v-if="
                $v.registrationForm.createBucketName.$dirty &&
                  !$v.registrationForm.createBucketName.required
              "
              >{{ $t("udx-registration.bucket-required") }}</label
            >
            <label
              id="udx-bucketname-invalid"
              v-else-if="
                $v.registrationForm.createBucketName.$dirty &&
                  !$v.registrationForm.createBucketName.udxBucketNameRegex
              "
              >{{ $t("udx-registration.invalid-bucketname") }}</label
            >
          </div>
        </div>
        <button
          class="cortx-btn-primary"
          type="button"
          :disabled="$v.registrationForm.createBucketName.$invalid"
          @click="createBucket()"
        >
          {{ $t("udx-registration.createNewBucket") }}
        </button>
        <button
          type="button"
          class="cortx-btn-secondary cortx-btn-cancel"
          @click="isCreateBucket = !isCreateBucket"
        >
          {{ $t("common.cancel") }}
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
import i18n from "./../../i18n";
import { Bucket } from "../../models/s3";

@Component({
  name: "cortx-select-create-bucket"
})
export default class CortxSelectCreateBucket extends Vue {
  public bucketNameTooltipMessage: string = udxBucketNameTooltipMessage;
  public bucketUrl: string;
  public registrationForm = {
    bucketName: {} as any,
    createBucketName: ""
  };

  @Prop({ required: true, default: "" })
  public authToken: string;

  @Validations()
  public validations = {
    registrationForm: {
      bucketName: { required },
      createBucketName: { required, udxBucketNameRegex }
    }
  };
  private isCreateBucket: boolean = false;
  private bucketList: any[] = [];

  public async mounted() {
    const config: any = {
      headers: {
        auth_token: this.authToken
      }
    };
    this.$store.dispatch("systemConfig/showLoader", "Fetching butcket list...");
    const res: any = await Api.getAllWithConfig(apiRegister.s3_bucket, config);
    if (res && res.data && res.data.buckets) {
      this.bucketList = res.data.buckets.map((bucket: any) => {
        return { label: bucket.name, value: bucket.name };
      });
    }
    this.$store.dispatch("systemConfig/hideLoader");
  }

  public backToPreviousStep() {
    this.registrationForm.createBucketName = "";
    if (this.$v.registrationForm) {
      this.$v.registrationForm.$reset();
    }
    this.$emit("onChange", true);
  }

  private async createBucket() {
    const bucketName: string = this.isCreateBucket
      ? this.registrationForm.createBucketName
      : this.registrationForm.bucketName.label;
    if (this.isCreateBucket) {
      const createBucketForm = {
        bucket: {} as Bucket
      };
      const config: any = {
        headers: {
          auth_token: this.authToken
        }
      };
      createBucketForm.bucket.bucket_name = bucketName;

      this.$store.dispatch(
        "systemConfig/showLoader",
        i18n.t("s3.bucket.creating-bucket")
      );
      const res = await Api.postAllWithConfig(
        apiRegister.s3_bucket,
        config,
        createBucketForm.bucket
      );
      this.bucketUrl = res && res.data.bucket_url ? res.data.bucket_url : "NA";

      this.$store.dispatch("systemConfig/hideLoader");
    }
    this.$emit("onChange", false, bucketName);
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
