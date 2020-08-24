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
  <div class="eos-modal-container" v-if="value">
    <div class="eos-modal">
      <div class="eos-modal-header">
        <label>Comments</label>
        <img
          class="eos-modal-close"
          :src="require('@/assets/close-green.svg')"
          @click="closeAddCommentsDialog()"
        />
      </div>
      <div>
        <div class="eos-comments-container-overlay" v-if="showLoader"></div>
        <div class="eos-comments-container">
          <label v-if="alertComments.length === 0" class="eos-text-md ml-4">No comments</label>
          <div
            v-else
            class="eos-comment"
            v-for="alertComment in alertComments"
            :key="alertComment.comment_id"
          >
            <div>
              <span class="eos-text-md">{{ alertComment.comment_text }}</span>
            </div>
            <div class="mt-2" style="height: 20px;">
              <span class="eos-text-sm">{{ new Date(alertComment.created_time * 1000) | timeago }}</span>
              <span class="eos-text-sm mx-3">|</span>
              <span class="eos-text-sm">{{ alertComment.created_by }}</span>
            </div>
          </div>
        </div>
        <div class="eos-modal-footer">
          <div
            class="eos-form-group"
            :class="{
            'eos-form-group--error': $v.addCommentForm.comment_text.$error
            }"
            style="width: 100%;"
          >
            <textarea
              class="eos-form__input_textarea"
              v-model.trim="addCommentForm.comment_text"
              @input="$v.addCommentForm.comment_text.$touch"
            ></textarea>
            <div class="eos-form-group-label eos-form-group-error-msg">
              <label
                v-if="$v.addCommentForm.comment_text.$dirty && !$v.addCommentForm.comment_text.required"
              >Comment is required.</label>
              <label
                v-else-if="$v.addCommentForm.comment_text.$dirty && !$v.addCommentForm.comment_text.maxLength"
              >Comment cannot be more than 250 characters.</label>
            </div>
          </div>
          <div style="height: 40px;margin-top:10px;">
            <button
              type="button"
              class="eos-btn-secondary eos-float-r ml-3"
              @click="closeAddCommentsDialog()"
            >Cancel</button>
            <button
              type="button"
              class="eos-btn-primary eos-float-r"
              @click="saveComment()"
              :disabled="$v.addCommentForm.$invalid"
            >Save</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { Validations } from "vuelidate-property-decorators";
import { required, maxLength } from "vuelidate/lib/validators";
import { Api } from "./../../services/api";
import apiRegister from "./../../services/api-register";
import { AlertComment } from "../../models/alert";

@Component({
  name: "eos-alert-comments"
})
export default class EosAlertComments extends Vue {
  @Prop({ required: true })
  public value: boolean;
  @Prop({ required: true })
  public alertId: string;
  public alertComments: AlertComment[] = [];
  public showLoader: boolean = false;
  public addCommentForm = {
    comment_text: ""
  };

  @Validations()
  public validations = {
    addCommentForm: {
      comment_text: { required, maxLength: maxLength(250) }
    }
  };

  @Watch("value")
  public async onPropertyChanged(newValue: number, oldValue: number) {
    if (newValue) {
      await this.getAlertComments();
    }
  }

  public async getAlertComments() {
    this.showLoader = true;
    const res = await Api.getAll(
      apiRegister.all_alerts + "/" + this.alertId + "/comments"
    );
    if (res.data) {
      this.alertComments = res.data.comments;
    }
    this.showLoader = false;
  }

  public async saveComment() {
    this.showLoader = true;
    const res = await Api.post(
      apiRegister.all_alerts + "/" + this.alertId + "/comments",
      { comment_text: this.addCommentForm.comment_text }
    );
    this.resetAddCommentForm();
    this.showLoader = false;
    await this.getAlertComments();
  }

  public closeAddCommentsDialog() {
    this.alertComments = [];
    this.resetAddCommentForm();
    this.$emit("input", false);
  }

  private resetAddCommentForm() {
    this.addCommentForm.comment_text = "";
    if (this.$v.addCommentForm) {
      this.$v.addCommentForm.$reset();
    }
  }
}
</script>
<style lang="scss" scoped>
.eos-comments-container-overlay {
  height: 24em;
  width: 424px;
  position: absolute;
  background-color: #ffffff;
  opacity: 70%;
}
.eos-comments-container {
  height: 12.5em;
  border-bottom: 1px solid #b7b7b7;
  overflow: auto;
  padding: 2px;
}
.eos-comment {
  padding: 0.5em;
  border: 1px solid #b7b7b7;
  margin-bottom: 2px;
  border-radius: 4px;
}
.eos-modal-footer {
  height: 12em;
  padding: 0.5em;
}
</style>
