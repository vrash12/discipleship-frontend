import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Dimensions, Alert, Modal } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from './AuthProvider';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const navigation = useNavigation();

    const { setAuthState } = useContext(AuthContext);

    const handleLogin = async () => {
        if (!email || !password) {
          Alert.alert('Validation Error', 'Please enter both email and password.');
          return;
        }
    
        try {
          const response = await axios.post('https://backend-disciple-a692164f13b9.herokuapp.com/api/auth/login', {
            email,
            password,
          });
      
    
          if (response.status === 200) {
            const { role, name, id, token } = response.data;
    
            // Save data to AsyncStorage
            await AsyncStorage.setItem('authToken', token);
            await AsyncStorage.setItem('userRole', role);
            await AsyncStorage.setItem('userName', name || 'User');
            await AsyncStorage.setItem('userId', id.toString());
    
            // Update Auth State
            setAuthState({
              isLoggedIn: true,
              userRole: role,
              token: token,
            });
    
           
          } else {
            Alert.alert('Login Failed', 'Invalid email or password');
          }
        } catch (error) {
          console.error('Login error:', error.response ? error.response.data : error.message);
    
          if (error.response && error.response.status === 403) {
            Alert.alert('Login Error', 'Your account is pending approval.');
          } else if (error.response && error.response.status === 401) {
            Alert.alert('Login Failed', 'Invalid email or password.');
          } else {
            Alert.alert('Error', `Something went wrong. Please try again later.\n${error.message}`);
          }
        }


      };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <ImageBackground
                    source={require('./assets/images/header.jpg')}
                    style={styles.headerImage}
                >
                    <View style={styles.overlay} />
                </ImageBackground>
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.title}>Login</Text>
                
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                />
                
                <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    secureTextEntry
                    style={styles.input}
                />
                
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>

                {/* Optional: Social Login Buttons */}
                {/* 
                <View style={styles.socialLoginContainer}>
                    <TouchableOpacity style={styles.socialButton}>
                        <FontAwesome name="facebook" size={24} color="#3b5998" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton}>
                        <FontAwesome name="google" size={24} color="#db4437" />
                    </TouchableOpacity>
                </View>
                */}

                <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
                    <Text style={styles.signupText}>New User? Sign up</Text>
                </TouchableOpacity>
            </View>

            {/* Modal for displaying custom error messages */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>{modalMessage}</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        height: Dimensions.get('window').height * 0.19,
        overflow: 'hidden',
        backgroundColor: '#000',
        marginBottom: 80,
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
        backgroundColor: 'rgba(255, 165, 0, 0.3)', // Orange overlay with 30% opacity
    },
    formContainer: {
        flex: 1,
        paddingHorizontal: 30,
        paddingTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
    },
    loginButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    socialLoginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    socialButton: {
        backgroundColor: '#fff',
        padding: 10,
        marginHorizontal: 10,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    signupText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#007BFF',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: 300,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 18,
    },
    modalButton: {
        backgroundColor: '#007BFF',
        borderRadius: 10,
        padding: 10,
        elevation: 2,
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default LoginScreen;
