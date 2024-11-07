// Lesson2Tagalog.js

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
  takeawaysBackground: '#E6F7FF',
};

const Lesson2Tagalog = ({ navigation }) => {
  const [showSections, setShowSections] = useState([false, false, false, false]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;

  const handleSectionToggle = (index) => {
    const updatedSections = [...showSections];
    updatedSections[index] = !updatedSections[index];
    setShowSections(updatedSections);
  };

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

  const handleQuizPress = () => {
    navigation.navigate('QuizTagalog2', {
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
          {/* Header */}
          <ImageBackground
            source={require('../../../assets/logos/lesson2.jpg')}
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
                Panginoon (Bagong Panginoon)
              </Animated.Text>
            </LinearGradient>
          </ImageBackground>

          {/* Introductory Text */}
          <Text style={styles.text}>
            Paano ko malalaman kung mayroon akong walang hanggang buhay?
          </Text>
          <Text style={styles.text}>
            Sa unang aralin, nakita nating napakalinaw ng Bibliya – hindi maliligtas ang isang tao
            batay sa paggawa ng mabuti, pagiging relihiyoso, o pagsisikap na makabayad sa ating mga
            kasalanan sa pamamagitan ng mga ritwal ng relihiyon. Tayo ay naligtas sa pamamagitan ng
            biyaya ng Diyos sa pamamagitan ng pananampalataya sa sakripisyo o natapos na gawa ni
            Hesukristo para sa ating mga kasalanan. Hindi dahil tayo ay mabuti kaya tayo naligtas,
            kundi dahil ang Diyos ay mabuti, at gumawa Siya ng paraan para tayo ay maligtas.
          </Text>

          {/* Additional Knowledge Section */}
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => handleSectionToggle(0)}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionHeaderText}>
              {showSections[0] ? 'Itago' : 'Dagdag Kaalaman'}
            </Text>
            <Ionicons
              name={showSections[0] ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={COLORS.lightText}
            />
          </TouchableOpacity>
          <Collapsible collapsed={!showSections[0]}>
            <View style={styles.sectionContent}>
              <Text style={styles.text}>
                Ang salitang "Panginoon" sa orihinal na Griyego ay "kurios" (κύριoς), na
                nangangahulugang pinakamataas sa awtoridad, at bilang isang pangngalan, tagapamahala.
                Sa ibang salita, si Hesus ang may hawak ng kapangyarihan. Siya ang Panginoon, ang
                Guro, at ang Isa na gumagawa ng mga desisyon.
              </Text>
            </View>
          </Collapsible>

          {/* Paghahari ni Kristo Section */}
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => handleSectionToggle(1)}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionHeaderText}>
              {showSections[1] ? 'Itago' : 'Paghahari ni Kristo'}
            </Text>
            <Ionicons
              name={showSections[1] ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={COLORS.lightText}
            />
          </TouchableOpacity>
          <Collapsible collapsed={!showSections[1]}>
            <View style={styles.sectionContent}>
              <Text style={styles.text}>
                Ang Panginoonship ay isa sa mga pangunahing mensahe ng Bibliya. Si Hesus ay tinukoy
                bilang “Panginoon” ng 100 beses sa Aklat ng Mga Gawa at 622 beses naman sa buong
                Bagong Tipan, habang tinutukoy bilang “Tagapagligtas” ng 2 beses lamang sa Aklat ng
                Mga Gawa at dalawampung beses sa Bagong Tipan. Ang Biblikal na diin ay labis sa
                konsepto ng Panginoonship. Ang ibig sabihin ng Lord ay panginoon, ang Isa na
                sinusunod.
              </Text>
              <View style={styles.quoteBox}>
                <Text style={styles.quote}>
                  “Kaya't dapat malaman ng buong Israel na itong si Hesus na ipinako ninyo sa krus
                  ay siyang ginawa ng Diyos na Panginoon at Kristo!" (Gawa 2:36)
                </Text>
              </View>
            </View>
          </Collapsible>

          {/* Ano ang ibig sabihin ng “Si Hesus ay ang aking Panginoon”? */}
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => handleSectionToggle(2)}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionHeaderText}>
              {showSections[2]
                ? 'Itago'
                : 'Ano ang ibig sabihin ng “Si Hesus ay ang aking Panginoon”?'}
            </Text>
            <Ionicons
              name={showSections[2] ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={COLORS.lightText}
            />
          </TouchableOpacity>
          <Collapsible collapsed={!showSections[2]}>
            <View style={styles.sectionContent}>
              <Text style={styles.subheader}>1.) Panginoon sa Kaligtasan</Text>
              <Text style={styles.text}>
                Ang panimulang punto ng kaligtasan ay ang pagkilala sa pagiging Panginoon ni
                Hesukristo. Ang pag-amin na si Hesus ay Panginoon ay nagpapakita ng pagsunod sa
                Kaniyang pagiging Panginoon sa bawat lugar at aspeto ng ating buhay. Kung si Jesus ay
                hindi Panginoon ng lahat, Siya ay hindi Panginoon sa lahat. Hindi natin maaring
                paghiwalayin ang pagiging Tagapagligtas ni Hesus at pagiging Panginoon ni Hesus. Kung
                si Hesus ay Tagapagligtas, dapat Siya rin ang ating Panginoon, ibig sabihin Siya ang
                ating amo o guro na mangunguna sa lahat ng ating desisyon sa buhay.
              </Text>
              <View style={styles.quoteBox}>
                <Text style={styles.quote}>
                  "Kung ipahahayag ng iyong bibig na si Jesus ay Panginoon at buong puso kang
                  sasampalataya na siya'y muling binuhay ng Diyos, maliligtas ka." (Roma 10:9)
                </Text>
              </View>
              <Text style={styles.text}>
                Hindi tayo binibigyan ng opsyon na tanggapin Siya bilang Tagapagligtas, kundi bilang
                Panginoon. Ito ay dapat na parehong Panginoon at Tagapagligtas. Ang kaligtasan ay
                isang alok na lahat o wala.
              </Text>
              <Text style={styles.subheader}>2.) Ang pagtanggap sa Panginoon ay nagsisimula sa puso.</Text>
              <Text style={styles.text}>
                Ang pagsusumite kay Hesukristo bilang Panginoon ay hindi tungkol sa pagsunod sa isang
                hanay ng mga panrelihiyong alituntunin, regulasyon, o tradisyon. Ang pagiging
                panginoon ay isang usaping mula sa puso.
              </Text>
              <View style={styles.quoteBox}>
                <Text style={styles.quote}>
                  "Igalang ninyo si Cristo mula sa inyong puso bilang Panginoon. Lagi kayong maging
                  handang sumagot sa sinumang humihingi ng paliwanag sa inyo tungkol sa pag-asang
                  nasa inyo". (1 Pedro 3:15)
                </Text>
              </View>
              <Text style={styles.text}>
                Nagsisimula ito bilang isang simpleng panloob na pagsusumite ng puso. Ang tunay na
                pagsunod ng puso ay sa kalaunan ay magpapakita ng sarili sa labas sa pamamagitan ng
                panlabas na pagsunod.
              </Text>
              <Text style={styles.subheader}>3.) Ang pagtanggap sa Panginoon ay may kaakibat na pagsunod.</Text>
              <Text style={styles.text}>
                Kung sinoman ang angkin na si Hesus ang kaniyang Panginoon ay inaasahang sumunod
                sa Kaniyang mga kautusan. Ang pag-iisip lamang tungkol sa pagsunod kay Kristo ay
                hindi sapat.
              </Text>
              <View style={styles.quoteBox}>
                <Text style={styles.quote}>
                  “Bakit ninyo ako tinatawag na ‘Panginoon, Panginoon,’ gayong hindi naman ninyo
                  tinutupad ang sinasabi ko?" (Lucas 6:46)
                </Text>
              </View>
              <Text style={styles.text}>
                Ang pagsasabi na susunod ka sa Kanya ay hindi sapat.
              </Text>
              <View style={styles.quoteBox}>
                <Text style={styles.quote}>
                  “Hindi lahat ng tumatawag sa akin, ‘Panginoon, Panginoon,’ ay papasok sa kaharian
                  ng langit, kundi ang mga taong sumusunod sa kalooban ng aking Ama na nasa
                  langit." ( Mateo 7:21)
                </Text>
              </View>
              <Text style={styles.text}>
                Ang pagsunod, o hindi pagsunod, ay makikita sa ating pamumuhay. Paano mo masasabing
                tinanggap mo si Jesus bilang iyong Tagapagligtas at bilang iyong Panginoon? Simple
                lang, kung mayroon kang kagustuhang sundin ang lahat ng Kanyang utos.
              </Text>
            </View>
          </Collapsible>

          {/* Pagtanggap sa Panginoon sa pang araw-araw nating pamumuhay */}
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => handleSectionToggle(3)}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionHeaderText}>
              {showSections[3]
                ? 'Itago'
                : 'Pagtanggap sa Panginoon sa pang araw-araw nating pamumuhay'}
            </Text>
            <Ionicons
              name={showSections[3] ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={COLORS.lightText}
            />
          </TouchableOpacity>
          <Collapsible collapsed={!showSections[3]}>
            <View style={styles.sectionContent}>
              <Text style={styles.text}>
                Sinisimulan natin ang ating Kristiyanong pamumuhay sa pamamagitan ng pagkilala kay
                Jesus bilang Panginoon. Ito ay hindi isang beses na pangyayari kundi isang
                panghabangbuhay na karanasan. Dapat tayong patuloy na maglakad sa ilalim ng Kanyang
                Panginoon para sa natitirang bahagi ng ating buhay.
              </Text>
              <View style={styles.quoteBox}>
                <Text style={styles.quote}>
                  "Yamang tinanggap na ninyo si Cristo Jesus bilang Panginoon, mamuhay kayo na may
                  pakikipag-isa sa kanya." (Colosas 2:6)
                </Text>
              </View>
              <Text style={styles.text}>
                Habang mas nakikilala natin Siya, mas lalo tayong sumusunod sa Kanya.
              </Text>
              <Text style={styles.subheader}>Paano natin kinikilala ang Kaniyang pagiging Panginoon sa ating buhay?</Text>
              <Text style={styles.text}>
                <Text style={styles.bold}>Kilalanin ang Panginoon sa pamamagitan ng maayos na desisyon.</Text>
              </Text>
              <Text style={styles.text}>
                Si Hesukristo, Panginoon ng mga Panginoon, ay palaging umiiral at palaging magiging
                ganito. Hindi lahat ng tao sa kasalukuyan ay kinikilala Siya bilang kanilang
                Panginoon, ngunit hindi nito binabago ang katotohanan ng Kaniyang pagiging Panginoon.
                Balang-araw ay kikilalanin ng lahat si Kristo bilang Panginoon, ngunit ang
                pribilehiyo na kilalanin at sundin na siya ang Panginoon ay posible na ngayon.
                Pahintulutan si Kristo na maging Panginoon ng iyong buhay sa pamamagitan ng desisyon.
              </Text>
              <Text style={styles.text}>
                <Text style={styles.bold}>Kilalanin siya bilang Panginoon sa Pagsasagawa</Text>
              </Text>
              <Text style={styles.text}>
                Ang mabuting intensyon ay hindi ginagarantiyahan ng mabuting resulta. Ang magandang
                simula ay hindi garantiya ng matibay na wakas; ang desisyon ay simula lamang. Kapag
                napagpasyahan mong kilalanin ang pagiging Panginoon ni Kristo sa iyong buhay,
                mapapatunayan mong Siya ay Panginoon sa pamamagitan ng pagpapasakop sa Kaniya sa
                bawat oras at pagsunod sa Kaniya sa araw-araw na mga gawain ng buhay. Halimbawa,
                kanino mo ipinagkakatiwala ang iyong buhay, mga desisyon, pag-aaral, mga relasyon, o
                kahit ang iyong mga pag-aari?
              </Text>
            </View>
          </Collapsible>

          {/* Conclusion */}
          <Text style={styles.subheader}>Maari nating malaman!</Text>
          <Text style={styles.text}>
            Basahin ang (Juan 5:11-13)
            {'\n'}
            [11] At ito ang patotoo ng Dios: Binigyan niya tayo ng buhay na walang hanggan, at ang
            buhay na itoʼy nasa kanyang Anak. [12] Ang sinumang nasa kanya ang Anak ng Dios ay may
            buhay na walang hanggan. Ngunit ang sinumang wala sa kanya ang Anak ng Dios ay walang
            buhay na walang hanggan. [13] Isinusulat ko ito sa inyo na mga sumasampalataya sa anak ng
            Diyos upang malaman ninyong mayroon kayong buhay na walang hanggan.
          </Text>
          <Text style={styles.text}>
            Isa sa pinakamakapangyarihang halimbawa ng katiyakan ng ating relasyon kay Cristo ay ang
            Kaniyang kwento tungkol sa Mabuting Pastol.
          </Text>

          {/* Reflection */}
          <TouchableOpacity
            style={styles.questionButton}
            onPress={() => Alert.alert('Reflection', 'Take time to reflect on the lesson.')}
            activeOpacity={0.7}
          >
            <Text style={styles.questionButtonText}>Pagninilay</Text>
            <Ionicons name="pricetag" size={24} color={COLORS.lightText} />
          </TouchableOpacity>

          {/* Navigate to Quiz */}
          <TouchableOpacity
            style={styles.quizButton}
            onPress={handleQuizPress}
            activeOpacity={0.7}
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
  sectionContent: {
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
    backgroundColor: COLORS.secondary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  questionButtonText: {
    color: COLORS.lightText,
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
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
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

export default Lesson2Tagalog;
