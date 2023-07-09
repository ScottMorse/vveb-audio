import os from "os"
import path from "path"
import TsForkPlugin from "fork-ts-checker-webpack-plugin"
import TsConfigPathsPlugin from "tsconfig-paths-webpack-plugin"
import { Configuration } from "webpack"
import ShellPlugin from "webpack-shell-plugin-next"
import "webpack-dev-server"

const CHUNKS = {
  userScript: {
    baseDir: path.join(__dirname, "userScript"),
    entry: path.join(__dirname, "userScript", "index.ts"),
    tsConfigFile: path.join(__dirname, "userScript", "tsconfig.json"),
  },
  contentScript: {
    baseDir: path.join(__dirname, "contentScript"),
    entry: path.join(__dirname, "contentScript", "index.ts"),
    tsConfigFile: path.join(__dirname, "contentScript", "tsconfig.json"),
  },
  background: {
    baseDir: path.join(__dirname, "background"),
    entry: path.join(__dirname, "background", "index.ts"),
    tsConfigFile: path.join(__dirname, "background", "tsconfig.json"),
  },
}

const BUILD_DIR =
  process.env.BUILD_HOME === "true"
    ? path.join(os.homedir(), "vveb-dev-extension")
    : path.join(__dirname, "build")

const config: Configuration = {
  entry: {
    userScript: CHUNKS.userScript.entry,
    background: CHUNKS.background.entry,
    contentScript: CHUNKS.contentScript.entry,
  },
  mode: "production",
  devServer: {
    devMiddleware: {
      writeToDisk: true,
    },
    liveReload: false,
    hot: false,
    webSocketServer: false,
    watchFiles: ["**/*.ts"],
  },
  output: {
    path: BUILD_DIR,
    clean: true,
  },
  optimization: {
    minimize: false,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    plugins: [
      new TsConfigPathsPlugin({
        configFile: CHUNKS.background.tsConfigFile,
      }),
      new TsConfigPathsPlugin({
        configFile: CHUNKS.userScript.tsConfigFile,
      }),
      new TsConfigPathsPlugin({
        configFile: CHUNKS.contentScript.tsConfigFile,
      }),
    ],
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
        test: /\.jsx?$/i,
        enforce: "pre",
        use: {
          loader: "source-map-loader",
        },
      },
      {
        test: new RegExp(`../packages/.*\\.tsx?$`),
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
            configFile: path.join(__dirname, "tsconfig.json"),
          },
        },
      },
      {
        test: new RegExp(`${CHUNKS.userScript.baseDir}.*\\.tsx?$`),
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
            configFile: CHUNKS.userScript.tsConfigFile,
          },
        },
      },
      {
        test: new RegExp(`${CHUNKS.background.baseDir}.*\\.tsx?$`),
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
            configFile: CHUNKS.background.tsConfigFile,
          },
        },
      },
      {
        test: new RegExp(`${CHUNKS.contentScript.baseDir}.*\\.tsx?$`),
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
            configFile: CHUNKS.contentScript.tsConfigFile,
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
    new TsForkPlugin(),
    new ShellPlugin({
      onAfterDone: `BUILD_DIR=${BUILD_DIR} npx ts-node ./generateManifest.ts`,
    }) as any,
  ],
}

export default config
