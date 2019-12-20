import "@mdi/font/css/materialdesignicons.css";
import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "mdi",
  },
  theme: {
    options: {
      customProperties: true
    },
    themes: {
      light: {
        csmprimary: "#6EBE49",
        csmdisabled: "#B7B7B7",
        csmborder: "#9E9E9E",
        csmheader: "#E8E8E8",
        csmtooltip: "#454545",
        csmerror: "#DC1F2E",
        csmwarning: "#F7A528",
        csmsuccess: "#6EBE49",
        csminfo: "#00A1DD",
        csmoverlay: "#9E9E9E",
      },
    },
  }
});
