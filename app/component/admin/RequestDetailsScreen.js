import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

const BASE_URL = 'https://backend-disciple-a692164f13b9.herokuapp.com/api';

const RequestDetailsScreen = ({ route, navigation }) => {
  const { request } = route.params || {};
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      // Since we're dealing with user requests only
      await axios.post(`${BASE_URL}/users/${request.id}/activate`);
      Alert.alert('Success', 'User account activated successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Error approving request:', error);
      Alert.alert('Error', 'Failed to approve request.');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      // Delete the user account
      await axios.delete(`${BASE_URL}/users/${request.id}`);
      Alert.alert('Success', 'User account deleted successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Error rejecting request:', error);
      Alert.alert('Error', 'Failed to reject request.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Processing request...</Text>
      </View>
    );
  }

  if (!request) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Request not found</Text>
        <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
          <Text style={styles.goBackText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Request Details</Text>
      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Name:</Text>
        <Text style={styles.detailValue}>{request.user.name}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Email:</Text>
        <Text style={styles.detailValue}>{request.user.email}</Text>
      </View>

      <TouchableOpacity style={styles.approveButton} onPress={handleApprove}>
        <Text style={styles.buttonText}>Approve</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
        <Text style={styles.buttonText}>Reject</Text>
      </TouchableOpacity>
    </View>
  );
};





const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    marginBottom: 25,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: '#333333',
  },
  detailContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 18,
    fontWeight: '600',
    width: 100,
    color: '#333333',
  },
  detailValue: {
    fontSize: 18,
    color: '#555555',
    flexShrink: 1, // Allow text to wrap if too long
  },
  approveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 30,
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
    marginTop: 15,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#555555',
  },
  goBackButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    alignSelf: 'center',
  },
  goBackText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
export default RequestDetailsScreen;