// app/component/user_setting/Settings.js

import React, { useState, useEffect, useContext } from 'react'; // Added useContext
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Alert,
    Image,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { Icon } from 'react-native-elements';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SidebarNav from '../user/SidebarNav'; // Ensure the path is correct
import * as ImagePicker from 'expo-image-picker';
import mime from 'mime'; // Import mime package
import { AuthContext } from '../../AuthProvider'; // Adjust the path based on your project structure

const COLORS = {
    primary: '#FF8C00',
    secondary: '#4A90E2',
    accent: '#FF6347',
    background: '#F5F5F5',
    textPrimary: '#333333',
    textSecondary: '#FFFFFF',
    border: '#cccccc',
    placeholder: '#999999',
    cardBackground: '#FFFFFF',
};

const Settings = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isNavbarMinimized, setIsNavbarMinimized] = useState(false); // Navbar state
    const [userId, setUserId] = useState(null);
    const [profilePictureUrl, setProfilePictureUrl] = useState(null);
    const [image, setImage] = useState(null); // Local image state
    const [isLoading, setLoading] = useState(false); // Loading state

    const { setAuthState } = useContext(AuthContext); // Access AuthContext

    useEffect(() => {
        requestPermissions(); // Request permissions on mount
        fetchUserData();
    }, []);

    // Request permissions for image picker
    const requestPermissions = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Permission Required',
                    'Permission to access photo library is required!'
                );
            }
        } catch (error) {
            console.error('Permission Error:', error);
            Alert.alert('Error', 'Failed to request permissions.');
        }
    };

    const fetchUserData = async () => {
        try {
            // Get userId from AsyncStorage
            const storedUserId = await AsyncStorage.getItem('userId');
            if (storedUserId !== null) {
                const parsedUserId = parseInt(storedUserId, 10);
                setUserId(parsedUserId);
    
                // Fetch user data from backend
                const response = await axios.get(`https://backend-disciple-a692164f13b9.herokuapp.com/api/users/${parsedUserId}`);
                const userData = response.data;
    
                setName(userData.name);
                setEmail(userData.email);
    
                // Use the profilePictureUrl directly
                const fetchedProfilePictureUrl = userData.profilePictureUrl || null;
                setProfilePictureUrl(fetchedProfilePictureUrl);
            } else {
                // Handle case where userId is not available
                Alert.alert('Error', 'User ID not found. Please log in again.');
                // Update Auth State to logged out
                setAuthState({
                    isLoading: false,
                    isLoggedIn: false,
                    userRole: null,
                    token: null,
                });
                navigation.navigate('LoginScreen');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            Alert.alert('Error', 'An error occurred while fetching user data.');
        }
    };
    
    const handleUpdateProfile = async () => {
        if (!name || !email) {
            Alert.alert('Error', 'Name and Email are required.');
            return;
        }

        try {
            console.log('Updating profile for user ID:', userId);
            console.log('New name:', name);
            console.log('New email:', email);

            // Send request to backend to update profile
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const response = await axios.put(
                `https://backend-disciple-a692164f13b9.herokuapp.com/api/users/${userId}`,
                {
                    name: name,
                    email: email,
                },
                config
            );

            console.log('Update profile response:', response.data);

            Alert.alert('Profile Updated', 'Your profile has been successfully updated.');
        } catch (error) {
            console.error('Error updating profile:', error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
                Alert.alert('Error', error.response.data);
            } else {
                Alert.alert('Error', 'An error occurred while updating your profile.');
            }
        }
    };

    const handleChangePassword = async () => {
        if (!password) {
            Alert.alert('Error', 'Please enter a new password.');
            return;
        }

        try {
            console.log('Changing password for user ID:', userId);

            // Send request to backend to change password
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const response = await axios.put(
                `https://backend-disciple-a692164f13b9.herokuapp.com/api/users/${userId}/change-password`,
                {
                    password: password,
                },
                config
            );

            console.log('Change password response:', response.data);

            Alert.alert('Password Changed', 'Your password has been successfully changed.');
            setPassword(''); // Clear the password field
        } catch (error) {
            console.error('Error changing password:', error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
                Alert.alert('Error', error.response.data);
            } else {
                Alert.alert('Error', 'An error occurred while changing your password.');
            }
        }
    };

    const handleLogout = async () => {
        try {
            // Clear AsyncStorage
            await AsyncStorage.clear();
            // Update Auth State
            setAuthState({
                isLoading: false,
                isLoggedIn: false,
                userRole: null,
                token: null,
            });
            // Navigation is handled by AppNavigator based on authState
            // Optionally, you can navigate explicitly
            navigation.navigate('LoginScreen');
        } catch (error) {
            console.error('Error logging out:', error);
            Alert.alert('Error', 'An error occurred while logging out.');
        }
    };

    // Image selection function using expo-image-picker
    const handleSelectProfilePicture = async () => {
        const options = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
        };

        try {
            const result = await ImagePicker.launchImageLibraryAsync(options);
            console.log('ImagePicker Result:', result); // Log the entire result
            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                console.log('Selected Asset:', asset);
                const filename = asset.uri.split('/').pop();
                const fileType = mime.getType(filename) || 'image/jpeg'; // Determine MIME type

                const source = {
                    uri: asset.uri,
                    name: filename,
                    type: fileType, // Set correct MIME type
                };
                console.log('Image Source:', source);
                setImage(source);

                // Proceed with the file upload
                await uploadProfilePicture(source);
            } else {
                console.log('Image selection was canceled.');
            }
        } catch (error) {
            console.error('ImagePicker Error: ', error);
            Alert.alert('Error', 'Failed to select image.');
        }
    };
    const uploadProfilePicture = async (imageData) => {
        if (!imageData) {
            Alert.alert('Error', 'No image selected.');
            return;
        }
    
        const formData = new FormData();
        formData.append('file', {
            uri: imageData.uri,
            name: imageData.name || 'profile.jpg',
            type: imageData.type || 'image/jpeg',
        });
    
        try {
            setLoading(true);
            const res = await axios.post(
                `https://backend-disciple-a692164f13b9.herokuapp.com/api/users/${userId}/upload-profile-picture`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
    
            Alert.alert('Profile Picture Updated', 'Your profile picture has been successfully updated.');
    
            // Use the profilePictureUrl from the server response
            const updatedProfilePictureUrl = res.data.profilePictureUrl || null;
            setProfilePictureUrl(updatedProfilePictureUrl);
            setImage(null); // Reset local image state
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            if (error.response) {
                Alert.alert('Error', error.response.data);
            } else {
                Alert.alert('Error', 'An error occurred while uploading your profile picture.');
            }
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <View style={styles.container}>
            {/* Render SidebarNav */}
            <SidebarNav
                navigation={navigation}
                isNavbarMinimized={isNavbarMinimized}
                setIsNavbarMinimized={setIsNavbarMinimized}
            />

            {/* Main content */}
            <ScrollView contentContainerStyle={styles.mainContent}>
                <Text style={styles.title}>Account Settings</Text>

                {/* Profile Picture */}
                <TouchableOpacity onPress={handleSelectProfilePicture} style={styles.profilePictureContainer}>
                    {profilePictureUrl ? (
                        <Image
    source={{ uri: profilePictureUrl }}
    style={styles.profilePicture}
    resizeMode="cover"
    onError={async (error) => {
        console.log('Error loading image:', error.nativeEvent.error);
        Alert.alert('Error', 'Failed to load profile picture. Refreshing...');
        // Attempt to fetch a new pre-signed URL
        await fetchUserData();
    }}
/>

                    ) : (
                        <View style={styles.profilePicturePlaceholder}>
                            <Icon name="user" type="font-awesome" size={100} color="#cccccc" />
                        </View>
                    )}
                    <Text style={styles.changeProfilePictureText}>Change Profile Picture</Text>
                </TouchableOpacity>

                {/* Name Input */}
                <View style={styles.inputContainer}>
                    <Icon name="user" type="font-awesome" size={20} color={COLORS.primary} style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        placeholderTextColor={COLORS.placeholder}
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                {/* Email Input */}
                <View style={styles.inputContainer}>
                    <Icon name="envelope" type="font-awesome" size={20} color={COLORS.primary} style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor={COLORS.placeholder}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={handleUpdateProfile} disabled={isLoading}>
                    {isLoading ? (
                        <ActivityIndicator color={COLORS.textSecondary} />
                    ) : (
                        <Text style={styles.buttonText}>Update Profile</Text>
                    )}
                </TouchableOpacity>

                {/* Password Input */}
                <View style={styles.inputContainer}>
                    <Icon name="lock" type="font-awesome" size={20} color={COLORS.primary} style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="New Password"
                        placeholderTextColor={COLORS.placeholder}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={handleChangePassword} disabled={isLoading}>
                    {isLoading ? (
                        <ActivityIndicator color={COLORS.textSecondary} />
                    ) : (
                        <Text style={styles.buttonText}>Change Password</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} disabled={isLoading}>
                    {isLoading ? (
                        <ActivityIndicator color={COLORS.textSecondary} />
                    ) : (
                        <Text style={styles.buttonText}>Logout</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    ); // End of Settings component

}; // Close the Settings component function

// Styles defined outside the component
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: COLORS.background,
    },
    mainContent: {
        flex: 1,
        padding: 20,
        backgroundColor: COLORS.background,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        color: COLORS.primary,
        textAlign: 'center',
    },
    profilePictureContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profilePicture: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    profilePicturePlaceholder: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#e1e1e1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    changeProfilePictureText: {
        textAlign: 'center',
        color: COLORS.primary,
        marginTop: 10,
        textDecorationLine: 'underline',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: COLORS.cardBackground,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 40,
        fontSize: 16,
        color: COLORS.textPrimary,
    },
    button: {
        backgroundColor: COLORS.secondary,
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    logoutButton: {
        backgroundColor: COLORS.accent,
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: COLORS.textSecondary,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Settings;
