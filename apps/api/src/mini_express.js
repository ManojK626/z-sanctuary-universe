// Z: apps\api\src\mini_express.js
import http from 'node:http';
function createApp() {
  const routes = [];

  function matchRoute(req, routePath) {
    const parsed = new URL(req.url || '/', 'http://localhost').pathname;
    return parsed === routePath;
  }

  const app = {
    use() {
      return;
    },
    get(pathname, handler) {
      routes.push({ method: 'GET', pathname, handler });
    },
    listen(port, cb) {
      const server = http.createServer((req, res) => {
        res.json = (payload) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(payload));
        };
        const route = routes.find((r) => r.method === req.method && matchRoute(req, r.pathname));
        if (route) {
          route.handler(req, res);
          return;
        }
        res.statusCode = 404;
        res.end('Not found');
      });
      server.listen(port, cb);
      return server;
    },
  };

  return app;
}

function json() {
  return (_req, _res, next) => {
    if (typeof next === 'function') {
      next();
    }
  };
}

function urlencoded() {
  return (_req, _res, next) => {
    if (typeof next === 'function') {
      next();
    }
  };
}

function staticMiddleware() {
  return (_req, _res, next) => {
    if (typeof next === 'function') {
      next();
    }
  };
}

const express = Object.assign(createApp, {
  json,
  urlencoded,
  static: staticMiddleware,
});

export default express;
