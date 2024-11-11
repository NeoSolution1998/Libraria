const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    devtool: 'source-map',
  },
  devServer: {
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    host: '0.0.0.0',
    port: 8080,
    client: {
      webSocketURL: {
        protocol: 'wss', // Использовать WSS протокол
        hostname: 'waste-street-opportunities-closes.trycloudflare.com', // Ваш ngrok домен
        port: '443', // Порт HTTPS
        pathname: '/ws',
      },
    }, 
  },
});
