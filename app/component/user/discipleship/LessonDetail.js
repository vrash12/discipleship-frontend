import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import SidebarNav from '../SidebarNav'; // Import SidebarNav if needed
import { useNavigation } from '@react-navigation/native';

const LessonDetail = ({ route }) => {
    const { lesson } = route.params; // Get the lesson data from route params
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* Optional: Include SidebarNav if your layout requires it */}
            {/* <SidebarNav navigation={navigation} /> */}
            <ScrollView style={styles.content}>
                {/* Lesson Image */}
                {lesson.imageUrl && (
                    <Image
                        source={{ uri: lesson.imageUrl }}
                        style={styles.lessonImage}
                    />
                )}

                {/* Lesson Title */}
                <Text style={styles.lessonTitle}>{lesson.title}</Text>

                {/* Lesson Scripture Reference */}
                {lesson.scriptureReference && (
                    <Text style={styles.lessonScripture}>
                        <Text style={styles.scriptureLabel}>Scripture Reference: </Text>
                        {lesson.scriptureReference}
                    </Text>
                )}

                {/* Lesson Content */}
                <Text style={styles.lessonContent}>{lesson.content}</Text>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row', // If using SidebarNav
        backgroundColor: '#f4f4f4', // Light grey background
    },
    content: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff', // White background for content
    },
    lessonImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
    },
    lessonTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    lessonScripture: {
        fontSize: 18,
        fontStyle: 'italic',
        color: '#8d6e63', // Brownish color for scripture
        marginBottom: 20,
        textAlign: 'center',
    },
    scriptureLabel: {
        fontWeight: 'bold',
        color: '#ff9800', // Orange color for label
    },
    lessonContent: {
        fontSize: 18,
        lineHeight: 28,
        color: '#333',
        textAlign: 'justify',
    },
});

export default LessonDetail;
