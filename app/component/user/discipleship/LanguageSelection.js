import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageSelection = ({ navigation }) => {
  const handleLanguageSelect = async (lang) => {
    try {
      await AsyncStorage.setItem('selectedLanguage', lang);
      navigation.replace('DiscipleshipDashboard'); // Navigate to the main dashboard after language selection
    } catch (error) {
      console.error('Failed to save selected language:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FF8C00" barStyle="light-content" />
      <View style={styles.overlay}>
        <Text style={styles.title}>Select Your Language</Text>
        <TouchableOpacity
          style={styles.languageButton}
          onPress={() => handleLanguageSelect('en')}
        >
          <Text style={styles.languageText}>English</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.languageButton}
          onPress={() => handleLanguageSelect('tl')}
        >
          <Text style={styles.languageText}>Tagalog</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF8C00', // Set the background color directly
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: '#FFF',
    padding: 30,
    borderRadius: 10,
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    width: '80%', // Take 80% of the screen width
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: '#FF8C00',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  languageButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  languageText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LanguageSelection;
