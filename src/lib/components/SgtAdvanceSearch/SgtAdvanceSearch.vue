<!--
* CORTX-CSM: CORTX Management web.
* Copyright (c) 2022 Seagate Technology LLC and/or its Affiliates
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
  <div class="main-container">
    <v-row>
      <v-col>
        <v-text-field
          type="text"
          placeholder="Search"
          outlined
          class="primary-field"
          color="csmprimary"
          append-icon="mdi-magnify"
          v-model="primarySearch"
          @keyup.enter="primaryAction"
          @click:append="primaryAction"
          dense
        ></v-text-field>
      </v-col>
      <v-col class="pl-0">
        <v-btn
          icon
          color="primary"
          class="mt-1"
          v-if="advanceSearchActive"
          @click="toggleAdvanceSearch"
        >
          <img src="@/assets/icons/filter-new.svg" alt />
        </v-btn>
      </v-col>
    </v-row>

    <v-expand-transition v-if="advanceSearchActive">
      <v-card v-show="expand" hover class="mx-auto advance-search-container">
        <div
          v-for="row in config.advanceForm"
          :key="row.name"
          class="advance-form-container"
        >
          <v-container class="py-0">
            <v-row>
              <v-col
                cols="4"
                class="py-0"
                style="height: 3rem"
                align-self="center"
              >
                <label class="field-label" :for="row.name">
                  <b>
                    {{ row.label }}
                    <span v-if="row.required">*</span>
                  </b>
                </label>
              </v-col>
              <v-col cols="8" class="pa-0">
                <!-- textbox -->
                <template v-if="row.type == 'textbox'">
                  <v-text-field
                    :name="row.name"
                    :placeholder="row.placeholder"
                    v-model="row.value"
                    outlined
                    dense
                  ></v-text-field>
                </template>
                <!-- dropdown -->
                <template v-if="row.type == 'dropdown'">
                  <SgtDropdown
                    :placeholder="row.placeholder"
                    :dropdownOptions="row.options"
                    v-model="row.value"
                  />
                </template>
                <!-- radio -->
                <template v-if="row.type == 'radio'">
                  <v-radio-group v-model="row.value" row class="mt-0">
                    <v-radio
                      v-for="radio in row.options"
                      :key="radio.value"
                      :label="radio.label"
                      :value="radio.value"
                    ></v-radio>
                  </v-radio-group>
                </template>
                <!-- date -->
                <template v-if="row.type == 'date'">
                  <v-menu ref="menu" v-model="menu">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="row.value"
                        :name="row.name"
                        color="green"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        class="pt-0"
                        outlined
                        dense
                      >
                        <template v-slot:append>
                          <v-icon color="primary"
                            >mdi-calendar-month-outline</v-icon
                          >
                        </template>
                      </v-text-field>
                    </template>
                    <v-date-picker
                      color="csmprimary"
                      v-model="row.value"
                    ></v-date-picker>
                  </v-menu>
                </template>
                <!-- checkbox -->
                <template v-if="row.type == 'checkbox'">
                  <v-row>
                    <v-checkbox
                      v-model="row.value"
                      v-for="checkbox in row.options"
                      :key="checkbox.value"
                      :label="checkbox.label"
                      :value="checkbox.value"
                    ></v-checkbox>
                  </v-row>
                </template>
              </v-col>
            </v-row>
          </v-container>
        </div>
        <div class="btn-container pr-3">
          <v-btn color="csmprimary" class="clear-btn" @click="clearAll" outlined
            >Clear</v-btn
          >
          <v-btn color="csmprimary" class="search-btn" @click="search" dark
            >Search</v-btn
          >
        </div>
      </v-card>
    </v-expand-transition>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Ref, Prop } from "vue-property-decorator";
import { SgtAdvanceSearchConfig } from "./SgtAdvanceSearch.model";
import { SgtFilterObject } from "../SgtChips/SgtFilterObject.model";
import SgtDropdown from "../SgtDropdown/SgtDropdown.vue";
@Component({
  name: "SgtAdvanceSearch",
  components: { SgtDropdown },
})
export default class SgtAdvanceSearch extends Vue {
  @Prop({ required: true }) private config: SgtAdvanceSearchConfig;

  private expand = false;
  private advanceSearchActive = false;
  private menu = false;
  private primarySearch = "";
  private searchList: SgtFilterObject[] = [];

  mounted() {
    if (this.config.advanceForm && this.config.advanceForm.length > 0) {
      this.advanceSearchActive = true;
    }
  }

  /**
   * toggle button click
   * reset the primary search box when opening.
   * reset back the filters to existing applied filter when closing.
   */
  toggleAdvanceSearch() {
    if (this.expand) {
      this.config.advanceForm?.forEach((ele) => {
        const selectedElement = this.searchList.find(
          (el) => el.name == ele.name
        );
        if (selectedElement) ele.value = selectedElement.value;
        else ele.value = undefined;
      });
    }
    this.expand = !this.expand;
    if (this.expand && this.primarySearch) this.primarySearch = "";
  }

  /**
   * Search on primary or any search.
   */
  primaryAction() {
    this.searchList = [];
    if (this.primarySearch && this.primarySearch.trim()) {
      this.searchList.push({
        name: "primary",
        value: this.primarySearch.trim(),
        label: "primary",
        required: false,
      });
    }
    this.config.advanceForm?.forEach((ele) => {
      if (ele.required) {
        this.searchList.push({
          name: ele.name,
          value: ele.value,
          label: ele.label,
          required: ele.required,
        });
      } else ele.value = undefined;
    });
    this.$emit("filter-click", this.searchList);
  }

  /**
   * Advance search action button
   */
  search() {
    this.expand = !this.expand;
    this.emitSearch();
  }

  /**
   * Clear search action button
   */
  clearAll() {
    this.config.advanceForm?.forEach((ele) => {
      if (!ele.required) ele.value = undefined;
    });
  }

  /**
   * Emit the search Event.
   * filter and map the search result to emit it in defined format.
   */
  emitSearch() {
    this.searchList = [];
    this.config.advanceForm?.forEach((ele) => {
      if (ele.value) {
        this.searchList.push({
          name: ele.name,
          value: ele.value,
          label: ele.label,
          required: ele.required,
        });
      }
    });
    this.$emit("filter-click", this.searchList);
  }
}
</script>
<style lang="scss" scoped>
.main-container {
  position: relative;
  width: 400px;
}
.primary-field {
  height: 40px;
  width: 300px;
}
.advance-search-container {
  position: absolute;
  z-index: 99;
  padding: 15px 0;
  margin-top: 0.5rem;
  border-radius: 5px;
  border: 1px solid #6ebe49;
  width: 30rem;
  max-width: 700px;
  box-shadow: none !important;

  .field-label {
    white-space: nowrap;
  }

  .advance-form-container {
    padding: 15px 15px 0 0;
  }
}
.btn-container {
  display: flex;
  justify-content: flex-end;
  .search-btn {
    margin-left: 10px;
  }
}
</style>
