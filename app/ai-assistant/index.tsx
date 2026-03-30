import React, { useState, useRef, useEffect } from 'react';
import { useColorScheme, StyleSheet, FlatList, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LinearGradient } from 'expo-linear-gradient';
import { careerService } from '@/services/careerService';
import { useCareer } from '@/context/CareerContext';
import { Theme, Colors } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const SUGGESTIONS = [
  'How to become a Web3 Dev?',
  'Review my Roadmap',
  'What skills are in demand?',
  'Salary info for Junior Devs',
];

export default function AIAssistantScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme as keyof typeof Colors];
  const { updateCareer } = useCareer();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your MentorX AI Assistant. I can help you with career paths, skill suggestions, and navigating your learning roadmap. How can I help you today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      // 1. Get real AI response from our backend AI route
      const result = await careerService.getAIResponse(text.trim());
      
      // 2. Handle specific actions (like roadmap updates)
      if (result.action === 'roadmap_updated' && result.data) {
        updateCareer(result.data);
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: result.answer,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('AI Assistant Error:', error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting to my brain right now. Please check your internet connection and try again.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
  }, [messages, isTyping]);

  return (
    <ThemedView style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header */}
      <LinearGradient colors={[Theme.colors.primary, '#005f7a']} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <ThemedText type="title" style={styles.headerTitle}>AI Assistant</ThemedText>
          <ThemedText style={styles.headerStatus}>Online • Specialized in Tech Careers</ThemedText>
        </View>
        <View style={styles.aiIcon}>
          <IconSymbol name="star.fill" size={20} color="#fff" />
        </View>
      </LinearGradient>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.messageRow, item.sender === 'user' ? styles.userRow : styles.aiRow]}>
            {item.sender === 'ai' && (
              <View style={[styles.aiAvatar, { backgroundColor: themeColors.surface }]}>
                <IconSymbol name="star.fill" size={12} color={Theme.colors.primary} />
              </View>
            )}
            <Card variant={item.sender === 'user' ? 'elevated' : 'flat'} padding="sm" 
              style={[
                styles.bubble, 
                item.sender === 'user' ? styles.userBubble : [styles.aiBubble, { backgroundColor: themeColors.surface, borderColor: themeColors.border }],
                item.sender === 'user' ? {} : { borderColor: themeColors.border }
              ] as any}>
              <ThemedText style={[styles.messageText, { color: item.sender === 'user' ? '#fff' : themeColors.text }]}>
                {item.text}
              </ThemedText>
            </Card>
          </View>
        )}
        ListFooterComponent={isTyping ? (
          <View style={styles.aiRow}>
            <View style={styles.aiAvatar}>
               <IconSymbol name="star.fill" size={12} color={Theme.colors.primary} />
            </View>
            <Card variant="flat" padding="sm" style={styles.aiBubble}>
              <ThemedText style={styles.typingText}>Thinking...</ThemedText>
            </Card>
          </View>
        ) : null}
        contentContainerStyle={styles.listContent}
      />

      {/* Suggestions */}
      {messages.length < 3 && (
        <View style={styles.suggestionsWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsContainer}>
            {SUGGESTIONS.map(s => (
              <TouchableOpacity key={s} onPress={() => handleSend(s)}>
                <Card variant="flat" padding="sm" style={styles.suggestionBtn}>
                  <ThemedText style={styles.suggestionText}>{s}</ThemedText>
                </Card>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Input */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={100}>
        <View style={[styles.inputArea, { borderTopColor: themeColors.border }] as any}>
          <Card variant="flat" padding="xs" style={[styles.inputBox, { backgroundColor: themeColors.surface, borderColor: themeColors.border }] as any}>
            <TextInput
              style={[styles.input, { color: themeColors.text }]}
              placeholder="Type your question..."
              placeholderTextColor={themeColors.text + '80'}
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity 
              style={[styles.sendButton, !inputText.trim() && styles.sendDisabled]} 
              onPress={() => handleSend(inputText)}
              disabled={!inputText.trim()}
            >
              <IconSymbol name="paperplane.fill" size={20} color="#fff" />
            </TouchableOpacity>
          </Card>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  headerStatus: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
  },
  aiIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '85%',
  },
  userRow: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  aiRow: {
    alignSelf: 'flex-start',
  },
  aiAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 4,
  },
  bubble: {
    borderRadius: Theme.borderRadius.lg,
  },
  aiBubble: {
    backgroundColor: Theme.colors.surface,
    borderTopLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: Theme.colors.primary,
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    color: Theme.colors.text,
  },
  userMessageText: {
    color: '#fff',
  },
  typingText: {
    fontSize: 13,
    color: Theme.colors.textMuted,
    fontStyle: 'italic',
  },
  suggestionsWrapper: {
    paddingVertical: 12,
  },
  suggestionsContainer: {
    paddingHorizontal: 20,
    gap: 8,
  },
  suggestionBtn: {
    paddingHorizontal: 16,
    borderRadius: Theme.borderRadius.full,
  },
  suggestionText: {
    fontSize: 13,
    color: Theme.colors.primary,
    fontWeight: '600',
  },
  inputArea: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Theme.colors.text,
    paddingVertical: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sendDisabled: {
    backgroundColor: Theme.colors.border,
  },
});
