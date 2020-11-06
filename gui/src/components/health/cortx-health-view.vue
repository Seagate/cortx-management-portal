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
import { linkHorizontal } from "d3";

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
  
  // public treeIcon = require("./../../assets/info-alert-green.svg");
  public data() {
    return {
      alertStatus: require("./../../common/const-string.json"),
      name: this.$route.query.name,
      isHidden: true,
    };
  }

  
  public async mounted() {
   
  // public treeIcon = require("./../../assets/info-alert-green.png");
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

// Set the dimensions and margins of the diagram
var margin = {top: 20, right: 90, bottom: 30, left: 90},
width = 1800 - margin.left - margin.right,
height = 1000 - margin.top - margin.bottom;

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#treeContainer").append("svg")
.attr("width", width + margin.right + margin.left)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate("
      + margin.left + "," + margin.top + ")");

var i = 0,
duration = 750,
root;

// declares a tree layout and assigns the size
var treemap = d3.tree().size([height, width]);

// Assigns parent, children, height, depth
root = d3.hierarchy(treeData, function(d: any) { return d.children; });
console.log(root);
root.x0 = height / 2;
root.y0 = 0;

// Collapse after the second level
root.children.forEach(collapse);

update(root);

// Collapse the node and all it's children
function collapse(d: any) {
if(d.children) {
d._children = d.children
d._children.forEach(collapse)
d.children = null
}
}

function update(source) {

// Assigns the x and y position for the nodes
var treeData = treemap(root);

// Compute the new tree layout.
var nodes = treeData.descendants(),
  links = treeData.descendants().slice(1);

// Normalize for fixed-depth.
nodes.forEach(function(d: any){ d.y = d.depth * 180});

// ****************** Nodes section ***************************

// Update the nodes...
var node = svg.selectAll('g.node')
  .data(nodes, function(d: any) {return d.id || (d.id = ++i); });

// Enter any new modes at the parent's previous position.
var nodeEnter = node.enter().append('g')
  .attr('class', 'node')
  .attr("transform", function(d: any) {
    return "translate(" + source.y0 + "," + source.x0 + ")";
})
.on('click', click);

// Add Circle for the nodes
nodeEnter
//   .append('circle')
//   .attr('class', 'node')
//   .attr('r', 1e-6)
//   .style("fill", function(d: any) {
//       return d._children ? "lightsteelblue" : "#fff";
//   })
  .append("image")
  .attr('class', 'node')
  .attr("xlink:href", "/img/acknowledge-default.be6686ad.svg")
  .attr("x", "-20px")
  .attr("y", "-20px")
  .attr("width", "40px")
  .attr("height", "40px");;

// Add labels for the nodes
nodeEnter.append('text')
  .attr("dy", ".35em")
  .attr("x", function(d: any) {
      return d.children || d._children ? -13 : 13;
  })
  .attr("text-anchor", function(d: any) {
      return d.children || d._children ? "end" : "start";
  })
  .text(function(d: any) { return d.data.name; });

// UPDATE
var nodeUpdate = nodeEnter.merge(node);

// Transition to the proper position for the node
nodeUpdate.transition()
.duration(duration)
.attr("transform", function(d: any) { 
    return "translate(" + d.y + "," + d.x + ")";
 });

// Update the node attributes and style
nodeUpdate.select('image.node')
.attr('r', 10)
.style("fill", function(d: any) {
    return d._children ? "lightsteelblue" : "#fff";
})
.attr('cursor', 'pointer');


// Remove any exiting nodes
var nodeExit = node.exit().transition()
  .duration(duration)
  .attr("transform", function(d: any) {
      return "translate(" + source.y + "," + source.x + ")";
  })
  .remove();

// On exit reduce the node circles size to 0
nodeExit.select('circle')
.attr('r', 1e-6);

// On exit reduce the opacity of text labels
nodeExit.select('text')
.style('fill-opacity', 1e-6);

// ****************** links section ***************************

// Update the links...
var link = svg.selectAll('path.link')
  .data(links, function(d: any) { return d.id; });
  console.log(link);

// Enter any new links at the parent's previous position.
var linkEnter = link.enter().insert('path', "g")
  .attr("class", "link")
  .attr('d', function(d: any){
    var o = {x: source.x0, y: source.y0}
    return diagonal(o, o)
  });

// UPDATE
var linkUpdate = linkEnter.merge(link);

// Transition back to the parent element position
linkUpdate.transition()
  .duration(duration)
  .attr('d', function(d: any){ return diagonal(d, d.parent) });

// Remove any exiting links
var linkExit = link.exit().transition()
  .duration(duration)
  .attr('d', function(d: any) {
    var o = {x: source.x, y: source.y}
    return diagonal(o, o)
  })
  .remove();

// Store the old positions for transition.
nodes.forEach(function(d: any){
d.x0 = d.x;
d.y0 = d.y;
});

var path;
// Creates a curved (diagonal) path from parent to the child nodes
function diagonal(s: any, d: any) {

path = `M ${s.y} ${s.x}
        C ${(s.y + d.y) / 2} ${s.x},
          ${(s.y + d.y) / 2} ${d.x},
          ${d.y} ${d.x}`

console.log(path);

return path
}

// Toggle children on click.
function click(d: any) {
if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
update(d);
}
}
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
