// DiscipleshipDashboard.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Icon } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import SidebarNav from '../SidebarNav';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const COLORS = {
  primary: '#FF8C00',
  secondary: '#32CD32',
  accent: '#FF6347',
  background: '#F5F5F5',
  text: '#333',
  lightText: '#FFF',
  placeholder: '#999',
  border: '#ddd',
  completed: '#32CD32',
  locked: '#FF8C00',
};

const lessons = [
  {
    id: '1',
    title: 'Lesson 1: Salvation New Life',
    titleTagalog: 'Aralin 1: Kaligtasan Bagong Buhay',
    image: require('../../assets/logos/lesson1.jpg'),
    screenEnglish: 'Lesson1English',
    screenTagalog: 'Lesson1Tagalog',
    quizId: 1,
  },
  {
    id: '2',
    title: 'Lesson 2: LORDSHIP (New Master)',
    titleTagalog: 'Aralin 2: Panginoon',
    image: require('../../assets/logos/lesson2.jpg'),
    screenEnglish: 'Lesson2English',
    screenTagalog: 'Lesson2Tagalog',
    quizId: 2,
  },
  {
    id: '3',
    title: 'Lesson 3: Bible New Standard',
    titleTagalog: 'Aralin 3: Bagong Pamantayan',
    image: require('../../assets/logos/lesson3.jpg'),
    screenEnglish: 'Lesson3English',
    screenTagalog: 'Lesson3Tagalog',
    quizId: 3,
  },
  {
    id: '4',
    title: 'Lesson 4: Prayer New Power',
    titleTagalog: 'Aralin 4: Panalangin Bagong Kapangyarihan',
    image: require('../../assets/logos/lesson4.jpg'),
    screenEnglish: 'Lesson4English',
    screenTagalog: 'Lesson4Tagalog',
    quizId: 4,
  },
  {
    id: '5',
    title: 'Lesson 5: Reaching the Next Generation',
    titleTagalog: 'Aralin 5: Pagtamo sa Susunod na Henerasyon',
    image: require('../../assets/logos/lesson5.jpg'),
    screenEnglish: 'Lesson5English',
    screenTagalog: 'Lesson5Tagalog',
    quizId: 5,
  },
];

