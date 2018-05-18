const path = require('path')
const htmlPlugin = require('html-webpack-plugin')

module.exports = {
    entry: ['babel-polyfill', path.join(__dirname, 'src', 'App.js')],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'build.js'
    },
    module: {
        rules: [{
            loader: 'babel-loader',
            test: /\.jsx?$/,
            exclude: /node_modules/,
            query: {
                presets: ['env', 'react']
            }
        }, {
            loader: 'json-loader',
            test: /\.json$/,
            exclude: /node_modules/
        }, {
            test: /\.styl$/,
            exclude: /node_modules/,
            use: ['style-loader', {
                loader: 'css-loader',
                options: {
                    importLoaders: 2
                }
            }, 'stylus-loader'],
            include: /src/
        }]
    },
    plugins: [new htmlPlugin({
        title: "Decentralized Ecommerce",
        template: './src/index.ejs',
        hash: true
    })]
}
