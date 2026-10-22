const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const port = 3000;
let publicUrl = `ws://localhost:${port}/ws`;

// Support running the dev server inside GitHub Codespaces (HMR websocket URL).
if(process.env.CODESPACE_NAME){
  publicUrl = `wss://${process.env.CODESPACE_NAME}-${port}.app.github.dev/ws`;
}

module.exports = merge(common, {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    devServer: {
        port,
        hot: true,
        allowedHosts: "all",
        historyApiFallback: true,
        static: {
          directory: path.resolve(__dirname, "dist"),
        },
        client: {
          webSocketURL: publicUrl
        },
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
});
