const path = require('path');
const HtmlWebpckPlugin = require('html-webpack-plugin');

module.exports = {
    entry: ['babel-polyfill', './src/js/index.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },
    devServer: {
        contentBase: path.resolve(__dirname,'dist')
    },
    plugins: [
        new HtmlWebpckPlugin({
            filename: 'index.html',
            template: './src/index.html',
            minify: false
         })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader'
                },
                exclude: '/node_modules/' 
            }
        ]
    }
}
