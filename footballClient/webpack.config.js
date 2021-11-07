const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const filename = (ext) => isDev ? `[name].${ext}` : `[contenthash].bundle.${ext}`

module.exports = {
    mode: 'development',
    entry: {
        main:["@babel/polyfill",  path.resolve(__dirname, './src/index.jsx')]
    },
    output: {
        path: path.join(__dirname, './dist'),
        filename: 'app.js',
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        },
        extensions: [".js", ".jsx"]
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
      },
    devServer: {
        compress: true,
        static: false,
        hot: true,
        open:true,
        port: 8081
    },
    cache: false,
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html'),
            filename: 'index.html',
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: `./css/${filename('css')}`,
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets:[
                        "@babel/preset-env",
                        "@babel/preset-react"
                    ]
                  }
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader",
                ],
            },
            {
                test: /\.css$/i,
                use: [
                    isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 
                    "css-loader"
                ],
            }
        ]
    }
}