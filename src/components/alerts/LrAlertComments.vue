<!--
* CORTX-CSM: CORTX Management web.
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
* please email opensource@seagate.com.
-->
<template>
  <v-dialog v-model="dialog" scrollable max-width="300px">
    <v-card>
      <v-card-title>
        <div class="title-container">
          {{modalTitle}}
          <img
            :src="require(`@/assets/icons/close-green.svg`)"
            @click="dialog = false"
            class="close-btn"
            alt="logo"
          />
        </div>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text style="height: 200px;">
        <label v-if="alertComments.length === 0">No Comments </label>
        <div
          v-else
          class="cortx-comment"
          v-for="comment in alertComments"
          :key="comment.comment_id"
        >
          <div>
            <span>{{ comment.comment_text }}</span>
          </div>
          <div class="mt-2">
            <span class="sub-txt">{{ new Date(comment.created_time * 1000) | timeago }}</span>
            <span class="sub-txt mx-3">|</span>
            <span class="sub-txt">{{ comment.created_by }}</span>
          </div>
        </div>
        <div>
          <v-textarea outlined name="comment" label="Add Comment" rows="3" row-height="30" v-model.trim="commentText"></v-textarea> 

          <span class="error-txt sub-txt">{{errorMsg}}</span>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" @click="dialog = false">cancel</v-btn>
        <v-btn color="green darken-1" @click="addComment()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";
import LrLabel from "../shared/LrLabel/LrLabel.vue";
import { Api } from "../../services/Api";
import { AlertCommentModel } from "./LrAlertComment.model";
@Component({
	name: "LrAlertComments",
	components: {},
})
export default class LrAlertComments extends Vue {
	@Prop({ required: true }) private id: any;
	@PropSync("showAlertCommentsDialog", { required: false, default: false })
	private dialog: boolean;
	private commentText = "";
    private alertComments: AlertCommentModel[] = [];
    private errorMsg = "";

	mounted() {
		Api.getData("alerts/comment", { isDummy: true }).then((resp: any) => {
			this.alertComments = resp["comments"];
		});
	}

	addComment() {
        if(!this.commentText)
            this.errorMsg = "Comment Required";
        else if(this.commentText.length>250)
            this.errorMsg = "Comment Cannot Be More Than 250 Char"
        else {
            this.errorMsg ="";
            // code to post date 
        }

    }
}
</script>
<style lang="scss" scoped>
.title-container {
	width: 100%;
	.close-btn {
		cursor: pointer;
		float: right;
	}
}
.sub-txt{
    font-size: 0.8rem;
}
.error-txt{
    color: red;
}
</style>