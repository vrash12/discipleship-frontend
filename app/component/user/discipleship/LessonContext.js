import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LessonContext = createContext();

export const LessonProvider = ({ children }) => {
    const [completedLessons, setCompletedLessons] = useState({});

    useEffect(() => {
        // Load completion state from AsyncStorage
        const loadCompletionStatus = async () => {
            try {
                const storedCompletionStatus = await AsyncStorage.getItem('completionStatus');
                if (storedCompletionStatus) {
                    setCompletedLessons(JSON.parse(storedCompletionStatus));
                }
            } catch (error) {
                console.error("Failed to load lesson completion status:", error);
            }
        };
        loadCompletionStatus();
    }, []);

    const completeLesson = async (lessonId) => {
        const updatedCompletionStatus = { ...completedLessons, [lessonId]: true };
        setCompletedLessons(updatedCompletionStatus);

        // Save the updated completion status to AsyncStorage
        try {
            await AsyncStorage.setItem('completionStatus', JSON.stringify(updatedCompletionStatus));
        } catch (error) {
            console.error("Failed to save lesson completion status:", error);
        }
    };

    return (
        <LessonContext.Provider value={{ completedLessons, completeLesson }}>
            {children}
        </LessonContext.Provider>
    );
};

export default LessonContext;
