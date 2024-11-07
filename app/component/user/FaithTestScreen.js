import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const FaithTestScreen = ({ navigation }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [language, setLanguage] = useState(null); // Store selected language
    const [questions, setQuestions] = useState([]); // Store fetched questions
    const [hasCompletedTest, setHasCompletedTest] = useState(false); 
    const [userId, setUserId] = useState(null); // Store user ID
    const [loading, setLoading] = useState(true); // Manage loading state
    const [fetchingQuestions, setFetchingQuestions] = useState(false); // Manage fetching questions

    // Fetch user data and check if the test has been completed
    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const storedUserId = await AsyncStorage.getItem('userId');
            if (storedUserId) {
                setUserId(storedUserId);
                const response = await axios.get(`https://backend-disciple-a692164f13b9.herokuapp.com/api/faith-test/${storedUserId}/faith-test-status`);
                console.log('Test completion status:', response.data);

                if (response.data === "User has completed the faith test.") {
                    setHasCompletedTest(true);
                    navigation.navigate('DiscipleshipDashboard'); // Redirect if completed
                } else {
                    setHasCompletedTest(false); // Proceed with the test if not completed
                }
            } else {
                console.error('No valid user ID found.');
            }
        } catch (error) {
            console.error('Error fetching test completion status:', error);
        } finally {
            setLoading(false); // End loading state after fetching
        }
    };
    

    // Function to fetch questions based on the selected language
    const fetchQuestions = async (selectedLanguage) => {
        setFetchingQuestions(true); // Start loading
        try {
            const response = await axios.get(`https://backend-disciple-a692164f13b9.herokuapp.com/api/faith-test/questions?language=${selectedLanguage}`);
            if (response.data && Array.isArray(response.data)) {
                setQuestions(response.data); // Set questions based on the language
                setLanguage(selectedLanguage); // Set the selected language
            } else {
                console.error('Invalid response format. Expected an array of questions.');
            }
        } catch (error) {
            console.error('Error fetching questions:', error);
        } finally {
            setFetchingQuestions(false); // End loading state
        }
    };

    const markTestAsCompleted = async () => {
        if (userId) {
            try {
                console.log(`Making request to mark test as completed for user ${userId}`);
                await axios.put(`https://backend-disciple-a692164f13b9.herokuapp.com/api/faith-test/completed-faith-test/${userId}`);
                setHasCompletedTest(true);
                await AsyncStorage.setItem('hasCompletedTest', 'true'); // Store in AsyncStorage
                navigation.navigate('DiscipleshipDashboard'); // Redirect after completion
            } catch (error) {
                console.error('Error marking test as completed:', error);
            }
        }
    };

    // Function to handle answer selection
    const handleAnswer = async (answer) => {
        try {
            const language = selectedLanguage.toLowerCase(); // Ensure it's lowercase for consistency
            
            // Depending on the selected language, submit the appropriate answer
            await axios.post(`https://backend-disciple-a692164f13b9.herokuapp.com/api/faith-test/${userId}/response`, {
                testId: questions[currentQuestionIndex].id, // Assuming this is correct for each question
                selectedAnswer: answer,
                language: language // Send either 'english' or 'tagalog'
            });
    
            console.log(`Answer submitted for ${language}:`, answer);
        } catch (error) {
            console.error('Error saving response:', error);
        }
    
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            markTestAsCompleted();
            Alert.alert('Thank you!', 'You have completed the test.');
        }
    };
    

    // If the test has been completed, show a message
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF8C00" />
                <Text>Loading...</Text>
            </View>
        );
    }

    if (hasCompletedTest) {
        return (
            <View style={styles.container}>
                <Text style={styles.completedText}>You have already completed this test. Thank you!</Text>
                <TouchableOpacity style={styles.navigateButton} onPress={() => navigation.navigate('DiscipleshipDashboard')}>
                    <Text style={styles.navigateButtonText}>Go to Dashboard</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // If no language is selected, show language selection screen
    if (!language) {
        return (
            <View style={styles.container}>
                <Text style={styles.languageSelectionTitle}>Piliin ang Wika / Choose your Language</Text>
                <TouchableOpacity style={styles.languageButton} onPress={() => fetchQuestions('tagalog')}>
                    <Text style={styles.languageButtonText}>Tagalog</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.languageButton} onPress={() => fetchQuestions('english')}>
                    <Text style={styles.languageButtonText}>English</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Show loading indicator while fetching questions
    if (fetchingQuestions) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF8C00" />
                <Text>Fetching questions...</Text>
            </View>
        );
    }

    // Check if there are questions to display
    if (questions.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.languageSelectionTitle}>No questions available</Text>
            </View>
        );
    }

    // Current question
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion || !Array.isArray(currentQuestion.answerOptions)) {
        return (
            <View style={styles.container}>
                <Text style={styles.languageSelectionTitle}>Invalid question data</Text>
            </View>
        );
    }

    // Display questions after language is selected
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.questionTitle}>The God Test ({language === 'tagalog' ? 'Tagalog' : 'English'})</Text>
            <Text style={styles.questionText}>
                {currentQuestionIndex + 1}. {currentQuestion.questionText}
            </Text>
            {currentQuestion.answerOptions.map((answer, index) => (
                <TouchableOpacity 
                    key={index} 
                    style={styles.answerButton} 
                    onPress={() => handleAnswer(answer)}
                >
                    <Text style={styles.answerText}>{answer}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    questionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    questionText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    answerButton: {
        backgroundColor: '#FF8C00',
        padding: 15,
        marginVertical: 10,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    answerText: {
        color: '#FFF',
        fontSize: 16,
    },
    languageSelectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    languageButton: {
        backgroundColor: '#FF8C00',
        padding: 15,
        marginVertical: 10,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    languageButtonText: {
        color: '#FFF',
        fontSize: 16,
    },
    completedText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'green',
        textAlign: 'center',
        marginBottom: 20,
    },
    navigateButton: {
        backgroundColor: '#FF8C00',
        padding: 15,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    navigateButtonText: {
        color: '#FFF',
        fontSize: 16,
    },
});

export default FaithTestScreen;
