import * as path from "path";

const config = {
  entry: {
    "flash-briefing": "./src/flash-briefing.ts",
    "skill": "./src/index.ts",
  },
  externals: ["aws-sdk"],
  module: {
    rules: [
      {
        test: /\.xml$/,
        use: "raw-loader",
      },
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: "ts-loader",
      },
    ],
  },
  output: {
    filename: "[name].js",
    library: "handler",
    libraryTarget: "commonjs2",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  target: "node",
};

export default config;
