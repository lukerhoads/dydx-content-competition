const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")

const port = process.env.PORT || 3000
const isProd = process.env.NODE_ENV === 'production'

const copyPluginPatterns = {
    patterns: [
        { from: "./src/assets/images", to: "images" },
        { from: "./src/assets/fonts", to: "fonts" },
        // { from: "./src/assets/vendor", to: "js" },
    ]
};

const config = {
    target: 'node',
    mode: isProd ? 'production' : 'development',
    entry: {
        index: "./src/index.tsx",
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)?$/,
                use: "babel-loader",
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
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: true,
            minify: false,
        }),
        new CopyPlugin(copyPluginPatterns)
    ]
}

if (isProd) {
    config.optimization = {
      minimizer: [
            new TerserWebpackPlugin(),
      ],
    };
  } else {
    // for more information, see https://webpack.js.org/configuration/dev-server
    config.devServer = {
        port: 3000,
        open: true,
        hot: true,
        compress: true,
        client: {
            overlay: true,
        }
    }
    config.stats = 'errors-only'
  }

  module.exports = config