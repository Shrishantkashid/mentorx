import React, { useState, useEffect, useCallback } from 'react';
import { useColorScheme, StyleSheet, View, TouchableOpacity, ActivityIndicator, Dimensions, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Theme, Colors } from '@/constants/theme';
import { RTCView, MediaStream } from 'react-native-webrtc';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { webrtcService, CallStatus } from '@/services/webrtcService';
import { socketService } from '@/services/socketService';

const { width, height } = Dimensions.get('window');

export default function VideoCallScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme as keyof typeof Colors];
  
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState<CallStatus>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const cleanup = useCallback(() => {
    webrtcService.cleanup();
  }, []);

  useEffect(() => {
    socketService.connect();
    
    const init = async () => {
      try {
        const stream = await webrtcService.setupLocalStream();
        setLocalStream(stream);
        
        // Use the mentor ID as the room ID
        const roomId = Array.isArray(id) ? id[0] : id;
        if (roomId) {
          webrtcService.startCall(
            roomId,
            (remote) => setRemoteStream(remote),
            (newStatus) => setStatus(newStatus)
          );
        }
      } catch (error) {
        console.error('Failed to initialize video call:', error);
      }
    };

    init();

    return () => {
      cleanup();
    };
  }, [id, cleanup]);

  const handleEndCall = () => {
    cleanup();
    router.back();
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    webrtcService.toggleMute(!newMuted); // enable = !muted
  };

  const toggleVideo = () => {
    const newVideoOff = !isVideoOff;
    setIsVideoOff(newVideoOff);
    webrtcService.toggleVideo(!newVideoOff); // enable = !off
  };

  const switchCamera = () => {
    webrtcService.switchCamera();
  };

  return (
    <ThemedView style={styles.container}>
      {/* Remote Video (Full Screen) */}
      <View style={styles.remoteViewContainer}>
        {remoteStream ? (
          <RTCView
            streamURL={remoteStream.toURL()}
            style={styles.remoteVideo}
            objectFit="cover"
          />
        ) : (
          <View style={styles.waitingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <ThemedText style={styles.waitingText}>
              {status === 'calling' ? 'Calling...' : 'Waiting for participant...'}
            </ThemedText>
          </View>
        )}
      </View>

      {/* Local Video (PIP) */}
      <View style={styles.localViewContainer}>
        {localStream && !isVideoOff ? (
          <RTCView
            streamURL={localStream.toURL()}
            style={styles.localVideo}
            objectFit="cover"
          />
        ) : (
          <View style={[styles.localVideo, styles.localVideoPlaceholder]}>
            <IconSymbol name="person.fill" size={30} color="#fff" />
          </View>
        )}
      </View>

      {/* Controls Overlay */}
      <SafeAreaView style={styles.controlsContainer}>
        <View style={styles.controlsRow}>
          <TouchableOpacity 
            style={[styles.controlButton, isMuted && styles.controlButtonActive]} 
            onPress={toggleMute}
          >
            <IconSymbol name={isMuted ? "mic.slash.fill" : "mic.fill"} size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.controlButton, isVideoOff && styles.controlButtonActive]} 
            onPress={toggleVideo}
          >
            <IconSymbol name={isVideoOff ? "video.slash.fill" : "video.fill"} size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={switchCamera}>
            <IconSymbol name="camera.rotate.fill" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.controlButton, styles.endCallButton]} onPress={handleEndCall}>
            <IconSymbol name="phone.down.fill" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Connection Status Label */}
      {status === 'reconnecting' && (
        <View style={styles.statusLabel}>
          <ThemedText style={styles.statusLabelText}>Reconnecting...</ThemedText>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  remoteViewContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  remoteVideo: {
    flex: 1,
  },
  localViewContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 120,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#333',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    elevation: 5,
    zIndex: 10,
  },
  localVideo: {
    flex: 1,
  },
  localVideoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#444',
  },
  waitingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  waitingText: {
    color: '#fff',
    opacity: 0.8,
    fontSize: 16,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonActive: {
    backgroundColor: 'rgba(255,0,0,0.5)',
  },
  endCallButton: {
    backgroundColor: '#FF5252',
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  statusLabel: {
    position: 'absolute',
    top: 70,
    left: 20,
    backgroundColor: 'rgba(255,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusLabelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});
