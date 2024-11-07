import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';

const Lesson4English = ({ navigation, route }) => {
    const [showTruths, setShowTruths] = useState([false, false, false, false]);
    const [showReflection, setShowReflection] = useState(false);
    const [prayerDone, setPrayerDone] = useState(false);
    
    const handleToggleTruth = (index) => {
        let newTruths = [...showTruths];
        newTruths[index] = !newTruths[index];
        setShowTruths(newTruths);
    };

    const { onComplete } = route.params || {}; 

    const handleCompleteLesson = () => {
        setPrayerDone(true);
        Alert.alert("Congratulations!", "You've completed the lesson.");
        if (onComplete) {
            onComplete(); // Call the onComplete function when the lesson is completed
        }
    };

    const handleReflectionToggle = () => setShowReflection(!showReflection);

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content}>
                {/* Header Image */}
                <Image source={require('../../../assets/logos/lesson4.jpg')} style={styles.headerImage} />

                <Text style={styles.header}>Lesson 4: Prayer - Our New Power</Text>

                {/* Introduction */}
                <Text style={styles.text}>Christianity is more than a religion; it's a relationship with God. The foundation of a strong bond with God is healthy communication with Him. The better the communication, the better the relationship will be. We talk to Him through prayer, and God talks to us primarily through His Word—the Bible. We learn to listen to God's voice in our lives when we read His Word. And the good news is that God listens when we pray to Him.</Text>

                {/* Learning Nugget */}
                <View style={styles.learningNugget}>
                    <Text style={styles.nuggetHeader}>Learning Nugget</Text>
                    <Text style={styles.nuggetText}>Prayer is not just about asking God for things; it's about building a relationship with Him. It's a two-way communication where we speak, and we also listen.</Text>
                </View>

                {/* Interactive Truths Section */}
                <TouchableOpacity style={styles.sectionHeader} onPress={() => handleToggleTruth(0)}>
                    <Text style={styles.subheader}>TRUTH 1: Prayer is Communication with God {showTruths[0] ? '▲' : '▼'}</Text>
                </TouchableOpacity>
                {showTruths[0] && (
                    <View style={styles.truthContent}>
                        <Text style={styles.text}>Prayer is our way of talking to God, sharing our thoughts, feelings, and desires with Him.</Text>
                        <Text style={styles.bibleVerse}>"Pray continually." (1 Thessalonians 5:17)</Text>
                    </View>
                )}

                <TouchableOpacity style={styles.sectionHeader} onPress={() => handleToggleTruth(1)}>
                    <Text style={styles.subheader}>TRUTH 2: Prayer Builds Relationship {showTruths[1] ? '▲' : '▼'}</Text>
                </TouchableOpacity>
                {showTruths[1] && (
                    <View style={styles.truthContent}>
                        <Text style={styles.text}>Regular communication strengthens our relationship with God, just as it does in human relationships.</Text>
                        <Text style={styles.bibleVerse}>"Come near to God and He will come near to you." (James 4:8a)</Text>
                    </View>
                )}

                <TouchableOpacity style={styles.sectionHeader} onPress={() => handleToggleTruth(2)}>
                    <Text style={styles.subheader}>TRUTH 3: Prayer Empowers Us {showTruths[2] ? '▲' : '▼'}</Text>
                </TouchableOpacity>
                {showTruths[2] && (
                    <View style={styles.truthContent}>
                        <Text style={styles.text}>Through prayer, we receive strength, guidance, and power from God to face life's challenges.</Text>
                        <Text style={styles.bibleVerse}>"The prayer of a righteous person is powerful and effective." (James 5:16b)</Text>
                    </View>
                )}

                <TouchableOpacity style={styles.sectionHeader} onPress={() => handleToggleTruth(3)}>
                    <Text style={styles.subheader}>TRUTH 4: Jesus Modeled Prayer {showTruths[3] ? '▲' : '▼'}</Text>
                </TouchableOpacity>
                {showTruths[3] && (
                    <View style={styles.truthContent}>
                        <Text style={styles.text}>Jesus often withdrew to pray, setting an example for us to follow.</Text>
                        <Text style={styles.bibleVerse}>"But Jesus often withdrew to lonely places and prayed." (Luke 5:16)</Text>
                    </View>
                )}

                {/* Additional Content */}
                <View style={styles.additionalContent}>
                    <Text style={styles.subheader}>Developing a Consistent Prayer Life</Text>
                    <Text style={styles.text}>Set aside specific times each day to pray. Find a quiet place where you can focus on God without distractions.</Text>
                    <Text style={styles.text}>Remember, prayer is a conversation. Be honest with God about your feelings and listen for His guidance.</Text>
                </View>

                {/* Reflection and Application Section */}
                <TouchableOpacity style={styles.questionButton} onPress={handleReflectionToggle}>
                    <Text style={styles.questionButtonText}>{showReflection ? 'Hide Reflection' : 'Reflect on Your Prayer Life'}</Text>
                </TouchableOpacity>
                {showReflection && (
                    <View style={styles.reflectionBox}>
                        <Text style={styles.text}>How has prayer impacted your life? What steps can you take to deepen your prayer life?</Text>
                    </View>
                )}

                {/* Navigation Buttons */}
                <TouchableOpacity style={styles.completeButton} onPress={handleCompleteLesson}>
                    <Text style={styles.completeButtonText}>Complete Lesson</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.quizButton} onPress={() => navigation.navigate('QuizEnglish4')}>
                    <Text style={styles.quizButtonText}>Proceed to Quiz</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>Back to Lessons</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFEFEF',
    },
    headerImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    text: {
        fontSize: 16,
        color: '#555',
        lineHeight: 24,
        marginBottom: 15,
    },
    learningNugget: {
        backgroundColor: '#FFF8E1',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    nuggetHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    nuggetText: {
        fontSize: 16,
        color: '#555',
    },
    sectionHeader: {
        backgroundColor: '#FFB74D',
        padding: 15,
        borderRadius: 5,
        marginVertical: 10,
    },
    subheader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    truthContent: {
        backgroundColor: '#FFF3E0',
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
    },
    reflectionBox: {
        backgroundColor: '#E1F5FE',
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
    },
    questionButton: {
        backgroundColor: '#64B5F6',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 10,
    },
    questionButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    bibleVerse: {
        fontStyle: 'italic',
        color: '#555',
        textAlign: 'center',
        marginVertical: 10,
        fontSize: 16,
    },
    completeButton: {
        backgroundColor: '#81C784',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 10,
    },
    completeButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    quizButton: {
        backgroundColor: '#FF8C00',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 10,
    },
    quizButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    backButton: {
        backgroundColor: '#E57373',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 10,
    },
    backButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    additionalContent: {
        backgroundColor: '#FFF9C4',
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
    },
});

export default Lesson4English;