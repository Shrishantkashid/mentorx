import React from 'react';
import { useColorScheme, StyleSheet, View, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LinearGradient } from 'expo-linear-gradient';
import { useCareer } from '@/context/CareerContext';
import { Theme, Colors } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function TasksScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme as keyof typeof Colors];
  const { tasks, updateTaskStatus } = useCareer();

  const toggleTask = (id: string, currentStatus: boolean) => {
    updateTaskStatus(id, !currentStatus);
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <ThemedView style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={[Theme.colors.accent, '#E65100']}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color="#fff" />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.headerTitle}>Daily Tasks</ThemedText>
        <View style={styles.progressSummary}>
          <ThemedText style={styles.summaryText}>{completedCount} of {tasks.length} tasks completed</ThemedText>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>
      </LinearGradient>

      {/* Task List */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => toggleTask(item.id, item.completed)}
          >
            <Card variant={item.completed ? 'flat' : 'elevated'} style={[styles.taskCard, { backgroundColor: themeColors.surface }, item.completed && styles.taskCardCompleted] as any}>
              <View style={[
                styles.statusIndicator, 
                { borderColor: themeColors.border },
                item.completed && styles.statusCompleted,
              ]}>
                {item.completed && <IconSymbol name="checklist" size={14} color="#fff" />}
              </View>
              <View style={styles.taskContent}>
                <ThemedText style={[styles.taskTitle, { color: themeColors.text }, item.completed && styles.taskTitleCompleted]}>
                  {item.title}
                </ThemedText>
                <View style={styles.taskMeta}>
                  <Badge label={item.category || 'Goal'} variant={item.completed ? 'neutral' : 'primary'} />
                  <ThemedText style={[styles.dueDate, { color: themeColors.text + '99' }]}>Due {item.dueDate}</ThemedText>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <IconSymbol name="checklist" size={60} color="#E5E7EB" />
            <ThemedText style={styles.emptyText}>No tasks yet. Ask the AI to update your roadmap!</ThemedText>
          </View>
        }
      />

      {/* Add Task Button */}
      <TouchableOpacity style={styles.fab}>
        <LinearGradient
          colors={[Theme.colors.accent, '#E65100']}
          style={styles.fabGradient}
        >
          <IconSymbol name="plus" size={24} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  backButton: {
    marginBottom: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
  },
  progressSummary: {
    marginTop: 16,
  },
  summaryText: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  listContent: {
    padding: 20,
    paddingTop: 32,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskCardCompleted: {
    opacity: 0.6,
  },
  statusIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statusPending: {
    borderWidth: 2,
    borderColor: Theme.colors.border,
  },
  statusCompleted: {
    backgroundColor: Theme.colors.success,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.text,
    marginBottom: 6,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: Theme.colors.textMuted,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dueDate: {
    fontSize: 12,
    color: Theme.colors.textMuted,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    marginTop: 16,
    color: Theme.colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    ...Theme.shadows.dark,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
