#!/usr/bin/env node

/**
 * Module dependencies.
 */

const { log } = require('console');
var app = require('../app');
var debug = require('debug')('demo:server');
var http = require('http');
var WebSocket = require('ws');
var pako = require('pako');
const url = require('url');
const querystring = require('querystring');
const { TableManager } = require('../controller/table');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
// app.set('port', port);

/**
 * Create HTTP server.
 */
let nextClientId = 1;
var server = http.createServer(app.callback());
var wss = new WebSocket.Server({ server });
var connection = new Map();
const pool = new Map();
wss.on('connection', (ws, request) => {
  const clientId = nextClientId++;
  const parsedUrl = url.parse(request.url);
  const parsedQuery = querystring.parse(parsedUrl.query);
  const { uuid, gridKey } = parsedQuery;
  console.log(uuid, gridKey);
  // if (!connection.has(uuid)) {
  //   connection.set(uuid, ws);
  // }
  if (!pool.has(gridKey)) {
    pool.set(gridKey, [ws]);
    console.log(`pool first connect gridKey: ${gridKey}`);
  } else {
    const arr = pool.get(gridKey);
    arr.push(ws);
    console.log('arr length', arr.length);
    pool.set(gridKey, arr);
    console.log('pool size', pool.size);
  }
  console.log('ws connect', clientId);
  ws.on('message', (msg) => {
    try {
      if (msg == 'rub') {
        console.log(msg);
        return;
      };
      const uncompressedMsg = pako.ungzip(msg, { to: 'string' });

      // 解码数据
      const decodedMsg = decodeURIComponent(uncompressedMsg);

      // 将数据转换为 JSON 对象
      const jsonData = JSON.parse(decodedMsg);
      console.log('ws message' ,JSON.stringify(jsonData));
      const { t, i, v, k } = jsonData;
      if (t === 'v' || t === 'arc' || t === 'all' || t === 'drc' || t === 'sha' || t === 'shd') {
        console.log('ws msg', jsonData);
        if (t === 'v') {
          TableManager.updateValue(gridKey, jsonData);
        }
        if (t === 'arc') {
          TableManager.addRowColumn(gridKey, jsonData);
        }
        if (t === 'drc') {
          TableManager.deleteRowColumn(gridKey, jsonData);
        }
        if (t === 'sha') {
          TableManager.addSheet(gridKey, jsonData);
        }
        if (t === 'shd') {
          TableManager.deleteSheet(gridKey, jsonData);
        }
        if (t === 'all' && k === 'name') {
          TableManager.renameSheet(gridKey, jsonData);
        }
        const notify = pool.get(gridKey);
        notify.filter(i => i !== ws).forEach(i => {
          console.log('notify');
          i.send(JSON.stringify({ type: 2, data: JSON.stringify(jsonData) }));
        })
      }
    } catch (error) {
      console.log(error);
    }
  });
  ws.on('error', (error) => {
    console.log('ws error', error);
  });
  ws.on('close', () => {
    let notify = pool.get(gridKey);
    notify = notify.filter(i => i !== ws);
    console.log('close exist user', notify.length);
    pool.set(gridKey, notify);
  })
});
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => {
  console.log(`localhost:${port}`);
});
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
