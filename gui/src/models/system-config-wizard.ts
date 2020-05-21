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
