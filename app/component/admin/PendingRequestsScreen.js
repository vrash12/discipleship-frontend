// PendingRequestsScreen.js

import React, { useState, useEffect } from 'react';
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

const BASE_URL = 'https://backend-disciple-a692164f13b9.herokuapp.com/api/auth';

const PendingRequestsScreen = ({ navigation }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/requests/all-pending`, {
        timeout: 10000, // Optional: Set a timeout for the request
      });

      setRequests(response.data);
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
      onPress={() => navigation.navigate('RequestDetailsScreen', { request: item })}
    >
      <Text style={styles.requestId}>Request ID: {item.id}</Text>
      <Text style={styles.requestName}>Name: {item.user.name}</Text>
      <Text style={styles.requestType}>
        Type: {item.type === 'ADMIN_REQUEST' ? 'Admin' : 'User'}
      </Text>
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
          keyExtractor={(item) => item.id.toString() + item.type}
          contentContainerStyle={styles.flatListContainer}
        />
      )}
    </View>
  );
};

export default PendingRequestsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  requestItem: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 15,
    elevation: 2, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 1 }, // For iOS shadow
    shadowOpacity: 0.2, // For iOS shadow
    shadowRadius: 1.41, // For iOS shadow
  },
  requestId: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  requestName: {
    fontSize: 16,
    marginBottom: 5,
  },
  requestType: {
    fontSize: 16,
    color: '#555',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
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
  flatListContainer: {
    paddingBottom: 20,
  },

  requestItem: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 15,
    elevation: 2,
    // Shadow settings
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  requestName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
