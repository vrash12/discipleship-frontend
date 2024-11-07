import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';

const Lesson2English = ({ navigation, route }) => {
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
                <Image source={require('../../../assets/logos/lesson2.jpg')} style={styles.headerImage} />

                <Text style={styles.header}>Lesson 2: LORDSHIP (New Master)</Text>

                {/* Introduction */}
                <Text style={styles.text}>How do I know if I have eternal life?</Text>
                <Text style={styles.text}>In the first lesson, we learned that a person cannot be saved by doing good deeds, being religious, or paying for sins through religious rituals. We are saved by God's grace through faith in Jesus Christ's sacrifice for our sins. Salvation is not because we are good, but because God is good and has provided a way for us to be saved.</Text>

                {/* Learning Nugget Section */}
                <View style={styles.learningNugget}>
                    <Text style={styles.nuggetHeader}>Learning Nugget</Text>
                    <Text style={styles.nuggetText}>The term "Lord" in the original Greek is "kurios" (κύριος), meaning supreme authority or controller. Jesus is the one who calls the shots—He is the Boss, the Master, the One who makes the decisions.</Text>
                </View>

                {/* Interactive Truths Section */}
                <TouchableOpacity style={styles.sectionHeader} onPress={() => handleToggleTruth(0)}>
                    <Text style={styles.subheader}>TRUTH 1: Lordship in Salvation {showTruths[0] ? '▲' : '▼'}</Text>
                </TouchableOpacity>
                {showTruths[0] && (
                    <View style={styles.truthContent}>
                        <Text style={styles.text}>The starting point of salvation is recognizing the Lordship of Jesus Christ. Confessing that Jesus is Lord means submitting to His Lordship in every area of our lives.</Text>
                        <Text style={styles.bibleVerse}>“If you declare with your mouth, 'Jesus is Lord,' and believe in your heart that God raised him from the dead, you will be saved.” (Romans 10:9)</Text>
                    </View>
                )}

                <TouchableOpacity style={styles.sectionHeader} onPress={() => handleToggleTruth(1)}>
                    <Text style={styles.subheader}>TRUTH 2: Lordship Begins in the Heart {showTruths[1] ? '▲' : '▼'}</Text>
                </TouchableOpacity>
                {showTruths[1] && (
                    <View style={styles.truthContent}>
                        <Text style={styles.text}>Submitting to Jesus as Lord is not about following a set of religious rules; it's a matter of the heart.</Text>
                        <Text style={styles.bibleVerse}>“But in your hearts revere Christ as Lord.” (1 Peter 3:15)</Text>
                    </View>
                )}

                <TouchableOpacity style={styles.sectionHeader} onPress={() => handleToggleTruth(2)}>
                    <Text style={styles.subheader}>TRUTH 3: Lordship Calls for Obedience {showTruths[2] ? '▲' : '▼'}</Text>
                </TouchableOpacity>
                {showTruths[2] && (
                    <View style={styles.truthContent}>
                        <Text style={styles.text}>Whoever claims Jesus Christ as their Lord is expected to obey His commands.</Text>
                        <Text style={styles.bibleVerse}>“Why do you call me, 'Lord, Lord,' and do not do what I say?” (Luke 6:46)</Text>
                        <Text style={styles.text}>Obedience or disobedience will manifest in our lifestyle.</Text>
                    </View>
                )}

                <TouchableOpacity style={styles.sectionHeader} onPress={() => handleToggleTruth(3)}>
                    <Text style={styles.subheader}>TRUTH 4: Lordship is a Lifestyle {showTruths[3] ? '▲' : '▼'}</Text>
                </TouchableOpacity>
                {showTruths[3] && (
                    <View style={styles.truthContent}>
                        <Text style={styles.text}>Acknowledging Jesus as Lord is not a one-time decision but a lifelong commitment.</Text>
                        <Text style={styles.bibleVerse}>“So then, just as you received Christ Jesus as Lord, continue to live your lives in him.” (Colossians 2:6)</Text>
                    </View>
                )}

                {/* Additional Content */}
                <View style={styles.additionalContent}>
                    <Text style={styles.subheader}>Understanding the Depth of Lordship</Text>
                    <Text style={styles.text}>Embracing Jesus as Lord means allowing Him to guide and direct every aspect of our lives, including our thoughts, actions, and decisions.</Text>
                    <Text style={styles.bibleVerse}>“Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.” (Proverbs 3:5-6)</Text>
                    <Text style={styles.text}>This involves surrendering our own desires and aligning ourselves with His will, trusting that His plans for us are good.</Text>
                </View>

                {/* Reflection and Application Section */}
                <TouchableOpacity style={styles.questionButton} onPress={handleReflectionToggle}>
                    <Text style={styles.questionButtonText}>{showReflection ? 'Hide Reflection' : 'Reflect on Lordship in Your Life'}</Text>
                </TouchableOpacity>
                {showReflection && (
                    <View style={styles.reflectionBox}>
                        <Text style={styles.text}>Think about your life. Are there areas where you need to acknowledge Jesus' Lordship more fully?</Text>
                        <Text style={styles.text}>Take some time to pray and ask God to reveal any areas where you might be holding back, and ask for His help to surrender those areas to Him.</Text>
                    </View>
                )}

                {/* Biblical Assurance of Eternal Life */}
                <Text style={styles.text}>To understand our relationship with Christ better, let's read about the Good Shepherd:</Text>
                <Text style={styles.bibleVerse}>John 10:11-14, 27-30</Text>
                <Text style={styles.text}>“I am the good shepherd. The good shepherd lays down his life for the sheep…”</Text>
                <Text style={styles.text}>“My sheep listen to my voice; I know them, and they follow me. I give them eternal life, and they shall never perish...”</Text>

                {/* Evidence of a New Life in Christ */}
                <Text style={styles.subheader}>Evidence of a New Life in Christ</Text>
                <Text style={styles.text}>The proof of our new life in Christ can be seen in our changed lives. The Bible gives us several indicators to recognize God's work within us.</Text>
                <Text style={styles.text}>Two evidences of our new life in Christ are obedience and love.</Text>
                <Text style={styles.bibleVerse}>“We know that we have come to know him if we keep his commands.” (1 John 2:3)</Text>
                <Text style={styles.bibleVerse}>“By this everyone will know that you are my disciples, if you love one another.” (John 13:35)</Text>
                
                {/* Call to Action */}
                <View style={styles.callToAction}>
                    <Text style={styles.text}>Are you starting to see a move of God in your life? Take a moment to pray and thank God for the changes He is starting to make.</Text>
                </View>

                {/* Navigation Buttons */}
                <TouchableOpacity style={styles.completeButton} onPress={handleCompleteLesson}>
                    <Text style={styles.completeButtonText}>Complete Lesson</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.quizButton} onPress={() => navigation.navigate('QuizEnglish2')}>
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
    bold: {
        fontWeight: 'bold',
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

export default Lesson2English;
