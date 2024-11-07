// QuizTagalog3.js

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Progress from 'react-native-progress';

const QuizTagalog3 = ({ navigation, route }) => {
  const { onQuizComplete } = route.params || {}; // Retrieve onQuizComplete from route.params
  const [quiz, setQuiz] = useState(null);
  const [userId, setUserId] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes timer for 15 questions
  const [loading, setLoading] = useState(true);

  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchUserId();
    fetchQuizData();
  }, []);

  useEffect(() => {
    let timer;

    if (!submitted && quiz) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleSubmitQuiz();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [submitted, quiz]);

  const fetchUserId = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId !== null) {
        setUserId(parseInt(storedUserId));
      } else {
        // Handle the case where userId is not found in AsyncStorage
        Alert.alert('Error', 'User ID not found. Please log in again.');
        navigation.navigate('LoginScreen'); // Navigate to login screen
      }
    } catch (error) {
      console.error('Error retrieving userId from AsyncStorage:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  const fetchQuizData = async () => {
    try {
      if (userId === null) {
        // User ID not yet fetched
        return;
      }

      // Check if the user has already passed Quiz Tagalog 3
      const statusResponse = await axios.get(
        `https://backend-disciple-a692164f13b9.herokuapp.com/api/quiz/status/3`,
        {
          params: { userId: userId },
        }
      );

      console.log('Quiz status response:', statusResponse.data); // For debugging

      const hasPassed = statusResponse.data.hasPassed;

      if (hasPassed) {
        Alert.alert('Quiz Completed', 'You have already passed this quiz.', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(), // Navigate back or to another screen
          },
        ]);
        setLoading(false);
        return;
      }

      // Fetch the quiz questions
      const quizResponse = await axios.get(
        `https://backend-disciple-a692164f13b9.herokuapp.com/api/quiz/tagalog/3`
      );

      if (
        quizResponse.data &&
        quizResponse.data.questions &&
        quizResponse.data.questions.length > 0
      ) {
        setQuiz(quizResponse.data);
        console.log('Fetched Tagalog Quiz 3 Data:', quizResponse.data);
      } else {
        Alert.alert('No Questions', 'The quiz does not have any questions.');
      }
    } catch (error) {
      console.error('Error fetching Tagalog Quiz 3 data:', error);
      Alert.alert('Error', 'Could not fetch Tagalog quiz data.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, answerId) => {
    setSelectedAnswers((prevState) => ({
      ...prevState,
      [questionId]: answerId,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (submitted) {
      // Prevent multiple submissions
      return;
    }

    setSubmitted(true);
    let tempCorrectCount = 0;

    quiz.questions.forEach((question) => {
      const selectedAnswerId = selectedAnswers[question.questionID];
      const correctAnswer = question.answers.find((answer) => answer.isCorrect === true);

      if (
        correctAnswer &&
        parseInt(correctAnswer.answerID) === parseInt(selectedAnswerId)
      ) {
        tempCorrectCount++;
      }
    });

    // Calculate percentage
    const percentage = (tempCorrectCount / quiz.questions.length) * 100;
    const passed = percentage >= 70;

    // Prepare data to send to the backend
    const quizResult = {
      quizId: quiz.quizId, // Assuming quizId is 3
      userId: userId,
      score: tempCorrectCount,
      totalQuestions: quiz.questions.length,
      selectedAnswers: selectedAnswers,
    };

    try {
      // Send the data to the backend
      const response = await axios.post(
        'https://backend-disciple-a692164f13b9.herokuapp.com/api/quiz/submit',
        quizResult
      );

      console.log('Quiz result saved:', response.data);

      if (passed) {
        // Save quiz completion status in AsyncStorage
        try {
          await AsyncStorage.setItem('quiz3Passed', 'true');
        } catch (error) {
          console.error('Error saving quiz completion status:', error);
        }

        // Call onQuizComplete callback if it exists
        if (onQuizComplete) {
          await onQuizComplete();
        }

        Alert.alert(
          'Quiz Submitted',
          `You scored ${tempCorrectCount} out of ${quiz.questions.length}!\n\nCongratulations! You passed the quiz.`,
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('DiscipleshipDashboard'), // Navigate to dashboard or next screen
            },
          ]
        );
      } else {
        Alert.alert(
          'Quiz Submitted',
          `You scored ${tempCorrectCount} out of ${quiz.questions.length}.\n\nYou need at least 70% to pass. Please try again.`,
          [
            {
              text: 'Retake Quiz',
              onPress: () => {
                // Reset quiz state
                setSubmitted(false);
                setSelectedAnswers({});
                setCorrectCount(0);
                setTimeRemaining(300); // Reset timer
                // Reset progress bar
                Animated.timing(progress, {
                  toValue: 0,
                  duration: 500,
                  easing: Easing.linear,
                  useNativeDriver: false,
                }).start();
              },
            },
            {
              text: 'Cancel',
              onPress: () => navigation.goBack(),
              style: 'cancel',
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error saving quiz result:', error);
      Alert.alert('Error', 'An error occurred while saving your quiz result.');
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const animateProgress = () => {
    Animated.timing(progress, {
      toValue: 1 - timeRemaining / 300, // Progress based on time elapsed
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    if (quiz) {
      animateProgress();
    }
  }, [timeRemaining, quiz]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF8C00" />
        <Text style={styles.loadingText}>Loading Quiz...</Text>
      </View>
    );
  }

  if (!quiz) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load the quiz.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.quizTitle}>{quiz.title}</Text>
      <Text style={styles.quizDescription}>{quiz.description}</Text>

      {/* Timer Progress Bar */}
      <View style={styles.timerContainer}>
        <Progress.Bar
          progress={(300 - timeRemaining) / 300}
          width={null}
          height={10}
          color="#FF8C00"
          borderRadius={5}
        />
        <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
      </View>

      {/* Questions */}
      {quiz.questions.map((question, index) => (
        <View key={question.questionID} style={styles.questionContainer}>
          <Text style={styles.questionNumber}>
            {index + 1}. {question.questionText}
          </Text>

          {question.answers.map((option) => {
            const isSelected = selectedAnswers[question.questionID] === option.answerID;
            let optionStyle = styles.defaultOption;

            if (submitted) {
              if (isSelected && option.isCorrect) {
                optionStyle = styles.correctOption;
              } else if (isSelected && !option.isCorrect) {
                optionStyle = styles.wrongOption;
              } else if (option.isCorrect) {
                optionStyle = styles.correctOption;
              } else {
                optionStyle = styles.defaultOptionDisabled;
              }
            } else if (isSelected) {
              optionStyle = styles.selectedOption;
            }

            return (
              <TouchableOpacity
                key={option.answerID}
                style={[styles.optionButton, optionStyle]}
                onPress={() => handleAnswerSelect(question.questionID, option.answerID)}
                disabled={submitted}
              >
                <Text style={styles.optionText}>{option.answerText}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}

      {/* Submit Button */}
      {!submitted && (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmitQuiz}>
          <Text style={styles.submitButtonText}>Submit Quiz</Text>
        </TouchableOpacity>
      )}

      {/* Score Display */}
      {submitted && (
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>
            You scored {correctCount} out of {quiz.questions.length}!
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#FF4500',
    textAlign: 'center',
  },
  quizTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  quizDescription: {
    fontSize: 18,
    fontStyle: 'italic',
    marginBottom: 20,
    color: '#666',
    textAlign: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  timerText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
  questionContainer: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  questionNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  optionButton: {
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
  },
  defaultOption: {
    backgroundColor: '#FF8C00',
  },
  selectedOption: {
    backgroundColor: '#FFD700',
  },
  correctOption: {
    backgroundColor: '#32CD32',
  },
  wrongOption: {
    backgroundColor: '#FF4500',
  },
  defaultOptionDisabled: {
    backgroundColor: '#A9A9A9',
  },
  optionText: {
    fontSize: 16,
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoreContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  scoreText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#32CD32',
  },
});

export default QuizTagalog3;
