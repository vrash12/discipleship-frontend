// SplashScreen.js

import React, { useState, useEffect } from 'react';
import { View, Animated, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, // Fade to opacity 1
      duration: 2000, // Duration of the animation in milliseconds
      useNativeDriver: true, // Use native driver for better performance
    }).start(() => checkLoginStatus()); // After animation completes, check login status
  }, [fadeAnim]);

  const checkLoginStatus = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        // Navigate based on the role, typically you would fetch user details here
        navigation.navigate('MainApp'); // Assuming 'MainApp' is your main app screen
      } else {
        navigation.navigate('LoginScreen');
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      navigation.navigate('LoginScreen');
    }
  };

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/logo.png')} // Adjust the path based on your file structure
        style={[styles.logo, { opacity: fadeAnim }]}
        resizeMode="contain" // Adjust the image scaling
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    backgroundColor: '#f8f8f8', // Background color of the splash screen
  },
  logo: {
    width: 250, // Adjust width as needed
    height: 250, // Adjust height as needed
  },
});

export default SplashScreen;
