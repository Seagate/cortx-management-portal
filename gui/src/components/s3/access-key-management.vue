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
    <div class="d-flex justify-end">
      <button
        type="button"
        id="s3-accesskey-add-btn"
        class="cortx-btn-primary "
        @click="createAccessKey()"
        :disabled="accessKeyList.length >= MAX_ACCESS_KEYS"
      >
        {{ $t("s3.access-key.add-btn") }}
      </button>
    </div>

    <cortx-has-access
      :to="$cortxUserPermissions.s3accounts + $cortxUserPermissions.list"
    >
      <v-data-table
        id="s3-accesskey-datatable"
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
            <td :id="'s3-accesskey-datatable-' + item.access_key_id">
              {{ item.access_key_id }}
            </td>
            <td>
              {{ SECRET_KEY_PLACEHOLDER }}
            </td>
            <td>
              <cortx-has-access
                class="mx-2"
                :to="
                  $cortxUserPermissions.s3accounts +
                    $cortxUserPermissions.delete
                "
              >
                <img
                  :id="'s3-accesskey-datatable-delete-' + item.access_key_id"
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
      :s3UrlNone="s3UrlNone"
      @closeDialog="showAccessKeyDetailsDialog = false"
    ></cortx-download-csv-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Validations } from "vuelidate-property-decorators";
import { required, helpers, sameAs, email } from "vuelidate/lib/validators";
import { AccessKey } from "../../models/s3";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
import CortxDownloadCsvDialog from "./download-csv-dialog.vue";
import i18n from "./s3.json";

@Component({
  name: "cortx-access-key-management",
  components: { CortxDownloadCsvDialog },
  i18n: {
    messages: i18n
  }
})
export default class CortxAccessKeyManagement extends Vue {
  @Prop({ required: true, default: "" })
  public s3Url: string;

  @Prop({ required: false, default: false })
  public s3UrlNone: boolean;

  private showConfirmDeleteDialog: boolean;
  private confirmDeleteDialogMessage: string = "";
  private showAccessKeyDetailsDialog: boolean;
  private accessKeyTableHeaderList: any[];
  private accessKeyList: AccessKey[] = [];
  private accessKeyDetails: any = {};
  private accountToDelete: string = "";
  private MAX_ACCESS_KEYS: number = 2;
  private SECRET_KEY_PLACEHOLDER: string = "XXXX";

  constructor() {
    super();
    this.showConfirmDeleteDialog = false;
    this.showAccessKeyDetailsDialog = false;
    this.accessKeyDetails = {};
  }
  public async mounted() {
     await this.getAllAccessKeys();
  }
  public beforeMount() {
    this.accessKeyTableHeaderList = [
      {
        text: this.$t("s3.access-key.table-headers.access_key"),
        value: "access_key",
        sortable: false
      },
      {
        text: this.$t("s3.access-key.table-headers.secret_key"),
        value: "secret_key",
        sortable: false
      },
      { text: this.$t("common.action"), value: "data-table-expand" }
    ];
  }
  public async createAccessKey() {
    this.$store.dispatch(
      "systemConfig/showLoader",
      this.$t("s3.access-key.create-message")
    );
    const res = await Api.post(apiRegister.s3_access_keys, {});
    const createAccessKeyDetails = res && res.data ? res.data : {};

    this.accessKeyDetails = {
      [`${this.$t(
        "s3.access-key.table-headers.access_key"
      )}`]: createAccessKeyDetails.access_key_id,
      [`${this.$t("s3.account.url-label-no-colon")}`]: this.s3Url,
      [`${this.$t(
        "s3.access-key.table-headers.secret_key"
      )}`]: createAccessKeyDetails.secret_key
    };

    if (this.s3UrlNone) {
      delete this.accessKeyDetails["S3 URL"];
    }
    this.showAccessKeyDetailsDialog = true;
    this.$store.dispatch("systemConfig/hideLoader");
    await this.getAllAccessKeys();
  }

  public async getAllAccessKeys() {
    this.$store.dispatch(
      "systemConfig/showLoader",
      this.$t("s3.access-key.get-message")
    );
    const res: any = await Api.getAll(apiRegister.s3_access_keys);
    this.accessKeyList = res && res.data ? res.data.access_keys : [];
    this.$store.dispatch("systemConfig/hideLoader");
  }

  public openConfirmDeleteDialog(accountName: string) {
    this.confirmDeleteDialogMessage = `${this.$t(
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
    this.$store.dispatch(
      "systemConfig/showLoader",
      this.$t("s3.access-key.delete-message") + this.accountToDelete
    );
    await Api.delete(apiRegister.s3_access_keys, this.accountToDelete);
    this.accountToDelete = "";
    this.confirmDeleteDialogMessage = "";
    this.$store.dispatch("systemConfig/hideLoader");
    await this.getAllAccessKeys();
  }
}
</script>
<style lang="scss" scoped></style>
