const path = require("path");
const ChromeExtensionReloader = require("webpack-chrome-extension-reloader");

const config = {
  entry: {
    app: "./src/app/index.jsx",
    background: "./src/extension/background.js",
    content: "./src/extension/content.js",
    backend: "./src/backend/reactFileParser.js",
  },
  output: {
    path: path.resolve(__dirname, "src/extension/build/bundles"),
    filename: "[name].bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?/,
        exclude: /(node_modules)/,
        resolve: {
          extensions: [".js", ".jsx"],
        },
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
  },
  plugins: [],
};

module.exports = (env, argv) => {
  if (argv.mode === "development") {
    config.plugins.push(
      new ChromeExtensionReloader({
        entries: {
          contentScript: ["app", "content"],
          background: ["background"],
        },
      })
    );
  }
  return config;
};
