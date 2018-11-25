import openSocket from "socket.io-client";

class ClientSocket {
  constructor() {
    this.isConnected = false;
    this.client = openSocket();
  }
}

export default new ClientSocket();
