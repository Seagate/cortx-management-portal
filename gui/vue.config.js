module.exports = {
    outputDir: 'web-dist',
    devServer: {
        proxy: 'http://10.230.245.80:28101'
    },
    configureWebpack: {
        devtool: 'source-map'
    }
}