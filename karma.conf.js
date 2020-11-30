// Karma configuration
const webpack = require("webpack");

module.exports = function (config) {
  config.set({
    frameworks: ["mocha", "sinon", "chai"],

    browsers: ["FirefoxHeadless"],

    files: ["test/index.js"],

    preprocessors: {
      "test/index.js": ["webpack", "sourcemap"],
    },

    reporters: ["mocha"],

    webpack: {
      mode: "development",
      devtool: "inline-source-map",
      module: {
        rules: [
          {
            test: /\.(j|t)sx?$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            query: {
              presets: ["airbnb"],
            },
          },
        ],
      },
      plugins: [
        new webpack.DefinePlugin({
          "process.env.NODE_ENV": JSON.stringify("test"),
        }),
      ],
      resolve: {
        extensions: [".js", ".ts", ".tsx"],
      },
      externals: {
        cheerio: "window",
        "react/addons": true,
        "react/lib/ExecutionEnvironment": true,
        "react/lib/ReactContext": true,
      },
    },

    webpackServer: {
      noInfo: true,
    },
  });
};
