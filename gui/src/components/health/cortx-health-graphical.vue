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
  <div>

    <div id="treeContainer"></div>

    <cortx-confirmation-dialog
      :show="showConfirmationDialog"
      title="Confirmation"
      :message="warningMessage"
      severity="warning"
      @closeDialog="closeConfirmationDialog"
      id="check-status-conirmationbox"
    ></cortx-confirmation-dialog>

    <cortx-confirmation-dialog
      :show="showWarningDialog"
      title="Warning"
      :message="warningMessage"
      severity="warning"
      @closeDialog="closeWarningDialog"
      id="warning-conirmationbox"
    ></cortx-confirmation-dialog>

    <cortx-confirmation-dialog
      :show="showSuccessDialog"
      title="Success"
      :message="successMessage"
      severity="success"
      @closeDialog="closeSuccessDialog"
      id="success-conirmationbox"
    ></cortx-confirmation-dialog>

  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
import * as d3 from "d3";
import * as moment from "moment";

@Component({
  name: "cortx-health-graphical"
})
export default class CortxHealthGraphical extends Vue {
  public clusterHealthData: any = {};
  public svg: any;
  public margin: any = { top: 150, right: 20, bottom: 20, left: 200 };
  public width: number = window.innerWidth;
  public height: number = window.innerHeight;
  public root: any;
  public treemap: any;
  public duration: number = 750;
  public showActionLinks: boolean = false;
  public currentAction: string = "";
  public showConfirmationDialog: boolean = false;
  public showWarningDialog: boolean = false;
  public showSuccessDialog: boolean = false;
  public successMessage: string = "";
  public currentNode: any;
  public warningMessage: string = "";

  public async mounted() {
    await this.getHealthData();
  }

  public async getHealthData() {
    const healthQueryParams = {
      depth: 0
    };
    this.$store.dispatch("systemConfig/showLoader", "Fetching health...");
    const res = await Api.getAll(apiRegister.health_cluster, healthQueryParams);
    this.clusterHealthData = res.data.data[0];
    this.$store.dispatch("systemConfig/hideLoader");
    this.plotTree();
  }

  public plotTree() {
    this.svg = d3
      .select("#treeContainer")
      .append("svg")
      .attr("width", this.width - this.margin.left - this.margin.right)
      .attr("height", this.height - this.margin.top - this.margin.bottom)
      .style("overflow-y", "auto")
      .append("g")
      .attr("transform", `translate( 0, 0 )`);
    this.treemap = d3.tree().size([this.height, this.width]);
    this.root = d3.hierarchy(this.clusterHealthData, (d: any) => {
      return d.sub_resources;
    });
    this.root.x0 = 0;
    this.root.y0 = 0;    
    this.root.children.forEach(this.collapse);    
    this.update(this.root);
  }
  
  public collapse(d: any) {
    if (d.children && d.depth > 2) {
      d._children = d.children;
      d._children.forEach(this.collapse);
      d.children = null;
    } else if (d.children) {
      d.children.forEach(this.collapse);
    }
  }

  public update(source: any) {
    const treeData = this.treemap(this.root);
    const nodes = treeData.descendants(),
      links = treeData.descendants().slice(1);
    nodes.forEach((d: any) => {
      d.y = d.depth * 300;
    });
    let i = 0;
    
    this.drawNodes(nodes, source);

    this.drawLinks(links, nodes, source);
  }

