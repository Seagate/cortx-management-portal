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
        nextComponent: "EosNetworkSettings",
        prevComponent: "homebase",
        nextBtnText: "Continue",
        prevBtnText: "",
        api: "/systemconfig"
      }
    },
    {
      sequence: 2,
      isSubstep: false,
      component: "EosNetworkSettings",
      path: "onboarding/system-config/mgmt-network/network-settings.vue",
      isByPassed: false,
      header: {
        state: "completed",
        name: "Management network"
      },
      footer: {
        nextComponent: "EosNetworkSettingsIpv4",
        prevComponent: "EOSUploadSSL",
        nextBtnText: "Continue",
        prevBtnText: "Back to previous step",
        api: "/systemconfig"
      }
    },
    {
      sequence: 3,
      isSubstep: true,
      component: "EosNetworkSettingsIpv4",
      path: "onboarding/system-config/mgmt-network/network-settings-ipv4.vue",
      name: "Management IPv4",
      isByPassed: true,
      footer: {
        nextComponent: "EosNetworkSettingsIpv6",
        prevComponent: "EosNetworkSettings",
        nextBtnText: " Continue",
        prevBtnText: "Back to previous step",
        api: "/systemconfig"
      }
    },
    {
      sequence: 4,
      isSubstep: true,
      component: "EosNetworkSettingsIpv6",
      path: "onboarding/system-config/mgmt-network/network-settings-ipv6.vue",
      name: "Management IPv6",
      isByPassed: true,
      footer: {
        nextComponent: "EosDataNetwork",
        prevComponent: "EosNetworkSettingsIpv4",
        nextBtnText: "continue",
        prevBtnText: "Back to previous step",
        api: "/systemconfig"
      }
    },
    {
      sequence: 5,
      isSubstep: false,
      component: "EosDataNetwork",
      path: "onboarding/system-config/data-network/data-network.vue",
      isByPassed: false,
      header: {
        state: "untouched",
        name: "Data network"
      },
      footer: {
        nextComponent: "EosDataNetworkIpv4",
        prevComponent: "EosNetworkSettingsIpv6",
        nextBtnText: "Continue",
        prevBtnText: "Back to previous step",
        api: "/systemconfig"
      }
    },
    {
      sequence: 6,
      isSubstep: true,
      component: "EosDataNetworkIpv4",
      path: "onboarding/system-config/data-network/data-network-ipv4.vue",
      name: "Data network IPv4",
      isByPassed: true,
      footer: {
        nextComponent: "EosDataNetworkIpv6",
        prevComponent: "EosDataNetwork",
        nextBtnText: " Continue",
        prevBtnText: "Back to previous step",
        api: "/systemconfig"
      }
    },
    {
      sequence: 7,
      isSubstep: true,
      component: "EosDataNetworkIpv6",
      path: "onboarding/system-config/data-network/data-network-ipv6.vue",
      name: "Data network IPv6",
      isByPassed: true,
      footer: {
        nextComponent: "EosDnsSettings",
        prevComponent: "EosDataNetworkIpv4",
        nextBtnText: "Continue",
        prevBtnText: "Back to previous step",
        api: "/systemconfig"
      }
    },
    {
      sequence: 8,
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
        prevComponent: "EosDataNetworkIpv6",
        nextBtnText: "Continue",
        prevBtnText: "Back to previous step",
        api: "/systemconfig"
      }
    },
    {
      sequence: 9,
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
      sequence: 10,
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
      sequence: 11,
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
      sequence: 12,
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
      sequence: 13,
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
      sequence: 14,
      isSubstep: false,
      component: "EosOnboardingFinish",
      path: "onboarding/finish.vue",
      name: "Onboarding Finish",
      isByPassed: false,
      hideHeader: true
    }
  ]
};
