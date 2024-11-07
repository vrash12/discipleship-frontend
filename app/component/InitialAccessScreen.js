import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const InitialAccessScreen = ({ navigation }) => {
    const handleStart = () => {
        // Navigate to the test screen or main content after starting
        navigation.navigate('FaithTestScreen'); // or navigate to 'MainScreen' if the test is after the main screen
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Start Your Discipleship Journey</Text>
            <Text style={styles.description}>
                After creating your account, you can begin your discipleship journey with initial learning activities.
                Complete a short faith-related test before gaining full access to the application.
            </Text>
            <Button title="START" onPress={handleStart} color="#ff7f50" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 40,
    },
});

export default InitialAccessScreen;
