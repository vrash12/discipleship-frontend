// LessonScreen.js

import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const COLORS = {
  primary: '#FF8C00',
  background: '#F5F5F5',
  textPrimary: '#333333',
  textSecondary: '#666666',
};

const LessonScreen = ({ route }) => {
  const { lesson } = route.params;

  return (
    <ScrollView style={styles.container}>
      {/* Image Section */}
      {lesson.imageUrl ? (
        <Image
          source={{ uri: lesson.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>No Image Available</Text>
        </View>
      )}

      {/* Content Section */}
      <View style={styles.content}>
        <Text style={styles.title}>{lesson.title || 'Untitled Lesson'}</Text>
        <Text style={styles.date}>{formatDate(lesson.date)}</Text>
        <Text style={styles.description}>
          {lesson.description ? String(lesson.description) : 'No description provided.'}
        </Text>
        <Text style={styles.contentText}>
          {lesson.content ? String(lesson.content) : 'No content available.'}
        </Text>
        {lesson.scriptureReference && (
          <Text style={styles.scripture}>
            Scripture Reference: {lesson.scriptureReference}
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown Date';
  const date = new Date(dateString);
  if (isNaN(date)) return 'Invalid Date';
  return date.toDateString();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  image: {
    width: '100%',
    height: 250,
  },
  imagePlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 15,
  },
  contentText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    lineHeight: 24,
    marginBottom: 15,
  },
  scripture: {
    fontSize: 16,
    color: COLORS.primary,
    fontStyle: 'italic',
  },
});

export default LessonScreen;
