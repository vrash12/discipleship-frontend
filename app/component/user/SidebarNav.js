import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Text,
  Easing,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;
const expandedWidth = screenWidth * 0.5; 
const minimizedWidth = screenWidth * 0.16; 
const tabWidth = 30; 

const SidebarNav = ({ navigation }) => {
  const [isNavbarMinimized, setIsNavbarMinimized] = useState(false);
  const [activeRoute, setActiveRoute] = useState('');
  const route = useRoute();
  const [userId, setUserId] = useState(null);
  const [hasCompletedTest, setHasCompletedTest] = useState(false);
  const [loading, setLoading] = useState(true);
  const sidebarAnim = useRef(new Animated.Value(0)).current; 

  useEffect(() => {
    fetchUserData();
    setActiveRoute(route.name);
  }, [route]);

  const fetchUserData = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
        const response = await axios.get(
          `https://backend-disciple-a692164f13b9.herokuapp.com/api/faith-test/${storedUserId}/faith-test-status`
        );

        if (response.data === 'User has completed the faith test.') {
          setHasCompletedTest(true);
        } else {
          setHasCompletedTest(false);
        }
      } else {
        console.error('No user ID found.');
      }
    } catch (error) {
      console.error('Error fetching test completion status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sidebar button data
  const data = [
    { id: '7', icon: 'home', label: 'Home', navigateTo: 'UserDashboard' },
    { id: '1', icon: 'book', label: 'Bible', navigateTo: 'Bible' },
    {
      id: '3',
      icon: 'road',
      label: 'Discipleship',
      navigateTo: 'DiscipleshipDashboard', // Added navigateTo
    },
    { id: '6', icon: 'sticky-note', label: 'Notes', navigateTo: 'NoteFeature' },
    { id: '8', icon: 'graduation-cap', label: 'Lesson', navigateTo: 'ChurchLessons' },
    { id: '4', icon: 'cog', label: 'Settings', navigateTo: 'Settings' },

  ];

  const handleToggleNavbar = () => {
    Animated.timing(sidebarAnim, {
      toValue: isNavbarMinimized ? 0 : 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false, // Must be false when animating width
    }).start();
    setIsNavbarMinimized(!isNavbarMinimized);
  };

  const handleNavigation = async (navigateTo) => {
    if (loading) {
      console.log('Loading user data...');
      return;
    }

    if (navigateTo === 'DiscipleshipDashboard') {
      if (hasCompletedTest) {
        navigation.navigate('DiscipleshipDashboard');
      } else {
        navigation.navigate('FaithTestScreen');
      }
    } else {
      navigation.navigate(navigateTo);
    }
  };

  // Interpolate width and translateX from sidebarAnim
  const sidebarWidth = sidebarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [expandedWidth, minimizedWidth],
  });

  const translateX = sidebarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -expandedWidth + minimizedWidth],
  });

  const rotateIcon = sidebarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  // Position the toggle button based on sidebar state
  const toggleButtonTranslateX = sidebarAnim.interpolate({
    inputRange: [0, 0.78],
    outputRange: [expandedWidth - tabWidth / 2, minimizedWidth - tabWidth / 2],
  });

  return (
    <>
      <Animated.View
        style={[
          styles.leftNavbar,
          {
            width: sidebarWidth,
            transform: [{ translateX }],
          },
        ]}
      >
        <View style={styles.navItemsContainer}>
          {data.map((item) => {
            const isActive = item.navigateTo === activeRoute;

            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.navItem,
                  isActive && styles.activeItem,
                ]}
                onPress={() => handleNavigation(item.navigateTo)}
              >
                <View style={styles.iconContainer}>
                  <Icon
                    name={item.icon}
                    type="font-awesome"
                    size={24}
                    color="#FFF"
                  />
                  {!isNavbarMinimized && (
                    <Text style={styles.iconLabel}>{item.label}</Text>
                  )}
                </View>
                {isActive && <View style={styles.activeIndicator} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>

      {/* Toggle Button */}
      <Animated.View
        style={[
          styles.toggleButtonContainer,
          {
            transform: [{ translateX: toggleButtonTranslateX }],
          },
        ]}
      >
        <TouchableOpacity
          onPress={handleToggleNavbar}
          style={styles.toggleButton}
        >
          <Animated.View style={{ transform: [{ rotate: rotateIcon }] }}>
            <Icon
              name="angle-double-left"
              type="font-awesome"
              size={24}
              color="#FFF"
            />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  leftNavbar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#FF8C00',
    alignItems: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'space-between',
    zIndex: 1000,
    elevation: 10,
    paddingTop: 50,
    paddingBottom: 20,
    overflow: 'hidden',
  },
  navItemsContainer: {
    flex: 1,
    width: '100%',
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    position: 'relative',
  },
  activeItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconLabel: {
    color: '#FFF',
    fontSize: 18,
    marginLeft: 15,
  },
  activeIndicator: {
    position: 'absolute',
    width: 5,
    height: '100%',
    backgroundColor: '#FFD700',
    left: 0,
    top: 0,
  },
  toggleButtonContainer: {
    position: 'absolute',
    top: Dimensions.get('window').height / 2 - 20,
    width: tabWidth,
    height: 40,
    zIndex: 1001,
  },
  toggleButton: {
    width: tabWidth,
    height: 40,
    backgroundColor: '#FF4500',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    elevation: 5,
  },
});

export default SidebarNav;
