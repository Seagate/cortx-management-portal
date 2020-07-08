module.exports = {
    outputDir: 'web-dist',
    devServer: {
        proxy: 'http://localhost:28100'
    },
    configureWebpack: {
        devtool: 'source-map'
    },

    pluginOptions: {
      i18n: {
        locale: 'en',
        fallbackLocale: 'en',
        localeDir: 'locales',
        enableInSFC: false
      }
    }
}
