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
import {
  ResourceConfig,
  COLOR_CODES,
  STATUS_CONTAINER_WIDTH
} from "./cortx-health-config";
import * as d3 from "d3";
import * as moment from "moment";

export default abstract class HealthCardBuilder {
  public static build(
    healthCardG: any,
    expandCollapse: any,
    performAction: any
  ): any {
    HealthCardBuilder.buildOuterRectangle(healthCardG);
    HealthCardBuilder.buildHeaderPath(healthCardG);
    HealthCardBuilder.buildIconPlaceHolderRectangle(healthCardG);
    HealthCardBuilder.buildIcon(healthCardG);
    HealthCardBuilder.buildShowActionsIcon(healthCardG, performAction);
    HealthCardBuilder.buildShowDescriptionIcon(healthCardG);
    HealthCardBuilder.buildStatusRectangle(healthCardG);
    HealthCardBuilder.buildStatusText(healthCardG);
    HealthCardBuilder.buildExpandCollapseIcon(healthCardG, expandCollapse);
    HealthCardBuilder.buildExpandCollapseIconCover(healthCardG);
    HealthCardBuilder.buildResourceText(healthCardG);
  }

  public static buildOuterRectangle(healthCardG: any) {
    healthCardG
      .append("rect")
      .attr("x", 0.500488)
      .attr("y", 0.5)
      .attr("width", 269)
      .attr("height", 119)
      .attr("rx", 3.5)
      .attr("fill", "#FFFFFF")
      .attr("stroke", (data: any) => data.config.color.dark);
  }

  public static buildHeaderPath(healthCardG: any) {
    healthCardG
      .append("path")
      .attr(
        "d",
        "M4.00049 0.5H266C267.934 0.5 269.5 2.067 269.5 4V49.5H0.500488V4C0.500488 2.067 2.06749 0.5 4.00049 0.5Z"
      )
      .attr("fill", (data: any) => data.config.color.light)
      .attr("stroke", (data: any) => data.config.color.dark);
  }

  public static buildIconPlaceHolderRectangle(healthCardG: any) {
    healthCardG
      .append("rect")
      .attr("x", 15.5)
      .attr("y", 60.5)
      .attr("width", 49)
      .attr("height", 49)
      .attr("rx", 3.5)
      .attr("fill", "#FFFFFF")
      .attr("stroke", (data: any) => data.config.color.dark);
  }

  public static buildIcon(healthCardG: any) {
    healthCardG
      .append("image")
      .attr("xlink:href", (data: any) =>
        require(`@/assets/health/${data.resource}/${data.status}/icon.svg`)
      )
      .attr("x", 21.5)
      .attr("y", 66.5)
      .attr("width", 37)
      .attr("height", 37);
  }

  public static buildShowDescriptionIcon(healthCardG: any) {
    healthCardG
      .append("image")
      .attr("xlink:href", require("@/assets/health/magnify_icon.svg"))
      .attr("id", (d: any) => `show_desc_icon_${d.treeNodeId}`)
      .attr("x", (data: any) => (data.config.actions.length > 0 ? 218 : 235))
      .attr("y", 13)
      .attr("width", 20)
      .attr("height", 20)
      .attr("style", "cursor: pointer;")
      .on("click", (event: any, data: any) => {
        HealthCardBuilder.buildDetailsMenu(data);
      });
  }

  public static buildShowActionsIcon(healthCardG: any, performAction: any) {
    healthCardG
      .append("image")
      .attr("xlink:href", require("@/assets/health/actions_menu_icon.svg"))
      .attr("id", (d: any) => `show_actions_icon_${d.treeNodeId}`)
      .attr("x", 250)
      .attr("y", 12)
      .attr("width", 10)
      .attr("height", 25)
      .attr("visibility", (data: any) =>
        data.config.actions.length > 0 ? "visible" : "hidden"
      )
      .attr("style", "cursor: pointer;")
      .on("click", (event: any, data: any) => {
        HealthCardBuilder.buildActionsMenu(data, performAction);
      });
  }

