import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
  Modal,
  ActivityIndicator,
  Platform,
  ScrollView,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as MediaLibrary from 'expo-media-library';
import { Audio } from 'expo-av';
import { WebView } from 'react-native-webview';
import Slider from '@react-native-community/slider';


import * as FileSystem from 'expo-file-system';









const AddSermonScreen = ({ navigation }) => {
  // State variables
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for Add/Edit Sermon Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentSermonId, setCurrentSermonId] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [pdf, setPdf] = useState(null);
  const [audio, setAudio] = useState(null);

  // State variables for existing files
const [existingPdfUrl, setExistingPdfUrl] = useState('');
const [existingAudioUrl, setExistingAudioUrl] = useState('');


  useEffect(() => {
    requestPermissions();
    fetchSermons();
  }, []);

  const getFileNameFromUrl = (url) => {
    return url.substring(url.lastIndexOf('/') + 1).split('?')[0];
  };
  

  const requestPermissions = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'Please grant storage permissions to use this feature.',
        [{ text: 'OK' }],
        { cancelable: false }
      );
    }
  };

  const fetchSermons = async () => {
    try {
      const response = await axios.get('https://backend-disciple-a692164f13b9.herokuapp.com/api/sermons');
      setSermons(response.data);
    } catch (error) {
      console.error('Error fetching sermons:', error);
      Alert.alert('Error', 'Failed to fetch sermons');
    } finally {
      setLoading(false);
    }
  };

  const pickPdfFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        const file = res.assets[0];
        setPdf(file);
        Alert.alert('File Selected', `Name: ${file.name}\nSize: ${file.size} bytes`);
      } else if (res.canceled) {
        console.log('File selection canceled by user.');
      } else {
        console.log('Unknown response structure:', res);
      }
    } catch (err) {
      console.error('Error picking file:', err);
      Alert.alert('Error', `Error picking file: ${err.message}`);
    }
  };

  const pickAudioFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        const file = res.assets[0];
        setAudio(file);
        Alert.alert('Audio Selected', `Name: ${file.name}\nSize: ${file.size} bytes`);
      } else if (res.canceled) {
        console.log('Audio selection canceled by user.');
      } else {
        console.log('Unknown response structure:', res);
      }
    } catch (err) {
      console.error('Error picking audio:', err);
      Alert.alert('Error', `Error picking audio: ${err.message}`);
    }
  };

  const uploadSermon = async () => {
    if (!title || !description) {
      Alert.alert('Validation Error', 'Title and Description are required');
      return;
    }

    const requestStoragePermission = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissions Required',
          'Please grant storage permissions to download the PDF.',
          [{ text: 'OK' }],
          { cancelable: false }
        );
        return false;
      }
      return true;
    };

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('youtubeUrl', youtubeUrl);


    if (isEditMode) {
      // Include flags to remove existing files if they've been removed
      if (!existingPdfUrl && !pdf) {
        formData.append('removePdf', 'true');
      }
      if (!existingAudioUrl && !audio) {
        formData.append('removeAudio', 'true');
      }
    }

    if (pdf) {
      let { uri, name, mimeType } = pdf;
      name = name || 'document.pdf';
      mimeType = mimeType || 'application/pdf';

      if (Platform.OS === 'android' && uri.startsWith('content://')) {
        try {
          const fileInfo = await FileSystem.getInfoAsync(uri);
          if (!fileInfo.exists) {
            console.error('File does not exist at URI:', uri);
            Alert.alert('Error', 'Selected file does not exist.');
            return;
          }
          uri = fileInfo.uri;
        } catch (error) {
          console.error('Error accessing PDF file:', error);
          Alert.alert('Error', 'Failed to access PDF file.');
          return;
        }
      }

      if (!uri.startsWith('file://')) {
        uri = 'file://' + uri;
      }

      formData.append('pdf', {
        uri,
        type: mimeType,
        name,
      });
    }

    if (audio) {
      let { uri, name, mimeType } = audio;
      name = name || 'audio.mp3';
      mimeType = mimeType || 'audio/mpeg';

      if (Platform.OS === 'android' && uri.startsWith('content://')) {
        try {
          const fileInfo = await FileSystem.getInfoAsync(uri);
          if (!fileInfo.exists) {
            console.error('File does not exist at URI:', uri);
            Alert.alert('Error', 'Selected file does not exist.');
            return;
          }
          uri = fileInfo.uri;
        } catch (error) {
          console.error('Error accessing audio file:', error);
          Alert.alert('Error', 'Failed to access audio file.');
          return;
        }
      }

      if (!uri.startsWith('file://')) {
        uri = 'file://' + uri;
      }

      formData.append('audio', {
        uri,
        type: mimeType,
        name,
      });
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      const url = isEditMode
        ? `https://backend-disciple-a692164f13b9.herokuapp.com/api/sermons/${currentSermonId}`
        : 'https://backend-disciple-a692164f13b9.herokuapp.com/api/sermons/upload';
  
      const method = isEditMode ? 'PUT' : 'POST';
  
      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
  
      if (response.ok) {
        Alert.alert('Success', `Sermon ${isEditMode ? 'updated' : 'uploaded'} successfully`);
        setModalVisible(false);
        fetchSermons();
        resetForm();
      } else {
        const errorData = await response.text();
        console.error('Upload error:', errorData);
        Alert.alert('Error', `Failed to ${isEditMode ? 'update' : 'upload'} sermon`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', `Failed to ${isEditMode ? 'update' : 'upload'} sermon`);
    }
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentSermonId(null);
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (sermon) => {
    setIsEditMode(true);
    setCurrentSermonId(sermon.id);
    setTitle(sermon.title);
    setDescription(sermon.description);
    setYoutubeUrl(sermon.youtubeUrl || '');
  
    // Set existing PDF and audio URLs
    setExistingPdfUrl(sermon.pdfUrl || '');
    setExistingAudioUrl(sermon.audioUrl || '');
  
    // Reset new file selections
    setPdf(null);
    setAudio(null);
  
    setModalVisible(true);
  };
  

  const deleteSermon = async (sermonId) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`https://backend-disciple-a692164f13b9.herokuapp.com/api/sermons/${sermonId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        Alert.alert('Success', 'Sermon deleted successfully');
        fetchSermons();
      } else {
        const errorData = await response.text();
        console.error('Delete error:', errorData);
        Alert.alert('Error', 'Failed to delete sermon');
      }
    } catch (error) {
      console.error('Delete error:', error);
      Alert.alert('Error', 'Failed to delete sermon');
    }
  };

  const confirmDelete = (sermonId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this sermon?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteSermon(sermonId) },
      ],
      { cancelable: false }
    );
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setYoutubeUrl('');
    setPdf(null);
    setAudio(null);
    setExistingPdfUrl('');
    setExistingAudioUrl('');
  };
  
  const renderSermonItem = ({ item }) => (
    <View style={styles.sermonItem}>
      <View style={styles.sermonHeader}>
        <Text style={styles.sermonTitle}>{item.title}</Text>
        <View style={styles.sermonActions}>
          <TouchableOpacity onPress={() => openEditModal(item)} style={styles.actionButton}>
            <Ionicons name="create-outline" size={24} color="#4A90E2" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => confirmDelete(item.id)} style={styles.actionButton}>
            <Ionicons name="trash-outline" size={24} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.sermonDescription}>{item.description}</Text>

      {/* Display YouTube Video */}
      {item.youtubeUrl ? (
        <View style={styles.youtubeContainer}>
          <WebView
            style={{ alignSelf: 'stretch', height: 200 }}
            javaScriptEnabled={true}
            source={{ uri: item.youtubeUrl }}
            allowsFullscreenVideo={true}
          />
        </View>
      ) : null}

      {/* Display Audio */}
      {item.audioUrl ? (
        <AudioPlayer uri={item.audioUrl} />
      ) : null}

      {/* Display PDF */}
      {item.pdfUrl ? (
        <PDFViewer uri={item.pdfUrl} />
      ) : null}
    </View>
  );

  const AudioPlayer = ({ uri }) => {
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(1);

    useEffect(() => {
      let isMounted = true;
    
      const loadSound = async () => {
        try {
          console.log('Loading audio from:', uri);
          const { sound } = await Audio.Sound.createAsync(
            { uri },
            { shouldPlay: false },
            (status) => {
              if (status.isLoaded) {
                setPosition(status.positionMillis);
                setDuration(status.durationMillis);
                setIsPlaying(status.isPlaying);
              }
            }
          );
          if (isMounted) setSound(sound);
        } catch (error) {
          console.log('Error loading audio:', error);
          Alert.alert('Error', 'Failed to load audio.');
        }
      };
    
      loadSound();
    
      return () => {
        isMounted = false;
        if (sound) {
          sound.unloadAsync();
        }
      };
    }, [uri]);


    
    

    const playPauseAudio = async () => {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      }
    };

    const onSliderValueChange = async (value) => {
      if (sound) {
        await sound.setPositionAsync(value);
        setPosition(value);
      }
    };

    const formatTime = (millis) => {
      const totalSeconds = millis / 1000;
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = Math.floor(totalSeconds % 60);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
      <View style={styles.audioPlayerContainer}>
        <TouchableOpacity onPress={playPauseAudio} style={styles.playPauseButton}>
          <Ionicons
            name={isPlaying ? 'pause-circle' : 'play-circle'}
            size={64}
            color="#4A90E2"
          />
        </TouchableOpacity>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onValueChange={onSliderValueChange}
          minimumTrackTintColor="#4A90E2"
          maximumTrackTintColor="#000000"
          thumbTintColor="#4A90E2"
        />
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>
    );
  };

  const PDFViewer = ({ uri }) => {
    const [showPDF, setShowPDF] = useState(false);

    const requestStoragePermission = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissions Required',
          'Please grant storage permissions to download the PDF.',
          [{ text: 'OK' }],
          { cancelable: false }
        );
        return false;
      }
      return true;
    };

    const downloadPDF = async () => {
      try {
        const hasPermission = await requestStoragePermission();
        if (!hasPermission) return;
    
        console.log('Downloading PDF from:', uri);
        const fileName = uri.substring(uri.lastIndexOf('/') + 1).split('?')[0];
        const fileUri = FileSystem.cacheDirectory + fileName;
    
        // Download the file to the cache directory
        const { uri: localUri } = await FileSystem.downloadAsync(uri, fileUri);
        console.log('PDF downloaded to cache:', localUri);
    
        // Save the file to the Downloads folder
        const asset = await MediaLibrary.createAssetAsync(localUri);
        const album = await MediaLibrary.getAlbumAsync('Download');
        if (album == null) {
          await MediaLibrary.createAlbumAsync('Download', asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
    
        Alert.alert('Success', 'PDF has been downloaded to your Downloads folder.');
      } catch (error) {
        console.error('Error downloading PDF:', error);
        Alert.alert('Error', 'Failed to download PDF.');
      }
    };
    
    
    const renderPDFUri =
      Platform.OS === 'android'
        ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(uri)}`
        : uri;

    return (
      <View style={styles.pdfContainer}>
        {showPDF ? (
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPDF(false)}
            >
              <Ionicons name="close-circle" size={30} color="#4A90E2" />
            </TouchableOpacity>
            <WebView
              source={{ uri: renderPDFUri }}
              style={styles.pdfViewer}
              startInLoadingState
              renderLoading={() => (
                <ActivityIndicator
                  size="large"
                  color="#4A90E2"
                  style={styles.loadingIndicator}
                />
              )}
              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.log('WebView error: ', nativeEvent);
                Alert.alert('Error', 'Failed to load PDF.');
              }}
            />
          </View>
        ) : (
          <View style={styles.pdfActions}>
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => setShowPDF(true)}
            >
              <Ionicons name="eye" size={24} color="#FFF" />
              <Text style={styles.buttonText}>View PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={downloadPDF}
            >
              <Ionicons name="download" size={24} color="#FFF" />
              <Text style={styles.buttonText}>Download PDF</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Sermon List */}
      <FlatList
        data={sermons}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderSermonItem}
        contentContainerStyle={styles.listContent}
      />

      {/* Add Sermon Button */}
      <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
        <Ionicons name="add-circle" size={64} color="#4A90E2" />
      </TouchableOpacity>

      {/* Add/Edit Sermon Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();
        }}
      >
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>{isEditMode ? 'Edit Sermon' : 'Add Sermon'}</Text>
            <TextInput
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />
            <TextInput
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              style={styles.textArea}
              multiline
            />
            <TextInput
              placeholder="YouTube URL"
              value={youtubeUrl}
              onChangeText={setYoutubeUrl}
              style={styles.input}
            />
{existingPdfUrl ? (
  <View style={styles.fileInfo}>
    <Text style={styles.fileText}>
      Existing PDF: {getFileNameFromUrl(existingPdfUrl)}
    </Text>
    <TouchableOpacity
      onPress={() => setExistingPdfUrl('')}
      style={styles.removeButton}
    >
      <Text style={styles.removeButtonText}>Remove PDF</Text>
    </TouchableOpacity>
  </View>
) : null}

<TouchableOpacity onPress={pickPdfFile} style={styles.fileButton}>
  <Ionicons name="document-text-outline" size={24} color="#FFFFFF" />
  <Text style={styles.fileButtonText}>
    {pdf ? 'Change PDF' : 'Select PDF'}
  </Text>
</TouchableOpacity>

            {pdf && (
              <View style={styles.fileInfo}>
                <Text style={styles.fileText}>Name: {pdf.name}</Text>
                <Text style={styles.fileText}>Size: {pdf.size} bytes</Text>
              </View>
            )}
            {existingAudioUrl ? (
  <View style={styles.fileInfo}>
    <Text style={styles.fileText}>
      Existing Audio: {getFileNameFromUrl(existingAudioUrl)}
    </Text>
    <TouchableOpacity
      onPress={() => setExistingAudioUrl('')}
      style={styles.removeButton}
    >
      <Text style={styles.removeButtonText}>Remove Audio</Text>
    </TouchableOpacity>
  </View>
) : null}

<TouchableOpacity onPress={pickAudioFile} style={styles.fileButton}>
  <Ionicons name="musical-notes-outline" size={24} color="#FFFFFF" />
  <Text style={styles.fileButtonText}>
    {audio ? 'Change Audio' : 'Select Audio'}
  </Text>
</TouchableOpacity>

            {audio && (
              <View style={styles.fileInfo}>
                <Text style={styles.fileText}>Name: {audio.name}</Text>
                <Text style={styles.fileText}>Size: {audio.size} bytes</Text>
              </View>
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.saveButton} onPress={uploadSermon}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // ... existing styles ...
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  listContent: {
    padding: 10,
  },
  sermonItem: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  sermonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sermonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  sermonActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 10,
  },
  sermonDescription: {
    fontSize: 16,
    color: '#666666',
    marginTop: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000000AA',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    padding: 10,
    marginBottom: 20,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    height: 100,
    textAlignVertical: 'top',
  },
  fileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 5,
    justifyContent: 'center',
    marginBottom: 10,
  },
  fileButtonText: {
    color: '#FFFFFF',
    marginLeft: 10,
    fontSize: 16,
  },
  fileInfo: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
  },
  fileText: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 5,
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: 30,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 5,
    marginRight: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#CCCCCC',
    padding: 15,
    borderRadius: 5,
    marginLeft: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333333',
    fontSize: 18,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  youtubeContainer: {
    marginTop: 10,
    height: 200,
  },
  audioPlayerContainer: {
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  playPauseButton: {
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  timeText: {
    fontSize: 14,
    color: '#666666',
  },
  pdfContainer: {
    marginTop: 10,
    flex: 1,
  },
  pdfViewer: {
    flex: 1,
    height: 400,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  pdfActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    padding: 10,
    borderRadius: 5,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF8C00',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFF',
    marginLeft: 5,
    fontSize: 16,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },

  removeButton: {
  marginTop: 5,
  alignSelf: 'flex-start',
  backgroundColor: '#FF3B30',
  padding: 5,
  borderRadius: 5,
},
removeButtonText: {
  color: '#FFFFFF',
  fontSize: 14,
},

});

export default AddSermonScreen;
