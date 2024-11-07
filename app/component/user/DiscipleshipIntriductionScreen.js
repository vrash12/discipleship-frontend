// DiscipleshipIntroductionScreen.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,

  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



const DiscipleshipIntroductionScreen = ({ navigation }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const fetchLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (storedLanguage) {
          setLanguage(storedLanguage);
        } else {
          setLanguage('en'); // Default to English if not found
        }
      } catch (error) {
        console.error('Error fetching language:', error);
        setLanguage('en');
      }
    };
    fetchLanguage();
  }, []);

  const proceedToDashboard = () => {
    navigation.navigate('DiscipleshipDashboard');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {language === 'en' ? 'Welcome to Discipleship' : 'Maligayang Pagdating sa Pagdidisipulo'}
      </Text>
      <Text style={styles.content}>
        {language === 'en'
          ? 'Discipleship is a journey of growing in your faith and following the teachings of Jesus. In this journey, you will learn more about God, His Word, and how to live a life that honors Him.'
          : 'Ang pagdidisipulo ay isang paglalakbay ng paglago sa iyong pananampalataya at pagsunod sa mga turo ni Jesus. Sa paglalakbay na ito, matututo ka nang higit pa tungkol sa Diyos, Kanyang Salita, at kung paano mamuhay nang may paggalang sa Kanya.'}
      </Text>
      <Text style={styles.content}>
        {language === 'en'
          ? 'Throughout the lessons, you will explore various topics that will help you understand the foundations of Christianity and how to apply them in your daily life.'
          : 'Sa buong mga aralin, susuriin mo ang iba\'t ibang mga paksa na makakatulong sa iyo na maunawaan ang mga pundasyon ng Kristiyanismo at kung paano ito isasabuhay sa iyong pang-araw-araw na buhay.'}
      </Text>
      <TouchableOpacity style={styles.button} onPress={proceedToDashboard}>
        <Text style={styles.buttonText}>
          {language === 'en' ? 'Start the Journey' : 'Simulan ang Paglalakbay'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFF',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FF8C00',
  },
  content: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    backgroundColor: '#FF8C00',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DiscipleshipIntroductionScreen;
