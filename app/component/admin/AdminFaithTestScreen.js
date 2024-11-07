import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';

const AdminFaithTestScreen = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFaithTestStatus();
    }, []);

    const fetchFaithTestStatus = async () => {
        try {
            const response = await axios.get('https://backend-disciple-a692164f13b9.herokuapp.com/api/faith-test/all-users');
            const allUsers = response.data;

            // Filter users with role 'USER'
            const usersWithRoleUser = allUsers.filter(user => user.role === 'USER');
            setUsers(usersWithRoleUser);

        } catch (error) {
            console.error('Error fetching faith test data:', error);
            Alert.alert('Error', 'Failed to fetch faith test data.');
        } finally {
            setLoading(false);
        }
    };

    const renderUserItem = ({ item }) => (
        <View style={styles.userItem}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
            <Text style={styles.testStatus}>
                Test Status: {item.completed ? 'Completed' : 'Not Completed'}
            </Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF8C00" />
                <Text>Loading Users...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Faith Test Completion Status</Text>
            {users.length > 0 ? (
                <FlatList
                    data={users}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderUserItem}
                />
            ) : (
                <Text style={styles.noUsersText}>No users found.</Text>
            )}
        </View>
    );
};





const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f4f4f4',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    userItem: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    userEmail: {
        fontSize: 16,
        color: '#666',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    testStatusLabel: {
        fontSize: 16,
        color: '#666',
        marginRight: 5,
    },
    testStatus: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    noUsersText: {
        fontSize: 18,
        color: '#999',
        textAlign: 'center',
        marginTop: 50,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        paddingBottom: 20,
    },
});

export default AdminFaithTestScreen;
