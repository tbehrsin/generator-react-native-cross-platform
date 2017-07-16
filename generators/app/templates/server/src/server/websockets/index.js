
import WebSocket from 'ws';
import mongoose from 'mongoose';
import url from 'url';

import onClientConnection from './client';

export default (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    const location = url.parse(req.url, true);

    if(location.query.u) {
      onClientConnection(ws, req);
    } else {
      ws.close();
    }
  });
};
