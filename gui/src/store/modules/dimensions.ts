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
import Vue from "vue";
import Vuex from "vuex";
import { Module, VuexModule, Mutation } from "vuex-module-decorators";

Vue.use(Vuex);

@Module({
    namespaced: true
})
export default class Dimensions extends VuexModule {

    public dimensions: any = {
        window: {
            height: 0,
            width: 0
        },
        mainLayout: {
            headerBar: {
                height: 0,
                width: 0
            },
            navBar: {
                height: 0,
                width: 0
            },
            content: {
                height: 0,
                width: 0
            }
        }
    };

    get getWindowDimension() {
        return this.dimensions.window;
    }

    get getHeaderBarDimension() {
        return this.dimensions.mainLayout.headerBar;
    }

    get getNavBarDimension() {
        return this.dimensions.mainLayout.navBar;
    }

    get getContentDimension() {
        return this.dimensions.mainLayout.content;
    }

    @Mutation
    public setDimensions(dimensions: any) {
      this.dimensions = dimensions;
    }
}
