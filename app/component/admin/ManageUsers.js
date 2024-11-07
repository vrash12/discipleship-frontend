// ManageUsers.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = {
  primary: '#FF8C00',
  secondary: '#4A90E2',
  accent: '#FF4500',
  background: '#F5F5F5',
  textPrimary: '#333333',
  textSecondary: '#FFFFFF',
};

const ManageUsers = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaderModalVisible, setLeaderModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedLeaderId, setSelectedLeaderId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchLeaders();
  }, []);

  // Function to get auth token from AsyncStorage
  const getAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken'); // Replace 'authToken' with your actual key
      return token;
    } catch (error) {
      console.error('Error retrieving auth token:', error);
      return null;
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      const token = await getAuthToken();
      const response = await axios.get('https://backend-disciple-a692164f13b9.herokuapp.com/api/users', {
        params: { role: 'USER' },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Fetched users:', JSON.stringify(response.data, null, 2));
      const validUsers = response.data.filter((user) => user && user.id);
      if (validUsers.length !== response.data.length) {
        console.warn('Some users are missing the id field and were excluded.');
      }
      setUsers(validUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch leaders
  const fetchLeaders = async () => {
    try {
      const token = await getAuthToken();
      const response = await axios.get('https://backend-disciple-a692164f13b9.herokuapp.com/api/users', {
        params: { role: 'USER', approved: true },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Fetched leaders:', JSON.stringify(response.data, null, 2));
      const approvedLeaders = response.data.filter((user) => user.approved && user.id);
      if (approvedLeaders.length !== response.data.length) {
        console.warn('Some leaders are missing the id field and were excluded.');
      }
      setLeaders(approvedLeaders);
    } catch (error) {
      console.error('Error fetching leaders:', error);
      Alert.alert('Error', 'Failed to fetch leaders.');
    }
  };

  // Deactivate a user
  const performDeactivateUser = async (userId) => {
    try {
      const token = await getAuthToken(); // Retrieve token if your API is secured
      await axios.post(`https://backend-disciple-a692164f13b9.herokuapp.com/api/users/${userId}/deactivate`, null, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token if your API is secured
        },
      });
      Alert.alert('Success', 'User deactivated successfully.');
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error deactivating user:', error);
      Alert.alert('Error', 'Failed to deactivate user.');
    }
  };

  // Activate a user
  const performActivateUser = async (userId) => {
    try {
      const token = await getAuthToken(); // Retrieve token if your API is secured
      await axios.post(`https://backend-disciple-a692164f13b9.herokuapp.com/api/users/${userId}/activate`, null, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token if your API is secured
        },
      });
      Alert.alert('Success', 'User activated successfully.');
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error activating user:', error);
      Alert.alert('Error', 'Failed to activate user.');
    }
  };

  // Delete a user
  const performDeleteUser = async (userId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await getAuthToken(); // Retrieve token if your API is secured
              await axios.delete(`https://backend-disciple-a692164f13b9.herokuapp.com/api/users/${userId}`, {
                headers: {
                  Authorization: `Bearer ${token}`, // Include token if your API is secured
                },
              });
              Alert.alert('Success', 'User deleted successfully.');
              fetchUsers(); // Refresh the user list
            } catch (error) {
              console.error('Error deleting user:', error);
              Alert.alert('Error', 'Failed to delete user.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  // Open modal to assign a leader
  const openAssignLeaderModal = (user) => {
    setSelectedUser(user);
    setSelectedLeaderId(user.leaderId || null); // Adjusted to use leaderId if available
    setLeaderModalVisible(true);
  };

  // Assign a leader to a user
  const assignLeader = async () => {
    if (!selectedLeaderId) {
      Alert.alert('Error', 'Please select a leader.');
      return;
    }

    // Prevent assigning self as leader
    if (selectedLeaderId === selectedUser.id) {
      Alert.alert('Error', 'A user cannot be their own leader.');
      return;
    }

    try {
      const token = await getAuthToken(); // Retrieve token if your API is secured
      await axios.post(
        `https://backend-disciple-a692164f13b9.herokuapp.com/api/users/${selectedUser.id}/assign-leader`,
        null, // No request body
        {
          params: { leaderId: selectedLeaderId },
          headers: {
            Authorization: `Bearer ${token}`, // Include token if your API is secured
          },
        }
      );
      Alert.alert('Success', 'Leader assigned successfully.');
      setLeaderModalVisible(false);
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error assigning leader:', error);
      Alert.alert('Error', 'Failed to assign leader.');
    }
  };

  // Open modal to edit user details
  const openEditUserModal = (user) => {
    setSelectedUser(user);
    setEditedName(user.name);
    setEditedEmail(user.email);
    setEditModalVisible(true);
  };

  // Update user details
  const editUser = async () => {
    if (!editedName.trim() || !editedEmail.trim()) {
      Alert.alert('Error', 'Name and Email cannot be empty.');
      return;
    }



    try {
      const token = await getAuthToken(); // Retrieve token if your API is secured
      await axios.put(
        `https://backend-disciple-a692164f13b9.herokuapp.com/api/users/${selectedUser.id}`,
        {
          name: editedName,
          email: editedEmail,
          // Add other fields as necessary
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token if your API is secured
          },
        }
      );
      Alert.alert('Success', 'User updated successfully.');
      setEditModalVisible(false);
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error updating user:', error);
      Alert.alert('Error', 'Failed to update user.');
    }
  };

  // Render each user item
  const renderUserItem = ({ item }) => (
    <View style={styles.userItem}>
      <Text style={styles.userName}>{item.name}</Text>
      <Text style={styles.userEmail}>{item.email}</Text>
      <Text style={styles.userStatus}>Status: {item.approved ? 'Approved' : 'Pending'}</Text>
      <Text style={styles.userLeader}>
        Leader: {item.leaderName ? item.leaderName : 'None'}
      </Text>
      <View style={styles.actionButtons}>
        {item.approved ? (
          <TouchableOpacity
            style={[styles.actionButton, styles.deactivateButton]}
            onPress={() => performDeactivateUser(item.id)}
          >
            <Ionicons name="close-circle" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Deactivate</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.actionButton, styles.activateButton]}
            onPress={() => performActivateUser(item.id)}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Activate</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.actionButton, styles.assignLeaderButton]}
          onPress={() => openAssignLeaderModal(item)}
        >
          <Ionicons name="people-circle" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Assign Leader</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => openEditUserModal(item)}
        >
          <Ionicons name="create" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => performDeleteUser(item.id)}
        >
          <Ionicons name="trash" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading users...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => (item.id ? item.id.toString() : `user-${item.email}`)}
        renderItem={renderUserItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<Text style={styles.header}>Manage Users</Text>}
        ListEmptyComponent={<Text style={styles.emptyText}>No users available.</Text>}
      />

      {/* Modal for Assigning Leader */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={leaderModalVisible}
        onRequestClose={() => setLeaderModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>Assign Leader to {selectedUser?.name}</Text>
            <Picker
              selectedValue={selectedLeaderId}
              onValueChange={(itemValue) => setSelectedLeaderId(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select a Leader" value={null} />
              {leaders.map((leader) => (
                <Picker.Item key={leader.id} label={leader.name} value={leader.id} />
              ))}
            </Picker>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setLeaderModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={assignLeader}
              >
                <Text style={styles.modalButtonText}>Assign</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for Editing User */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>Edit User: {selectedUser?.name}</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={editedName}
              onChangeText={setEditedName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={editedEmail}
              onChangeText={setEditedEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={editUser}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  userItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  userEmail: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  userStatus: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginTop: 5,
  },
  userLeader: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginTop: 5,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    padding: 8,
    borderRadius: 5,
    marginRight: 5,
    marginTop: 5,
  },
  deactivateButton: {
    backgroundColor: '#FF6347',
  },
  activateButton: {
    backgroundColor: '#32CD32',
  },
  assignLeaderButton: {
    backgroundColor: COLORS.secondary,
  },
  editButton: {
    backgroundColor: '#1E90FF',
  },
  deleteButton: {
    backgroundColor: '#FF0000',
  },
  actionButtonText: {
    color: COLORS.textSecondary,
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    color: '#777777',
    fontSize: 16,
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: COLORS.textPrimary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
    textAlign: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#A9A9A9',
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  modalButtonText: {
    color: COLORS.textSecondary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
});

export default ManageUsers;
