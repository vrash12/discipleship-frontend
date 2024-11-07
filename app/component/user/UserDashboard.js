// UserDashboard.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  RefreshControl,
  ImageBackground,
  TouchableOpacity,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from 'react-native-elements';
import axios from 'axios';
import SidebarNav from './SidebarNav';

import CircularProgress from 'react-native-circular-progress-indicator';
import { useNavigation } from '@react-navigation/native';




// Assuming lessons array is accessible here
const lessons = [
  {
    id: '1',
    title: 'Lesson 1: Salvation New Life',
  },
  {
    id: '2',
    title: 'Lesson 2: LORDSHIP (New Master)',
  },
  {
    id: '3',
    title: 'Lesson 3: Bible New Standard',
  },
  {
    id: '4',
    title: 'Lesson 4: Prayer New Power',
  },
  {
    id: '5',
    title: 'Lesson 5: Reaching the Next Generation',
  },
];

const totalLessons = lessons.length; // Total number of lessons

const NoteWidget = ({ title, content }) => (
  <View style={styles.widget}>
    <Text style={styles.widgetTitle}>Latest Note</Text>
    <Text style={styles.noteTitle}>{title || 'No Title'}</Text>
    <Text style={styles.noteContent}>{content || 'No Content'}</Text>
  </View>
);

const StatCard = ({ iconName, iconType, statText }) => (
  <View style={styles.statCard}>
    <Icon name={iconName} type={iconType} size={40} color="#FFFFFF" />
    <Text style={styles.statText}>{statText}</Text>
  </View>
);

