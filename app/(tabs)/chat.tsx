import React, { useState, useCallback } from 'react';
import { useColorScheme, StyleSheet, FlatList, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { Theme, Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

// Mock removed - using API

export default function RecentChatsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme as keyof typeof Colors];

  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChats = useCallback(async () => {
    try {
      const response = await api.get('/chat/conversations');
      if (response.success) {
        setChats(response.data);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchChats();
    }, [fetchChats])
  );

  const formatTime = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 86400000) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={{ color: themeColors.text }}>Messages</ThemedText>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
        </View>
      ) : chats.length === 0 ? (
        <View style={styles.centered}>
          <IconSymbol name="message.fill" size={48} color={themeColors.text + '20'} />
          <ThemedText style={{ color: themeColors.text + '60', marginTop: 16 }}>No messages yet</ThemedText>
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            const lastMsg = item.messages?.[item.messages.length - 1];
            return (
              <TouchableOpacity 
                style={[styles.chatItem, { borderBottomColor: themeColors.border }]}
                onPress={() => router.push(`/chat/${item._id}`)}
              >
                <View style={[styles.avatar, { backgroundColor: colorScheme === 'dark' ? 'rgba(10, 126, 164, 0.2)' : '#F0F8FF' }]}>
                  <IconSymbol name="person.fill" size={30} color={Theme.colors.primary} />
                </View>
                <View style={styles.chatInfo}>
                  <View style={styles.chatHeader}>
                    <ThemedText type="defaultSemiBold">{item.title || 'Support Chat'}</ThemedText>
                    <ThemedText style={styles.time}>{formatTime(item.updated_at)}</ThemedText>
                  </View>
                  <View style={styles.chatFooter}>
                    <ThemedText style={[styles.lastMessage, { color: themeColors.text + '99' }]} numberOfLines={1}>
                      {lastMsg?.message || 'New conversation'}
                    </ThemedText>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={styles.listContent}
        />
      )}
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
  },
  listContent: {
    paddingHorizontal: 20,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    opacity: 0.5,
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    opacity: 0.6,
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: '#0a7ea4',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
