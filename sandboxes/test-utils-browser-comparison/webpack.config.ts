import path from "path"
import TsForkPlugin from "fork-ts-checker-webpack-plugin"
import HtmlPlugin from "html-webpack-plugin"
import TsConfigPathsPlugin from "tsconfig-paths-webpack-plugin"
import { Configuration, ProvidePlugin } from "webpack"
import "webpack-dev-server"

const MAIN_CHUNK = "main"

const config: Configuration = {
  entry: {
    [MAIN_CHUNK]: "./src/index.ts",
  },
  mode: "development",
  devtool: "source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    historyApiFallback: true,
    port: 3000,
    open: true,
    client: {
      overlay: {
        warnings: false,
      },
    },
  },
  output: {
    filename: "[name].[contenthash].js",
    path: path.join(__dirname, "build"),
    publicPath: "/",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    plugins: [new TsConfigPathsPlugin()],
    fallback: {
      assert: require.resolve("../../node_modules/assert"),
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.tsx?$/i,
        enforce: "pre",
        use: {
          loader: "source-map-loader",
        },
      },
      {
        test: /\.tsx?$/i,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg|ttf|woff|woff2|eot|wav|mp3|mp4|mpeg)$/i,
        exclude: /node_modules/,
        use: {
          loader: "url-loader",
          options: {
            limit: 8192,
          },
        },
      },
    ],
  },
  plugins: [
    new ProvidePlugin({
      process: "process/browser",
    }),
    new TsForkPlugin(),
    new HtmlPlugin({
      template: "./public/index.html",
      chunks: [MAIN_CHUNK],
    }),
  ],
}

export default config
