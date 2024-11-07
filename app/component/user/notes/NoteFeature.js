import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { Icon } from 'react-native-elements';
import SidebarNav from '../SidebarNav';

const NoteFeature = ({ navigation }) => {
  const [notes, setNotes] = useState([]);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editNoteId, setEditNoteId] = useState(null);
  const [editNoteTitle, setEditNoteTitle] = useState('');
  const [editNoteContent, setEditNoteContent] = useState('');
  const [isNavbarMinimized, setIsNavbarMinimized] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // For creating/editing notes

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get('https://backend-disciple-a692164f13b9.herokuapp.com/api/notes');
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const createNote = async () => {
    if (newNoteTitle.trim() === '' || newNoteContent.trim() === '') {
      Alert.alert('Error', 'Title and Content are required.');
      return;
    }

    try {
      const response = await axios.post('https://backend-disciple-a692164f13b9.herokuapp.com/api/notes', {
        title: newNoteTitle,
        content: newNoteContent,
      });
      setNotes([...notes, response.data]);
      setNewNoteTitle('');
      setNewNoteContent('');
      setModalVisible(false);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const updateNote = async () => {
    if (editNoteTitle.trim() === '' || editNoteContent.trim() === '') {
      Alert.alert('Error', 'Title and Content are required.');
      return;
    }

    try {
      const response = await axios.put(`https://backend-disciple-a692164f13b9.herokuapp.com/api/notes/${editNoteId}`, {
        title: editNoteTitle,
        content: editNoteContent,
      });
      setNotes(
        notes.map((note) => (note.id === editNoteId ? response.data : note))
      );
      setEditNoteId(null);
      setEditNoteTitle('');
      setEditNoteContent('');
      setModalVisible(false);
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`https://backend-disciple-a692164f13b9.herokuapp.com/api/notes/${id}`);
      setNotes(notes.filter((note) => note.id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const startEditing = (note) => {
    setEditNoteId(note.id);
    setEditNoteTitle(note.title);
    setEditNoteContent(note.content);
    setModalVisible(true);
  };

  const cancelEditing = () => {
    setEditNoteId(null);
    setEditNoteTitle('');
    setEditNoteContent('');
    setModalVisible(false);
  };

  const renderNoteItem = ({ item, index }) => {
    // Cycle through colors based on index
    const colors = ['#FF8C00', '#1E90FF', '#32CD32'];
    const backgroundColor = colors[index % colors.length];

    return (
      <TouchableOpacity
        style={[styles.noteItem, { backgroundColor }]}
        onPress={() => startEditing(item)}
      >
        <View style={styles.noteHeader}>
          <Text style={styles.noteTitle}>{item.title}</Text>
          <TouchableOpacity onPress={() => deleteNote(item.id)}>
            <Icon name="delete" color="#FFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.noteContent}>{item.content}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Sidebar Navigation */}
      <SidebarNav
        navigation={navigation}
        isNavbarMinimized={isNavbarMinimized}
        setIsNavbarMinimized={setIsNavbarMinimized}
      />

      <View style={styles.mainContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>My Notes</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Icon name="add" color="#FFF" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={notes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNoteItem}
          contentContainerStyle={styles.notesList}
        />

        {/* Note Modal */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={cancelEditing}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView>
                <Text style={styles.modalHeader}>
                  {editNoteId ? 'Edit Note' : 'New Note'}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Title"
                  value={editNoteId ? editNoteTitle : newNoteTitle}
                  onChangeText={editNoteId ? setEditNoteTitle : setNewNoteTitle}
                />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Content"
                  value={editNoteId ? editNoteContent : newNoteContent}
                  onChangeText={editNoteId ? setEditNoteContent : setNewNoteContent}
                  multiline
                  numberOfLines={4}
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={editNoteId ? updateNote : createNote}
                  >
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={cancelEditing}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  addButton: {
    backgroundColor: '#FF8C00',
    padding: 10,
    borderRadius: 30,
  },
  notesList: {
    paddingBottom: 20,
  },
  noteItem: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 2,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  noteTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  noteContent: {
    fontSize: 16,
    color: '#FFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF8C00',
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: '#32CD32',
  },
  cancelButton: {
    backgroundColor: '#FF4500',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default NoteFeature;
