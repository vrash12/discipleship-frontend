import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView, Button } from 'react-native';
import axios from 'axios';
import { BarChart } from 'react-native-chart-kit'; // For statistics visualization
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminGodTestScreen = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [statistics, setStatistics] = useState({});
    const [remindersLoading, setRemindersLoading] = useState(false);

    useEffect(() => {
        fetchUsersAndStats();
    }, []);

    // Fetch users and statistics when component mounts
    const fetchUsersAndStats = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('https://backend-disciple-a692164f13b9.herokuapp.com/api/admin/god-test/users'); // Update URL based on your backend
            const statsResponse = await axios.get('https://backend-disciple-a692164f13b9.herokuapp.com/api/admin/god-test/statistics'); // For aggregated statistics
            setUsers(response.data);
            setStatistics(statsResponse.data);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch data.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch detailed user responses for a selected user
    const handleUserSelect = async (userId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`https://backend-disciple-a692164f13b9.herokuapp.com/api/admin/god-test/users/${userId}`);
            setSelectedUser(response.data);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch user responses.');
        } finally {
            setIsLoading(false);
        }
    };

    // Send reminders to users who haven't completed the test
    const sendReminder = async () => {
        setRemindersLoading(true);
        try {
            await axios.post('https://backend-disciple-a692164f13b9.herokuapp.com/api/admin/god-test/send-reminders');
            Alert.alert('Success', 'Reminders sent to users.');
        } catch (error) {
            Alert.alert('Error', 'Failed to send reminders.');
        } finally {
            setRemindersLoading(false);
        }
    };

    // Export statistics
    const exportData = async () => {
        try {
            const response = await axios.get('https://backend-disciple-a692164f13b9.herokuapp.com/api/admin/god-test/export', { responseType: 'blob' });
            // Handle file download...
            Alert.alert('Success', 'Data exported successfully.');
        } catch (error) {
            Alert.alert('Error', 'Failed to export data.');
        }
    };

    const renderUserItem = ({ item }) => (
        <TouchableOpacity style={styles.userItem} onPress={() => handleUserSelect(item.id)}>
            <Text style={styles.userText}>{item.name}</Text>
            <Text style={styles.userText}>Status: {item.completedTest ? 'Completed' : 'Not Completed'}</Text>
        </TouchableOpacity>
    );

    const renderUserDetails = () => (
        <ScrollView style={styles.detailsContainer}>
            <Text style={styles.detailTitle}>User: {selectedUser.name}</Text>
            {selectedUser.responses.map((response, index) => (
                <View key={index} style={styles.responseContainer}>
                    <Text style={styles.questionText}>{response.question}</Text>
                    <Text style={styles.answerText}>Answer: {response.answer}</Text>
                </View>
            ))}
        </ScrollView>
    );

    const renderStatistics = () => (
        <View style={styles.statisticsContainer}>
            <Text style={styles.statsTitle}>Test Statistics</Text>
            <BarChart
                data={{
                    labels: ['Believers', 'Agnostic', 'Atheist'],
                    datasets: [{ data: [statistics.believers, statistics.agnostic, statistics.atheist] }]
                }}
                width={Dimensions.get('window').width - 40}
                height={220}
                chartConfig={{
                    backgroundColor: '#e26a00',
                    backgroundGradientFrom: '#ff9800',
                    backgroundGradientTo: '#ffa726',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                }}
                style={styles.chartStyle}
            />
        </View>
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ff9800" />
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>God Test Admin Dashboard</Text>

            {/* User list and test completion status */}
            <FlatList
                data={users}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderUserItem}
                style={styles.userList}
            />

            {/* Display user details if a user is selected */}
            {selectedUser && (
                <View style={styles.detailsSection}>
                    <Text style={styles.subTitle}>User Responses</Text>
                    {renderUserDetails()}
                </View>
            )}

            {/* Test statistics section */}
            <View style={styles.statisticsSection}>
                {renderStatistics()}
            </View>

            {/* Admin actions: Send reminders, export data */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.button} onPress={sendReminder}>
                    <Text style={styles.buttonText}>{remindersLoading ? 'Sending...' : 'Send Reminders'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={exportData}>
                    <Text style={styles.buttonText}>Export Data</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#ff9800',
    },
    subTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#4CAF50',
    },
    userList: {
        marginBottom: 20,
    },
    userItem: {
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        backgroundColor: '#f9f9f9',
    },
    userText: {
        fontSize: 16,
        color: '#333',
    },
    detailsSection: {
        marginBottom: 20,
    },
    detailsContainer: {
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f9f9f9',
    },
    detailTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: '#4CAF50',
    },
    responseContainer: {
        marginBottom: 10,
    },
    questionText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    answerText: {
        fontSize: 16,
        color: '#555',
    },
    statisticsSection: {
        marginBottom: 20,
    },
    statisticsContainer: {
        marginBottom: 20,
    },
    statsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#4CAF50',
    },
    chartStyle: {
        marginVertical: 8,
        borderRadius: 16,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#ff9800',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        flex: 1,
        margin: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AdminGodTestScreen;
