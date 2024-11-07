// AdminDashboard.js

import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';


import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import axios from 'axios';
import { AuthContext } from '../../AuthProvider';

const screenWidth = Dimensions.get('window').width;

const COLORS = {
  primary: '#FF8C00', // Sidebar background
  secondary: '#4A90E2', // Secondary elements
  accent: '#FF4500', // Accent buttons
  background: '#F5F5F5', // Main background
  textPrimary: '#333333', // Primary text
  textSecondary: '#FFFFFF', // Secondary text (e.g., in sidebar)
};

const AdminDashboard = ({ navigation }) => {
  const [userRole, setUserRole] = useState('');

  // States for widgets
  const [totalUsers, setTotalUsers] = useState(0);
  const [newUsersThisWeek, setNewUsersThisWeek] = useState(0);
  const [loadingWidgets, setLoadingWidgets] = useState(true);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const { setAuthState } = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear AsyncStorage
              await AsyncStorage.removeItem('authToken');
              await AsyncStorage.removeItem('userRole');
              await AsyncStorage.removeItem('userName');
              await AsyncStorage.removeItem('userId');

              // Reset Auth State
              setAuthState({
                isLoading: false,
                isLoggedIn: false,
                userRole: null,
                token: null,
              });
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      const checkUserRole = async () => {
        try {
          const role = await AsyncStorage.getItem('userRole');
          setUserRole(role);
  
          if (role !== 'ADMIN') {
            Alert.alert(
              'Access Denied',
              'You do not have administrative privileges.',
              [
                {
                  text: 'OK',
                  onPress: () => navigation.navigate('HomeScreen'),
                },
              ],
              { cancelable: false }
            );
          } else {
            fetchAdminData();
          }
        } catch (error) {
          console.error('Error retrieving user role:', error);
          Alert.alert('Error', 'An unexpected error occurred. Please try again.');
        }
      };
  
      checkUserRole();
  
      // Optional cleanup function
      return () => {
        // Clean up if needed
      };
    }, [navigation])
  );
  

  const fetchAdminData = async () => {
    setLoadingWidgets(true);
    try {
      // Fetch all users
      const token = await getAuthToken();
      const usersResponse = await axios.get('https://backend-disciple-a692164f13b9.herokuapp.com/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const allUsers = usersResponse.data;

      // Log all users to inspect roles
      console.log('All Users:', allUsers);
      allUsers.forEach((user) => {
        console.log(`User ID: ${user.id}, Role: ${user.role}`);
      });
      

      // Filter users to include only those with role 'USER', case-insensitive
      const users = allUsers.filter(
        (user) => user && user.role && user.role.toUpperCase() === 'USER'
      );
      
      // Update total users count
      setTotalUsers(users.length);

      users.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      // Calculate new users in the past week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const newUsers = users.filter((user) => {
        const signupDate = new Date(user.createdAt);
        return signupDate >= oneWeekAgo;
      });
      setNewUsersThisWeek(newUsers.length);

      // Prepare user growth data for the past 7 days
      const growthData = [];
      for (let i = 6; i >= 0; i--) {
        const day = new Date();
        day.setDate(day.getDate() - i);
        const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayStart.getDate() + 1);

        const usersOnDay = users.filter((user) => {
          const signupDate = new Date(user.createdAt);
          return signupDate >= dayStart && signupDate < dayEnd;
        });
        growthData.push(usersOnDay.length);
      }
      setUserGrowthData(growthData);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      Alert.alert('Error', 'Failed to load admin dashboard data.');
    } finally {
      setLoadingWidgets(false);
    }
  };

  // Function to get auth token from AsyncStorage
  const getAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken'); // Replace 'authToken' with your actual key
      return token;
    } catch (error) {
      console.error('Error retrieving auth token:', error);
      return null;
    }
  };

  const handleNavigate = (screenName) => {
    navigation.navigate(screenName);
  };
  const navItems = [
    { id: '1', icon: 'stats-chart', label: 'Quiz Stats', navigateTo: 'AdminQuizStatistics' },
    { id: '2', icon: 'book', label: 'Manage Sermons', navigateTo: 'AddSermonScreen' },
    { id: '3', icon: 'clipboard-outline', label: 'Faith Test', navigateTo: 'AdminFaithTestScreen' },
    { id: '4', icon: 'school-outline', label: 'Lessons', navigateTo: 'LessonForm' },
    { id: '6', icon: 'mail-unread-outline', label: 'Pending Requests', navigateTo: 'PendingRequestsScreen' },
    { id: '5', icon: 'log-out-outline', label: 'Logout', action: handleLogout },
  ];

  // Fixed sidebar width (collapsed state)
  const fixedSidebarWidth = 70; // Adjust as needed

  if (userRole !== 'ADMIN') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Checking Access...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Fixed left-side navbar */}
      <View style={[styles.leftNavbar, { width: fixedSidebarWidth }]}>
        <ScrollView contentContainerStyle={styles.navItemsContainer}>
          {navItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.navItem}
              onPress={() => {
                if (item.action) {
                  item.action();
                } else {
                  handleNavigate(item.navigateTo);
                }
              }}
            >
              <Animatable.View animation="bounceIn" duration={1500}>
                <Ionicons name={item.icon} size={28} color={COLORS.textSecondary} />
              </Animatable.View>
              {/* Removed the label to show only icons */}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Main content area */}
      <View style={[styles.mainContent, { marginLeft: fixedSidebarWidth }]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header Section */}
          <ImageBackground
            source={require('./admin_header.jpg')} // Ensure you have an appropriate image
            style={styles.headerImage}
            imageStyle={{ opacity: 0.8 }}
          >
            <View style={styles.headerOverlay}>
              <Text style={styles.headerText}>Hello, Admin!</Text>
            </View>
          </ImageBackground>

          {/* Widgets Section */}
          <View style={styles.widgetsContainer}>
            {/* Total Users Widget */}
            <View style={styles.widget}>
              <Ionicons name="people-outline" size={50} color={COLORS.primary} />
              <Text style={styles.widgetTitle}>Total Users</Text>
              {loadingWidgets ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
              ) : (
                <Text style={styles.widgetContent}>{totalUsers}</Text>
              )}
              <TouchableOpacity
                style={styles.widgetButton}
                onPress={() => navigation.navigate('ManageUsers')}
              >
                <Text style={styles.widgetButtonText}>Manage Users</Text>
              </TouchableOpacity>
            </View>

            {/* You can add more widgets here if needed */}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.background,
  },
  leftNavbar: {
    backgroundColor: COLORS.primary,
    paddingVertical: 80,
    paddingHorizontal: 10,
    alignItems: 'center',
    elevation: 9,
  },
  navItemsContainer: {
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    marginVertical: 15,
  },

  mainContent: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 10,
    marginTop: 20,
    marginBottom: 20,
    marginRight: 10,
    paddingVertical: 30,       // Retained vertical padding
    paddingHorizontal: 0,  
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerImage: {
    width: '100%',
    height: 200,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  headerOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },

  widgetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 40,
    // Adjusted marginLeft since sidebar is fixed and labels are removed
    marginLeft: 39,
  },
  widget: {
    width: (screenWidth - 100) / 2, // Adjusted width for fixed sidebar
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    alignItems: 'center',
  },
  widgetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  widgetContent: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 15,
  },
  widgetButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  widgetButtonText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: 'bold',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.primary,
  },
});

export default AdminDashboard;
