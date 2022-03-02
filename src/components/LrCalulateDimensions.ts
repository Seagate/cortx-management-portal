/**
 * CORTX-CSM: CORTX Management web and CLI interface.
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
 * please email opensource@seagate.com or cortx-questions@seagate.com.
 */
import store from "../store/index";

export default class LrCalulateDimensions {
  public static populateDimensions() {
    const dimensions = this.calculateDimensions();
    store.commit("dimensions/setDimensions", dimensions);
  }

  public static calculateDimensions() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const headerHeight = 50;
    const headerWidth = windowWidth;
    const navBarHeight = windowHeight - headerHeight;
    const navBarWidth = 60;

    return {
      window: {
        height: windowHeight,
        width: windowWidth,
      },
      mainLayout: {
        headerBar: {
          height: headerHeight,
          width: headerWidth,
        },
        navBar: {
          height: navBarHeight,
          width: navBarWidth,
        },
        content: {
          height: navBarHeight,
          width: windowWidth - navBarWidth,
        },
      },
    };
  }
}
