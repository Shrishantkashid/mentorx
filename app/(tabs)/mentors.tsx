import React, { useState, useEffect } from 'react';
import { useColorScheme, StyleSheet, FlatList, View, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { MentorCard } from '@/components/features/dashboard/MentorCard';
import { mentorService, Mentor } from '@/services/mentorService';

const CATEGORIES = ['All', 'Tech', 'Business', 'Design'];
import { Theme, Colors } from '@/constants/theme';

export default function MentorListScreen() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme as keyof typeof Colors];
  const [error, setError] = useState<string | null>(null);

  const fetchMentors = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await mentorService.getMentors(searchQuery, selectedCategory);
      setMentors(data);
    } catch (err) {
      setError('Failed to load mentors. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, [searchQuery, selectedCategory]);

  const renderHeader = () => (
    <View style={styles.header}>
      <ThemedText type="title" style={styles.title}>Find a Mentor</ThemedText>
      
      <View style={[styles.searchContainer, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
        <IconSymbol name="magnifyingglass" size={20} color={themeColors.text + '80'} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: themeColors.text }]}
          placeholder="Search name or skill..."
          placeholderTextColor={themeColors.text + '80'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity 
            key={cat} 
            style={[
              styles.categoryBadge, 
              { backgroundColor: themeColors.surface, borderColor: themeColors.border },
              selectedCategory === cat && styles.selectedCategory
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <ThemedText style={[styles.categoryText, { color: themeColors.text + '99' }, selectedCategory === cat && styles.selectedCategoryText]}>
              {cat}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <ThemedText style={styles.emptyText}>
        {isLoading ? 'Searching...' : 'No mentors found matching your criteria.'}
      </ThemedText>
    </View>
  );

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={fetchMentors}>
          <ThemedText style={styles.retryText}>Retry</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={mentors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MentorCard 
            {...item}
            fullWidth
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={fetchMentors}
      />
    </ThemedView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  categoriesScroll: {
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f7f9',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedCategory: {
    backgroundColor: '#0a7ea4',
    borderColor: '#0a7ea4',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    opacity: 0.5,
    textAlign: 'center',
  },
  errorText: {
    color: '#d32f2f',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#0a7ea4',
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