  public static buildStatusRectangle(healthCardG: any) {
    healthCardG
      .append("rect")
      .attr("x", "15.5")
      .attr("y", "12")
      .attr("width", (data: any) => data.config.statusContainerWidth)
      .attr("height", "24")
      .attr("rx", "12")
      .attr("fill", (data: any) => data.config.color.dark);
  }

  public static buildStatusText(healthCardG: any) {
    healthCardG
      .append("text")
      .attr("x", 30)
      .attr("y", 29)
      .attr("fill", "#FFFFFF")
      .attr("style", "font-size: 12px;font-weight: bold;")
      .text((data: any) => data.status.toUpperCase());
  }

  public static buildExpandCollapseIcon(healthCardG: any, expandCollapse: any) {
    healthCardG
      .append("line")
      .attr("stroke", (data: any) => data.config.color.dark)
      .attr("x1", 270)
      .attr("y1", 49.5)
      .attr("x2", 293)
      .attr("y2", 49.5);
    healthCardG
      .append("line")
      .attr("stroke", (data: any) => data.config.color.dark)
      .attr("stroke-width", 2)
      .attr("x1", 299)
      .attr("y1", 50)
      .attr("x2", 309)
      .attr("y2", 50);
    healthCardG
      .append("line")
      .attr("class", "expand_line")
      .attr("stroke", (data: any) => data.config.color.dark)
      .attr("x1", 304)
      .attr("y1", 45)
      .attr("x2", 304)
      .attr("y2", 55)
      .attr("stroke-width", (data: any) => {
        return data.sub_resources && data.sub_resources.length > 0 ? 0 : 2;
      });
    healthCardG
      .append("circle")
      .attr("cx", 304)
      .attr("cy", 50)
      .attr("r", 11.5)
      .attr("fill", "#FFFFFF")
      .attr("style", "cursor: pointer;")
      .attr("fill-opacity", 0)
      .attr("stroke", (data: any) => data.config.color.dark)
      .on("click", (event: any, data: any) => {
        expandCollapse(data);
      });
  }

  public static buildExpandCollapseIconCover(healthCardG: any) {
    healthCardG
      .append("rect")
      .attr("x", "270")
      .attr("y", "38")
      .attr("width", (data: any) => {
        return data.isLeafNode && !data._sub_resources ? "47" : "0";
      })
      .attr("height", "25")
      .attr("fill", "#FFFFFF");
  }

  public static buildResourceText(healthCardG: any) {
    healthCardG
      .append("text")
      .attr("x", 80)
      .attr("y", 81)
      .attr("fill", "#000000")
      .attr("style", "font-size: 14px;font-weight: bold;")
      .text((data: any) => data.resource.toUpperCase());
    healthCardG
      .append("text")
      .attr("x", 80)
      .attr("y", 100)
      .attr("fill", "#000000")
      .attr("style", "font-size: 14px;font-weight: bold;")
      .text((data: any) => {
        return HealthCardBuilder.getTruncatedString(data.id);
      });
  }

  public static buildDetailsMenu(data: any) {
    const lastUpdatedTimeInMillis = new Date(data.last_updated_time * 1000);
    const lastUpdatedTime = moment
      .default(lastUpdatedTimeInMillis)
      .format("DD-MM-YYYY hh:mm A");
    const details: any[] = [
      {
        title: "Resource",
        value: data.resource.toUpperCase()
      },
      {
        title: "Id",
        value: HealthCardBuilder.getTruncatedString(data.id)
      },
      {
        title: "Status",
        value: data.status.toUpperCase()
      },
      {
        title: "Time",
        value: lastUpdatedTime
      }
    ];
    const outerG = d3.select(`#outer_g`);
    const detailsMenuContainerHeight = details.length * 35;
    const detailsMenuContainerG = outerG
      .append("g")
      .attr("id", `g_detail_menu_${data.treeNodeId}`)
      .attr("class", "g_popup")
      .attr("tabindex", 0)
      .style("outline", "none")
      .attr("width", 269)
      .attr("height", detailsMenuContainerHeight)
      .attr("transform", `translate(${data.x + 0.500488},${data.y + 49.5})`)
      .on("blur", () => {
        d3.select(`.g_popup`).remove();
      });
    const detailsMenuContainerGNode: any = detailsMenuContainerG.node();
    detailsMenuContainerGNode.focus();
    detailsMenuContainerG
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("height", detailsMenuContainerHeight)
      .attr("width", 269)
      .attr("fill", "#FFFFFF")
      .attr("stroke", data.config.color.dark);

    let detailItemY = 0;
    details.forEach(detail => {
      const detailItemContainerG: any = detailsMenuContainerG
        .append("g")
        .attr("transform", `translate(0.5,${detailItemY})`)
        .attr("width", 268)
        .attr("height", 35);
      detailItemContainerG
        .append("text")
        .attr("x", 15)
        .attr("y", 20)
        .attr("fill", "#000000")
        .attr("style", "font-size: 16px;")
        .text(`${detail.title}: ${detail.value}`);

      detailItemY += 35;
    });
  }

