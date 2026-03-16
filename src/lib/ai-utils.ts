import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp, collection, addDoc } from 'firebase/firestore';

export interface AISessionData {
    userId: string;
    goal: string;
    difficulty: string;
    topic: string;
    duration: number; // in seconds
    messageCount: number;
    fluency: number;
    grammar: number;
    vocabulary: number;
    confidence: number;
    suggestions: string[];
}

export const saveAISession = async (data: AISessionData) => {
    try {
        const userRef = doc(db, 'users', data.userId);
        const aiSessionsRef = collection(db, 'users', data.userId, 'ai_sessions');

        // 1. Save session details
        await addDoc(aiSessionsRef, {
            ...data,
            timestamp: serverTimestamp()
        });

        // 2. Update user aggregates
        await updateDoc(userRef, {
            'stats.aiSessions': increment(1),
            'stats.speakingMinutes': increment(Math.floor(data.duration / 60)),
            'stats.lastPracticeDate': serverTimestamp(),
            // Streak logic could be added here
        });

        console.log('AI session saved successfully');
    } catch (error) {
        console.error('Error saving AI session:', error);
    }
};

export const calculateFeedback = (messages: any[], duration: number): any => {
    // This is a simplified logic. In a production app, 
    // you might send the transcript back to the LLM for evaluation.
    const userMessages = messages.filter(m => m.role === 'user');
    const wordCount = userMessages.reduce((sum, m) => sum + m.text.split(' ').length, 0);
    const avgWordsPerMessage = userMessages.length > 0 ? wordCount / userMessages.length : 0;

    // Dummy scores based on activity
    const fluency = Math.min(6.0 + (avgWordsPerMessage / 10) * 3, 9.5);
    const grammar = Math.min(6.5 + (userMessages.length / 20) * 2, 9.0);
    const vocabulary = Math.min(6.0 + (wordCount / 200) * 3, 9.5);
    const confidence = Math.min(7.0 + (duration / 300) * 2.5, 9.5);

    const allSuggestions = [
        "Try using longer sentences during the conversation.",
        "Avoid repeating the same vocabulary too often.",
        "Good flow! Your response speed is improving.",
        "Practice using more formal language in business scenarios.",
        "Try to use more transitional words like 'However' or 'Therefore'.",
        "Clear pronunciation! Keep it up."
    ];

    // Pick 3 random suggestions
    const suggestions = [...allSuggestions]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

    return { fluency, grammar, vocabulary, confidence, suggestions };
};
