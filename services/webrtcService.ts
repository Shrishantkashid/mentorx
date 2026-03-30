import { 
  RTCPeerConnection, 
  RTCIceCandidate, 
  RTCSessionDescription, 
  mediaDevices,
  MediaStream,
  RTCIceConnectionState,
} from 'react-native-webrtc';
import { socketService } from './socketService';

export type CallStatus = 'idle' | 'calling' | 'connected' | 'ended' | 'reconnecting';

class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private roomId: string | null = null;
  private targetSocketId: string | null = null;
  private onRemoteStreamCallback: ((stream: MediaStream) => void) | null = null;
  private onStatusChangeCallback: ((status: CallStatus) => void) | null = null;
  private status: CallStatus = 'idle';

  private configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
    ],
  };

  setStatus(newStatus: CallStatus) {
    this.status = newStatus;
    this.onStatusChangeCallback?.(newStatus);
  }

  async setupLocalStream() {
    try {
      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: {
          facingMode: 'user',
        },
      });
      this.localStream = stream as any;
      return stream as any as MediaStream;
    } catch (error) {
      console.error('Error setting up local stream:', error);
      throw error;
    }
  }

  async startCall(roomId: string, remoteStreamCallback: (stream: MediaStream) => void, statusCallback: (status: CallStatus) => void) {
    this.roomId = roomId;
    this.onRemoteStreamCallback = remoteStreamCallback;
    this.onStatusChangeCallback = statusCallback;
    this.setStatus('calling');

    const socket = socketService.getSocket();
    if (!socket) {
      console.error('Socket not connected');
      this.setStatus('ended');
      return;
    }

    // Initialize socket listeners
    this.setupSocketListeners(socket);

    // Join room
    socket.emit('join-room', roomId);
  }

  private setupSocketListeners(socket: any) {
    socket.on('user-joined', async (remoteId: string) => {
      console.log('User joined room:', remoteId);
      this.targetSocketId = remoteId;
      await this.createPeerConnection(remoteId);
      
      // Create and send offer
      const offer = await this.peerConnection?.createOffer();
      await this.peerConnection?.setLocalDescription(offer);
      socket.emit('offer', { offer, target: remoteId });
    });

    socket.on('offer', async (data: { offer: any; sender: string }) => {
      console.log('Received offer from:', data.sender);
      this.targetSocketId = data.sender;
      await this.createPeerConnection(data.sender);
      await this.peerConnection?.setRemoteDescription(new RTCSessionDescription(data.offer));
      
      const answer = await this.peerConnection?.createAnswer();
      await this.peerConnection?.setLocalDescription(answer);
      socket.emit('answer', { answer, target: data.sender });
    });

    socket.on('answer', async (data: { answer: any; sender: string }) => {
      console.log('Received answer from:', data.sender);
      await this.peerConnection?.setRemoteDescription(new RTCSessionDescription(data.answer));
    });

    socket.on('ice-candidate', async (data: { candidate: any; sender: string }) => {
      if (this.peerConnection) {
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    });

    socket.on('user-left', (remoteId: string) => {
      if (remoteId === this.targetSocketId) {
        this.setStatus('ended');
        this.cleanup();
      }
    });
  }

  private async createPeerConnection(remoteId: string) {
    if (this.peerConnection) return;

    this.peerConnection = new RTCPeerConnection(this.configuration);

    // Add local tracks to peer connection
    if (this.localStream) {
      this.localStream.getTracks().forEach((track: any) => {
        this.peerConnection?.addTrack(track, this.localStream!);
      });
    }

    this.peerConnection.onicecandidate = (event: { candidate: RTCIceCandidate | null }) => {
      if (event.candidate) {
        socketService.getSocket()?.emit('ice-candidate', {
          candidate: event.candidate,
          target: remoteId,
        });
      }
    };

    this.peerConnection.oniceconnectionstatechange = () => {
      console.log('ICE Connection State:', this.peerConnection?.iceConnectionState);
      if (this.peerConnection?.iceConnectionState === 'connected') {
        this.setStatus('connected');
      } else if (this.peerConnection?.iceConnectionState === 'failed' || this.peerConnection?.iceConnectionState === 'closed') {
        this.setStatus('ended');
      }
    };

    this.peerConnection.ontrack = (event: { streams: ReadonlyArray<MediaStream> }) => {
      console.log('Received remote track');
      if (event.streams && event.streams[0]) {
        this.remoteStream = event.streams[0] as any;
        this.onRemoteStreamCallback?.(this.remoteStream!);
      }
    };
  }

  switchCamera() {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        (videoTrack as any)._switchCamera();
      }
    }
  }

  toggleMute(enabled: boolean) {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = enabled;
      }
    }
  }

  toggleVideo(enabled: boolean) {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = enabled;
      }
    }
  }

  cleanup() {
    const socket = socketService.getSocket();
    if (socket && this.roomId) {
      socket.emit('leave-room', this.roomId);
      socket.off('user-joined');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      socket.off('user-left');
    }

    if (this.localStream) {
      this.localStream.getTracks().forEach((track: any) => track.stop());
      this.localStream = null;
    }

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    this.remoteStream = null;
    this.targetSocketId = null;
    this.roomId = null;
  }
}

export const webrtcService = new WebRTCService();
