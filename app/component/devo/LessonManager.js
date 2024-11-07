import React, { useState, useCallback } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import LessonForm from './LessonForm'; // Ensure this path is correct

const LessonManager = () => {
    const [selectedLessonId, setSelectedLessonId] = useState(null);

    // Callback function to handle the completion of the lesson operation
    const handleCompletion = useCallback(() => {
        Alert.alert("Operation Successful", "The lesson operation was successful.");
        setSelectedLessonId(null);  
    }, []);

    const handleNewLesson = () => {
        setSelectedLessonId(null); 
    };

    // Function to handle editing an existing lesson
    const handleEditLesson = (lessonId) => {
        setSelectedLessonId(lessonId); // Set the selected lesson ID to edit
    };

    return (
        <View style={styles.container}>
            <Button title="Create New Lesson" onPress={handleNewLesson} />
            
  
            {selectedLessonId !== null && (
                <LessonForm
                    lessonId={selectedLessonId}
                    onCompletion={handleCompletion} // Pass onCompletion directly as a prop
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default LessonManager;
