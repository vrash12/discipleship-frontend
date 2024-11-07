// Lesson5Tagalog.js

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

const Lesson5Tagalog = ({ navigation }) => {
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
      'Panalangin para sa Susunod na Henerasyon',
      '“Panginoon, salamat po sa pagkakataong makapaglingkod sa mga kabataan. Nawa\'y gamitin Mo ako upang maging gabay at inspirasyon sa kanila. Tulungan Mo po silang lumago sa pananampalataya at maging matatag sa kanilang paglalakbay kasama Ka. Sa pangalan ni Jesus, Amen.”',
      [{ text: 'Amen', onPress: () => setPrayerDone(true) }]
    );
  };

  // Sections Data
  const sections = [
    {
      title: '1. Pinahahalagahan ng Diyos ang susunod na henerasyon',
      content:
        '"One generation shall commend your works to another, and shall declare your mighty acts." (Awit 145:4)\n\nPinahahalagahan ng Diyos ang bawat henerasyon at nais Niyang ipasa ng kasalukuyang henerasyon ang Kaniyang mga gawa sa susunod.',
    },
    {
      title: '2. Hamunin at paniwalaan ang susunod na henerasyon',
      content:
        '"Huwag mong hayaang hamakin ka ninuman dahil sa iyong kabataan." (1 Timoteo 4:12)\n\nTulad ni Pablo kay Timoteo, tayo rin ay dapat maniwala at sumuporta sa mga kabataan upang matulungan silang tuparin ang kanilang tawag mula sa Diyos.',
    },
    {
      title: '3. Maging halimbawa ng makadiyos na pamumuhay',
      content:
        '"...sa halip, sikapin mong maging halimbawa sa mga mananampalataya, sa iyong pagsasalita, pag-uugali, pag-ibig, pananampalataya at malinis na pamumuhay." (1 Timoteo 4:12)\n\nAng mga kabataan ay maaaring maging mabuting halimbawa sa lahat ng aspeto ng pamumuhay at maging inspirasyon sa nakatatandang henerasyon.',
    },
    {
      title: '4. Bakit mahalaga ang kabataan?',
      content:
        'Ang mga kabataan ang hinaharap ng simbahan at ng bansa. Ang kanilang paglago sa pananampalataya ay susi sa pag-unlad ng komunidad at ng bansa.',
    },
  ];

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <ScrollView>
          {/* Header */}
          <ImageBackground
            source={require('../../../assets/logos/lesson5.jpg')}
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
                Abutin ang Susunod na Henerasyon
              </Animated.Text>
            </LinearGradient>
          </ImageBackground>

          {/* Introductory Text */}
          <Text style={styles.text}>
            Ang simbahan ay lumalago hindi lang dahil ang isang henerasyon ay kilala ang Diyos at sumusunod sa Kaniya, kundi dahil ipinapasa rin nila ang Ebanghelyo sa susunod na henerasyon. Matutunan natin ang kahalagahan ng kabataan mula sa perspektibo ng Diyos, ng mga naunang henerasyon, at ng susunod na henerasyon.
          </Text>

          {/* Reflection Section */}
          <TouchableOpacity
            style={styles.questionButton}
            onPress={() => handleToggleSection(4)}
            activeOpacity={0.7}
          >
            <Text style={styles.questionButtonText}>
              {activeSections[4] ? 'Itago ang Pagninilay' : 'Pag-isipan ang Iyong Karanasan'}
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
                Paano mo mai-inspire ang kabataan sa iyong paligid na lumapit sa Diyos? Ano ang mga bagay na magagawa mo para maging mabuting halimbawa sa kanila?
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

          {/* Application to Reach the Next Generation */}
          <Text style={styles.subheader}>Aplikasyon upang Abutin ang Susunod na Henerasyon:</Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>1.</Text> Ipanalangin ang mga kabataang gusto mong maligtas at madisiple.
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>2.</Text> Mag-invest ng oras para sa malusog na relasyon at pagkakaibigan.
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>3.</Text> Unti-unting ipakilala ang Ebanghelyo at ibahagi ang iyong testimonya.
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>4.</Text> Anyayahan sila sa ating Lingguhang Pagdiriwang at sa FAM Meetings at Fellowship.
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>5.</Text> Turuan sila ng regular upang patuloy silang lumago at mag-mature sa kaalaman.
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>6.</Text> Hikayatin silang sumali sa komunidad at maglingkod sa Panginoon at sa komunidad.
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>7.</Text> Isama sila sa one-to-one discipleship at sa mga tunay na karanasan sa buhay.
          </Text>

          {/* Prayer Button */}
          {!prayerDone ? (
            <TouchableOpacity
              style={styles.prayerButton}
              onPress={handlePrayer}
              activeOpacity={0.7}
            >
              <Ionicons name="prayer" size={24} color={COLORS.lightText} />
              <Text style={styles.prayerButtonText}>Panalangin para sa Susunod na Henerasyon</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.thankYouBox}>
              <Text style={styles.thankYouText}>
                Salamat sa iyong panalangin at dedikasyon na suportahan ang kabataan sa kanilang paglalakbay sa pananampalataya.
              </Text>
            </View>
          )}

          {/* Navigate to Quiz */}
          <TouchableOpacity
            style={styles.quizButton}
            onPress={() => navigation.navigate('QuizTagalog5')}
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
  bold: {
    fontWeight: 'bold',
  },
  subheader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginHorizontal: 20,
    color: COLORS.primary,
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

export default Lesson5Tagalog;
