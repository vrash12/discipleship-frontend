// SermonScreen.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Platform,
  ImageBackground,
} from 'react-native';
import { Audio } from 'expo-av';
import { WebView } from 'react-native-webview';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const COLORS = {
  primary: '#FF8C00',
  secondary: '#4CAF50',
  background: '#FFFFFF',
  cardBackground: '#F9F9F9',
  textPrimary: '#333333',
  textSecondary: '#666666',
  accent: '#FF9800',
};

const SermonScreen = ({ route, navigation }) => {
  const { sermon } = route.params;

  useEffect(() => {
    navigation.setOptions({ title: sermon.title });
  }, []);

  const YouTubePlayer = ({ youtubeUrl }) => {
    // Extract the video ID from the URL
    const getVideoId = (url) => {
      const regex =
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|.*[?&]v)=)|youtu\.be\/)([^"&?\/\s]{11})/i;
      const match = url.match(regex);
      return match && match[1] ? match[1] : null;
    };

    const videoId = getVideoId(youtubeUrl);

    if (!videoId) {
      return <Text style={styles.errorText}>Invalid YouTube URL</Text>;
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    return (
      <View style={styles.youtubeContainer}>
        <WebView
          style={{ alignSelf: 'stretch', height: 200 }}
          javaScriptEnabled={true}
          source={{ uri: embedUrl }}
          allowsFullscreenVideo={true}
        />
      </View>
    );
  };

  const AudioPlayer = ({ uri }) => {
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(1);

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

    useEffect(() => {
      let isMounted = true;

      const loadSound = async () => {
        try {
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
            color={COLORS.primary}
          />
        </TouchableOpacity>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onValueChange={onSliderValueChange}
          minimumTrackTintColor={COLORS.primary}
          maximumTrackTintColor="#000000"
          thumbTintColor={COLORS.primary}
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

    const downloadPDF = async () => {
      try {
        const fileUri = FileSystem.documentDirectory + 'document.pdf';
        const { uri: localUri } = await FileSystem.downloadAsync(uri, fileUri);
        await Sharing.shareAsync(localUri);
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
              <Ionicons name="close-circle" size={30} color={COLORS.primary} />
            </TouchableOpacity>
            <WebView
              source={{ uri: renderPDFUri }}
              style={styles.pdfViewer}
              startInLoadingState
              renderLoading={() => (
                <ActivityIndicator
                  size="large"
                  color={COLORS.primary}
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
            <TouchableOpacity style={styles.downloadButton} onPress={downloadPDF}>
              <Ionicons name="download" size={24} color="#FFF" />
              <Text style={styles.buttonText}>Download PDF</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown Date';
    const date = new Date(dateString);
    if (isNaN(date)) return 'Invalid Date';
    return date.toDateString();
  };

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={require('./sermon_background.jpg')}
        style={styles.headerBackground}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>{sermon.title}</Text>
          <Text style={styles.date}>{formatDate(sermon.date)}</Text>
        </View>
      </ImageBackground>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{sermon.description}</Text>
        </View>

        {/* Display Media */}
        {sermon.youtubeUrl && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Watch Video</Text>
            <YouTubePlayer youtubeUrl={sermon.youtubeUrl} />
          </View>
        )}
        {sermon.audioUrl && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Listen to Audio</Text>
            <AudioPlayer uri={`https://backend-disciple-a692164f13b9.herokuapp.com/${sermon.audioUrl}`} />
          </View>
        )}
        {sermon.pdfUrl && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Read PDF</Text>
            <PDFViewer uri={`https://backend-disciple-a692164f13b9.herokuapp.com/${sermon.pdfUrl}`} />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
  },
  headerBackground: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 20,
    paddingHorizontal: 10,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 5,
  },
  date: {
    fontSize: 16,
    color: '#FFF',
  },
  content: {
    padding: 15,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  youtubeContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  audioPlayerContainer: {
    alignItems: 'center',
    marginBottom: 20,
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
    color: COLORS.textSecondary,
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
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    width: '45%',
    justifyContent: 'center',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    padding: 12,
    borderRadius: 8,
    width: '45%',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    marginLeft: 8,
    fontSize: 16,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
});

export default SermonScreen;
