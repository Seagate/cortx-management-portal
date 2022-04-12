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
  <ClickOutsideHOC @clicked-outside="isMenuOpen = false">
    <div class="lr-header-dropdown" @click="isMenuOpen = !isMenuOpen">
      <label class="username-label">{{ username }}</label>
      <img :src="require('@/assets/icons/user-icon.svg')" id="logout-icon" />
      <ul class="lr-dropdown-menu" v-show="isMenuOpen">
        <li class="lr-dropdown-menu-item">
          <div
            class="lr-text-md lr-dropdown-menu-item-text"
            @click="openChangePassword()"
          >
            {{ $t("change-password") }}
          </div>
        </li>
        <li class="lr-dropdown-menu-item" @click="logout()" id="logout-link">
          <div class="lr-text-md lr-dropdown-menu-item-text">
            {{ $t("logout") }}
          </div>
        </li>
      </ul>
    </div>
  </ClickOutsideHOC>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import ClickOutsideHOC from "@/lib/components/ClickOutsideHOC.vue";

@Component({
  name: "LrHeaderDropdown",
  components: { ClickOutsideHOC },
})
export default class LrHeaderDropdown extends Vue {
  public username = "Admin";
  public isMenuOpen = false;

  get isRouterPathOnboarding() {
    return this.$route.name === "onboarding";
  }

  public openChangePassword() {
    console.log("change password");
  }

  public logout() {
    console.log("logout");
  }
}
</script>

<style lang="scss" scoped>
.lr-header-dropdown {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5em;
  cursor: pointer;

  .username-label {
    cursor: pointer;
  }

  .lr-dropdown-menu {
    padding: 0;
    max-height: 188px;
    overflow: auto;
    background: #ffffff;
    box-shadow: 8px 6px 8px rgba(0, 0, 0, 0.12);
    border: 1px solid #6ebe49;
    border-radius: 4px;
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    z-index: 4;
    white-space: nowrap;

    .lr-dropdown-menu-item {
      padding: 0.5em 1em;
      width: 100%;

      &:hover,
      &.selected {
        background: #f5f5f5;
      }

      & [disabled] {
        cursor: not-allowed;
      }
    }
  }
}

.dropdown-icon {
  transition: transform 150ms ease-in-out;
  &.dropdown-active {
    transform: rotate(180deg);
  }
}
</style>
