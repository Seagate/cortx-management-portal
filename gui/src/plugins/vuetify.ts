import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "mdi",
  },
  theme: {
    themes: {
      light: {
        udxprimary: "#6EBE49",
        udxdisabled: "#B7B7B7",
        udxborder: "#9E9E9E",
        udxheader: "#E8E8E8",
        udxtooltip: "#454545",
        udxerror: "#DC1F2E",
        udxwarning: "#F7A528",
        udxsuccess: "#6EBE49",
        udxinfo: "#00A1DD",
        udxoverlay: "rgba(0, 0, 0, 0.75)",
      },
    },
  },
});
