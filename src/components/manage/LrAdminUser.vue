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
  <div class="title-container">
    <span class="title-label">User Settings</span>
    <SgtIButton>
      <div class="i-content">
        <div>
          <p class="section-title">User Settings: Local</p>
          <p class="description">
            Manage users. Depending on the user role, you can create, modify,
            and delete users. You can also change the password for the admin
            user. A role is a collection of permissions granted to a user.
          </p>
        </div>
        <div>
          <p class="section-title">Note:</p>
          <p class="description">
            Only admin user can create and delete users and change the password
            of the admin user.
          </p>
        </div>
      </div>
    </SgtIButton>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SgtIButton from "../shared/SgtIButton.vue";

@Component({
  name: "LrAdminUser",
  components: {
    SgtIButton,
  },
})
export default class LrAdminUser extends Vue {}
</script>

<style lang="scss" scoped>
.title-container {
  margin: 1em 0;
  display: flex;
  align-items: center;
  gap: 5px;

  .title-label {
    font-weight: bold;
  }
}

.i-content {
  display: flex;
  flex-direction: column;
  gap: 15px;

  p {
    margin: 0;
  }
  .section-title {
    font-weight: bold;
  }
}
</style>
