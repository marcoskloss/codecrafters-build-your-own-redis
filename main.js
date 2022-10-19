const net = require('net');
const protocol = require('./protocol');

const isPingCommand = (command) => {
    if (Array.isArray(command)) {
        return command.map((str) => str.toLowerCase()).includes('ping');
    }
    return command.toLowerCase() === 'ping';
};

const handlePingCommand = (socket) => {
    socket.write(protocol.encodeRespString('PONG'));
}

const isEchoCommand = (command) =>
    Array.isArray(command) && command[0].toLowerCase() === 'echo';

const handleEchoCommand = (command, socket) => {
    socket.write(protocol.encodeRespBulkString(command[1]));
};

const server = net.createServer((socket) => {
    socket.on('data', (data) => {
        const message = data.toString()
        const decoded = protocol.decode(message);

        if (isPingCommand(decoded)) {
            return handlePingCommand(socket);
        }

        if (isEchoCommand(decoded)) {
            return handleEchoCommand(decoded, socket);
        }
  });
});

server.listen(6379, '127.0.0.1');
