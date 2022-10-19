const assert = require('assert')
const protocol = require('./protocol')

{
  const message = 'encodeRespError';
  const result = protocol.encodeRespError('err wrong xxx');
  const expected = '-err wrong xxx\r\n';
  assert.equal(result, expected, message)
}

{
  const message = 'decodeRespError';
  const result = protocol.decodeRespError('-err wrong xxx\r\n');
  const expected = 'err wrong xxx';
  assert.equal(result, expected, message)
}

{
  const message = 'encodeRespInteger';
  const result = protocol.encodeRespInteger('12');
  const expected = ':12\r\n';
  assert.equal(result, expected, message);
}

{
  const message = 'decodeRespInteger';
  const result = protocol.decodeRespInteger(':12\r\n');
  const expected = '12';
  assert.equal(result, expected, message);
}

{
  const message = 'encodeRespString';
  const result = protocol.encodeRespString('OK');
  const expected = '+OK\r\n';
  assert.equal(result, expected, message);
}

{
  const message = 'decodeRespString';
  const result = protocol.decodeRespString('+OK\r\n');
  const expected = 'OK';
  assert.equal(result, expected, message);
}

{
  const message = 'encodeRespBulkString';
  const result = protocol.encodeRespBulkString('hello');
  const expected = '$5\r\nhello\r\n';
  assert.equal(result, expected, message);
}

{
  const message = 'decodeRespBulkString';
  const result = protocol.decodeRespBulkString('$5\r\nhello\r\n');
  const expected = 'hello';
  assert.equal(result, expected, message);
}

{
  const message = 'encodeRespBulkString empty string';
  const result = protocol.encodeRespBulkString('');
  const expected = '$0\r\n\r\n';
  assert.equal(result, expected, message);
}

{
  const message = 'decodeRespBulkString empty string';
  const result = protocol.decodeRespBulkString('');
  const expected = '';
  assert.equal(result, expected, message);
}

{
  const message = 'encodeRespBulkString null bulk string';
  const result = protocol.encodeRespBulkString(null);
  const expected = '$-1\r\n';
  assert.equal(result, expected, message);
}

{
  const message = 'decodeRespBulkString null bulk string';
  const result = protocol.decodeRespBulkString('$-1\r\n');
  const expected = null;
  assert.equal(result, expected, message);
}

{
  const message = 'encodeRespArray';
  const result = protocol.encodeRespArray([
    protocol.encodeRespBulkString('hello'),
    protocol.encodeRespBulkString('world')
  ]);
  const expected = '*2\r\n$5\r\nhello\r\n$5\r\nworld\r\n';
  assert.equal(result, expected, message);
}

{
  const message = 'decodeRespArray';
  const result = protocol.decodeRespArray('*1\r\n$4\r\nping\r\n');
  const expected = ['ping'];
  assert.equal(result[0], expected[0], message);
}

{
  const message = 'encodeRespArray empty array';
  const result = protocol.encodeRespArray([]);
  const expected = '*0\r\n';
  assert.equal(result, expected, message);
}

{
  const message = 'decodeRespArray empty array';
  const result = protocol.decodeRespArray('*0\r\n');
  assert.equal(result.length, 0, message);
}

{
  const message = 'encodeRespArray array with null element';
  const result = protocol.encodeRespArray([
    protocol.encodeRespBulkString('hello'),
    protocol.encodeRespBulkString(null),
    protocol.encodeRespBulkString('world')
  ]);
  const expected = '*3\r\n$5\r\nhello\r\n$-1\r\n$5\r\nworld\r\n';
  assert.equal(result, expected, message);
}

{
  const message = 'decodeRespArray array with null element';
  const result = protocol.decodeRespArray(
    '*3\r\n$5\r\nhello\r\n$-1\r\n$5\r\nworld\r\n'
  );
  const expected = ['hello', null, 'world'];
  assert.equal(result[0], expected[0], message);
  assert.equal(result[1], expected[1], message);
  assert.equal(result[2], expected[2], message);
}

{
  const message = 'decodeRespArray';
  const result = protocol.decodeRespArray(
    '*2\r\n$4\r\nECHO\r\n$3\r\nhey\r\n'
  );
  const expected = ['ECHO', 'hey'];
  assert.equal(result[0], expected[0], message);
  assert.equal(result[1], expected[1], message);
}

