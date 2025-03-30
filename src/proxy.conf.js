const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8085',
      secure: false,
      changeOrigin: true,
      bypass: function (req, res, proxyOptions) {
        if (req.headers.host === '192.168.0.122:4200') {
          return req.url;
        }
        return null;
      }
    })
  );
};
