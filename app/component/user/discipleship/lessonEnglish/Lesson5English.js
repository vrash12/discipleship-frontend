import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';

const Lesson5English = ({ navigation, route }) => {
  const [showTruths, setShowTruths] = useState([false, false, false, false, false, false]);
  const [prayerDone, setPrayerDone] = useState(false);

  const { onComplete } = route.params || {};

  const handleCompleteLesson = () => {
    setPrayerDone(true);
    Alert.alert('Congratulations!', "You've completed the lesson.");
    if (onComplete) {
      onComplete(); // Call the onComplete function when the lesson is completed
    }
  };

  const truthsAnim = useRef(
    [0, 1, 2, 3, 4, 5].map(() => new Animated.Value(0))
  ).current;

  const fadeIn = (animation) => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = (animation) => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleToggleTruth = (index) => {
    let newTruths = [...showTruths];
    newTruths[index] = !newTruths[index];
    setShowTruths(newTruths);
    newTruths[index]
      ? fadeIn(truthsAnim[index])
      : fadeOut(truthsAnim[index]);
  };

  const handlePrayerConfirmation = () => {
    setPrayerDone(true);
    Alert.alert(
      'Congratulations!',
      "You've committed to the mission of reaching the next generation."
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lesson 5: Reaching the Next Generation</Text>
      <ScrollView style={styles.content}>
        <Text style={styles.text}>
          The church grows not only because one generation knows God and follows
          Him, but the church also grows when one generation passes the Gospel
          to the next generation. We can see this in the lives of Paul and
          Timothy. In this lesson, we will learn the value of youth from God's
          perspective, from the perspective of previous generations, and from
          the perspective of the next generation.
        </Text>

        <Text style={styles.subheader}>NEW MISSION TO MAKE HISTORY</Text>

        <View style={styles.scriptureBox}>
          <Text style={styles.scripture}>
            "Don't let anyone look down on you because you are young, but set an
            example for the believers in speech, in conduct, in love, in faith
            and in purity." (1 Timothy 4:12)
          </Text>
          <Text style={styles.scripture}>
            "Remember your Creator in the days of your youth, before the days of
            trouble come and the years approach when you will say, 'I find no
            pleasure in them.'" (Ecclesiastes 12:1)
          </Text>
        </View>

        <Text style={styles.subheader}>Why the Youth?</Text>

        {/* Truths */}
        {[
          'God values the next generation.',
          'The preceding generation is to challenge and believe in the next generation.',
          'The next generation is to set a godly example.',
          'The truth about today’s youth.',
          'How can we reach the next generation?',
          'Our Movement in the Campus',
        ].map((truth, index) => (
          <View key={index}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => handleToggleTruth(index)}
            >
              <Text style={styles.sectionHeaderText}>
                {truth} {showTruths[index] ? '-' : '+'}
              </Text>
            </TouchableOpacity>
            {showTruths[index] && (
              <Animated.View
                style={[styles.truthContent, { opacity: truthsAnim[index] }]}
              >
                <Text style={styles.text}>
                  {index === 0 &&
                    `One generation shall commend your works to another, and shall declare your mighty acts. (Psalm 145:4)\n\nSince the beginning, God has been at work in every generation, and He values the next generation. The Bible says that the current generation should commend and declare the works of God to the next generation. This is God's design.`}
                  {index === 1 &&
                    `Don't let anyone look down on you because of your youth. (1 Timothy 4:12)\n\nPaul believed in Timothy and trained him to fulfill God's calling on his life even though he was still a teenager. Timothy did not allow himself to be underestimated just because he was young. We should not underestimate or be frustrated with youth because they hold immense potential for God's kingdom.`}
                  {index === 2 &&
                    `No matter how young the next generation is, they can humbly and graciously set a godly example that even the older generation can emulate. Because the next generation encountered God and He changed that generation, these young people will be the standard of godly speech and behavior, in love, in faith, and of course, in purity.`}
                  {index === 3 &&
                    `- Addiction is harder to deal with than ever.\n- Homosexual acts and relationships are more accepted than ever.\n- Selling the body for sex in exchange for money (or grades) is becoming common.\n- Suicide and depression rates are increasing among youth.\n- Individualism and relativism are prevalent.\n- The number of broken families is increasing.\n- God is acknowledged but not central in their lives.`}
                  {index === 4 &&
                    `- **Intercede**: Pray fervently for the salvation and discipleship of the youth.\n- **Invest**: Spend time building healthy relationships and friendships.\n- **Introduce**: Share the Gospel gradually and share your life testimony.\n- **Invite**: Encourage them to join church services and fellowship groups.\n- **Instruct**: Teach them regularly to grow in knowledge.\n- **Inspire**: Motivate them to serve God and the community.\n- **Involve**: Engage them in discipleship processes and real-life ministry experiences.`}
                  {index === 5 &&
                    `We should value the mission of reaching the youth and raising future leaders on campuses and in communities, resulting in increased passion, commitment, and support for the mission, creating a revolution to impact the world.\n\n**WHY THE CAMPUS?**\n- The future leaders of our country are on campuses.\n- Major movements, both good and bad, begin within the campus.\n- Most of the country's leaders were once students.\n- International students can impact their nations.\n- Values on campus often become the values of society.\n- The most available and trainable group of people are on campuses.\n- When we reach a student, we reach a family.\n- God promised to pour out His Spirit on sons and daughters (Acts 2:17).`}
                </Text>
              </Animated.View>
            )}
          </View>
        ))}

        {/* Commitment Section */}
        {!prayerDone && (
          <TouchableOpacity
            style={styles.prayerButton}
            onPress={handlePrayerConfirmation}
          >
            <Text style={styles.prayerButtonText}>Commit to the Mission</Text>
          </TouchableOpacity>
        )}
        {prayerDone && (
          <Text style={styles.text}>
            Thank you for committing to the mission! Continue to reach out and
            impact the next generation.
          </Text>
        )}

        {/* Complete Lesson Button */}

        <TouchableOpacity
          style={styles.quizButton}
          onPress={() => navigation.navigate('QuizEnglish5')}
        >
          <Text style={styles.quizButtonText}>Start Quiz</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleCompleteLesson}
        >
          <Text style={styles.completeButtonText}>Complete Lesson</Text>
        </TouchableOpacity>

        {/* Back to Lessons Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back to Lessons</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 20,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 15,
  },
  scriptureBox: {
    backgroundColor: '#E8F4FA',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  scripture: {
    fontStyle: 'italic',
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 16,
  },
  subheader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#FF8C00',
    textAlign: 'center',
  },
  sectionHeader: {
    backgroundColor: '#FF8C00',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  sectionHeaderText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  truthContent: {
    marginBottom: 20,
    paddingLeft: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#FF8C00',
  },
  prayerButton: {
    backgroundColor: '#32CD32',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  prayerButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  completeButton: {
    backgroundColor: '#FF8C00',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  completeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#A9A9A9',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  quizButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  quizButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Lesson5English;
