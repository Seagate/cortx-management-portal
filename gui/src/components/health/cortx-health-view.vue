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
  <div class="pa-5">
    <div class="cortx-text-lg cortx-text-bold pr-2">Health View Test
      <button style="{ float: right; border: 1px solid blue; font-size: 12px; background-color: #eee; padding: 5px 15px; color: #6ebe49; }" onclick="isHidden = false">Show Tree</button>
    </div>
    <div>
      <div class="cortx-health-summary-container">
        <div class="cortx-text-lg cortx-float-l cortx-text-bold">{{componentName}}</div>
        <div
          class="cortx-summary-chip cortx-float-l cortx-chip-ok ml-2"
          v-if="healthSummary.good && healthSummary.good > 0"
        >
          <div class="summary-count">
            <label
              class="cortx-text-sm"
            >{{ healthSummary.good?healthSummary.good:0 }}</label>
          </div>
        </div>
        <div
          class="cortx-summary-chip cortx-float-l cortx-chip-warning ml-2"
          v-if="healthSummary.warning && healthSummary.warning > 0">
          <div class="summary-count">
            <label
              class="cortx-text-sm"
            >{{ healthSummary.warning?healthSummary.warning:0 }}</label>
          </div>
        </div>
        <div
          class="cortx-summary-chip cortx-float-l cortx-chip-alert ml-2"
          v-if="healthSummary.critical && healthSummary.critical > 0"
        >
          <div class="summary-count">
            <label
              class="cortx-text-sm"
            >{{ healthSummary.critical?healthSummary.critical:0 }}</label>
          </div>
        </div>
      </div>
    </div>
    <div id="treeContainer"></div>
    <v-data-table
      calculate-widths
      :items="healthComponentData"
      item-key="component_id"
      class="cortx-table"
      hide-default-header
      id="tblHealthLarge"
      :items-per-page.sync="itemsPerPage"
      :footer-props="{
        'items-per-page-options': [50, 100, 150, 200]
      }"
    >
      <template v-slot:header="{}">
        <tr>
          <th
            v-for="header in alertTableHeaders"
            :key="header.text"
            :class="[
              'tableheader',
              header.sortable ? 'cortx-cursor-pointer' : ''
            ]"
          >
            <span>{{ header.text }}</span>
          </th>
          <th class="tableheader">Action</th>
        </tr>
      </template>
      <template v-slot:item="props">
        <tr style="color: #000000;">
          <td>{{props.item.component_id}}</td>
          <td>
            <div
              v-if="
               props.item.health === 'OK' || props.item.health === 'NA'
              "
              class="cortx-status-chip cortx-chip-ok"
              v-bind:title="props.item.health"
            ></div>
            <div
              v-else-if="
                props.item.severity === alertStatus.informational ||
                  props.item.severity === 'NA' || props.item.severity === ''
              "
              class="cortx-status-chip cortx-chip-warning"
              title="warning"
            ></div>
            <div
              v-else-if="
                props.item.severity === alertStatus.critical ||
                  props.item.severity === alertStatus.error
              "
              class="cortx-status-chip cortx-chip-alert"
              v-bind:title="props.item.severity"
            ></div>
            <div
              v-else-if="props.item.severity === alertStatus.warning"
              class="cortx-status-chip cortx-chip-warning"
              v-bind:title="props.item.severity"
            ></div>

          </td>
          <td v-if="props.item.alert_uuid !== 'NA' && props.item.health !== 'OK' && props.item.health !== 'NA'">
            <img
             id="healthview-zoomicon"
              :src="require('@/assets/zoom-in.svg')"
              class="cortx-cursor-pointer"
              @click="$router.push(`/alerts/${props.item.alert_uuid}`)"
            />
           </td>
           <td v-else>NA</td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Api } from "./../../services/api";
import apiRegister from "./../../services/api-register";
import { HealthSummary } from "../../models/system";
import i18n from "../../i18n";
import * as d3 from "d3";

@Component({
  name: "cortx-health-view"
})
export default class CortxHealthView extends Vue {
  public alertTableHeaders: any = [
    {
      text: "Component Id",
      value: "component_id",
      sortable: true
    },
    {
      text: "Health",
      value: "health",
      sortable: true
    }
  ];
  public healthComponentData = [];
  public itemsPerPage: number = 100;
  public currentPage: number = 1;
  public healthSummary: HealthSummary = {
    good: 0,
    fault: 0,
    degraded: 0,
    total: 0,
    unrecoverable: 0,
    critical: 0
  };
  
