// Lesson1Tagalog.js

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
  placeholder: '#999',
  border: '#ddd',
  completed: '#32CD32',
  locked: '#FF8C00',
  reflectionBackground: '#FFF0E0',
  quoteBackground: '#F0F8FF',
  takeawaysBackground: '#E6F7FF',
};

const Lesson1Tagalog = ({ navigation }) => {
  const [showReflection1, setShowReflection1] = useState(false);
  const [showReflection2, setShowReflection2] = useState(false);
  const [showTruths, setShowTruths] = useState([false, false, false, false]);
  const [prayerDone, setPrayerDone] = useState(false);
  const [showTakeaways, setShowTakeaways] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;

  const handleTruthToggle = (index) => {
    const updatedTruths = [...showTruths];
    updatedTruths[index] = !updatedTruths[index];
    setShowTruths(updatedTruths);
  };

  const handlePrayer = () => {
    Alert.alert(
      'Panalangin ng Pagtanggap',
      '“Amang Diyos, maraming salamat po sa Inyong pagmamahal dahil ipinadala N’yo ang Inyong kaisa-isang Anak na si Hesus." Panginoong Hesus, salamat po dahil namatay Kayo para sa akin. Salamat po dahil tinanggal at inangkin ninyo ang aking mga kasalanan. Hesus, binubuksan ko ang pintuan ng aking buhay at tinatanggap Ka bilang aking Panginoon at Tagapagligtas. Salamat po sa Inyong regalong kapatawaran at kaligtasan para sa akin. Kayo po ang manguna at magkontrol sa aking buhay. Simula ngayon, Kayo na ang aking kikilalaning Diyos, Guro, Hari, at Pinakamatalik na Kaibigan. Sa ngalan ni Hesus, Amen.',
      [{ text: 'Amen', onPress: () => setPrayerDone(true) }]
    );
  };

  const startAnimations = () => {
    // Fade-in for the entire content
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Slide-in for the header title
    Animated.timing(titleAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    startAnimations();
  }, []);

  const handleQuizPress = () => {
    navigation.navigate('QuizTagalog1', {
      onQuizComplete: async () => {
        // Optionally handle any post-quiz completion logic here
        // For example, you might want to refresh lessons or update UI
      },
    });
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <ScrollView>
          {/* Lesson Header with Image and Gradient Overlay */}
          <ImageBackground
            source={require('../../../assets/logos/lesson1.jpg')}
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
                Kaligtasan (Bagong Buhay)
              </Animated.Text>
            </LinearGradient>
          </ImageBackground>

          {/* Introductory Text */}
          <Text style={styles.text}>
            Pagdating sa kaligtasan o pagpunta sa langit, naisip mo na ba ang diwa na ganito?
          </Text>

          {/* Reflection Question 1 */}
          <TouchableOpacity
            style={styles.questionButton}
            onPress={() => setShowReflection1(!showReflection1)}
          >
            <Text style={styles.questionButtonText}>
              {showReflection1 ? 'Itago' : 'Mga Karaniwang Kaisipan'}
            </Text>
            <Ionicons
              name={showReflection1 ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={COLORS.lightText}
            />
          </TouchableOpacity>
          <Collapsible collapsed={!showReflection1}>
            <View style={styles.reflectionBox}>
              <Text style={styles.text}>
                “Ililigtas ako ng Diyos dahil hindi naman ako masamang tao.”
              </Text>
              <Text style={styles.text}>
                “Ililigtas ako ng Diyos kapag nakagawa ako ng mabubuting bagay."
              </Text>
              <Text style={styles.text}>
                “Hindi ako kailanman ililigtas ng Diyos dahil masyado akong masamang tao.”
              </Text>
            </View>
          </Collapsible>

          {/* Additional Introductory Text */}
          <Text style={styles.text}>
            Ang tanong natin ngayon ay papaano ba talaga ako magkakaroon ng kaligtasan at
            makakapagsimula ng relasyon sa Diyos? Sa tingin mo, papaano?
          </Text>

          {/* Truth Sections */}
          {[
            {
              title: 'KATOTOHANAN 1',
              subtitle:
                'Mahal ka ng Diyos kung kaya’t nagaalok Siya palagi ng magandang plano para sa iyong buhay.',
              content: [
                {
                  quoteTitle: '■ Pagmamahal ng Diyos',
                  quote:
                    '“Sapagkat gayon na lamang ang pag-ibig ng Diyos sa sangkatauhan, kaya’t ibinigay niya ang kanyang kaisa-isang Anak, upang ang sinumang sumampalataya sa kanya ay hindi mapahamak, kundi magkaroon ng buhay na walang hanggan.” Juan 3:16',
                },
                {
                  quoteTitle: '■ Plano ng Diyos',
                  quote:
                    '“Dumarating ang magnanakaw para lamang magnakaw, pumatay, at manira. Naparito ako upang ang mga tupa ay magkaroon ng buhay, buhay na masaganang lubos.” Juan 10:10',
                },
              ],
            },
            {
              title: 'KATOTOHANAN 2',
              subtitle:
                'Lahat tayo ay nagkasala kaya ang resulta ng ating kasalanan ay pagkahiwalay sa Diyos.',
              content: [
                {
                  quoteTitle: '■ Tayong lahat ay makasalanan',
                  quote:
                    '“Sapagkat ang lahat ay nagkasala, at walang sinumang nakaabot sa kaluwalhatian ng Diyos.” Roma 3:23',
                },
                {
                  quoteTitle: '■ Tayo ay ibinukod',
                  quote:
                    '“Sapagkat kamatayan ang kabayaran ng kasalanan, ngunit ang walang bayad na kaloob ng Diyos ay buhay na walang hanggan sa pamamagitan ni Cristo Jesus na ating Panginoon.” Roma 6:23',
                },
              ],
            },
            {
              title: 'KATOTOHANAN 3',
              subtitle:
                'Si Hesukristo ang tanging probisyon ng Diyos para sa ating kasalanan.',
              content: [
                {
                  quoteTitle: '■ Namatay Siya dahil sa atin',
                  quote:
                    '“Ngunit pinatunayan ng Diyos ang kanyang pag-ibig sa atin nang mamatay si Cristo para sa atin noong tayo’y makasalanan pa.” Roma 5:8',
                },
                {
                  quoteTitle: '■ Siya ay muling nabuhay',
                  quote:
                    '“Si Cristo\'y namatay dahil sa ating mga kasalanan... inilibing Siya at muling nabuhay sa ikatlong araw...” 1 Corinto 15:3-4',
                },
                {
                  quoteTitle: '■ Siya lang ang tanging daan patungo sa Diyos',
                  quote:
                    '“Sumagot si Jesus, ‘Ako ang daan, ang katotohanan, at ang buhay. Walang makakapunta sa Ama kundi sa pamamagitan Ko.’” Juan 14:6',
                },
              ],
            },
            {
              title: 'KATOTOHANAN 4',
              subtitle:
                'Dapat nating isa-isang tanggapin si Hesukristo bilang ating Tagapagligtas at Panginoon.',
              content: [
                {
                  quoteTitle: '■ Dapat nating tanggapin si Kristo',
                  quote:
                    '“Subalit ang lahat ng tumanggap at sumampalataya sa Kanya ay binigyan Niya ng karapatang maging mga anak ng Diyos.” Juan 1:12',
                },
                {
                  quoteTitle: '■ Tinatanggap natin si Kristo sa pamamagitan ng pananampalataya',
                  quote:
                    '“At ang kaligtasang ito\'y kaloob ng Diyos—at hindi sa pamamagitan ng inyong sarili; hindi ito bunga ng inyong mga gawa kaya\'t walang dapat ipagmalaki ang sinuman.” Efeso 2:8-9',
                },
              ],
            },
          ].map((truth, index) => (
            <View key={index}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => handleTruthToggle(index)}
              >
                <Text style={styles.sectionHeaderText}>{truth.title}</Text>
                <Ionicons
                  name={showTruths[index] ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color={COLORS.lightText}
                />
              </TouchableOpacity>
              <Collapsible collapsed={!showTruths[index]}>
                <View style={styles.truthContent}>
                  <Text style={styles.subheader}>{truth.subtitle}</Text>
                  {truth.content.map((item, idx) => (
                    <View key={idx} style={styles.quoteBox}>
                      <Text style={styles.bold}>{item.quoteTitle}</Text>
                      <Text style={styles.quote}>{item.quote}</Text>
                    </View>
                  ))}
                </View>
              </Collapsible>
            </View>
          ))}

          {/* Reflection Question 2 */}
          <TouchableOpacity
            style={styles.questionButton}
            onPress={() => setShowReflection2(!showReflection2)}
          >
            <Text style={styles.questionButtonText}>
              {showReflection2 ? 'Itago' : 'Tanong para sa Iyo'}
            </Text>
            <Ionicons
              name={showReflection2 ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={COLORS.lightText}
            />
          </TouchableOpacity>
          <Collapsible collapsed={!showReflection2}>
            <View style={styles.reflectionBox}>
              <Text style={styles.text}>
                Ngayon gusto kong itanong sa iyo, ikaw ba ay ligtas na? Iyon ay nakadepende sa
                iyong tugon sa ating Tagapagligtas.
              </Text>
            </View>
          </Collapsible>

          {/* Takeaways Section */}
          <TouchableOpacity
            style={styles.takeawaysButton}
            onPress={() => setShowTakeaways(!showTakeaways)}
          >
            <Text style={styles.takeawaysButtonText}>
              {showTakeaways ? 'Itago ang Mga Pangunahing Kaalaman' : 'Mga Pangunahing Kaalaman'}
            </Text>
            <Ionicons
              name={showTakeaways ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={COLORS.lightText}
            />
          </TouchableOpacity>
          <Collapsible collapsed={!showTakeaways}>
            <View style={styles.takeawaysBox}>
              <Text style={styles.text}>
                <Text style={styles.bold}>1. </Text>Ang kaligtasan ay isang libreng handog mula sa Diyos.
              </Text>
              <Text style={styles.text}>
                <Text style={styles.bold}>2. </Text>Kailangan nating tanggapin si Hesus sa pamamagitan ng pananampalataya.
              </Text>
              <Text style={styles.text}>
                <Text style={styles.bold}>3. </Text>Ang relasyon sa Diyos ay isang buhay na proseso na nangangailangan ng patuloy na pakikipag-ugnayan.
              </Text>
            </View>
          </Collapsible>

          {/* Prayer Button */}
          {!prayerDone ? (
            <TouchableOpacity style={styles.prayerButton} onPress={handlePrayer}>
              <Ionicons name="praying" size={24} color={COLORS.lightText} />
              <Text style={styles.prayerButtonText}>Panalangin ng Pagtanggap</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.thankYouBox}>
              <Text style={styles.thankYouText}>Salamat sa iyong panalangin!</Text>
            </View>
          )}

          {/* Quiz Button */}
          <TouchableOpacity
            style={styles.quizButton}
            onPress={handleQuizPress}
          >
            <Ionicons name="school" size={24} color={COLORS.lightText} />
            <Text style={styles.quizButtonText}>
              Pumunta sa Quiz
            </Text>
          </TouchableOpacity>

          {/* Related Resources */}
          <TouchableOpacity
            style={styles.resourcesButton}
            onPress={() => navigation.navigate('ResourcesTagalog')}
          >
            <Ionicons name="book" size={24} color={COLORS.lightText} />
            <Text style={styles.resourcesButtonText}>Mga Kaugnay na Sanggunian</Text>
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
  quoteBox: {
    backgroundColor: COLORS.quoteBackground,
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  quote: {
    fontStyle: 'italic',
    color: COLORS.text,
    marginTop: 5,
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
  truthContent: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  bold: {
    fontWeight: 'bold',
    color: COLORS.text,
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
    marginBottom: 20,
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
  takeawaysButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  takeawaysButtonText: {
    color: COLORS.lightText,
    fontSize: 16,
    fontWeight: 'bold',
  },
  takeawaysBox: {
    backgroundColor: COLORS.takeawaysBackground,
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  resourcesButton: {
    backgroundColor: COLORS.accent,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  resourcesButtonText: {
    color: COLORS.lightText,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default Lesson1Tagalog;
