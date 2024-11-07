import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';

const Lesson1English = ({ navigation, route }) => {
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
                <Image source={require('../../../assets/logos/lesson1.jpg')} style={styles.headerImage} />

                <Text style={styles.header}>Lesson 1: Salvation (New Life)</Text>

                {/* Introduction */}
                <Text style={styles.text}>When it comes to salvation or going to heaven, have you ever thought about these things?</Text>
                <View style={styles.quoteBox}>
                    <Text style={styles.quote}>"God will save me because I'm not a bad person."</Text>
                    <Text style={styles.quote}>"God will save me because I did good things."</Text>
                    <Text style={styles.quote}>"God could never save me because I do a lot of bad things."</Text>
                </View>

                <Text style={styles.text}>How can we truly attain salvation and start a relationship with God? What do you think?</Text>

                {/* Reflection Prompt */}
                <TouchableOpacity style={styles.questionButton} onPress={handleReflectionToggle}>
                    <Text style={styles.questionButtonText}>{showReflection ? 'Hide Reflection' : 'Reflect on Your Thoughts'}</Text>
                </TouchableOpacity>
                {showReflection && (
                    <View style={styles.reflectionBox}>
                        <Text style={styles.text}>Do you think devoting yourself to religious activities or doing good deeds will save you? Reflect on this before moving on.</Text>
                    </View>
                )}

                {/* Learning Nugget */}
                <View style={styles.learningNugget}>
                    <Text style={styles.nuggetHeader}>Learning Nugget</Text>
                    <Text style={styles.nuggetText}>Salvation is not earned by good works or personal merit. It is a gift from God through faith in Jesus Christ.</Text>
                </View>

                {/* Interactive Truths Section */}
                <TouchableOpacity style={styles.sectionHeader} onPress={() => handleToggleTruth(0)}>
                    <Text style={styles.subheader}>TRUTH 1: God's Love and Plan {showTruths[0] ? '▲' : '▼'}</Text>
                </TouchableOpacity>
                {showTruths[0] && (
                    <View style={styles.truthContent}>
                        <Text style={styles.text}>God loves you and offers a wonderful plan for your life.</Text>
                        <Text style={styles.bibleVerse}>"For God so loved the world that He gave His one and only Son, that whoever believes in Him shall not perish but have eternal life." (John 3:16)</Text>
                        <Text style={styles.text}>Jesus came so that we may have life, and have it to the full.</Text>
                        <Text style={styles.bibleVerse}>"I have come that they may have life, and have it to the full." (John 10:10b)</Text>
                    </View>
                )}

                <TouchableOpacity style={styles.sectionHeader} onPress={() => handleToggleTruth(1)}>
                    <Text style={styles.subheader}>TRUTH 2: Humanity's Problem {showTruths[1] ? '▲' : '▼'}</Text>
                </TouchableOpacity>
                {showTruths[1] && (
                    <View style={styles.truthContent}>
                        <Text style={styles.text}>All of us have sinned, and our sin has separated us from God.</Text>
                        <Text style={styles.bibleVerse}>"For all have sinned and fall short of the glory of God." (Romans 3:23)</Text>
                        <Text style={styles.text}>The consequence of sin is spiritual death.</Text>
                        <Text style={styles.bibleVerse}>"For the wages of sin is death, but the gift of God is eternal life in Christ Jesus our Lord." (Romans 6:23)</Text>
                    </View>
                )}

                <TouchableOpacity style={styles.sectionHeader} onPress={() => handleToggleTruth(2)}>
                    <Text style={styles.subheader}>TRUTH 3: Jesus Christ's Solution {showTruths[2] ? '▲' : '▼'}</Text>
                </TouchableOpacity>
                {showTruths[2] && (
                    <View style={styles.truthContent}>
                        <Text style={styles.text}>Jesus Christ is God's only provision for our sin. Through Him alone we can know God personally and experience His love and plan.</Text>
                        <Text style={styles.bibleVerse}>"But God demonstrates His own love for us in this: While we were still sinners, Christ died for us." (Romans 5:8)</Text>
                        <Text style={styles.bibleVerse}>"Jesus answered, 'I am the way and the truth and the life. No one comes to the Father except through me.'" (John 14:6)</Text>
                    </View>
                )}

                <TouchableOpacity style={styles.sectionHeader} onPress={() => handleToggleTruth(3)}>
                    <Text style={styles.subheader}>TRUTH 4: Our Response {showTruths[3] ? '▲' : '▼'}</Text>
                </TouchableOpacity>
                {showTruths[3] && (
                    <View style={styles.truthContent}>
                        <Text style={styles.text}>We must individually receive Jesus Christ as Savior and Lord; then we can know God personally and experience His love and plan.</Text>
                        <Text style={styles.bibleVerse}>"Yet to all who did receive Him, to those who believed in His name, He gave the right to become children of God." (John 1:12)</Text>
                        <Text style={styles.bibleVerse}>"For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God." (Ephesians 2:8)</Text>
                    </View>
                )}

                {/* Additional Content */}
                <View style={styles.additionalContent}>
                    <Text style={styles.subheader}>Understanding Salvation</Text>
                    <Text style={styles.text}>Salvation is a free gift from God. It cannot be earned by human efforts or good deeds. It is received by faith when we trust in Jesus Christ.</Text>
                    <Text style={styles.bibleVerse}>"He saved us, not because of righteous things we had done, but because of His mercy." (Titus 3:5a)</Text>
                    <Text style={styles.text}>This means turning from our own ways and trusting Jesus to forgive our sins and lead our lives.</Text>
                </View>

                {/* Call to Action */}
                <View style={styles.callToAction}>
                    <Text style={styles.text}>Are you ready to receive Jesus Christ as your Savior and Lord?</Text>
                    <Text style={styles.text}>You can express your faith through prayer. Prayer is talking with God.</Text>
                    <Text style={styles.text}>Here's a suggested prayer:</Text>
                    <Text style={styles.prayer}>"Dear God, I know that I am a sinner and need your forgiveness. I believe that Jesus Christ died for my sins and rose from the dead. I want to turn from my sins. I now invite Jesus Christ to come into my heart and life. I want to trust and follow Him as my Lord and Savior. In Jesus' name, Amen."</Text>
                </View>

                {/* Prayer Confirmation */}
                {!prayerDone && (
                    <TouchableOpacity style={styles.completeButton} onPress={handleCompleteLesson}>
                        <Text style={styles.completeButtonText}>I Prayed This Prayer</Text>
                    </TouchableOpacity>
                )}
                {prayerDone && (
                    <Text style={styles.text}>Congratulations on taking this important step! Continue to grow in your relationship with God.</Text>
                )}

                {/* Proceed to Quiz */}
                <TouchableOpacity style={styles.quizButton} onPress={() => navigation.navigate('QuizEnglish1')}>
                    <Text style={styles.quizButtonText}>Proceed to Quiz</Text>
                </TouchableOpacity>

                {/* Back to Lessons */}
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
    quoteBox: {
        backgroundColor: '#E8F4FA',
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
    },
    quote: {
        fontStyle: 'italic',
        color: '#555',
        textAlign: 'center',
        marginBottom: 5,
        fontSize: 16,
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
    prayer: {
        fontStyle: 'italic',
        color: '#555',
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
    callToAction: {
        backgroundColor: '#FFFDE7',
        padding: 15,
        borderRadius: 10,
        marginVertical: 20,
    },
});

export default Lesson1English;
