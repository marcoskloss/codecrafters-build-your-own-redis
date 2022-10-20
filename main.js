const net = require('net');
const protocol = require('./protocol');

const db = new Map();

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

const isSetCommand = (command) => 
    Array.isArray(command) && command[0].toLowerCase() === 'set';

const handleSetCommand = (command, socket) => {
    const [_, key, value] = command;
    db.set(key, { value })
    socket.write(protocol.encodeRespString('OK'))
}

const isGetCommand = (command) => 
    Array.isArray(command) && command[0].toLowerCase() === 'get';

const handleGetCommand = (command, socket) => {
    const [_, key] = command;
    const object = db.get(key) ?? {};
    const value = object.value ?? null;
    socket.write(protocol.encodeRespBulkString(value));
}

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

        if (isSetCommand(decoded)) {
            return handleSetCommand(decoded, socket)
        }

        if (isGetCommand(decoded)) {
            return handleGetCommand(decoded, socket);
        }
  });
});

server.listen(6379, '127.0.0.1');
