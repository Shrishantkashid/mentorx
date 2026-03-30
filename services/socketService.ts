import { io, Socket } from 'socket.io-client';
import { Platform } from 'react-native';

// Use 10.0.2.2 for Android emulator to access localhost, otherwise use localhost
const SOCKET_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;
  private statusCallback: ((connected: boolean) => void) | null = null;

  onStatusChange(callback: (connected: boolean) => void) {
    this.statusCallback = callback;
  }

  connect() {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 5000,
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
      this.statusCallback?.(true);
      console.log('Connected to Socket.IO server');
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      this.statusCallback?.(false);
      console.log('Disconnected from Socket.IO server');
    });

    this.socket.on('connect_error', (error) => {
      this.isConnected = false;
      this.statusCallback?.(false);
      // Quiet error logging
      console.log('Socket connectivity issue - system will retry in background');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Join a specific room (e.g., chat with a mentor)
  joinRoom(roomId: string) {
    this.socket?.emit('join', roomId);
  }

  // Send a message
  sendMessage(roomId: string, message: any) {
    this.socket?.emit('message', { roomId, ...message });
  }

  // Listen for new messages
  onMessage(callback: (message: any) => void) {
    this.socket?.on('message', callback);
  }

  // Stop listening for messages
  offMessage() {
    this.socket?.off('message');
  }

  getSocket() {
    return this.socket;
  }
}

export const socketService = new SocketService();
