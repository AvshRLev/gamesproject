const path = require("path");

module.exports = {
  mode: "development",

  devtool: "eval-source-map",

  entry: {
    bundle: "./static/proto.js",
  },

  output: {
    path: path.resolve(__dirname, "./static/dist"), // Should be in STATICFILES_DIRS
    publicPath: "/static/", // Should match Django STATIC_URL
    filename: "[name].js", // No filename hashing, Django takes care of this
    chunkFilename: "[id]-[chunkhash].js", // DO have Webpack hash chunk filename, see below
  },

  devServer: {
    writeToDisk: true, // Write files to disk in dev mode, so Django can serve the assets
  },
};
