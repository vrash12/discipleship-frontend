import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Modal,
  Image,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const LessonForm = ({ onCompletion }) => {
  const [lessons, setLessons] = useState([]);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [scripture, setScripture] = useState('');
  const [image, setImage] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    setLoading(true);
    try {
        const response = await axios.get('https://backend-disciple-a692164f13b9.herokuapp.com/api/lessons');
        setLessons(response.data);
    } catch (error) {
        console.error('Error fetching lessons:', error);
        Alert.alert('Error', 'Failed to load lessons.');
    } finally {
        setLoading(false);
    }
};


  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLessons();
    setRefreshing(false);
  };

const handleSave = async () => {
    if (!title || !description || !content || !scripture) {
        Alert.alert('Error', 'All fields are required.');
        return;
    }

    const userId = await AsyncStorage.getItem('userId');
    console.log('Retrieved userId:', userId);

    if (!userId) {
        Alert.alert('Error', 'User ID not found.');
        return;
    }

    const url = selectedLessonId
        ? `https://backend-disciple-a692164f13b9.herokuapp.com/api/lessons/${selectedLessonId}`
        : `https://backend-disciple-a692164f13b9.herokuapp.com/api/lessons`;

    const method = selectedLessonId ? 'PUT' : 'POST';

    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('content', content);
    formData.append('scriptureReference', scripture);
    formData.append('userid', userId);

    if (image && image.uri) {
        const uriParts = image.uri.split('.');
        let fileType = uriParts[uriParts.length - 1];

        // Handle cases where fileType might contain query parameters
        if (fileType.includes('?')) {
            fileType = fileType.split('?')[0];
        }

        const mimeType = `image/${fileType}`;
        formData.append('image', {
            uri: image.uri,
            name: image.name || `lesson_${Date.now()}.${fileType}`,
            type: mimeType,
        });
    }

    // Log FormData contents for debugging
    formData._parts.forEach(part => {
        console.log(`${part[0]}:`, part[1]);
    });

    try {
        const response = await fetch(url, {
            method: method,
            body: formData,
            // Do not set 'Content-Type' header manually
        });

        if (response.ok) {
            Alert.alert(
                'Success',
                `Lesson ${selectedLessonId ? 'updated' : 'created'} successfully!`
            );
            fetchLessons();
            clearForm();
            if (typeof onCompletion === 'function') onCompletion();
        } else {
            const errorData = await response.text();
            console.error('Error saving lesson:', errorData);
            Alert.alert('Error', 'Failed to save lesson.');
        }
    } catch (error) {
        console.error('Upload Error:', error);
        Alert.alert('Error', 'Failed to save lesson.');
    } finally {
        setLoading(false);
    }
};

  const confirmDelete = (lessonId) => {
    setLessonToDelete(lessonId);
    setModalVisible(true);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(`https://backend-disciple-a692164f13b9.herokuapp.com/api/lessons/${lessonToDelete}`);
      if (response.status === 200) {
        Alert.alert('Success', 'Lesson deleted successfully!');
        fetchLessons();
        if (typeof onCompletion === 'function') onCompletion();
      } else {
        Alert.alert('Error', 'Failed to delete lesson.');
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
      Alert.alert('Error', 'Failed to delete lesson.');
    } finally {
      setLoading(false);
      setModalVisible(false);
      setLessonToDelete(null);
    }
  };

  const clearForm = () => {
    setSelectedLessonId(null);
    setTitle('');
    setDescription('');
    setContent('');
    setScripture('');
    setImage(null);
  };

  const handleEdit = (lesson) => {
    setSelectedLessonId(lesson.lessonID);
    setTitle(lesson.title);
    setDescription(lesson.description);
    setContent(lesson.content);
    setScripture(lesson.scriptureReference);
    // Do not set the image state; only set it when the user selects a new image
    setImage(null);
};


  const selectImage = async () => {
    // Request media library permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access camera roll is required!');
      return;
    }

    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    };

    try {
      const result = await ImagePicker.launchImageLibraryAsync(options);
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        console.log('ImagePicker Result:', asset);
        const filename = asset.uri.split('/').pop();
        const fileType = filename.split('.').pop();

        const source = {
          uri: asset.uri,
          name: filename,
          type: asset.type || `image/${fileType}`,
        };
        console.log('Image Source:', source);
        setImage(source);
      }
    } catch (error) {
      console.error('ImagePicker Error: ', error);
      Alert.alert('Error', 'Failed to select image.');
    }
  };

  const renderLessonItem = ({ item, index }) => (
    <Animatable.View
        animation="fadeInUp"
        delay={index * 100}
        style={styles.lessonCard}
    >
        <View style={styles.lessonCardContent}>
            <Text style={styles.lessonTitle}>{item.title}</Text>
            <View style={styles.lessonActions}>
                <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionIcon}>
                    <Ionicons name="pencil" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => confirmDelete(item.lessonID)} style={styles.actionIcon}>
                    <Ionicons name="trash" size={24} color={COLORS.accent} />
                </TouchableOpacity>
            </View>
        </View>
        {/* Display Image if Available */}
        {item.imageUrl && (
            <Image
                source={{ uri: item.imageUrl }}
                style={styles.lessonImage}
                onError={async (error) => {
                    console.log('Error loading image:', error.nativeEvent.error);
                    // Handle URL expiration by refetching lessons
                    await fetchLessons();
                }}
            />
        )}
    </Animatable.View>
);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.formContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.header}>
          {selectedLessonId ? 'Update Lesson' : 'Create Lesson'}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter lesson title"
          placeholderTextColor={COLORS.placeholder}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter description"
          placeholderTextColor={COLORS.placeholder}
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <TextInput
          style={styles.textarea}
          placeholder="Enter content"
          placeholderTextColor={COLORS.placeholder}
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={4}
        />
        <TextInput
          style={styles.input}
          placeholder="Scripture reference"
          placeholderTextColor={COLORS.placeholder}
          value={scripture}
          onChangeText={setScripture}
        />

        {/* Image Selection and Preview */}
        <TouchableOpacity style={styles.imageSelector} onPress={selectImage}>
          <Text style={styles.imageSelectorText}>
            {image ? 'Change Image' : 'Select Image'}
          </Text>
        </TouchableOpacity>
        {image && (
          <Image source={{ uri: image.uri }} style={styles.previewImage} />
        )}

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.textSecondary} />
          ) : (
            <Text style={styles.saveButtonText}>
              {selectedLessonId ? 'Update Lesson' : 'Create Lesson'}
            </Text>
          )}
        </TouchableOpacity>
        {selectedLessonId && (
          <TouchableOpacity style={styles.cancelButton} onPress={clearForm}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Text style={styles.sectionTitle}>Existing Lessons</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        <FlatList
          data={lessons}
          keyExtractor={(item) => item.lessonID.toString()}
          renderItem={renderLessonItem}
          contentContainerStyle={styles.lessonList}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Delete</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete this lesson?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonDelete}
                onPress={handleDelete}
              >
                <Text style={styles.modalButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  formContainer: {
    paddingBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    color: COLORS.textPrimary,
  },
  textarea: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    height: 100,
    textAlignVertical: 'top',
    color: COLORS.textPrimary,
  },
  imageSelector: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  imageSelectorText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewImage: {
    width: '100%',
    height: 200,
    marginBottom: 15,
    borderRadius: 5,
  },
  lessonImage: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: COLORS.secondary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  saveButtonText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: COLORS.accent,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginVertical: 15,
  },
  lessonList: {
    paddingBottom: 20,
  },
  lessonCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    marginBottom: 10,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  lessonCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  lessonActions: {
    flexDirection: 'row',
  },
  actionIcon: {
    marginLeft: 15,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButtonCancel: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: COLORS.border,
    borderRadius: 5,
    marginRight: 10,
  },
  modalButtonDelete: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: COLORS.accent,
    borderRadius: 5,
  },
  modalButtonText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LessonForm;
