module.exports = {
    outputDir: 'web-dist',
    devServer: {
        proxy: 'http://localhost:8100'
    },
    configureWebpack: {
        devtool: 'source-map'
    }
}