const DiscipleshipDashboard = ({ navigation }) => {
  const [completedLessons, setCompletedLessons] = useState({});
  const [unlockedLessons, setUnlockedLessons] = useState({ '1': true });
  const [language, setLanguage] = useState(null);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [userId, setUserId] = useState(null);
  const [currentActiveItem, setCurrentActiveItem] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state

  const screenWidth = Dimensions.get('window').width;
  const expandedWidth = screenWidth * 0.5; // 50% of screen width
  const minimizedWidth = screenWidth * 0.16; // 16% of screen width

  useEffect(() => {
    const loadCompletionStatus = async () => {
      try {
        const storedCompletionStatus = await AsyncStorage.getItem('completionStatus');
        const storedLanguage = await AsyncStorage.getItem('selectedLanguage');
        const storedUserId = await AsyncStorage.getItem('userId');

        console.log('Stored Language:', storedLanguage); // Debugging

        if (storedCompletionStatus) {
          setCompletedLessons(JSON.parse(storedCompletionStatus));
        }
        if (storedLanguage) {
          setLanguage(storedLanguage);
          console.log('Language set to:', storedLanguage); // Debugging
        } else {
          // Don't navigate away here; wait until loading is complete
          console.log('No language found in AsyncStorage.');
        }

        if (storedUserId) {
          const parsedUserId = parseInt(storedUserId, 10);
          if (!isNaN(parsedUserId)) {
            setUserId(parsedUserId);
            console.log('User ID set to:', parsedUserId); // Debugging

            // Fetch completed quizzes from the backend
            const response = await axios.get('https://backend-disciple-a692164f13b9.herokuapp.com/api/quiz/completed', {
              params: { userId: parsedUserId },
            });
            const completedQuizIds = response.data.completedQuizIds;

            // Update state with completed quizzes
            setCompletedQuizzes(completedQuizIds);
            console.log('Completed Quizzes:', completedQuizIds); // Debugging
          } else {
            console.error('Invalid user ID format.');
          }
        } else {
          console.error('User ID not found in AsyncStorage.');
        }
      } catch (error) {
        console.error('Failed to load lesson completion status:', error);
      } finally {
        setLoading(false); // Set loading to false after data is loaded
      }
    };
    loadCompletionStatus();
  }, []);

  useEffect(() => {
    // Update unlocked lessons based on completed quizzes
    const updateUnlockedLessons = () => {
      const updatedUnlockedLessons = { '1': true }; // Lesson 1 is always unlocked
      completedQuizzes.forEach((quizId) => {
        const nextLessonId = (parseInt(quizId) + 1).toString();
        updatedUnlockedLessons[nextLessonId] = true;
      });
      setUnlockedLessons(updatedUnlockedLessons);
    };
    updateUnlockedLessons();
  }, [completedQuizzes]);

  const handleLessonCompletion = async (lessonId) => {
    const updatedCompletionStatus = { ...completedLessons, [lessonId]: true };
    setCompletedLessons(updatedCompletionStatus);

    try {
      await AsyncStorage.setItem('completionStatus', JSON.stringify(updatedCompletionStatus));
    } catch (error) {
      console.error('Failed to save lesson completion status:', error);
    }
  };

  const handleScreenPress = (item) => {
    setCurrentActiveItem(item.id);
    if (!item.isLocked) {
      navigation.navigate(language === 'en' ? item.screenEnglish : item.screenTagalog, {
        onComplete: () => handleLessonCompletion(item.id),
      });
    } else {
      Alert.alert(
        language === 'en' ? 'Lesson Locked' : 'Aralin ay Naka-lock',
        language === 'en'
          ? 'Please complete the previous quiz to unlock this lesson.'
          : 'Mangyaring tapusin ang nakaraang pagsusulit upang i-unlock ang araling ito.'
      );
    }
  };

  const renderLessonItem = ({ item }) => {
    const isCompleted = completedLessons[item.id];
    const isLocked = !unlockedLessons[item.id];
    const hasPassedQuiz = item.quizId && completedQuizzes.includes(parseInt(item.quizId));

    return (
      <Animatable.View animation="fadeInUp" delay={parseInt(item.id) * 100}>
        <TouchableOpacity
          style={[styles.lessonItem, isLocked && styles.lockedLessonItem]}
          onPress={() => handleScreenPress({ ...item, isLocked })}
        >
          <Image source={item.image} style={styles.lessonImage} />
          <View style={styles.lessonTextContainer}>
            <Text style={styles.lessonTitle}>
              {language === 'en' ? item.title : item.titleTagalog}
            </Text>
          </View>
          {isCompleted && (
            <Icon name="check-circle" type="font-awesome" color={COLORS.completed} />
          )}
          {hasPassedQuiz && (
            <Icon name="star" type="font-awesome" color={COLORS.accent} />
          )}
          {isLocked && (
            <Icon name="lock" type="font-awesome" color={COLORS.locked} />
          )}
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  if (loading) {
    // Show loading indicator
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!language) {
    // Language not selected, navigate to LanguageSelection
    navigation.replace('LanguageSelection');
    return null;
  }

  return (
    <View style={styles.container}>
      <SidebarNav
        navigation={navigation}
        isNavbarMinimized={false} // Adjust as needed
        setIsNavbarMinimized={() => {}} // Adjust as needed
        language={language}
      />

      <View style={styles.mainContent}>
        <Text style={styles.header}>
          {language === 'en' ? 'Discipleship Journey' : 'Paglalakbay ng Pagdidisipulo'}
        </Text>
        <FlatList
          data={lessons}
          renderItem={renderLessonItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lessonList}
          extraData={{ completedLessons, unlockedLessons, language, completedQuizzes }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    flexDirection: 'row',
    position: 'relative',
  },
  mainContent: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: COLORS.primary,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginVertical: 5,
    backgroundColor: '#FFF',
    borderRadius: 10,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    // Elevation for Android
    elevation: 2,
  },
  lockedLessonItem: {
    opacity: 0.6,
  },
  lessonImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  lessonTextContainer: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  lessonList: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DiscipleshipDashboard;
