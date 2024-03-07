// to process frontend javascript
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
	// source code that needs to be transformed
	entry: {
		main: "./src/client/js/main.js",
		videoPlayer: "./src/client/js/videoPlayer.js",
	},
	// either development or production mode
	mode: "development",
	watch: true,
	plugins: [new MiniCssExtractPlugin({ filename: "css/styles.css" })],
	// where the files should be processed
	output: {
		filename: "js/[name].js",
		path: path.resolve(__dirname, "assets"),
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: {
					// applies transformations to files
					loader: "babel-loader",
					options: {
						presets: [["@babel/preset-env", { targets: "defaults" }]],
					},
				},
			},
			{
				test: /\.scss$/,
				// writing backwards order because webpack starts from the back
				use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
			},
		],
	},
};
