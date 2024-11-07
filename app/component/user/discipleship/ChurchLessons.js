// ChurchLessons.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import SidebarNav from '../SidebarNav'; // Ensure this component exists
import * as Animatable from 'react-native-animatable';
import { Icon } from 'react-native-elements';
import { Audio } from 'expo-av';
import { WebView } from 'react-native-webview';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const COLORS = {
  primary: '#FF8C00',
  secondary: '#4CAF50',
  background: '#F5F5F5',
  cardBackground: '#FFFFFF',
  textPrimary: '#333333',
  textSecondary: '#666666',
  accent: '#FF9800',
};

// Enable LayoutAnimation on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ChurchLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [sermons, setSermons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [filteredSermons, setFilteredSermons] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  // Filter state variables
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDateRange, setSelectedDateRange] = useState('All');

  // Pagination state variables
  const [currentLessonPage, setCurrentLessonPage] = useState(1);
  const [currentSermonPage, setCurrentSermonPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default items per page

  useEffect(() => {
    fetchContent();
  }, []);

  useEffect(() => {
    applyFilters();
    // Reset to the first page when filters change
    setCurrentLessonPage(1);
    setCurrentSermonPage(1);
  }, [lessons, sermons, searchQuery, selectedCategory, selectedDateRange]);

  useEffect(() => {
    // When itemsPerPage changes, reset pages
    setCurrentLessonPage(1);
    setCurrentSermonPage(1);
  }, [itemsPerPage]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      console.log('User ID:', userId);

      const [lessonsResponse, sermonsResponse] = await Promise.all([
        axios.get('https://backend-disciple-a692164f13b9.herokuapp.com/api/lessons', { params: { userId } }),
        axios.get('https://backend-disciple-a692164f13b9.herokuapp.com/api/sermons', { params: { userId } }),
      ]);

      setLessons(lessonsResponse.data);
      setSermons(sermonsResponse.data);
      console.log('Fetched Lessons:', lessonsResponse.data);
      console.log('Fetched Sermons:', sermonsResponse.data);
    } catch (error) {
      console.error('Error fetching content:', error);
      Alert.alert('Error', 'Failed to load content.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchContent();
    setRefreshing(false);
  };

  const applyFilters = () => {
    const filteredLessons = filterContent(lessons);
    const filteredSermons = filterContent(sermons);
    setFilteredLessons(filteredLessons);
    setFilteredSermons(filteredSermons);
  };

  const filterContent = (contentArray) => {
    return contentArray.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesDate = checkDateRange(item.date, selectedDateRange);
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesDate && matchesSearch;
    });
  };

  const checkDateRange = (dateString, range) => {
    if (range === 'All') return true;

    if (!dateString) return false; // Exclude items without a date

    const itemDate = new Date(dateString);
    if (isNaN(itemDate)) return false;

    const now = new Date();

    switch (range) {
      case 'Latest':
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return itemDate >= oneWeekAgo && itemDate <= now;
      case 'This Month':
        return (
          itemDate.getMonth() === now.getMonth() &&
          itemDate.getFullYear() === now.getFullYear()
        );
      case 'This Year':
        return itemDate.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  };

 // Add this function inside your ChurchLessons component
const navigateToLessonDetail = (lesson) => {
  navigation.navigate('LessonScreen', { lesson: lesson });
};

const navigateToSermonDetail = (sermon) => {
  navigation.navigate('SermonScreen', { sermon: sermon });
};
const renderLessonItem = ({ item, index }) => {
  return (
    <Animatable.View
      animation="fadeInUp"
      delay={index * 100}
      style={styles.lessonCard}
    >
      <TouchableOpacity onPress={() => navigateToLessonDetail(item)}>
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.lessonImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.lessonImagePlaceholder}>
            <Text style={styles.placeholderText}>No Image Available</Text>
          </View>
        )}
        <View style={styles.lessonContent}>
          <Text style={styles.lessonTitle}>{item.title}</Text>
          <Text style={styles.lessonDate}>{formatDate(item.date)}</Text>
          <Text numberOfLines={3} style={styles.lessonDescription}>
            {item.description}
          </Text>
          <View style={styles.readMoreContainer}>
            <Text style={styles.readMoreText}>Read More</Text>
            <Icon
              name="chevron-right"
              type="feather"
              color={COLORS.accent}
              size={16}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );
};


  const renderSermonItem = ({ item, index }) => {
    return (
      <Animatable.View
        animation="fadeInUp"
        delay={index * 100}
        style={styles.sermonCard}
      >
        <TouchableOpacity onPress={() => navigateToSermonDetail(item)}>
          <View style={styles.sermonHeader}>
            <Text style={styles.sermonTitle}>{item.title}</Text>
            <View style={styles.sermonActions}>
              {/* Options Menu (Placeholder for future functionality) */}
            </View>
          </View>
          <Text style={styles.sermonDate}>{formatDate(item.date)}</Text>
          <Text numberOfLines={3} style={styles.sermonDescription}>
            {item.description}
          </Text>
          <View style={styles.readMoreContainer}>
            <Text style={styles.readMoreText}>Read More</Text>
            <Icon
              name="chevron-right"
              type="feather"
              color={COLORS.accent}
              size={16}
            />
          </View>
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown Date';
    const date = new Date(dateString);
    if (isNaN(date)) return 'Invalid Date';
    return date.toDateString();
  };

  // Pagination Logic
  const totalLessonPages = Math.ceil(filteredLessons.length / itemsPerPage);
  const totalSermonPages = Math.ceil(filteredSermons.length / itemsPerPage);

  const displayedLessons = filteredLessons.slice(
    (currentLessonPage - 1) * itemsPerPage,
    currentLessonPage * itemsPerPage
  );

  const displayedSermons = filteredSermons.slice(
    (currentSermonPage - 1) * itemsPerPage,
    currentSermonPage * itemsPerPage
  );

  return (
    <View style={styles.container}>
      <SidebarNav navigation={navigation} />
      <View style={styles.content}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Filter Section */}
          <View style={styles.filterContainer}>
            {/* Search Bar */}
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#999" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Category Filter */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['All', 'Faith', 'Worship', 'Prayer'].map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.filterButton,
                    selectedCategory === category && styles.filterButtonActive,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      selectedCategory === category &&
                        styles.filterButtonTextActive,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Date Range Filter */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['All', 'Latest', 'This Month', 'This Year'].map((range) => (
                <TouchableOpacity
                  key={range}
                  style={[
                    styles.filterButton,
                    selectedDateRange === range && styles.filterButtonActive,
                  ]}
                  onPress={() => setSelectedDateRange(range)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      selectedDateRange === range &&
                        styles.filterButtonTextActive,
                    ]}
                  >
                    {range}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Items Per Page Selector */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[5, 10, 20].map((count) => (
                <TouchableOpacity
                  key={count}
                  style={[
                    styles.filterButton,
                    itemsPerPage === count && styles.filterButtonActive,
                  ]}
                  onPress={() => setItemsPerPage(count)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      itemsPerPage === count && styles.filterButtonTextActive,
                    ]}
                  >
                    Show {count}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Lessons Section */}
          <Text style={styles.sectionHeader}>Church Lessons</Text>
          {displayedLessons.length > 0 ? (
            <>
              <FlatList
                data={displayedLessons}
                keyExtractor={(item) => item.lessonID.toString()}
                renderItem={renderLessonItem}
                contentContainerStyle={styles.lessonList}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
              />
              {/* Pagination Controls */}
              <View style={styles.paginationContainer}>
                <TouchableOpacity
                  style={[
                    styles.paginationButton,
                    currentLessonPage === 1 && styles.paginationButtonDisabled,
                  ]}
                  onPress={() =>
                    setCurrentLessonPage(
                      currentLessonPage > 1 ? currentLessonPage - 1 : 1
                    )
                  }
                  disabled={currentLessonPage === 1}
                >
                  <Ionicons name="arrow-back" size={24} color="#FFF" />
                  <Text style={styles.paginationButtonText}>Previous</Text>
                </TouchableOpacity>
                <Text style={styles.pageNumber}>
                  {currentLessonPage} / {totalLessonPages}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.paginationButton,
                    currentLessonPage === totalLessonPages &&
                      styles.paginationButtonDisabled,
                  ]}
                  onPress={() =>
                    setCurrentLessonPage(
                      currentLessonPage < totalLessonPages
                        ? currentLessonPage + 1
                        : totalLessonPages
                    )
                  }
                  disabled={currentLessonPage === totalLessonPages}
                >
                  <Text style={styles.paginationButtonText}>Next</Text>
                  <Ionicons name="arrow-forward" size={24} color="#FFF" />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <Text style={styles.noLessonsText}>No lessons available.</Text>
          )}

          {/* Sermons Section */}
          <Text style={styles.sectionHeader}>Sermons</Text>
          {displayedSermons.length > 0 ? (
            <>
              <FlatList
                data={displayedSermons}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderSermonItem}
                contentContainerStyle={styles.sermonList}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
              />
              {/* Pagination Controls */}
              <View style={styles.paginationContainer}>
                <TouchableOpacity
                  style={[
                    styles.paginationButton,
                    currentSermonPage === 1 && styles.paginationButtonDisabled,
                  ]}
                  onPress={() =>
                    setCurrentSermonPage(
                      currentSermonPage > 1 ? currentSermonPage - 1 : 1
                    )
                  }
                  disabled={currentSermonPage === 1}
                >
                  <Ionicons name="arrow-back" size={24} color="#FFF" />
                  <Text style={styles.paginationButtonText}>Previous</Text>
                </TouchableOpacity>
                <Text style={styles.pageNumber}>
                  {currentSermonPage} / {totalSermonPages}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.paginationButton,
                    currentSermonPage === totalSermonPages &&
                      styles.paginationButtonDisabled,
                  ]}
                  onPress={() =>
                    setCurrentSermonPage(
                      currentSermonPage < totalSermonPages
                        ? currentSermonPage + 1
                        : totalSermonPages
                    )
                  }
                  disabled={currentSermonPage === totalSermonPages}
                >
                  <Text style={styles.paginationButtonText}>Next</Text>
                  <Ionicons name="arrow-forward" size={24} color="#FFF" />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <Text style={styles.noSermonsText}>No sermons available.</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  // ... (same as your existing styles)
  // Ensure styles are defined for the new components
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  noContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noContentText: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
  sectionHeader: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.primary,
  },
  lessonList: {
    paddingBottom: 20,
  },
  lessonCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  lessonImage: {
    width: '100%',
    height: 180,
  },
  lessonContent: {
    padding: 15,
  },
  lessonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  lessonDate: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  lessonDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 15,
  },
  readMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    fontSize: 14,
    color: COLORS.accent,
    fontWeight: 'bold',
    marginRight: 5,
  },
  sermonList: {
    paddingBottom: 20,
  },
  sermonCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    marginBottom: 20,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  sermonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sermonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  sermonDate: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginVertical: 5,
  },
  sermonDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 15,
  },
  mediaContainer: {
    marginTop: 10,
    flex: 1,
  },
  youtubeContainer: {
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  audioPlayerContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  playPauseButton: {
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  timeText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  pdfContainer: {
    marginTop: 10,
    flex: 1,
  },
  pdfViewer: {
    flex: 1,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  pdfActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFF',
    marginLeft: 5,
    fontSize: 16,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  loadingContainer: {
    marginTop: 20,
  },
  noLessonsText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  noSermonsText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  actionButton: {
    padding: 5,
  },
  // Filter Styles
  filterContainer: {
    marginBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 10,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    height: '100%',
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterButtonText: {
    color: COLORS.textSecondary,
  },
  filterButtonTextActive: {
    color: '#FFF',
  },
  // Pagination Styles
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  paginationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  paginationButtonDisabled: {
    backgroundColor: '#ccc',
  },
  paginationButtonText: {
    color: '#FFF',
    fontSize: 16,
    marginHorizontal: 5,
  },
  pageNumber: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});

export default ChurchLessons;
