<template>
  <v-card class="pb-5 elevation-0" outlined tile>
    <v-system-bar color="greay lighten-3" height="50">BUCKETS</v-system-bar>
    <div v-if="isUserCreate">
      <v-row>
        <v-col class="pl-5">
          <div class="font-weight-medium pt-3">BUCKET NAME</div>
          <input class="input-text" type="text" name="bucketname" v-model="bucket_name" />
        </v-col>
      </v-row>
    </div>
    <v-btn color="green" class="ma-5 elevation-0">
      <span v-if="!isUserCreate" class="white--text" @click="addBucket()">Add BUCKET</span>
      <span v-if="isUserCreate" class="white--text" @click="createUser()">CREATE BUCKET</span>
    </v-btn>
    <span v-if="isUserCreate" class="green--text" @click="createUser()">Cancel</span>
    <v-data-table
      calculate-widths
      :items="bucketData"
      :single-expand="singleExpand"
      item-key="id"
      show-expand
      class="eos-table"
      hide-default-header
    >
      <template v-slot:header="{props}">
        <tr>
          <th class="tableheader" />
          <th
            v-for="header in alertHeader"
            :key="header.text"
            class="tableheader text-capitalize font-weight-medium text--black"
            @click="onSortPaginate(header.value, header, props.options.page, props.options.itemsPerPage)"
          >
            <span
              class="headerText"
              :class="(header.value === sortColumnName && isSortActive) ? 'active' : ''"
            >{{ header.text }}</span>
            <span
              :class="(header.value === sortColumnName && isSortActive) ? 'active' : 'notActive'"
            >
              <img
                v-if="header.sortable && header.sortDir === alertStatus.desc"
                src="./../../assets/table-caret-green-down.png"
              />
              <img
                v-if="header.sortable && header.sortDir === alertStatus.asc"
                src="./../../assets/table-caret-green-up.png"
              />
            </span>
          </th>
          <th class="tableheader" />
        </tr>
      </template>

      <template v-slot:item="props">
        <tr class="font-weight-small">
          <td @click="onExpand(props)">
            <img v-if="props.isExpanded" src="./../../assets/caret-green-down.png" />
            <img v-if="!props.isExpanded" src="./../../assets/caret-green-right.png" />
          </td>
          <td>{{props.item.name}}</td>
          <td>
            <img @click="onDelete(props.item.name )" src="./../../assets/delete-off.png" />
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Buckets } from "./../.././././models/s3Buckets";
@Component({
  name: "eos-bucketcreation"
})
export default class EosBucketCreation extends Vue {
  public gotToNextPage() {
    this.$router.push("bucketconfigsummary");
  }
  public gotToPrevPage() {
    this.$router.push("usersetting");
  }
  private addIpAddressNode(address: string) {
    if (
      this.$data.ipaddressNode0.length < 4 &&
      address !== "" &&
      address !== undefined
    ) {
      this.$data.ipaddressNode0.push(address);
      this.$data.newAddressNode0 = "";
    }
  }
  private addBucket() {
    this.$data.isUserCreate = !this.$data.isUserCreate;
    return this.$data.isUserCreate;
  }
  private createUser() {
    this.$data.isUserCreate = !this.$data.isUserCreate;
    const queryParams: Buckets = {
      bucket_name: this.$data.bucket_name
    };
    this.$store
      .dispatch("bucket/createBucketListAction", queryParams)
      .then((res: any) => {
        this.getUserData();
      })
      .catch(() => {
        // tslint:disable-next-line: no-console
        console.error("Create User Fails");
      });
    return this.$data.isUserCreate;
  }
  private editUser() {
    this.$data.isUserEdit = !this.$data.isUserEdit;
    return this.$data.isUserEdit;
  }
  private onExpand(props: any) {
    if (props.isExpanded === false) {
      props.expand(props.item);
    } else {
      props.expand(false);
    }
  }
  private onDelete(name: string) {
    this.$store
      .dispatch("bucket/deleteBucketListAction", name)
      .then(data => {
        alert("Deleting");
        this.getUserData();
      })
      .catch(e => {
        console.log("err logger: ", e);
      });
  }
  private getUserData() {
    this.$store
      .dispatch("bucket/getDataAction")
      .then(data => {
        this.$data.bucketData = data.buckets;
      })
      .catch(e => {
        console.log("err logger: ", e);
      });
  }
  private mounted() {
    this.getUserData();
  }
  private data() {
    return {
      source: "manual",
      isUserCreate: false,
      page: 1, // Page counter, in sync with data table
      singleExpand: false, // Expande single row property
      itemsPerPage: 5, // Total rows per page, in sync with data table
      isSortActive: false, // Set table column sorting flag to default inactive
      sortColumnName: "", // Set sorting column name to none
      alertStatus: require("./../../common/const-string.json"),
      bucket_name: "",
      alertHeader: [
        {
          text: "BUCKETNAME",
          value: "username",
          sortable: false
        }
      ],
      bucketData: []
    };
  }
}
</script>
</script>
<style lang="scss" scoped>
.input-text {
  border-style: solid;
  border-width: 1px;
  border-color: #e3e3e3;
  width: 20em;
  height: 2.5em;
}
.pointer {
  cursor: pointer;
}

.actbtn {
  position: absolute;
  float: left;
}
#clear {
  font-size: 14px;
  color: green;
  float: right;
}
#title {
  color: black;
}
.tableheader {
  height: 2.5em;
  background-color: #e3e3e3;
  border-top: 1px solid whitesmoke;
  padding-top: 0.5em;
}
.active {
  display: inline-block;
  color: green !important;
}
.notActive {
  opacity: 0;
}
.headerText {
  color: black;
}
.backoverview {
  position: relative;
  top: 1em;
  cursor: pointer;
}
.backoverviewimg {
  position: relative;
  display: inline-block;
}
.backoverviewtxt {
  position: relative;
  top: -0.3em;
}
.tableheader:hover {
  .notActive {
    opacity: 1;
  }
}
.largeAlert {
  border: 2px solid #e3e3e3;
}
tbody tr {
  background-color: #ebf1e9 !important ;
}
tbody tr:hover {
  border-top: 2px solid darkgray !important;
  border-bottom: 2px solid darkgray !important;
}
tbody tr:active {
  border-top: 2px solid darkgray !important;
  border-bottom: 2px solid darkgray !important;
}
.center {
  padding: 22px;
}
</style>
