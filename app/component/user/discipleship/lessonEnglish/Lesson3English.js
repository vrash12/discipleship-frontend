import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';

const Lesson3English = ({ navigation, route }) => {
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
                <Image source={require('../../../assets/logos/lesson3.jpg')} style={styles.headerImage} />

                <Text style={styles.header}>Lesson 3: Bible - Our New Standard</Text>

                {/* Introduction */}
                <Text style={styles.text}>Do you know why the first-century believers grew and remained passionate in their devotion to God? Because they were devoted to growing their personal relationship with Jesus. They cultivated their spiritual lifestyle through their devotion to the Lord. Two key practices that show devotion to the Lord are reading the Bible and praying.</Text>

                {/* Learning Nugget */}
                <View style={styles.learningNugget}>
                    <Text style={styles.nuggetHeader}>Learning Nugget</Text>
                    <Text style={styles.nuggetText}>The Bible is not just one book but a collection of 66 books written by over 40 authors across approximately 1,500 years. Despite being written over such a long period, it remains consistent in its message and purpose.</Text>
                </View>

                {/* Interactive Truths Section */}
                <TouchableOpacity style={styles.sectionHeader} onPress={() => handleToggleTruth(0)}>
                    <Text style={styles.subheader}>TRUTH 1: The Bible is the Word of God {showTruths[0] ? '▲' : '▼'}</Text>
                </TouchableOpacity>
                {showTruths[0] && (
                    <View style={styles.truthContent}>
                        <Text style={styles.text}>The Bible is God's primary means of communicating with us. It's His letter of love, instruction, and guidance.</Text>
                        <Text style={styles.bibleVerse}>"All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness." (2 Timothy 3:16)</Text>
                    </View>
                )}

                <TouchableOpacity style={styles.sectionHeader} onPress={() => handleToggleTruth(1)}>
                    <Text style={styles.subheader}>TRUTH 2: The Bible is Spiritual Food {showTruths[1] ? '▲' : '▼'}</Text>
                </TouchableOpacity>
                {showTruths[1] && (
                    <View style={styles.truthContent}>
                        <Text style={styles.text}>Just as food nourishes our physical bodies, the Word of God nourishes our spirits.</Text>
                        <Text style={styles.bibleVerse}>"Like newborn babies, crave pure spiritual milk, so that by it you may grow up in your salvation." (1 Peter 2:2)</Text>
                    </View>
                )}

                <TouchableOpacity style={styles.sectionHeader} onPress={() => handleToggleTruth(2)}>
                    <Text style={styles.subheader}>TRUTH 3: The Bible Guides Us {showTruths[2] ? '▲' : '▼'}</Text>
                </TouchableOpacity>
                {showTruths[2] && (
                    <View style={styles.truthContent}>
                        <Text style={styles.text}>The Bible provides guidance, wisdom, and instruction for every aspect of life.</Text>
                        <Text style={styles.bibleVerse}>"Your word is a lamp for my feet, a light on my path." (Psalm 119:105)</Text>
                    </View>
                )}

                <TouchableOpacity style={styles.sectionHeader} onPress={() => handleToggleTruth(3)}>
                    <Text style={styles.subheader}>TRUTH 4: The Bible Equips Us {showTruths[3] ? '▲' : '▼'}</Text>
                </TouchableOpacity>
                {showTruths[3] && (
                    <View style={styles.truthContent}>
                        <Text style={styles.text}>It prepares us to face challenges and equips us to do God's work effectively.</Text>
                        <Text style={styles.bibleVerse}>"So that the servant of God may be thoroughly equipped for every good work." (2 Timothy 3:17)</Text>
                    </View>
                )}

                {/* Additional Content */}
                <View style={styles.additionalContent}>
                    <Text style={styles.subheader}>Applying the Bible in Daily Life</Text>
                    <Text style={styles.text}>Reading the Bible regularly helps us understand God's will and strengthens our faith. It teaches us how to live a life that pleases God.</Text>
                    <Text style={styles.bibleVerse}>"Do not merely listen to the word, and so deceive yourselves. Do what it says." (James 1:22)</Text>
                </View>

                {/* Reflection and Application Section */}
                <TouchableOpacity style={styles.questionButton} onPress={handleReflectionToggle}>
                    <Text style={styles.questionButtonText}>{showReflection ? 'Hide Reflection' : 'Reflect on Your Bible Reading Habits'}</Text>
                </TouchableOpacity>
                {showReflection && (
                    <View style={styles.reflectionBox}>
                        <Text style={styles.text}>How often do you read the Bible? What steps can you take to make Bible reading a daily habit?</Text>
                    </View>
                )}

                {/* Navigation Buttons */}
                <TouchableOpacity style={styles.completeButton} onPress={handleCompleteLesson}>
                    <Text style={styles.completeButtonText}>Complete Lesson</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.quizButton} onPress={() => navigation.navigate('QuizEnglish3')}>
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
        backgroundColor: '#4DB6AC',
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
        backgroundColor: '#90A4AE',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    backButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    additionalContent: {
        backgroundColor: '#E8F5E9',
        padding: 15,
        borderRadius: 10,
        marginVertical: 20,
    },
});

export default Lesson3English;
