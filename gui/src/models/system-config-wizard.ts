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
export const wizardConfig = {
  currentComponent: "EOSUploadSSL",
  steps: [
    {
      sequence: 1,
      isSubstep: false,
      component: "EOSUploadSSL",
      path: "onboarding/system-config/ssl-certificate/upload-ssl.vue",
      isByPassed: false,
      header: {
        state: "completed",
        name: "SSL upload"
      },
      footer: {
        nextComponent: "EosDnsSettings",
        prevComponent: "homebase",
        nextBtnText: "Continue",
        prevBtnText: "",
        api: "/systemconfig"
      }
    },
    {
      sequence: 2,
      isSubstep: false,
      component: "EosDnsSettings",
      path: "onboarding/system-config/dns/dns-setting.vue",
      isByPassed: false,
      header: {
        state: "untouched",
        name: "DNS"
      },
      footer: {
        nextComponent: "EosDateTime",
        prevComponent: "EOSUploadSSL",
        nextBtnText: "Continue",
        prevBtnText: "Back to previous step",
        api: "/systemconfig"
      }
    },
    {
      sequence: 3,
      isSubstep: false,
      component: "EosDateTime",
      path: "onboarding/system-config/date-time/date-time.vue",
      isByPassed: false,
      header: {
        state: "untouched",
        name: "NTP"
      },
      footer: {
        nextComponent: "EosNotifications",
        prevComponent: "EosDnsSettings",
        nextBtnText: "Continue",
        prevBtnText: "Back to previous step",
        api: "/systemconfig"
      }
    },
    {
      sequence: 4,
      isSubstep: false,
      component: "EosNotifications",
      path: "onboarding/system-config/notifications/notifications.vue",
      isByPassed: false,
      header: {
        state: "untouched",
        name: "Notifications"
      },
      footer: {
        nextComponent: "EosNotificationsEmail",
        prevComponent: "EosDateTime",
        nextBtnText: "Continue",
        prevBtnText: "Back to previous step",
        api: "/systemconfig"
      }
    },
    {
      sequence: 5,
      isSubstep: true,
      component: "EosNotificationsEmail",
      path: "onboarding/system-config/notifications/notifications-email.vue",
      name: "Notifications email",
      isByPassed: true,
      footer: {
        nextComponent: "EosNotificationsSyslog",
        prevComponent: "EosNotifications",
        nextBtnText: "Continue",
        prevBtnText: "Back to previous step",
        api: "/systemconfig"
      }
    },
    {
      sequence: 6,
      isSubstep: true,
      component: "EosNotificationsSyslog",
      path: "onboarding/system-config/notifications/notifications-syslog.vue",
      name: "Notifications syslog",
      isByPassed: true,
      footer: {
        nextComponent: "EosOnboardingSummary",
        prevComponent: "EosNotificationsEmail",
        nextBtnText: "Apply and continue",
        prevBtnText: "Back to previous step",
        api: "/systemconfig"
      }
    },
    {
      sequence: 7,
      isSubstep: false,
      component: "EosOnboardingSummary",
      path: "onboarding/system-config/summary/onboarding-summary.vue",
      isByPassed: false,
      header: {
        state: "untouched",
        name: "Summary"
      },
      footer: {
        nextComponent: "EosOnboardingFinish",
        prevComponent: "EosNotificationsSyslog",
        nextBtnText: " Continue",
        prevBtnText: "Back to previous step",
        api: "/systemconfig"
      }
    },
    {
      sequence: 8,
      isSubstep: false,
      component: "EosOnboardingFinish",
      path: "onboarding/finish.vue",
      name: "Onboarding Finish",
      isByPassed: false,
      hideHeader: true
    }
  ]
};
