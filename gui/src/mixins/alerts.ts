/*****************************************************************************
 Filename:          alerts.ts
 Description:       Alerts Common code should come in this file

 Creation Date:     20/09/2019
 Author:            Sanjeevan Bhave

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
// mixin.js
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";
import { AlertQueryParam } from "../models/alert";

@Component({
    name: "eos-alert-medium"
})
export default class AlertsMixin extends Vue {

    // Column sort handler
    public onSortPaginate(
        sortby: string,
        sortedHeader: any,
        offset: number,
        limit: number
    ) {
        const alertQueryParam: AlertQueryParam = {} as AlertQueryParam;
        // Check if current column is sortable
        if (sortedHeader && sortedHeader.sortable) {
            // Change sort direction in alertHeader data for current selected/sorted column
            this.$data.isSortActive = false; // Reset sort active for all columns
            this.$data.sortColumnName = "";
            for (const header of this.alertHeader) {
                if (header.value === sortby) {
                    header.sortDir = sortedHeader.sortDir === "desc" ? "asc" : "desc";
                    // Set flags sorting active with respective header name
                    this.$data.isSortActive = true;
                    this.$data.sortColumnName = header.value;
                }
            }
            // Update alert header data set with updated sort direction
            this.$store.commit("alerts/alertHeaderMutation", this.alertHeader);
        }
        // Set queryparams data to store; sortBy is null in case of pagination
        // For sorting sortBy should have column value

        sortby = sortby ? sortby : this.queryParams.sortby;
        const dir =
            sortedHeader != null ? sortedHeader.sortDir : this.queryParams.dir;

        if (this.$data.alertPageFilter) {
            switch (this.$data.alertPageFilter) {
                case "new":
                    alertQueryParam.acknowledged = false;
                    break;
                case "active":
                    alertQueryParam.acknowledged = true;
                    alertQueryParam.resolved = false;
                    break;
            }
        }
        alertQueryParam.sortby = sortby;
        alertQueryParam.dir = dir;
        alertQueryParam.offset = offset;
        alertQueryParam.limit = limit;
        this.$store.commit("alerts/alertQueryParamMutation", alertQueryParam);
        // Get queryparams data from store and then dispatch to action
        this.$store.dispatch("alerts/alertDataAction", alertQueryParam);
    }

    // Get total_records from alert API
    get totalRecordsCount() {
        return this.$store.getters["alerts/alertTotalRecordCount"];
    }
    // Get the header data from store
    get alertHeader() {
        return this.$store.getters["alerts/alertHeader"];
    }
    // Get all alerts from API
    get alertData() {
        return this.$store.getters["alerts/alertData"];
    }
    // Get alerts queryparams from store
    get queryParams() {
        return this.$store.getters["alerts/alertQueryParams"];
    }
    // Get current page
    get page() {
        return this.$store.getters["alerts/page"];
    }
    // Set current page
    set page(page: number) {
        this.$store.commit("alerts/setPage", page);
    }
    get itemsPerPage() {
        return this.$store.getters["alerts/itemsPerPage"];
    }
    set itemsPerPage(items: number) {
        this.$store.commit("alerts/setItemsPerPage", items);
    }
}
