import { io } from 'socket.io-client';

const SOCKET_URL = process.env.SOCKET_URL || 'http://localhost:5000';
const TOKEN_A = process.env.TOKEN_A;
const TOKEN_B = process.env.TOKEN_B;
const ROOM_ID = process.env.ROOM_ID;
const TEST_TIMEOUT_MS = Number(process.env.TEST_TIMEOUT_MS || 15000);

if (!TOKEN_A || !TOKEN_B || !ROOM_ID) {
  console.error('Missing required env vars: TOKEN_A, TOKEN_B, ROOM_ID');
  process.exit(1);
}

const createClient = (token, label) => {
  const client = io(SOCKET_URL, {
    auth: { token },
    reconnection: false,
    timeout: 5000,
  });

  client.on('connect', () => {
    console.log(`${label} connected: ${client.id}`);
  });

  client.on('connect_error', (error) => {
    console.error(`${label} connection error:`, error.message);
    if (error.description) {
      console.error(`${label} connection details:`, error.description);
    }
  });

  client.on('socket-error', (data) => {
    console.error(`${label} socket error:`, data);
  });

  return client;
};

const clientA = createClient(TOKEN_A, 'Client A');
const clientB = createClient(TOKEN_B, 'Client B');

let messageReceived = false;
let codeReceived = false;

const finish = (exitCode = 0) => {
  clientA.disconnect();
  clientB.disconnect();

  setTimeout(() => {
    process.exit(exitCode);
  }, 250);
};

const runFlow = () => {
  console.log(`Running socket test against ${SOCKET_URL} for room ${ROOM_ID}`);

  clientB.on('receive-message', (data) => {
    console.log('Client B received:', data);
    messageReceived = true;

    clientA.emit('code-change', {
      roomId: ROOM_ID,
      code: 'const synced = true;',
    });
    console.log('Client A sent code change');
  });

  clientB.on('receive-code', (data) => {
    console.log('Client B received:', data);
    codeReceived = true;
    finish(0);
  });

  clientA.emit('join-room', { roomId: ROOM_ID });
  clientB.emit('join-room', { roomId: ROOM_ID });

  setTimeout(() => {
    clientA.emit('send-message', {
      roomId: ROOM_ID,
      message: 'Hello from Client A',
    });
    console.log('Client A sent message');
  }, 1000);
};

let connectedCount = 0;

const onConnected = () => {
  connectedCount += 1;

  if (connectedCount === 2) {
    runFlow();
  }
};

clientA.on('connect', onConnected);
clientB.on('connect', onConnected);

setTimeout(() => {
  if (!messageReceived || !codeReceived) {
    console.error('Socket test timed out');
    finish(1);
  }
}, TEST_TIMEOUT_MS);