  public drawNodes(nodes: any, source: any) {
    let i = 0;
    const node: any = this.svg.selectAll("g.node").data(nodes, (d: any) => {
      return d.id || (d.id = ++i);
    });
    const nodeEnter = node
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d: any) => {
        return `translate( ${source.y0} , ${source.x0} )`;
      });

    this.drawCard(nodeEnter, nodes, node, source);
  }

  public drawCard(nodeEnter: any, nodes: any, node: any, source: any) {
    nodeEnter
      .append("rect")
      .attr("width", "188")
      .attr("height", "90")
      .attr("rx", 5)
      .style("fill", "#fff")
      .style("stroke", this.color)
      .style("stroke-width", 1);
    nodeEnter
      .append("foreignObject")
      .attr("x", 10)
      .attr("y", 7.5)
      .attr("width", 90)
      .attr("height", 20)
      .append("xhtml:body")
      .html((d: any) => {
        return `<span style="padding: 2px 10px; background-color: ${this.color(d)}; border-radius: 7px;color: #fff;font-size: 10px;float: left;text-transform: uppercase;"
              >${d.data.status}</span>`
      });
    nodeEnter
      .append("image")
      .attr("id", (d: any) => {
        return `show${d.id}${d.depth}`;
      })
      .attr("xlink:href", (d: any) => {
        if(this.isNodeCluster(d)) return require("@/assets/action-icon.svg/");
      })
      .attr("x", 168)
      .attr("y", 7.5)
      .attr("width", 10)
      .attr("height", 20)
      .style("cursor", "pointer")
      .on("click", this.showActions)
    nodeEnter
      .append("image")
      .attr("id", (d: any) => {
        return `hide${d.id}${d.depth}`;
      })
      .attr("xlink:href", (d: any) => {
        if(this.isNodeCluster(d)) return require("@/assets/action-icon.svg/");
      })
      .attr("x", 168)
      .attr("y", 7.5)
      .attr("width", 10)
      .attr("height", 20)
      .style("cursor", "pointer")
      .style("visibility", "hidden")
      .on("click", this.hideActions)
    nodeEnter
      .append("image")
      .attr("id", (d: any) => {
        return `showInfo${d.id}${d.depth}`;
      })
      .attr("xlink:href", require("@/assets/info-icon.svg/"))
      .attr("x", (d: any) => {
        if(this.isNodeCluster(d)) return 148; else return 168;
      })
      .attr("y", 10)
      .attr("width", 15)
      .attr("height", 15)
      .style("cursor", "pointer")
      .on("click", this.showInfo)
    nodeEnter
      .append("image")
      .attr("id", (d: any) => {
        return `hideInfo${d.id}${d.depth}`;
      })
      .attr("xlink:href", require("@/assets/info-icon.svg/"))
      .attr("x", (d: any) => {
        if(this.isNodeCluster(d)) return 148; else return 168;
      })
      .attr("y", 10)
      .attr("width", 15)
      .attr("height", 15)
      .style("cursor", "pointer")
      .style("visibility", "hidden")
      .on("click", this.hideInfo)
    nodeEnter
      .append("line")
      .attr("x1", "0px")
      .attr("x2", (d: any) => {if (this.isLeafNode(d)) return 208; else return 188;})
      .attr("y2", 35)
      .attr("y1", 35)
      .attr("stroke", this.color);
    nodeEnter
      .append("circle")
      .attr("cx", 218)
      .attr("cy", 35)
      .attr("r", (d: any) => {if (this.isLeafNode(d)) return 10; else return 0;})
      .style("fill", "none")
      .style("stroke", "#6EBE49")
      .style("stroke-width", 1)
      .style("cursor", "pointer");
    nodeEnter
      .append("foreignObject")
      .attr("x", 0)
      .attr("y", 35)
      .attr("width", 188)
      .attr("height", 55)
      .append("xhtml:body")
      .html((d: any) => {
        return `<div style="padding: 7px 10px;">
              <img src=${this.imageLink(d)}
                style="float: left;width: 35px;height: 35px; margin-right: 10px;"/>
              <p style="float: left; margin: 0; font-size: 14px; font-weight: bold;" >
                <span style="display: block;">${d.data.resource}</span>
                <span>${d.data.id}</span>
              </p>
            </div>`
      });
    nodeEnter
      .append("text")
      .attr("class", "node-text")
      .attr("y", 40)
      .attr("x", (d: any) => {
        return d._children ? "213.5" : "215";
      })
      .text((d: any) => {
        if (this.isLeafNode(d)) return d._children ? "+" : "-"; else return "";
      })
      .style("cursor", "pointer")
      .on("click", this.expandCollpase);

    this.nodeUpdate(nodeEnter, node, source);
  }

  public nodeUpdate(nodeEnter: any, node: any, source: any) {
    const nodeUpdate: any = nodeEnter.merge(node);
    nodeUpdate
      .transition()
      .duration(this.duration)
      .attr("transform", (d: any) => {
        return `translate(${d.y} , ${d.x})`;
      });      
    this.nodeExit(node, source);
  }

  public nodeExit(node: any, source: any) {
    const nodeExit = node
      .exit()
      .transition()
      .duration(this.duration)
      .attr("transform", (d: any) => {
        return `translate(${source.y} , ${source.x})`;
      })
      .remove();
    nodeExit
      .select("rect")
      .attr("width", "188")
      .attr("height", "90")
      .attr("stroke-width", 1);
    node
      .select("text.node-text")
      .attr("x", (d: any) => {
        return d._children ? "213.5" : "215";
      })
      .text((d: any) => {
        if (this.isLeafNode(d)) return d._children ? "+" : "-"; else return "";
      });
  }

  public drawLinks(links: any, nodes: any, source: any) {
    const link: any = this.svg.selectAll("path.link").data(links, (d: any) => {
      return d.id;
    });
    const linkEnter = link
      .enter()
      .insert("path", "g")
      .attr("class", "link")
      .attr("d", (d: any) => {
        const o = { x: source.x0, y: source.y0 };
        return this.definePath(o, o);
      })
      .style("fill", "none")
      .style("stroke", "#0832A0")
      .style("stroke-width", "1px")
      .style("stroke-dasharray", "2 2");
      
    const linkUpdate: any = linkEnter.merge(link);
    linkUpdate
      .transition()
      .duration(this.duration)
      .attr("d", (d: any) => {
        return this.definePath(d, d.parent);
      });
    const linkExit = link
      .exit()
      .transition()
      .duration(this.duration)
      .attr("d", (d: any) => {
        const o = { x: source.x, y: source.y };
        return this.definePath(o, o);
      })
      .remove();
    nodes.forEach((d: any) => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  public definePath(s: any, d: any) {
    const path = `M ${s.y} ${s.x + 35}
              L ${d.y + 228} ${d.x + 35}`;
    return path;
  }

  public expandCollpase(d: any) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    this.update(d);
  }

  public showActions(d: any) {
    this.hideInfo(d);
    const addLinks: any = {
      cluster: ['start', 'stop'],
      node: ['start', 'stop', 'poweroff', 'poweroff with storage']
    }
    const graphNode = d;
    const showActionIcon = document.getElementById(`show${d.id}${d.depth}`),
      hideActionIcon = document.getElementById(`hide${d.id}${d.depth}`);
    hideActionIcon!.setAttribute(
      "style",
      "visibility: visible; cursor: pointer"
    );
    showActionIcon!.setAttribute("style", "visibility: hidden");
    let foWidth = 188;
    let foHeight = addLinks[d.data.resource].length * 30;
    let fo = this.svg
      .append("foreignObject")
      .attr("x", d.y)
      .attr("y", d.x + 35)
      .attr("width", foWidth)
      .attr("height", foHeight)
      .attr("class", `action-${d.id}${d.depth}`)
      .style("background-color", "#fff")
      .style("border", `1px solid ${this.color(d)}`)
      .style("border-top", "none")
      .style("border-radius", "0 0 5px 5px")
      .style("box-shadow", "8px 6px 8px rgb(0 0 0 / 20%)")
      .style("font-size", "13px");
    let div = fo
      .append("xhtml:div")
      .append("div")
      .attr("class", "actions");

    addLinks[d.data.resource].forEach((val: string) => {
      const currentAction =  val;
      div
        .append("p")
        .style("margin", 0)
        .style("padding", "5px 10px")
        .style("font-size", "12px")
        .text(`${val} ${d.data.resource}`)
        .style("cursor", "pointer")
        .style("text-transform", "capitalize")
        .on("click", () => {
          this.updateAction(graphNode, currentAction);
        });
    })
  }

  public hideActions(d: any) {    
    const showActionIcon = document.getElementById(`show${d.id}${d.depth}`),
      hideActionIcon = document.getElementById(`hide${d.id}${d.depth}`);
    hideActionIcon!.setAttribute("style", "visibility: hidden");
    showActionIcon!.setAttribute(
      "style",
      "visibility: visible; cursor: pointer"
    );
    this.svg.selectAll(`.action-${d.id}${d.depth}`).remove();
  }

  public showInfo(d: any) {
    this.svg.selectAll(`.action-${d.id}${d.depth}`).remove();
    const showInfoIcon = document.getElementById(`showInfo${d.id}${d.depth}`),
      hideInfoIcon = document.getElementById(`hideInfo${d.id}${d.depth}`);
    hideInfoIcon!.setAttribute(
      "style",
      "visibility: visible; cursor: pointer"
    );
    showInfoIcon!.setAttribute("style", "visibility: hidden");    
    const newDate = new Date(d.data.last_updated_time * 1000);
    const time = moment.default(newDate).format("DD-MM-YYYY hh:mm A");
    const infoData: any = {
      "resource": d.data.resource,
      "id": d.data.id,
      "Time": time
    }
    let foWidth = 188;
    let foHeight = Object.keys(infoData).length * 30;
    let fo = this.svg
      .append("foreignObject")
      .attr("x", d.y)
      .attr("y", d.x + 35)
      .attr("width", foWidth)
      .attr("height", foHeight)
      .attr("class", `info-${d.id}${d.depth}`)
      .style("background-color", "#fff")
      .style("border", `1px solid ${this.color(d)}`)
      .style("border-top", "none")
      .style("border-radius", "0 0 5px 5px")
      .style("box-shadow", "8px 6px 8px rgb(0 0 0 / 20%)")
      .style("font-size", "13px");
    let div = fo
      .append("xhtml:div")
      .append("div")
      .attr("class", "moreinfo");

    for (const property in infoData) {
      div.append("p")
        .text(`${property}: ${infoData[property]}`)
        .style("margin", 0)
        .style("padding", "5px 10px")
        .style("font-size", "12px")
        .style("text-transform", "capitalize")
    }
    
  }

  public hideInfo(d: any) { 
    this.hideActions(d);   
    const showInfoIcon = document.getElementById(`showInfo${d.id}${d.depth}`),
      hideInfoIcon = document.getElementById(`hideInfo${d.id}${d.depth}`);
    hideInfoIcon!.setAttribute("style", "visibility: hidden");
    showInfoIcon!.setAttribute(
      "style",
      "visibility: visible; cursor: pointer"
    );
    this.svg.selectAll(`.info-${d.id}${d.depth}`).remove();
  }

  public updateAction(d: any, currentAction: string) {
    this.currentAction = currentAction;
    this.showConfirmationDialog = true;
    this.currentNode = d;
    this.warningMessage = `Are you sure you want to ${this.currentAction} ${d.data.resource}?`;
  }

  public closeConfirmationDialog(confirmation: boolean) {
    if (confirmation) {
      this.checkStatus(this.currentNode);
    } else {
      this.currentAction = "";
      this.showConfirmationDialog = false;
    }
  }

  public closeWarningDialog(confirmation: boolean) {
    if (confirmation) {
      this.requestForUpdate(this.currentNode);
    } else {
      this.showWarningDialog = false;
    }
  }

  public closeSuccessDialog(confirmation: boolean) {
      this.showSuccessDialog = false;
      this.successMessage = "";
  }

  public async checkStatus(d: any) {
    this.showConfirmationDialog = false;
    this.$store.dispatch(
      "systemConfig/showLoader",
      `Updating ${d.data.resource} status....`
    );
    this.warningMessage = "";
    const res: any = await Api.getAll(apiRegister.cluster_status + "/" + d.data.id);
    if (res.data.status == "WARNING") {
      this.showWarningDialog = true;
      this.warningMessage = res.data.message;
    } else if (res.data.status == "OK") {
      this.requestForUpdate(d);
    }
    this.$store.dispatch("systemConfig/hideLoader");

  }

  public async requestForUpdate(d: any) {
    this.showWarningDialog = false;
    this.warningMessage = "";
    this.$store.dispatch(
      "systemConfig/showLoader",
      `Updating ${d.data.resource} status....`
    );
    this.warningMessage = "";
    const reqBody = {
                      "operation": this.currentAction,
                      "arguments": {
                        "resource_id": d.data.id,
                        "storageoff": false,
                        "force": false
                      }
                    }
    if(this.currentAction === "poweroff with storage") {
      reqBody.operation = "poweroff";
      reqBody.arguments.storageoff = true;
    }
    const res: any = await Api.post(apiRegister.cluster_operation + "/" + d.data.resource, reqBody);
    this.$store.dispatch("systemConfig/hideLoader");
    if(res) {
      this.showSuccessDialog = true;
      this.successMessage = res.message;
    }
  }

  public isLeafNode(d: any) {
    return d.data.sub_resources && d.data.sub_resources.length
  }

  public isNodeCluster(d: any) {
    if (d.data.resource === "cluster" || d.data.resource === "node") {
      return true;
    } else {
      return false;
    }
  }

  public color(d: any) {
    let color = "";
    switch (d.data.status) {
      case "online":
        color = "#6ebe49";
        break;
      case "offline":
        color = "#dc1f2e";
        break;
      case "failed":
        color = "#dc1f2e";
        break;
      case "degraded":
        color = "#f7a528";
        break;
      case "unknown":
        color = "#9e9e9e";
        break;
    }
    return color;
  }

  public imageLink(d: any) {
    let imageLink = "";
    switch (d.data.status) {
      case "online":
        imageLink = require("@/assets/green-icon.svg/");
        break;
      case "offline":
        imageLink = require("@/assets/red-icon.svg/");
        break;
      case "failed":
        imageLink = require("@/assets/red-icon.svg/");
        break;
      case "degraded":
        imageLink = require("@/assets/yellow-icon.svg/");
        break;
      case "unknown":
        imageLink = require("@/assets/grey-icon.svg/");
        break;
    }
    return imageLink;
  }

}
</script>
<style lang="scss" scoped>
#treeContainer {
  width: 100%;
  overflow: auto;
}
</style>
