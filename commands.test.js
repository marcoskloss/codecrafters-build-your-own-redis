const assert = require('assert');
const protocol = require('./protocol');
const commands = require('./commands');

const createMockedSocket = () => {
    return {
        writeMethodCalledWith: null,
        write(value) {
            this.writeMethodCalledWith = value;
        },
    }
}

const createDbMock = () => {
    return {
        map: new Map(),
        setCalledWith: null,
        getCalledWith: null,
        set(key, value) {
            this.setCalledWith = [key, value];
            this.map.set(key, value);
        },
        get(key) {
            this.getCalledWith = key;
            return this.map.get(key);
        }
    }
}

{
    const testMessage = 'match ping command';
    const isSinglePingCommand = commands.ping.match('PING');
    const isMultiplePingCommands = commands.ping.match(['PING', 'PING']);
    assert(isSinglePingCommand, testMessage);
    assert(isMultiplePingCommands, testMessage);
}

{
    const testMessage = 'doesnt match ping command';
    const isSinglePingCommand = commands.ping.match('PIN');
    const isMultiplePingCommands = commands.ping.match(['PIN', 'PIN']);
    assert.equal(isSinglePingCommand, false, testMessage);
    assert.equal(isMultiplePingCommands, false, testMessage);
}

{
    const testMessage = 'handle ping command';
    const socketMock = createMockedSocket();

    commands.ping.handle('', socketMock);
    const expected = protocol.encodeRespString('PONG');

    assert.equal(socketMock.writeMethodCalledWith, expected, testMessage);
}

{
    const testMessage = 'match echo command';
    const isEchoCommand = commands.echo.match(['ECHO', 'foo']);
    assert(isEchoCommand, testMessage);
}

{
    const testMessage = 'doesnt match echo command';
    assert.equal(commands.echo.match(['ECO', 'foo']), false, testMessage);
    assert.equal(commands.echo.match(['EHCO', 'foo']), false, testMessage);
    assert.equal(commands.echo.match(['ECH', 'foo']), false, testMessage);
    assert.equal(commands.echo.match(['ASDSAD', 'foo']), false, testMessage);
    assert.equal(commands.echo.match(['HECO', 'foo']), false, testMessage);
    assert.equal(commands.echo.match(['ECHOS', 'foo']), false, testMessage);
}

{
    const testMessage = 'match set command';
    const isSetCommand = commands.set.match(['SET', 'value']);
    assert(isSetCommand, testMessage);
}

{
    const testMessage = 'doesnt match set command';
    assert.equal(commands.set.match(['ST', 'value']), false, testMessage);
    assert.equal(commands.set.match(['SETA', 'value']), false, testMessage);
    assert.equal(commands.set.match(['STE', 'value']), false, testMessage);
    assert.equal(commands.set.match(['TES', 'value']), false, testMessage);
    assert.equal(commands.set.match(['asdasd', 'value']), false, testMessage);
}

{
    const testMessage = 'handle set command';
    const socketMock = createMockedSocket();
    const dbMock = createDbMock();
    const command = ['SET', 'key', 'value'];
    
    commands.set.handle(command, socketMock, dbMock);

    const expectedWriteResponse = protocol.encodeRespString('OK');
    assert.equal(
        socketMock.writeMethodCalledWith, 
        expectedWriteResponse, 
        testMessage
    );
    assert.equal(
        JSON.stringify(dbMock.setCalledWith), 
        JSON.stringify(['key', { value: 'value' }]), 
        testMessage
    );
}

{
    const testMessage = 'match get command';
    const isGetCommand = commands.get.match(['GET', 'foo']);
    assert(isGetCommand, testMessage);
}

{
    const testMessage = 'doesnt match get command';
    assert.equal(commands.get.match(['GTE', 'bar']), false, testMessage);
    assert.equal(commands.get.match(['GE', 'bar']), false, testMessage);
    assert.equal(commands.get.match(['TGE', 'bar']), false, testMessage);
    assert.equal(commands.get.match(['GETE', 'bar']), false, testMessage);
    assert.equal(commands.get.match(['str', 'bar']), false, testMessage);
}

{
    const testMessage = 'handle get command';
    const socketMock = createMockedSocket();
    const dbMock = createDbMock();
    const command = ['GET', 'some_key'];
    dbMock.map.set('some_key', { value: 'expectedValue' });

    commands.get.handle(command, socketMock, dbMock);

    const expectedWriteResponse = protocol.encodeRespBulkString(
        'expectedValue'
    );
        
    assert.equal(dbMock.getCalledWith, command[1], testMessage);
    assert.equal(
        socketMock.writeMethodCalledWith, 
        expectedWriteResponse, 
        testMessage
    );
}
