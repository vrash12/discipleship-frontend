// Lesson4Tagalog.js

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Alert,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Collapsible from 'react-native-collapsible';
import { LinearGradient } from 'expo-linear-gradient';

const COLORS = {
  primary: '#FF8C00',
  secondary: '#32CD32',
  accent: '#FF6347',
  background: '#F5F5F5',
  text: '#333',
  lightText: '#FFF',
  reflectionBackground: '#FFF0E0',
  quoteBackground: '#F0F8FF',
};

const Lesson4Tagalog = ({ navigation }) => {
  const [activeSections, setActiveSections] = useState([]);
  const [prayerDone, setPrayerDone] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleToggleSection = (index) => {
    const updatedSections = [...activeSections];
    updatedSections[index] = !updatedSections[index];
    setActiveSections(updatedSections);
  };

  const handlePrayer = () => {
    Alert.alert(
      'Panalangin ng Pagtanggap',
      '“Amang Diyos, lumalapit po ako sa Inyo sa panalangin. Salamat po sa pagkakataong makipag-usap sa Inyo. Tulungan N\'yo po akong lumago sa aking buhay panalangin at pananampalataya sa Inyo. Sa pangalan ni Jesus, Amen.”',
      [{ text: 'Amen', onPress: () => setPrayerDone(true) }]
    );
  };

  // Sections Data
  const sections = [
    {
      title: 'KAHALAGAHAN NG PANALANGIN',
      content:
        'Ang panalangin ay paraan ng komunikasyon ng Kristiyano sa Diyos. Ito ay isang pangangailangan upang tayo ay lumago sa biyaya ng Diyos at lumalim sa ating relasyon sa Kaniya.',
    },
    {
      title: 'ANG PANALANGIN AY PERSONAL NA KOMUNIKASYON',
      content:
        '"Manalangin kayo ng ganito: \'Ama namin na nasa langit, sambahin ang iyong pangalan...\'" (Mateo 6:9)\n\nAng panalangin ay ating paraan ng personal na pakikipag-ugnayan sa Diyos.',
    },
    {
      title: 'ANG PANALANGIN AY NAGPAPAKITA NG ATING DEPENDENCY',
      content:
        '"Magtiwala sa Diyos at ibuhos ang inyong puso sa Kaniya." (Awit 62:8)\n\nAng panalangin ay nagpapakita ng ating buong pagdepende sa Diyos para sa lahat ng bagay.',
    },
    {
      title: 'MANALANGIN NG MAY PANANAMPALATAYA',
      content:
        'Ang pananampalataya ay isang matatag na pagtitiwala sa Diyos batay sa Kaniyang mga katangian at pangako na nakasulat sa Biblia.',
    },
    {
      title: 'MANALANGIN AYON SA KALOOBAN NG DIYOS',
      content:
        '"Kung tayo\'y humihingi ng anuman ayon sa Kaniyang kalooban, tayo\'y nakatitiyak na tayo\'y pinakikinggan Niya." (1 Juan 5:14)\n\nAng panalangin ayon sa kalooban ng Diyos ay nagmumula sa pag-unawa sa Kaniyang Salita at pagsunod dito.',
    },
  ];

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <ScrollView>
          {/* Header */}
          <ImageBackground
            source={require('../../../assets/logos/lesson4.jpg')}
            style={styles.headerImage}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.2)']}
              style={styles.gradientOverlay}
            >
              <Animated.Text
                style={[
                  styles.headerTitle,
                  {
                    opacity: titleAnim,
                    transform: [
                      {
                        translateY: titleAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                Bagong Lakas sa Panalangin
              </Animated.Text>
            </LinearGradient>
          </ImageBackground>

          {/* Introductory Text */}
          <Text style={styles.text}>
            Ang Kristiyanismo ay higit pa sa isang relihiyon; ito ay isang relasyon sa Panginoon. Ang pundasyon ng isang matibay na ugnayan sa Diyos ay ang pagkakaroon ng malusog na komunikasyon sa Kaniya.
          </Text>
          <Text style={styles.text}>
            Nakikipag-usap tayo sa Kaniya sa pamamagitan ng panalangin. Ang Diyos ay nakikipag-usap sa atin sa maraming paraan, ngunit pangunahing sa pamamagitan ng Kaniyang Salita, ang Biblia.
          </Text>

          {/* Sections */}
          {sections.map((section, index) => (
            <View key={index}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => handleToggleSection(index)}
                activeOpacity={0.7}
              >
                <Text style={styles.sectionHeaderText}>{section.title}</Text>
                <Ionicons
                  name={activeSections[index] ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color={COLORS.lightText}
                />
              </TouchableOpacity>
              <Collapsible collapsed={!activeSections[index]}>
                <View style={styles.sectionContent}>
                  <Text style={styles.text}>{section.content}</Text>
                </View>
              </Collapsible>
            </View>
          ))}

          {/* Prayer Button */}
          {!prayerDone ? (
            <TouchableOpacity
              style={styles.prayerButton}
              onPress={handlePrayer}
              activeOpacity={0.7}
            >
              <Ionicons name="prayer" size={24} color={COLORS.lightText} />
              <Text style={styles.prayerButtonText}>Panalangin ng Pagtanggap</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.thankYouBox}>
              <Text style={styles.thankYouText}>Salamat sa iyong panalangin!</Text>
            </View>
          )}

          {/* Navigate to Quiz */}
          <TouchableOpacity
            style={styles.quizButton}
            onPress={() => navigation.navigate('QuizTagalog4')}
            activeOpacity={0.7}
          >
            <Ionicons name="school" size={24} color={COLORS.lightText} />
            <Text style={styles.quizButtonText}>Pumunta sa Quiz</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerImage: {
    width: '100%',
    height: 200,
    justifyContent: 'flex-end',
  },
  gradientOverlay: {
    padding: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.lightText,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  sectionHeader: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionHeaderText: {
    color: COLORS.lightText,
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionContent: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  prayerButton: {
    backgroundColor: COLORS.secondary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  prayerButtonText: {
    color: COLORS.lightText,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  thankYouBox: {
    backgroundColor: '#DFF2BF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  thankYouText: {
    color: '#4F8A10',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quizButton: {
    backgroundColor: COLORS.accent,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  quizButtonText: {
    color: COLORS.lightText,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default Lesson4Tagalog;