  // public treeIcon = require("./../../assets/nodes.PNG");
  public data() {
    return {
      alertStatus: require("./../../common/const-string.json"),
      name: this.$route.query.name,
      isHidden: true,
    };
  }

  
  public async mounted() {
    
  // var treeIcon = require("./../../assets/nodes.PNG");
    //  Tree Code
var treeData =
  {
    "name": "cluster",
    // "icon": require("./../../../assets/nodes.PNG"),
    "children": [
      {
        "name": "sites",
       // "icon": require("./../../../assets/nodes.PNG"),
        "children": [
          {
            "name": "rack",
            // "icon": require("./../../../assets/nodes.PNG"),
            "children": [
                {
                    "name": "nodes",
                    // "icon": require("./../../../assets/nodes.PNG"),
                    "children": [
                        {
                            "name": "storage_encl",
                            // "icon": require("./../../../assets/nodes.PNG"),
                            "children": [
                                {
                                    "name": "hw",
                                    // "icon": require("./../../../assets/nodes.PNG"),
                                    "children": [
                                        {
                                            "name": "fru",
                                            // "icon": require("./../../../assets/nodes.PNG"),
                                            "children": [
                                                {
                                                    "name": "disks",
                                                    // "icon": require("./../../../assets/nodes.PNG"),
                                                },
                                                {
                                                    "name": "psus",
                                                    // "icon": require("./../../../assets/nodes.PNG"),
                                                },
                                                {
                                                    "name": "controllers",
                                                    // "icon": require("./../../../assets/nodes.PNG"),
                                                },
                                                {
                                                    "name": "fans",
                                                    // "icon": require("./../../../assets/nodes.PNG"),
                                                },
                                                {
                                                    "name": "sideplane_expander",
                                                    // "icon": require("./../../../assets/nodes.PNG"),
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "name": "sw",
                                    // "icon": require("./../../../assets/nodes.PNG"),
                                    "children": [
                                        {
                                            "name": "logical_volume",
                                            // "icon": require("./../../../assets/nodes.PNG"),
                                        }
                                    ]
                                },
                                {
                                    "name": "interfaces",
                                    // "icon": require("./../../../assets/nodes.PNG"),
                                    "children": [
                                        {
                                            "name": "sas_port",
                                            // "icon": require("./../../../assets/nodes.PNG"),
                                        }
                                    ]
                                },
                                {
                                    "name": "platform_sensors",
                                    // "icon": require("./../../../assets/nodes.PNG"),
                                    "children": [
                                        {
                                            "name": "current",
                                            // "icon": require("./../../../assets/nodes.PNG"),
                                        },
                                        {
                                            "name": "temperature",
                                            // "icon": require("./../../../assets/nodes.PNG"),
                                        },
                                        {
                                            "name": "voltage",
                                            // "icon": require("./../../../assets/nodes.PNG"),
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "name": "node:smc21-m10.colo.seagate.com",
                            // "icon": require("./../../../assets/nodes.PNG"),
                            "children": [
                                {
                                    "name": "hw",
                                    // "icon": require("./../../../assets/nodes.PNG"),
                                    "children": [
                                        {
                                            "name": "fru",
                                            // "icon": require("./../../../assets/nodes.PNG"),
                                            "children": [
                                                {
                                                    "name": "fans",
                                                    // "icon": require("./../../../assets/nodes.PNG"),
                                                },
                                                {
                                                    "name": "psus",
                                                    // "icon": require("./../../../assets/nodes.PNG"),
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "name": "os",
                                    // "icon": require("./../../../assets/nodes.PNG"),
                                    "children": [
                                        {
                                            "name": "cortx_sw",
                                            // "icon": require("./../../../assets/nodes.PNG"),
                                        },
                                        {
                                            "name": "operating_system",
                                            // "icon": require("./../../../assets/nodes.PNG"),
                                        }
                                    ]
                                },
                                {
                                    "name": "interfaces",
                                    // "icon": require("./../../../assets/nodes.PNG"),
                                    "children": [
                                        {
                                            "name": "sas_port",
                                            // "icon": require("./../../../assets/nodes.PNG"),
                                        }
                                    ]
                                },
                                {
                                    "name": "platform_sensors",
                                    // "icon": require("./../../../assets/nodes.PNG"),
                                    "children": [
                                        {
                                            "name": "temperature",
                                            // "icon": require("./../../../assets/nodes.PNG"),
                                            "children": [
                                                {
                                                    "name": "node:sensor:temperature-CPU1 Temp",
                                                    // "icon": require("./../../../assets/nodes.PNG"),
                                                },
                                                {
                                                    "name": "node:sensor:temperature-CPU2 Temp",
                                                    // "icon": require("./../../../assets/nodes.PNG"),
                                                },
                                                {
                                                    "name": "node:sensor:temperature-PCH Temp",
                                                    // "icon": require("./../../../assets/nodes.PNG"),
                                                },
                                                {
                                                    "name": "node:sensor:temperature-System Temp",
                                                    // "icon": require("./../../../assets/nodes.PNG"),
                                                },
                                                {
                                                    "name": "node:sensor:temperature-Peripheral Temp",
                                                    // "icon": require("./../../../assets/nodes.PNG"),
                                                },
                                                {
                                                    "name": "node:sensor:temperature-MB_NIC Temp",
                                                    // "icon": require("./../../../assets/nodes.PNG"),
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]

                        }
                    ]
                }
            ]
          }
        ]
      }
    ]
  };


// set the dimensions and margins of the diagram
var margin = {top: 120, right: 100, bottom: 50, left: 150},
    width = 1000 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

// declares a tree layout and assigns the size
var treemap = d3.tree()
    .size([height, width]);

//  assigns the data to a hierarchy using parent-child relationships
var nodes = d3.hierarchy(treeData, function(d) {
    return d.children;
  });

// maps the node data to the tree layout
nodes = treemap(nodes);

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#treeContainer").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom),
    g = svg.append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

// adds the links between the nodes
var link = g.selectAll(".link")
    .data( nodes.descendants().slice(1))
  .enter().append("path")
    .attr("class", "link")
    .style("fill", "none")
    .style("stroke", "black")
    .attr("d", function(d) {
       return "M" + d.y + "," + d.x
         + "C" + (d.y + d.parent.y) / 2 + "," + d.x
         + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
         + " " + d.parent.y + "," + d.parent.x;
       });

// adds each node as a group
var node = g.selectAll(".node")
    .data(nodes.descendants())
  .enter().append("g")
    .attr("class", function(d) { 
      return "node" + 
        (d.children ? " node--internal" : " node--leaf"); })
    .attr("transform", function(d) { 
      return "translate(" + d.y + "," + d.x + ")"; });

// adds images as nodes
node.append("image")
  .attr("xlink:href", "")
  .attr("x", "-12px")
  .attr("y", "-12px")
  .attr("width", "24px")
  .attr("height", "24px");

// adds the text to the node
node.append("text")
  .attr("dy", ".35em")
  .attr("x", function(d) { return d.children ? -13 : 13; })
  .style("text-anchor", function(d) { 
    return d.children ? "end" : "start"; })
  .text(function(d) { return d.data.name; });

    // tree Code

    this.$store.dispatch("systemConfig/showLoaderMessage", {
      show: true,
      message: "Getting health info..."
    });
    const enclosureName = this.$route.query.name
      ? this.$route.query.name
      : "";
    const res = await Api.getAll(apiRegister.health_components, {
      node_id: enclosureName
    });
    if (res && res.data) {
      this.healthComponentData = res.data[0][Object.keys(res.data[0])[0]].components;
      this.healthSummary =
        res.data[0][Object.keys(res.data[0])[0]].health_summary;
      this.healthComponentData.sort((a: any, b: any) => {
        let result = 0;
        const fa = a.health.toLowerCase();
        const fb = b.health.toLowerCase();

        if (fa < fb) {
          result = -1;
        }
        if (fa > fb) {
          result = 1;
        }
        return result;
      });
    }
    this.$store.dispatch("systemConfig/hideLoader");
  }

  get componentName() {
    let compName: any = "";
    if (this.$route.query.name) {
      compName = this.$route.query.name === "storage_encl"
                  ? i18n.t("health.storage_encl")
                  : this.$route.query.name;
    }
    return compName;
  }
}
</script>
<style lang="scss">
.cortx-health-summary-container {
  height: 1.875em;
}
.cortx-health-summary-container {
  height: 1.875em;
}
.cortx-summary-chip {
  display: flex;
  min-height: 16px;
  min-width: 16px;
  border-radius: 2px;
  line-height: 1;
  text-align: center;
  color: #ffffff;
  padding: 3px;
  border-radius: 34px;
  .summary-label {
    padding: 2px 3px 3px 5px;
  }
  .summary-count {
    border: 2px solid #ffffff;
    border-radius: 34px;
    line-height: 1;
    padding: 0 3px 3px 3px;
    //margin-left: 8px;
    min-width: 33px;
  }
}
</style>
