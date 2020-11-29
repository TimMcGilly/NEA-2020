module.exports = {
  configureWebpack: {
    devtool: 'source-map',
  },
  devServer: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
      },
    },
  },
};
