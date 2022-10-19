const encodeRespError = (str) => `-${str}\r\n`;
const encodeRespString = (str) => `+${str}\r\n`;
const encodeRespInteger = (str) => `:${str}\r\n`;
const encodeRespBulkString = (str) =>
    str === null ? '$-1\r\n' : `$${Buffer.from(str).byteLength}\r\n${str}\r\n`;

const encodeRespArray = (list) =>
    list === null ? '*-1\r\n' : `*${list.length}\r\n` + list.join('');

const decodeRespError = (str) => str.replace('-', '').trim();
const decodeRespInteger = (str) => str.replace(':', '').trim();
const decodeRespString = (str) => str.replace('+', '').trim();
const decodeRespBulkString = (str) =>
    str === '$-1\r\n' ? null : str.replace(/\$\d/g, '').trim();
    
const decodeRespArray = (str) => {
    if (str === '*0\r\n') return [];

    const parts = str.split('\r\n').filter((it) => it !== '');
    const result = [];
    for (const part of parts) {
        if (part === '$-1') { 
            result.push(null);
        }
        if (!part.match(/\$|-|\*|\:|\+/g)) {
            result.push(part);
        }
    }
    return result;
};

const decode = (str) => {
    const type = str[0];

    if (type === '-') return decodeRespError(str);
    if (type === '+') return decodeRespString(str);
    if (type === ':') return decodeRespInteger(str);
    if (type === '$') return decodeRespBulkString(str);
    if (type === '*') return decodeRespArray(str);
};

module.exports = {
    encodeRespError,
    encodeRespString,
    encodeRespInteger,
    encodeRespBulkString,
    encodeRespArray,
    decodeRespError,
    decodeRespInteger,
    decodeRespString,
    decodeRespBulkString,
    decodeRespArray,
    decode,
};
