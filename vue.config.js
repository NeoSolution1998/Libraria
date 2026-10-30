const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    devtool: 'source-map', // Для удобной отладки
  },
  devServer: {
    allowedHosts: 'all', // Разрешить доступ с любых хостов
    headers: {
      'Access-Control-Allow-Origin': '*', // Разрешить кросс-доменные запросы (если нужно)
    },
    host: '0.0.0.0', // Хост для работы на любой машине
    port: 8081, // Порт разработки
    hot: true, // Включаем HMR (по умолчанию включено)
    historyApiFallback: true, // Для SPA роутинга с history mode
    client: {
      webSocketURL: {
        protocol: 'ws', // Используем WebSocket без SSL
        hostname: 'localhost', // Указываем локальный хост
        port: 8081, // Порт разработки
      },
    },
  },
});