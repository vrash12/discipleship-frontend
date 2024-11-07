// Lesson3Tagalog.js

import React, { useState, useRef, useEffect, useContext } from 'react';
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
import LessonContext from '../LessonContext';

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

const Lesson3Tagalog = ({ navigation }) => {
  const [activeSections, setActiveSections] = useState([]);
  const [prayerDone, setPrayerDone] = useState(false);

  const { completeLesson } = useContext(LessonContext);

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

  const handlePrayerConfirmation = () => {
    setPrayerDone(true);
    Alert.alert(
      'Congratulations!',
      'Natapos mo ang aralin at sinimulan mo na ang bagong pamumuhay kasama ang Diyos.'
    );
  };

  const handleCompleteLesson = () => {
    completeLesson(3);
    navigation.goBack();
  };

  // Sections Data
  const sections = [
    {
      title: 'KAHALAGAHAN NG BIBLIA',
      content:
        'Ang Biblia ay hindi lamang isang koleksyon ng mga kwento, tula, at mga sulat. Ito ay ang "inspired written" na Salita ng Diyos.\n\n"Hindi ako lumalabag sa Kaniyang kautusan, at ang Kaniyang mga salita ay aking iniingatan." (Job 23:12)',
    },
    {
      title: 'ANG BIBLIA AY ESPIRITWAL NA PAGKAIN',
      content:
        'Bilang Kristyano, kailangan nating busugin at palakasin ang ating espiritwal na buhay sa pamamagitan ng pagbabasa ng Salita ng Diyos.\n\n"Gaya ng mga bagong panganak na sanggol, hangarin ang purong espiritwal na gatas upang kayo\'y lumago sa kaligtasan..." (1 Pedro 2:2-3)',
    },
    {
      title: 'ANG GINAGAWA NG BIBLIA PARA SA ATIN',
      content:
        'Ginagamit ng Diyos ang Kaniyang salita upang tayo ay turuan, suwayin, itama, at i-train sa katuwiran.\n\n"Ang lahat ng Kasulatan ay kinasihan ng Diyos, at nagagamit sa pagtuturo ng katotohanan..." (2 Timoteo 3:16-17)',
    },
    {
      title: 'APLIKASYON NG BIBLIA SA BUHAY',
      content:
        'Binigyan tayo ng Panginoon ng isang mahalagang regalo, ang Biblia. Dapat nating basahin at pagnilayan ang Salita ng Diyos araw-araw.\n\n"Dapat mong pagnilayan ito araw at gabi, upang maging maingat ka sa pagsunod sa lahat ng nasusulat dito." (Josue 1:8)',
    },
  ];

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <ScrollView>
          {/* Header */}
          <ImageBackground
            source={require('../../../assets/logos/lesson3.jpg')}
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
                Bagong Pamantayan ng Biblia
              </Animated.Text>
            </LinearGradient>
          </ImageBackground>

          {/* Introductory Text */}
          <Text style={styles.text}>
            Alam mo ba kung bakit malalago at maiinit ang mga unang siglo ng mga mananampalataya sa kanilang debosyon kay God?
          </Text>
          <Text style={styles.text}>
            Dahil sila ay devoted sa pagpapalago ng kanilang personal na relasyon kay Jesus, pinalago nila ang kanilang spiritual lifestyle sa pamamagitan ng kanilang debosyon sa Panginoon. Ang dalawa sa mga lifestyle na nagpapakita ng debosyon kay Lord ay ang pagbabasa ng Biblia at pananalangin.
          </Text>

          {/* Reflection Section 1 */}
          <TouchableOpacity
            style={styles.questionButton}
            onPress={() => handleToggleSection(4)}
            activeOpacity={0.7}
          >
            <Text style={styles.questionButtonText}>
              {activeSections[4] ? 'Itago ang Pagninilay' : 'Pag-isipan ang Iyong Kaisipan'}
            </Text>
            <Ionicons
              name={activeSections[4] ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={COLORS.lightText}
            />
          </TouchableOpacity>
          <Collapsible collapsed={!activeSections[4]}>
            <View style={styles.reflectionBox}>
              <Text style={styles.text}>
                Paano mo pinalalago ang iyong debosyon sa Panginoon? Ano ang mga hakbang na ginagawa mo upang lumalim sa Kaniyang Salita?
              </Text>
            </View>
          </Collapsible>

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

          {/* Reflection Section 2 */}
          <TouchableOpacity
            style={styles.questionButton}
            onPress={() => handleToggleSection(5)}
            activeOpacity={0.7}
          >
            <Text style={styles.questionButtonText}>
              {activeSections[5] ? 'Itago ang Pagninilay' : 'Pag-isipan Ito'}
            </Text>
            <Ionicons
              name={activeSections[5] ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={COLORS.lightText}
            />
          </TouchableOpacity>
          <Collapsible collapsed={!activeSections[5]}>
            <View style={styles.reflectionBox}>
              <Text style={styles.text}>
                Bakit mahalaga ang regular na pagbabasa at pagmumuni-muni sa Biblia? Anong mga aspeto ng iyong buhay ang maaari pang mapalago sa pamamagitan nito?
              </Text>
            </View>
          </Collapsible>

          {/* Prayer Button */}
          {!prayerDone ? (
            <TouchableOpacity
              style={styles.prayerButton}
              onPress={handlePrayerConfirmation}
              activeOpacity={0.7}
            >
              <Ionicons name="prayer" size={24} color={COLORS.lightText} />
              <Text style={styles.prayerButtonText}>Panalangin ng Pagtanggap</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.thankYouBox}>
              <Text style={styles.thankYouText}>
                Salamat sa pagkuha ng hakbang na ito! Magpatuloy sa paglago sa iyong bagong pamumuhay kasama ang Diyos.
              </Text>
            </View>
          )}

          {/* Complete Lesson Button */}
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleCompleteLesson}
            activeOpacity={0.7}
          >
            <Ionicons name="checkmark-circle" size={24} color={COLORS.lightText} />
            <Text style={styles.completeButtonText}>Tapusin ang Aralin</Text>
          </TouchableOpacity>

          {/* Navigate to Quiz */}
          <TouchableOpacity
            style={styles.quizButton}
            onPress={() => navigation.navigate('QuizTagalog3')}
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
  reflectionBox: {
    backgroundColor: COLORS.reflectionBackground,
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  questionButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  questionButtonText: {
    color: COLORS.lightText,
    fontSize: 16,
    fontWeight: 'bold',
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
    fontSize: 16,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  completeButton: {
    backgroundColor: COLORS.accent,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  completeButtonText: {
    color: COLORS.lightText,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
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
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default Lesson3Tagalog;
