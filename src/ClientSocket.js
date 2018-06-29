import openSocket from 'socket.io-client';

class ClientSocket {
  constructor() {
    this.initialized = false;
    this.isConnected = false;
    this.connectedToRoom = undefined;
    this.client = openSocket();
  }
}

export default new ClientSocket();
