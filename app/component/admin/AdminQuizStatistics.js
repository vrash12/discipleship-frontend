// AdminQuizStatistics.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
  TextInput,
} from 'react-native';
import axios from 'axios';
import { BarChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

// Get screen dimensions
const screenWidth = Dimensions.get('window').width;

const AdminQuizStatistics = ({ navigation }) => {
  const [quizStatistics, setQuizStatistics] = useState([]);
  const [filteredStatistics, setFilteredStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#f5f5f5',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForBackgroundLines: {
      strokeWidth: 1,
      stroke: '#e3e3e3',
      strokeDasharray: '0',
    },
  };

  useEffect(() => {
    fetchQuizStatistics();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, quizStatistics]);

  // Fetch quiz statistics
  const fetchQuizStatistics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'https://backend-disciple-a692164f13b9.herokuapp.com/api/admin/quiz-statistics'
      );
      console.log('Quiz Statistics Data:', JSON.stringify(response.data, null, 2));

      const dataWithRoles = response.data
        .filter((user) => {
          // Exclude users with no quiz results
          const hasQuizResults = user.quizResults && user.quizResults.length > 0;
          // Exclude user with id 1 (Head Admin)
          const isHeadAdmin = user.userId === 1;
          return hasQuizResults && !isHeadAdmin;
        })
        .map((user) => ({
          ...user,
          role: user.role || 'USER', // Default role
          quizResults: user.quizResults.filter(
            (result) => result.status !== 'RESET'
          ),
        }));

      setQuizStatistics(dataWithRoles);
      setFilteredStatistics(dataWithRoles); // Update filtered data
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching quiz statistics:', error);
      setLoading(false);
      setRefreshing(false);
      Alert.alert(
        'Error',
        'Failed to fetch quiz statistics. Please try again.'
      );
    }
  };

  // Refresh the data
  const onRefresh = () => {
    setRefreshing(true);
    fetchQuizStatistics();
  };

  // Reset quiz for a user
  const handleResetQuiz = async (userId, quizId) => {
    try {
      Alert.alert(
        'Confirm Reset',
        'Are you sure you want to reset this quiz for the user?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Reset',
            style: 'destructive',
            onPress: async () => {
              const response = await axios.post(
                'https://backend-disciple-a692164f13b9.herokuapp.com/api/admin/reset-quiz',
                {
                  userId,
                  quizId,
                }
              );
              if (response.data.success) {
                Alert.alert('Success', 'Quiz has been reset.');
                fetchQuizStatistics(); // Refresh data after reset
              } else {
                Alert.alert('Error', 'Failed to reset quiz.');
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error resetting quiz:', error);
      Alert.alert('Error', 'An error occurred while resetting the quiz.');
    }
  };

  // Filter users based on search query
  const filterUsers = () => {
    let filteredData = quizStatistics;

    if (searchQuery.trim() !== '') {
      filteredData = filteredData.filter((user) =>
        user.userName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredStatistics(filteredData);
  };

  // Render user stats including their quizzes
  const renderUserStats = ({ item }) => {
    const scores = item.quizResults.map((result) => result.score);

    // Change labels to numbers from 1 to N
    const quizLabels = item.quizResults.map((_, index) => (index + 1).toString());

    const chartData = {
      labels: quizLabels,
      datasets: [
        {
          data: scores,
        },
      ],
    };

    return (
      <Animatable.View
        animation="fadeInUp"
        duration={1000}
        style={styles.userStatsContainer}
      >
        <Text style={styles.userName}>{item.userName}</Text>
        <Text style={styles.userRole}>Role: {item.role}</Text>
        <Text style={styles.userLeader}>
          Leader: {item.leaderName ? item.leaderName : 'None'}
        </Text>

        {item.quizResults.length > 0 ? (
          <>
            <BarChart
              data={chartData}
              width={screenWidth - 60}
              height={220}
              yAxisLabel=""
              chartConfig={chartConfig}
              style={styles.chartStyle}
              fromZero
              showValuesOnTopOfBars
            />

            {/* Legend mapping numbers to quiz titles */}
            <View style={styles.legendContainer}>
              {item.quizResults.map((result, index) => (
                <Text key={result.quizId} style={styles.legendItem}>
                  {index + 1}. {result.quizTitle}
                </Text>
              ))}
            </View>

            {/* Display quiz results in a list */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {item.quizResults.map((result, index) => (
                <View key={result.quizId} style={styles.quizResultCard}>
                  <Text style={styles.quizTitle}>
                    {index + 1}. {result.quizTitle}
                  </Text>
                  <Text style={styles.scoreText}>
                    Score: {result.score} / {result.totalQuestions}
                  </Text>
                  <Text style={styles.dateText}>
                    Date: {new Date(result.submissionDate).toLocaleDateString()}
                  </Text>

                  {/* Reset Quiz Button */}
                  <TouchableOpacity
                    style={styles.resetButton}
                    onPress={() => handleResetQuiz(item.userId, result.quizId)}
                  >
                    <Text style={styles.resetButtonText}>Reset Quiz</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </>
        ) : (
          <Text style={styles.noQuizText}>No quiz results available.</Text>
        )}
      </Animatable.View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Fetching quiz statistics...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#4A90E2" />
        <Text style={styles.backButtonText}>Back to Dashboard</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Quiz Statistics</Text>

      <View style={styles.filterContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by user name"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>
      </View>

      {filteredStatistics.length > 0 ? (
        <FlatList
          data={filteredStatistics}
          renderItem={renderUserStats}
          keyExtractor={(item) => item.userId.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <Text style={styles.noDataText}>
          {searchQuery
            ? 'No users found.'
            : 'No quiz statistics available.'}
        </Text>
      )}
    </View>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4A90E2',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    marginTop: 10,
    marginBottom: 5,
  },
  backButtonText: {
    marginLeft: 5,
    fontSize: 18,
    color: '#4A90E2',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginVertical: 10,
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 5,
  },
  categoryContainer: {
    width: 130,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  picker: {
    height: 40,
    width: '100%',
  },
  userStatsContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 15,
    elevation: 3,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  userRole: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
    textAlign: 'center',
  },
  userLeader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  quizResultCard: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginRight: 10,
    borderRadius: 10,
    width: 220,
    elevation: 2,
    alignItems: 'center',
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  scoreText: {
    fontSize: 16,
    color: '#4A90E2',
    marginTop: 5,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
    alignSelf: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  noDataText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
  noQuizText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 10,
  },
  resetButton: {
    backgroundColor: '#E53935',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  legendContainer: {
    marginTop: 10,
    paddingHorizontal: 15,
  },
  legendItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
});

export default AdminQuizStatistics;
