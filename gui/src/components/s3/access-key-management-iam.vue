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
  <div class="mt-7">
    <div class="d-flex justify-space-between align-center">
      <label
        id="iam-accesskey-datatable-title"
        class="cortx-text-lg font-weight-bold ml-2"
        ><span v-if="userNameIAM">
          {{
            $t("s3.access-key.iam-table-title", { userNameIAM })
          }}
        </span></label
      >
      <button
        type="button"
        id="iam-accesskey-add-btn"
        class="cortx-btn-primary "
        @click="createAccessKey()"
        :disabled="accessKeyList.length >= MAX_ACCESS_KEYS || !this.userNameIAM"
      >
        {{ $t("s3.access-key.add-btn") }}
      </button>
    </div>

    <cortx-has-access
      :to="$cortxUserPermissions.s3iamusers + $cortxUserPermissions.list"
    >
      <v-data-table
        id="iam-accesskey-datatable"
        :headers="accessKeyTableHeaderList"
        :items="accessKeyList"
        item-key="access_key_id"
        class="cortx-table"
        :hide-default-header="true"
        :hide-default-footer="true"
        :disable-pagination="true"
      >
        <template v-slot:header="{}">
          <tr>
            <th
              v-for="header in accessKeyTableHeaderList"
              :key="header.text"
              class="tableheader"
            >
              <span>{{ header.text }}</span>
            </th>
          </tr>
        </template>
        <template v-slot:item="{ item }">
          <tr>
            <td :id="'iam-accesskey-datatable-' + item.access_key_id">
              {{ item.access_key_id }}
            </td>
            <td>
              XXXX
            </td>
            <td>
              <cortx-has-access
                class="mx-2"
                :to="
                  $cortxUserPermissions.s3iamusers + $cortxUserPermissions.delete
                "
              >
                <img
                  :id="'iam-accesskey-datatable-delete-' + item.access_key_id"
                  @click="openConfirmDeleteDialog(item.access_key_id)"
                  class="cortx-cursor-pointer"
                  src="@/assets/actions/delete-green.svg"
                />
              </cortx-has-access>
            </td></tr
        ></template>
      </v-data-table>
    </cortx-has-access>

    <cortx-confirmation-dialog
      :show="showConfirmDeleteDialog"
      :title="$t('common.confirm-dialog.title')"
      :message="confirmDeleteDialogMessage"
      severity="warning"
      @closeDialog="closeConfirmDeleteDialog"
      cancelButtonText="No"
    ></cortx-confirmation-dialog>
    <cortx-download-csv-dialog
      :show="showAccessKeyDetailsDialog"
      :title="$t('s3.download-csv-dialog.created')"
      :tableContent="accessKeyDetails"
      @closeDialog="showAccessKeyDetailsDialog = false"
    ></cortx-download-csv-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { Validations } from "vuelidate-property-decorators";
import { required, helpers, sameAs, email } from "vuelidate/lib/validators";
import { AccessKey } from "../../models/s3";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
import CortxDownloadCsvDialog from "./download-csv-dialog.vue";
import i18n from "./../../i18n";

@Component({
  name: "cortx-access-key-management-iam",
  components: { CortxDownloadCsvDialog }
})
export default class CortxAccessKeyManagementIAM extends Vue {
  private showConfirmDeleteDialog: boolean;
  private confirmDeleteDialogMessage: string = "";
  private showAccessKeyDetailsDialog: boolean;
  private accessKeyTableHeaderList: any[];
  private accessKeyList: AccessKey[] = [];
  private accessKeyDetails: any = {};
  private accountToDelete: string = "";
  private MAX_ACCESS_KEYS: number = 2;

  @Prop({ required: true, default: "" })
  private userNameIAM!: string;

  constructor() {
    super();

    this.showConfirmDeleteDialog = false;
    this.showAccessKeyDetailsDialog = false;
    this.accessKeyDetails = {};
    this.accessKeyTableHeaderList = [
      {
        text: i18n.t("s3.access-key.table-headers.access_key"),
        value: "access_key",
        sortable: false
      },
      {
        text: i18n.t("s3.access-key.table-headers.secret_key"),
        value: "secret_key",
        sortable: false
      },
      { text: "", value: "data-table-expand" }
    ];
  }

  public async createAccessKey() {
    if (!this.userNameIAM) {
      return;
    }
    this.$store.dispatch(
      "systemConfig/showLoader",
      i18n.t("s3.access-key.create-message")
    );
    const res = await Api.post(
      apiRegister.s3_access_keys,
      {},
      {
        params: { user_name: this.userNameIAM }
      }
    );
    const createAccessKeyDetails = res && res.data ? res.data : {};

    this.accessKeyDetails = {
      [`${i18n.t(
        "s3.access-key.table-headers.user_name"
      )}`]: createAccessKeyDetails.user_name,
      [`${i18n.t(
        "s3.access-key.table-headers.access_key"
      )}`]: createAccessKeyDetails.access_key_id,
      [`${i18n.t(
        "s3.access-key.table-headers.secret_key"
      )}`]: createAccessKeyDetails.secret_key
    };

    this.showAccessKeyDetailsDialog = true;
    this.$store.dispatch("systemConfig/hideLoader");
    await this.getAllAccessKeys();
  }

  @Watch("userNameIAM")
  public async getAllAccessKeys() {
    this.accessKeyList = [];
    if (!this.userNameIAM) {
      return;
    }
    this.$store.dispatch(
      "systemConfig/showLoader",
      i18n.t("s3.access-key.get-message-iam")
    );
    const res: any = await Api.getAll(apiRegister.s3_access_keys, {
      user_name: this.userNameIAM
    });
    this.accessKeyList = res && res.data ? res.data.access_keys : [];
    this.$store.dispatch("systemConfig/hideLoader");
  }

  public openConfirmDeleteDialog(accountName: string) {
    this.confirmDeleteDialogMessage = `${i18n.t(
      "s3.access-key.delete-confirmation",
      { key: accountName }
    )}`;
    this.accountToDelete = accountName;
    this.showConfirmDeleteDialog = true;
  }

  public async closeConfirmDeleteDialog(confirmation: boolean) {
    this.showConfirmDeleteDialog = false;
    if (confirmation) {
      await this.deleteAccessKey();
    }
  }
  private async deleteAccessKey() {
    if (!this.userNameIAM) {
      return;
    }
    this.$store.dispatch(
      "systemConfig/showLoader",
      i18n.t("s3.access-key.delete-message") + this.accountToDelete
    );
    await Api.delete(apiRegister.s3_access_keys, this.accountToDelete, {
      params: { user_name: this.userNameIAM }
    });
    this.accountToDelete = "";
    this.confirmDeleteDialogMessage = "";
    this.$store.dispatch("systemConfig/hideLoader");
    await this.getAllAccessKeys();
  }
}
</script>
<style lang="scss" scoped></style>