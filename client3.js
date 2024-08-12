const WebSocket = require('ws');
const readline = require('readline');
const prompt = require("prompt-sync")({ sigint: true });

const uri = 'ws://https://beb1027407297d1350349a5fb9adbb68.serveo.net';
const ws = new WebSocket(uri);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

function displayMessage(message) {
  readline.cursorTo(process.stdout, 0, process.stdout.rows - 1);
  readline.clearLine(process.stdout, 0);
  console.log(`Received: ${message}`);
  // readline.cursorTo(process.stdout, 0);
  console.log('Enter message : ');
}

let username;

function sendMessage() {
  rl.question('Enter message : ', (input) => {
    ws.send(username + " : " + input);
    if (!input.startsWith('/username ')) {
        const newUsername = input.substring(10).trim();
        const username = newUsername
        sendMessage()
    }
    
  });
}

ws.on('message', (message) => {
  displayMessage(message);
});

ws.on('open', () => {
    username = prompt("Who are you? : ")
    console.log('Connected to the server');
    console.log('You can chose your username with /username');
    sendMessage(); // Start sending messages
});

ws.on('close', () => {
  console.log('Connection closed');
  rl.close();
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});
