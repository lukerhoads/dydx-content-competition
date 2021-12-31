const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")

const port = process.env.PORT || 3000

const copyPluginPatterns = {
    patterns: [
        { from: "./src/assets/images", to: "images" },
        { from: "./src/assets/fonts", to: "fonts" },
        // { from: "./src/assets/vendor", to: "js" },
    ]
};

module.exports = {
    mode: 'development',
    entry: "./src/index.tsx",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                use: [
                    // We're in dev and want HMR, SCSS is handled in JS
                    // In production, we want our css as files
                    "style-loader",
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    ["postcss-preset-env"],
                                ],
                            },
                        },
                    },
                    "sass-loader"
                ],
            },
            {
                test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                type: "javascript/auto",
                exclude: /images/,
                loader: "file-loader",
                options: {
                    publicPath: "../",
                    context: path.resolve(__dirname, "src/assets"),
                    name: "[path][name].[ext]",
                    emitFile: false,
                },
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: true,
            minify: false,
        }),
        new CopyPlugin(copyPluginPatterns)
    ],
    devServer: {
        static: path.join(__dirname, "dist"),
        compress: true,
        port: port,
    },
}