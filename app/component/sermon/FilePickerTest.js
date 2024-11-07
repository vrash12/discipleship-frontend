// FilePickerTest.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform, PermissionsAndroid } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';

const FilePickerTest = () => {
  const [file, setFile] = useState(null);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);

        const readGranted = granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED;
        const writeGranted = granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED;

        if (!readGranted || !writeGranted) {
          Alert.alert(
            'Permissions Required',
            'Please grant storage permissions to use this feature.',
            [{ text: 'OK' }],
            { cancelable: false }
          );
        }
      } catch (err) {
        console.warn('Permission error:', err);
      }
    }
  };

  const pickFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (res.type === 'success') {
        console.log('Picked file:', res);
        setFile(res);
        Alert.alert('File Selected', `Name: ${res.name}\nSize: ${res.size} bytes`);
      } else {
        console.log('File selection canceled.');
      }
    } catch (err) {
      console.error('Error picking file:', err);
      Alert.alert('Error', `Error picking file: ${err.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickFile} style={styles.button}>
        <Ionicons name="document-text-outline" size={24} color="#FFFFFF" />
        <Text style={styles.buttonText}>{file ? 'Change PDF' : 'Select PDF'}</Text>
      </TouchableOpacity>
      {file && (
        <View style={styles.fileInfo}>
          <Text style={styles.fileText}>Name: {file.name}</Text>
          <Text style={styles.fileText}>Size: {file.size} bytes</Text>
          <Text style={styles.fileText}>URI: {file.uri}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 5,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    marginLeft: 10,
    fontSize: 16,
  },
  fileInfo: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
  },
  fileText: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 5,
  },
});

export default FilePickerTest;
