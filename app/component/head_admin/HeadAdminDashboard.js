//app/component/head_admin/HeadAdminDashboard.js
import React, { useState, useEffect, useContext} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

// Define the base URL with the /admin prefix
const BASE_URL = 'https://backend-disciple-a692164f13b9.herokuapp.com/admin';

const HeadAdminDashboard = ({ navigation }) => {

  const { setAuthState } = useContext(AuthContext); 

  const handleLogout = () => {
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear AsyncStorage
              await AsyncStorage.removeItem('authToken');
              await AsyncStorage.removeItem('userRole');
              await AsyncStorage.removeItem('userName');
              await AsyncStorage.removeItem('userId');

              // Reset Auth State
              setAuthState({
                isLoading: false,
                isLoggedIn: false,
                userRole: null,
                token: null,
              });

              // Optionally, navigate to LoginScreen or SplashScreen
              // navigation.reset({
              //   index: 0,
              //   routes: [{ name: 'LoginScreen' }],
              // });
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Head Admin Dashboard</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('PendingRequests')}
      >
        <Text style={styles.buttonText}>View Pending Admin Requests</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const PendingRequestsScreen = ({ navigation }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true); // Initially set to true

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/requests/pending`, {
        timeout: 10000, // Optional: Set a timeout for the request
      });

      if (response.status === 204) {
        // No Content
        setRequests([]);
      } else {
        setRequests(response.data);
      }
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      Alert.alert('Error', 'Failed to fetch pending requests.');
    } finally {
      setLoading(false);
    }
  };

  const renderRequestItem = ({ item }) => (
    <TouchableOpacity
      style={styles.requestItem}
      onPress={() =>
        navigation.navigate('RequestDetails', { requestId: item.id })
      }
    >
      <Text style={styles.requestText}>Request ID: {item.id}</Text>
      <Text style={styles.requestText}>User: {item.user.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pending Requests</Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading pending requests...</Text>
        </View>
      ) : requests.length === 0 ? (
        <Text style={styles.noRequestsText}>No pending requests.</Text>
      ) : (
        <FlatList
          data={requests}
          renderItem={renderRequestItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.flatListContainer}
        />
      )}
    </View>
  );
};

const RequestDetailsScreen = ({ route, navigation }) => {
  const { requestId } = route.params;
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequestDetails();
  }, []);

  const fetchRequestDetails = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/request-status/${requestId}`,
        {
          timeout: 10000, // Optional: Set a timeout for the request
        }
      );
      setRequest(response.data);
    } catch (error) {
      console.error('Error fetching request details:', error);
      Alert.alert('Error', 'Failed to load request details.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      await axios.post(`${BASE_URL}/requests/approve/${requestId}`);
      Alert.alert('Success', 'Request approved successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Error approving request:', error);
      Alert.alert('Error', 'Failed to approve request.');
    }
  };
  

  const handleReject = async () => {
    try {
      await axios.post(`${BASE_URL}/requests/reject/${requestId}`);
      Alert.alert('Success', 'Request rejected successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Error rejecting request:', error);
      Alert.alert('Error', 'Failed to reject request.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!request) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Request not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Request Details</Text>
      <Text style={styles.detailText}>User: {request.user.name}</Text>
      <Text style={styles.detailText}>Email: {request.user.email}</Text>
      <Text style={styles.detailText}>Status: {request.status}</Text>

      <TouchableOpacity style={styles.approveButton} onPress={handleApprove}>
        <Text style={styles.buttonText}>Approve</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
        <Text style={styles.buttonText}>Reject</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="HeadAdminDashboard">
        <Stack.Screen
          name="HeadAdminDashboard"
          component={HeadAdminDashboard}
          options={{ title: 'Head Admin Dashboard' }}
        />
        <Stack.Screen
          name="PendingRequests"
          component={PendingRequestsScreen}
          options={{ title: 'Pending Requests' }}
        />
        <Stack.Screen
          name="RequestDetails"
          component={RequestDetailsScreen}
          options={{ title: 'Request Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    // Center content vertically
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    elevation: 2, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 }, // For iOS shadow
    shadowOpacity: 0.25, // For iOS shadow
    shadowRadius: 3.84, // For iOS shadow
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  requestItem: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    width: '100%',
    borderRadius: 8,
    elevation: 1, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 1 }, // For iOS shadow
    shadowOpacity: 0.2, // For iOS shadow
    shadowRadius: 1.41, // For iOS shadow
  },
  requestText: {
    fontSize: 16,
    marginBottom: 5,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    elevation: 2, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 }, // For iOS shadow
    shadowOpacity: 0.25, // For iOS shadow
    shadowRadius: 3.84, // For iOS shadow
  },
  rejectButton: {
    backgroundColor: '#f44336',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
    elevation: 2, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 }, // For iOS shadow
    shadowOpacity: 0.25, // For iOS shadow
    shadowRadius: 3.84, // For iOS shadow
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  noRequestsText: {
    fontSize: 18,
    color: '#555',
    marginTop: 20,
    textAlign: 'center',
  },
  detailText: {
    fontSize: 18,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  flatListContainer: {
    width: '100%',
  },

  logoutButton: {
    backgroundColor: '#f44336',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    elevation: 2, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 }, // For iOS shadow
    shadowOpacity: 0.25, // For iOS shadow
    shadowRadius: 3.84, // For iOS shadow
  },
  logoutButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