  public static buildActionsMenu(data: any, performAction: any) {
    const actions: any[] = data.config.actions;
    if (actions.length > 0) {
      const outerG = d3.select(`#outer_g`);

      const actionsMenuContainerHeight = actions.length * 40;
      const actionsMenuContainerG = outerG
        .append("g")
        .attr("id", `g_action_menu_${data.treeNodeId}`)
        .attr("class", "g_popup")
        .attr("tabindex", 0)
        .style("outline", "none")
        .attr("width", 269)
        .attr("height", actionsMenuContainerHeight)
        .attr("transform", `translate(${data.x + 0.500488},${data.y + 49.5})`)
        .on("blur", () => {
          d3.select(`.g_popup`).remove();
        });
      const actionsMenuContainerGNode: any = actionsMenuContainerG.node();
      actionsMenuContainerGNode.focus();
      actionsMenuContainerG
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", actionsMenuContainerHeight)
        .attr("width", 269)
        .attr("fill", "#FFFFFF")
        .attr("stroke", data.config.color.dark);

      let actionItemY = 0;
      actions.forEach((action: any) => {
        const actionItemContainerG: any = actionsMenuContainerG
          .append("g")
          .attr("transform", `translate(0.5,${actionItemY})`)
          .attr("width", 268)
          .attr("height", 40);
        const rectId: string = `rect_${data.treeNodeId}_${action.action}`;
        actionItemContainerG
          .append("text")
          .attr("x", 45)
          .attr("y", 25)
          .attr("fill", "#000000")
          .attr("style", "font-size: 16px;")
          .text(action.title);
        actionItemContainerG
          .append("image")
          .attr(
            "xlink:href",
            require(`@/assets/health/${data.resource}/${data.status}/operations/${action.action}.svg`)
          )
          .attr("x", 15)
          .attr("y", 11)
          .attr("width", 22)
          .attr("height", 22);

        const actionItemRect: any = actionItemContainerG
          .append("rect")
          .attr("id", rectId)
          .attr("height", 40)
          .attr("width", 268)
          .attr("fill", "#E5E5E5");
        if (action.isEnabled) {
          actionItemRect
            .attr("style", "cursor: pointer;")
            .attr("fill-opacity", 0)
            .on("mouseover", () => {
              d3.select(`#${rectId}`).attr("fill-opacity", 0.2);
            })
            .on("mouseout", () => {
              d3.select(`#${rectId}`).attr("fill-opacity", 0);
            })
            .on("click", () => {
              // const gPopup: any = d3.select(`.g_popup`);
              // if (gPopup.node()) {
              //     d3.select(`.g_popup`).remove();
              // }
              performAction(data, action.action);
            });
        } else {
          actionItemRect
            .attr("style", "cursor: not-allowed;")
            .attr("fill-opacity", 0.5);
        }
        actionItemY += 40;
      });
    }
  }

  public static buildConfig(resource: any) {
    const actions: any = ResourceConfig.getActionsOfResource(
      resource.resource,
      resource.status
    );
    resource.config = {
      color: COLOR_CODES[resource.status].color,
      statusContainerWidth: STATUS_CONTAINER_WIDTH[resource.status],
      actions
    };
  }

  public static getTruncatedString(str: string) {
    return str.length > 20 ? `${str.slice(0, 20)}...` : str;
  }
}
