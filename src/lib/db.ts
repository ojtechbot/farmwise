import { doc, setDoc, getDoc, updateDoc, arrayUnion, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import type { ChatMessage } from '@/ai/flows/tutor-flow';

export const saveQuizResult = async (userId: string, lessonSlug: string, score: number, totalQuestions: number) => {
  const progressRef = doc(db, 'progress', userId);
  const progressDoc = await getDoc(progressRef);

  const newQuizData = {
    lessonSlug,
    score,
    totalQuestions,
    completedAt: new Date(),
  };

  if (progressDoc.exists()) {
    const existingQuizzes = progressDoc.data().quizzes || [];
    const existingQuizIndex = existingQuizzes.findIndex((q: any) => q.lessonSlug === lessonSlug);
    
    if (existingQuizIndex > -1) {
      // If a quiz for this lesson already exists, update it.
      // This prevents creating duplicate entries if the user retakes a quiz.
      const updatedQuizzes = [...existingQuizzes];
      updatedQuizzes[existingQuizIndex] = newQuizData;
       await updateDoc(progressRef, {
        quizzes: updatedQuizzes
      });
    } else {
       await updateDoc(progressRef, {
        quizzes: arrayUnion(newQuizData),
      });
    }

  } else {
    await setDoc(progressRef, {
      userId,
      quizzes: [newQuizData],
    });
  }
};

export const getUserProgress = async (userId: string) => {
    const progressRef = doc(db, 'progress', userId);
    const progressDoc = await getDoc(progressRef);
    if (progressDoc.exists()) {
        return progressDoc.data();
    }
    return null;
}

export const getLessonChatHistory = async (userId: string, lessonSlug: string): Promise<ChatMessage[]> => {
    const chatHistoryRef = doc(db, 'progress', userId, 'chatHistory', lessonSlug);
    const chatHistoryDoc = await getDoc(chatHistoryRef);
    if(chatHistoryDoc.exists()) {
        return chatHistoryDoc.data().messages as ChatMessage[];
    }
    return [];
}

export const saveLessonChatMessage = async (userId: string, lessonSlug: string, message: ChatMessage) => {
    const chatHistoryRef = doc(db, 'progress', userId, 'chatHistory', lessonSlug);
    const chatHistoryDoc = await getDoc(chatHistoryRef);

    if (chatHistoryDoc.exists()) {
        await updateDoc(chatHistoryRef, {
            messages: arrayUnion(message)
        });
    } else {
        await setDoc(chatHistoryRef, {
            messages: [message]
        });
    }
}
