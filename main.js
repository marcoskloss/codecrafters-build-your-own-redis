const net = require('net');
const protocol = require('./protocol');
const commands = require('./commands');

const db = new Map();

const server = net.createServer((socket) => {
    socket.on('data', (data) => {
        const message = data.toString()
        const decoded = protocol.decode(message);

        for (const command of commands) {
            if (command.match(decoded)) {
                command.handle(decoded, socket, db);
            }
        }
  });
});

server.listen(6379, '127.0.0.1');
