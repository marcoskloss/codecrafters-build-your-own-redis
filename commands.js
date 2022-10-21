const protocol = require('./protocol');

const ping = {
    match: (command) => {
        if (Array.isArray(command)) {
            return command.map((str) => str.toLowerCase()).includes('ping');
        }
        return command.toLowerCase() === 'ping';
    },
    handle: (_command, socket) => {
        socket.write(protocol.encodeRespString('PONG'));
    },
};

const echo = {
    match: (command) => {
        return Array.isArray(command) && command[0].toLowerCase() === 'echo';
    },
    handle: (command, socket) => {
        socket.write(protocol.encodeRespBulkString(command[1]));
    },
};

const set = {
    match: (command) => {
        return Array.isArray(command) && command[0].toLowerCase() === 'set';
    },
    handle: (command, socket, db) => {
        const [_, key, value] = command;
        db.set(key, { value });
        socket.write(protocol.encodeRespString('OK'));
    },
};

const get = {
    match: (command) => {
        return Array.isArray(command) && command[0].toLowerCase() === 'get';
    },
    handle: (command, socket, db) => {
        const [_, key] = command;
        const object = db.get(key) ?? {};
        const value = object.value ?? null;
        socket.write(protocol.encodeRespBulkString(value));
    },
};

module.exports = {
    ping,
    echo,
    set,
    get,
};
