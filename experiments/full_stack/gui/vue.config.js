const path = require("path");

module.exports = {
  chainWebpack: config => {
    config
      .entry("app")
      .clear()
      .add("./main.js")
      .end();
    config.resolve.alias
      .set("@", path.join(__dirname, "./"))
  }
};