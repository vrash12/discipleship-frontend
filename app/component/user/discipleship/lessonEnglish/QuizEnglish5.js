// QuizEnglish5.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QuizEnglish5 = ({ navigation }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [score, setScore] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const [loading, setLoading] = useState(true);
  const progress = useRef(new Animated.Value(0)).current;
  const [timeRemaining, setTimeRemaining] = useState(300); // 3 minutes timer

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchQuizData();
  }, []);

  useEffect(() => {
    let timer;

    if (questions.length > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleQuizEnd();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [questions]);

  const fetchQuizData = async () => {
    try {
      // Retrieve userId from AsyncStorage
      const storedUserId = await AsyncStorage.getItem('userId');
      if (!storedUserId) {
        Alert.alert('Error', 'User not logged in');
        navigation.navigate('Login');
        return;
      }
      const userId = parseInt(storedUserId);
      setUserId(userId);

      // Check if the user has already passed the quiz
      const statusResponse = await axios.get(
        `https://backend-disciple-a692164f13b9.herokuapp.com/api/quiz/status/5`,
        {
          params: { userId: userId },
        }
      );

      console.log('Quiz status response:', statusResponse.data);

      const hasPassed = statusResponse.data.hasPassed;

      if (hasPassed) {
        Alert.alert('Quiz Completed', 'You have already passed this quiz.', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
        setLoading(false);
        return;
      }

      // Proceed with fetching the quiz questions
      const quizResponse = await axios.get(
        'https://backend-disciple-a692164f13b9.herokuapp.com/api/quiz/english/5'
      );
      if (
        quizResponse.data &&
        quizResponse.data.questions &&
        quizResponse.data.questions.length > 0
      ) {
        setQuestions(quizResponse.data.questions);
        console.log(
          'Fetched Questions:',
          JSON.stringify(quizResponse.data.questions, null, 2)
        );
        setLoading(false);
      } else {
        Alert.alert('No Questions', 'The quiz does not have any questions.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching quiz data:', error);
      Alert.alert('Error', 'Could not fetch quiz data.');
      setLoading(false);
    }
  };

  const validateAnswer = (selectedOption) => {
    const currentQuestion = questions[currentQuestionIndex];

    if (!currentQuestion || !currentQuestion.answers) {
      Alert.alert('Error', 'No answers available for this question.');
      return;
    }

    const correctOptionID = currentQuestion.answers.find((option) => option.correct)?.answerID;

    if (selectedOption.answerID === correctOptionID) {
      setScore((prevScore) => prevScore + 1);
    }

    setSelectedOptionId(selectedOption.answerID);
    setShowNextButton(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex === questions.length - 1) {
      // Quiz finished
      handleQuizEnd();
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedOptionId(null);
      setShowNextButton(false);
      animateProgress();
    }
  };

  const handleQuizEnd = () => {
    const quizResult = {
      quizId: 5, // Since this is quiz 5 (English)
      userId: userId, // Use actual user ID
      score: score,
      totalQuestions: questions.length,
    };

    axios
      .post('https://backend-disciple-a692164f13b9.herokuapp.com/api/quiz/submit', quizResult)
      .then((response) => {
        console.log('Quiz result saved:', response.data);

        // Check if the user passed or failed
        const percentage = (score / questions.length) * 100;
        const passed = percentage >= 70;

        if (passed) {
          Alert.alert(
            'Quiz Completed',
            `Congratulations! You scored ${score} out of ${questions.length} and passed the quiz.`,
            [
              {
                text: 'OK',
                onPress: () => navigation.navigate('UserDashboard'), // Navigate to dashboard or next screen
              },
            ]
          );
        } else {
          Alert.alert(
            'Quiz Completed',
            `You scored ${score} out of ${questions.length}. You need at least 70% to pass. Please try again.`,
            [
              {
                text: 'Retake Quiz',
                onPress: () => {
                  // Reset quiz state
                  setCurrentQuestionIndex(0);
                  setScore(0);
                  setSelectedOptionId(null);
                  setShowNextButton(false);
                  setTimeRemaining(300); // Reset timer
                },
              },
              {
                text: 'Cancel',
                onPress: () => navigation.goBack(),
              },
            ]
          );
        }
      })
      .catch((error) => {
        console.error('Error saving quiz result:', error);
        Alert.alert('Error', 'An error occurred while saving your quiz result.');
      });
  };

  const animateProgress = () => {
    Animated.timing(progress, {
      toValue: (currentQuestionIndex + 1) / questions.length,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  const renderQuestion = () => {
    if (questions.length === 0 || !questions[currentQuestionIndex]) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>No questions available.</Text>
        </View>
      );
    }

    const question = questions[currentQuestionIndex];
    console.log('Current Question:', question);

    if (!question.answers || question.answers.length === 0) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>
            No answers available for this question.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          {currentQuestionIndex + 1}. {question.questionText}
        </Text>
        {question.answers.map((option) => {
          const isSelected = selectedOptionId === option.answerID;
          const isCorrect = option.correct;

          let optionStyle = styles.defaultOption;
          if (selectedOptionId !== null) {
            if (isSelected && isCorrect) {
              optionStyle = styles.correctOption;
            } else if (isSelected && !isCorrect) {
              optionStyle = styles.wrongOption;
            } else if (isCorrect) {
              optionStyle = styles.correctOption;
            } else {
              optionStyle = styles.defaultOptionDisabled;
            }
          }

          return (
            <TouchableOpacity
              key={option.answerID}
              style={[styles.optionButton, optionStyle]}
              onPress={() => validateAnswer(option)}
              disabled={selectedOptionId !== null}
            >
              <Text style={styles.optionText}>{option.answerText}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF8C00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Timer */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>
          Time Remaining: {formatTime(timeRemaining)}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>

      {/* Question */}
      {renderQuestion()}

      {/* Next Button */}
      {showNextButton && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF4500',
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    marginBottom: 20,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#FF8C00',
    borderRadius: 5,
  },
  questionContainer: {
    flex: 1,
  },
  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  optionButton: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  optionText: {
    fontSize: 18,
    color: '#FFF',
  },
  defaultOption: {
    backgroundColor: '#FF8C00',
  },
  defaultOptionDisabled: {
    backgroundColor: '#A9A9A9',
  },
  correctOption: {
    backgroundColor: '#32CD32',
  },
  wrongOption: {
    backgroundColor: '#FF4500',
  },
  nextButton: {
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 30,
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#FF4500',
    textAlign: 'center',
  },
});

export default QuizEnglish5;