const UserDashboard = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [loadingVerse, setLoadingVerse] = useState(true);
  const [isNavbarMinimized, setIsNavbarMinimized] = useState(false);
  const [verseOfTheDay, setVerseOfTheDay] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [userId, setUserId] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null); // New state for profile picture

  useEffect(() => {
    fetchUserName();
    fetchNotes();
    fetchVerseOfTheDay();
    fetchUserId();
    fetchUserProfilePicture(); // Fetch profile picture
  }, []);

  const fetchUserName = async () => {
    try {
      const name = await AsyncStorage.getItem('userName');
      if (!name) {
        const role = await AsyncStorage.getItem('userRole');
        setUserName(role === 'ADMIN' ? 'Admin' : 'User');
      } else {
        setUserName(name);
      }
    } catch (error) {
      console.error('Error fetching user name:', error);
    }
  };

  const fetchUserId = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
        fetchCompletedQuizzes(storedUserId);
      }
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };

  const fetchUserProfilePicture = async () => {
    try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
            const parsedUserId = parseInt(storedUserId, 10);
            const response = await axios.get(`https://backend-disciple-a692164f13b9.herokuapp.com/api/users/${parsedUserId}`);
            const userData = response.data;
            const fetchedProfilePictureUrl = userData.profilePictureUrl || null;
            setProfilePictureUrl(fetchedProfilePictureUrl);
        }
    } catch (error) {
        console.error('Error fetching profile picture:', error);
    }
};

  const fetchCompletedQuizzes = async (userId) => {
    try {
      const response = await axios.get('https://backend-disciple-a692164f13b9.herokuapp.com/api/quiz/completed', {
        params: { userId },
      });
      const completedQuizIds = response.data.completedQuizIds;
      setCompletedQuizzes(completedQuizIds);
    } catch (error) {
      console.error('Error fetching completed quizzes:', error);
    }
  };

  const progressPercentage = (completedQuizzes.length / totalLessons) * 100;

  const fetchNotes = async () => {
    setLoadingNotes(true);
    try {
      const cachedNotes = await AsyncStorage.getItem('cachedNotes');
      if (cachedNotes) {
        setNotes(JSON.parse(cachedNotes));
      }

      const response = await axios.get('https://backend-disciple-a692164f13b9.herokuapp.com/api/notes');
      setNotes(response.data);
      await AsyncStorage.setItem('cachedNotes', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoadingNotes(false);
    }
  };
  const fetchVerseOfTheDay = async () => {
    setLoadingVerse(true);
    try {
      const cachedData = await AsyncStorage.getItem('cachedVerse');
      const today = new Date().toUTCString().split(' ').slice(0, 4).join(' ');
  
      if (cachedData) {
        const { date: cachedDate, verse } = JSON.parse(cachedData);
        if (cachedDate === today) {
          setVerseOfTheDay(verse);
          setLoadingVerse(false);
          return;
        }
      }
  
      const response = await axios.get('https://backend-disciple-a692164f13b9.herokuapp.com/api/bible/votd', {
        responseType: 'text',
      });
      setVerseOfTheDay(response.data);
  
      // Save the verse along with today's date
      await AsyncStorage.setItem('cachedVerse', JSON.stringify({ date: today, verse: response.data }));
    } catch (error) {
      console.error('Error fetching verse of the day:', error);
      Alert.alert('Error', 'Failed to fetch the verse of the day.');
    } finally {
      setLoadingVerse(false);
    }
  };
  

  // In UserDashboard.js

const parseVerseReference = (verseString) => {
  // Split the string into lines
  const lines = verseString.split('\n');
  // The last line should contain the reference, starting with '- '
  const lastLine = lines[lines.length - 1].trim();

  // Check if the last line starts with '- '
  if (lastLine.startsWith('- ')) {
    const reference = lastLine.substring(2).trim(); // Remove '- ' and trim
    // Reference should be in the format 'BookName Chapter:Verse'
    const referenceMatch = reference.match(/^(.+?)\s+(\d+):(\d+)$/);
    if (referenceMatch) {
      const bookName = referenceMatch[1];
      const chapter = parseInt(referenceMatch[2], 10);
      const verse = parseInt(referenceMatch[3], 10);
      return { bookName, chapter, verse };
    }
  }
  return null; // Unable to parse reference
};

  

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotes();
    await fetchVerseOfTheDay();
    await fetchUserProfilePicture(); // Refresh profile picture
    setRefreshing(false);
  };

  const renderLatestNote = () => {
    if (notes.length === 0) {
      return (
        <View style={styles.widget}>
          <Text style={styles.noteTitle}>No notes available.</Text>
        </View>
      );
    }

    const latestNote = notes[0];
    return <NoteWidget title={latestNote.title} content={latestNote.content} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <SidebarNav
        navigation={navigation}
        isNavbarMinimized={isNavbarMinimized}
        setIsNavbarMinimized={setIsNavbarMinimized}
      />

      <ScrollView
        style={styles.mainContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <ImageBackground
          source={require('./header.jpg')} // Ensure this path is correct
          style={styles.headerImage}
          imageStyle={{ opacity: 0.8 }}
        >
          <View style={styles.headerOverlay}>
            {/* Add profile picture in the header */}
            <View style={styles.profileContainer}>
              {profilePictureUrl ? (
                <Image
                  source={{ uri: profilePictureUrl }}
                  style={styles.profilePicture}
                />
              ) : (
                <Icon name="user-circle" type="font-awesome" size={80} color="#FFFFFF" />
              )}
            </View>
            <Text style={styles.headerText}>Welcome, {userName}!</Text>
            <Text style={styles.subHeaderText}>Here are your daily verses and tasks.</Text>
          </View>
        </ImageBackground>

        {/* Rest of your components */}
        {/* ... */}
        <View style={styles.widget}>
  <Text style={styles.widgetTitle}>Verse of the Day</Text>
  {loadingVerse ? (
    <ActivityIndicator size="large" color="#4A90E2" />
  ) : (
    <TouchableOpacity
      onPress={() => {
        const parsedReference = parseVerseReference(verseOfTheDay);
        if (parsedReference) {
          navigation.navigate('Bible', {
            bookName: parsedReference.bookName,
            chapter: parsedReference.chapter,
            verse: parsedReference.verse,
          });
        } else {
          Alert.alert('Error', 'Unable to parse verse reference.');
        }
      }}
    >
      <Text style={styles.verseText}>{verseOfTheDay}</Text>
    </TouchableOpacity>
  )}
</View>


        {/* Progress Tracking */}
        <View style={styles.circularProgressContainer}>
          <Text style={styles.progressTitle}>Discipleship Journey Progress</Text>
          <CircularProgress
            value={progressPercentage}
            radius={80}
            duration={1000}
            progressValueColor={'#333'}
            maxValue={100}
            title={'%'}
            titleColor={'#333'}
            titleStyle={{ fontWeight: 'bold' }}
            activeStrokeColor={'#FF8C00'}
            activeStrokeSecondaryColor={'#FF6347'}
          />
          <Text style={styles.progressText}>
            {completedQuizzes.length} of {totalLessons} lessons completed
          </Text>
        </View>

        <TouchableOpacity style={styles.ctaButton} onPress={() => navigation.navigate('Bible')}>
          <Text style={styles.ctaButtonText}>Start Reading</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  headerImage: {
    width: '100%',
    height: 300,
    justifyContent: 'flex-end',
  },
  headerOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subHeaderText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  widgetContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  widget: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  widgetTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#4A90E2',
    textAlign: 'center',
  },
  verseText: {
    fontSize: 18,
    color: '#333333',
    lineHeight: 28,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  noteTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
    textAlign: 'center',
  },
  noteContent: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 22,
    textAlign: 'center',
  },
  statText: {
    marginTop: 10,
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  ctaButton: {
    marginTop: 30,
    marginHorizontal: 40,
    paddingVertical: 15,
    backgroundColor: '#FF8C00',
    borderRadius: 30,
    alignItems: 'center',
    elevation: 3,
  },
  ctaButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  progressContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  circularProgressContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  progressText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
  },
});

export default UserDashboard;
