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
    host: 'localhost', // Хост для работы на локальной машине
    port: 8080, // Порт разработки
    hot: true, // Включаем HMR (по умолчанию включено)
    client: {
      webSocketURL: {
        protocol: 'ws', // Используем WebSocket без SSL
        hostname: 'localhost', // Указываем локальный хост
        port: 8080, // Порт разработки
      },
    },
  },
});