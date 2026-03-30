import React, { useState, useEffect, useRef } from 'react';
import { useColorScheme, StyleSheet, FlatList, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Theme, Colors } from '@/constants/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { socketService } from '@/services/socketService';
import { useAuth } from '@/hooks/useAuth';
import { mentorService } from '@/services/mentorService';

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: Date;
}

export default function ChatRoomScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme as keyof typeof Colors];
  const [mentor, setMentor] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const [isSocketConnected, setIsSocketConnected] = useState(true);

  useEffect(() => {
    const initChat = async () => {
      if (!id) return;
      
      const mentorData = await mentorService.getMentorById(id as string);
      setMentor(mentorData);
      setIsLoading(false);

      socketService.onStatusChange((connected) => {
        setIsSocketConnected(connected);
      });

      socketService.connect();
      socketService.joinRoom(id as string);

      socketService.onMessage((msg) => {
        setMessages(prev => [...prev, { ...msg, timestamp: new Date(msg.timestamp) }]);
      });
    };

    initChat();

    return () => {
      socketService.offMessage();
    };
  }, [id]);

  const sendMessage = () => {
    if (!inputText.trim() || !user) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      senderId: user.id,
      timestamp: new Date(),
    };

    socketService.sendMessage(id as string, newMessage);
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    
    // Scroll to bottom
    setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMine = item.senderId === user?.id;
    return (
      <View style={[styles.messageBubble, isMine ? styles.myMessage : styles.theirMessage]}>
        <ThemedText style={[styles.messageText, isMine && styles.myMessageText]}>
          {item.text}
        </ThemedText>
        <ThemedText style={[styles.timestamp, isMine && styles.myTimestamp]}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </ThemedText>
      </View>
    );
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: themeColors.surface, borderBottomColor: themeColors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={24} color={themeColors.text} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <ThemedText type="defaultSemiBold" style={{ color: themeColors.text }}>{mentor?.name || 'Mentor'}</ThemedText>
            <ThemedText style={[styles.onlineStatus, !isSocketConnected && styles.offlineStatus]}>
              {isSocketConnected ? 'Online' : 'Reconnecting...'}
            </ThemedText>
          </View>
          <TouchableOpacity style={styles.headerIcon}>
            <IconSymbol name="video.fill" size={20} color={Theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {!isSocketConnected && (
          <View style={styles.offlineBanner}>
            <ThemedText style={styles.offlineBannerText}>
              Connection lost. Trying to reconnect...
            </ThemedText>
          </View>
        )}

        {/* Message List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        />

        {/* Input Bar */}
        <View style={[styles.inputBar, { backgroundColor: themeColors.surface, borderTopColor: themeColors.border }]}>
          <TouchableOpacity style={styles.attachButton}>
            <IconSymbol name="plus" size={22} color={themeColors.text + '80'} />
          </TouchableOpacity>
          <TextInput
            style={[styles.input, { backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : '#F5F7F9', color: themeColors.text }]}
            placeholder="Type a message..."
            placeholderTextColor={themeColors.text + '80'}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]} 
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <IconSymbol name="paperplane.fill" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#fff',
  },
  backButton: {
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  onlineStatus: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  offlineStatus: {
    color: '#FF9800',
  },
  offlineBanner: {
    backgroundColor: '#FFF3E0',
    paddingVertical: 4,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#FFE0B2',
  },
  offlineBannerText: {
    fontSize: 12,
    color: '#E65100',
    fontWeight: '500',
  },
  headerIcon: {
    padding: 8,
  },
  messageList: {
    padding: 16,
    paddingBottom: 20,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#0a7ea4',
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F0F0',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    color: '#333',
  },
  myMessageText: {
    color: '#fff',
  },
  timestamp: {
    fontSize: 10,
    opacity: 0.5,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  myTimestamp: {
    color: '#fff',
    opacity: 0.7,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 30 : 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#fff',
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F7F9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    maxHeight: 100,
    fontSize: 15,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0a7ea4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
});
