const WebSocket = require('ws');

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 8765 });

// Set to keep track of connected clients
const clients = new Set();

wss.on('connection', (ws) => {
  // Register the new client
  clients.add(ws);

  ws.on('message', (message) => {
    // Convert the message to a string, if it's not already
    if (Buffer.isBuffer(message)) {
        message = message.toString();
      } else if (message instanceof ArrayBuffer) {
        message = Buffer.from(message).toString();
      }
  
      if (typeof message !== 'string') {
        ws.send('Error: Received non-string message.');
        return;
      }


    // Broadcast the received message to all connected clients
    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    // Unregister the client
    clients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

console.log('Server started at ws://localhost:8765');