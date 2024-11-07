import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    Alert, 
    StyleSheet, 
    ImageBackground, 
    Dimensions, 
    Switch, 
    ActivityIndicator 
} from 'react-native';
import axios from 'axios';


const SignupScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(false);



    const handleSignup = async () => {

        // Password length validation
        if (password.length < 8) {
            Alert.alert('Weak Password', 'Password must be at least 8 characters long.');
            return;
        }

        // Passwords match validation
        if (password !== confirmPassword) {
            Alert.alert('Password Mismatch', 'Passwords do not match.');
            return;
        }

        setLoading(true); // Start loading

        try {
            // Generate salt and hash the password synchronously
  

            const signupData = {
                name: name,
                email: email,
                password: password,
            };

            const endpoint = isAdmin ? 'api/users/admin-signup' : 'api/users/user-signup';

            console.log('Request Payload:', signupData);

            // Send signup data to the API
            const response = await axios.post(`https://backend-disciple-a692164f13b9.herokuapp.com/${endpoint}`, signupData);
            console.log('Signup Success:', response.data);

            Alert.alert('Success', 'Signup request submitted successfully. Awaiting approval.');
            

            // Navigate to the appropriate screen
            navigation.navigate(isAdmin ? 'AdminPendingScreen' : 'LoginScreen');
        } catch (error) {
            console.error('Signup Error:', error.response ? error.response.data : error.message);

            if (error.response && error.response.data) {
                Alert.alert('Error', error.response.data);
            } else {
                Alert.alert('Error', 'An error occurred during signup. Please try again.');
            }
        } finally {
            setLoading(false); // End loading
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <ImageBackground
                    source={isAdmin ? require('./assets/images/admin_header.jpg') : require('./assets/images/header1.jpg')}
                    style={styles.headerImage}
                >
                    <View style={styles.overlay} />
                </ImageBackground>
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.title}>{isAdmin ? 'Admin Sign Up' : 'Sign Up'}</Text>

                <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your name"
                    style={styles.input}
                />
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your username"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                />
                <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    secureTextEntry
                    style={styles.input}
                />
                <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm your password"
                    secureTextEntry
                    style={styles.input}
                />

                <View style={styles.adminToggleContainer}>
                    <Text style={styles.adminToggleText}>Sign up as Admin</Text>
                    <Switch
                        value={isAdmin}
                        onValueChange={setIsAdmin}
                    />
                </View>

                <TouchableOpacity 
                    style={styles.signupButton} 
                    onPress={handleSignup} 
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.signupButtonText}>Sign Up</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                    <Text style={styles.loginText}>Already have an account? Log in</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        height: Dimensions.get('window').height * 0.2,
        overflow: 'hidden',
        backgroundColor: '#000',
        marginBottom: 30,
    },
    headerImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 165, 0, 0.5)',
    },
    formContainer: {
        flex: 1,
        paddingHorizontal: 30,
        paddingTop: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 30,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    signupButton: {
        backgroundColor: '#FF8C00',
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 20,
    },
    signupButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#007BFF',
    },
    adminToggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    adminToggleText: {
        fontSize: 16,
        color: '#333',
    },
});

export default SignupScreen;
