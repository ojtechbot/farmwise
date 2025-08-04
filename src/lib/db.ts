'use client';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, collection, query, where, getDocs, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { getFirebaseFirestore } from './firebase';
import type { ChatMessage } from '@/ai/flows/tutor-flow';
import type { Tutorial, Lesson } from './types';

// This function now relies on the consumer to provide the db instance.
// This enforces client-side only usage.

export const saveQuizResult = async (userId: string, lessonSlug: string, score: number, totalQuestions: number) => {
  const db = getFirebaseFirestore();

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
    const db = getFirebaseFirestore();
    const progressRef = doc(db, 'progress', userId);
    const progressDoc = await getDoc(progressRef);
    if (progressDoc.exists()) {
        return progressDoc.data();
    }
    return null;
}

export const getLessonChatHistory = async (userId: string, lessonSlug: string): Promise<ChatMessage[]> => {
    const db = getFirebaseFirestore();
    const chatHistoryRef = doc(db, 'progress', userId, 'chatHistory', lessonSlug);
    const chatHistoryDoc = await getDoc(chatHistoryRef);
    if(chatHistoryDoc.exists()) {
        return chatHistoryDoc.data().messages as ChatMessage[];
    }
    return [];
}

export const saveLessonChatMessage = async (userId: string, lessonSlug: string, message: ChatMessage) => {
    const db = getFirebaseFirestore();
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

export const getTutorialsRealtime = (callback: (tutorials: Tutorial[]) => void): Unsubscribe => {
    const db = getFirebaseFirestore();
    const tutorialsCol = collection(db, 'tutorials');
    
    const unsubscribe = onSnapshot(tutorialsCol, async (tutorialSnapshot) => {
        const tutorials: Tutorial[] = [];
        for (const tutorialDoc of tutorialSnapshot.docs) {
            const tutorialData = tutorialDoc.data() as Omit<Tutorial, 'id' | 'lessons'>;
            
            const lessonsCol = collection(db, 'tutorials', tutorialDoc.id, 'lessons');
            const lessonSnapshot = await getDocs(lessonsCol);
            const lessons = lessonSnapshot.docs.map(lessonDoc => {
                const data = lessonDoc.data();
                return {
                    id: lessonDoc.id,
                    slug: data.slug,
                    title: data.title,
                    content: data.content,
                    videoUrl: data.videoUrl,
                    quiz: data.quiz || [],
                };
            });

            tutorials.push({
                id: tutorialDoc.id,
                slug: tutorialData.slug,
                title: tutorialData.title,
                description: tutorialData.description,
                category: tutorialData.category,
                imageUrl: tutorialData.imageUrl,
                lessons: lessons,
            });
        }
        callback(tutorials);
    });

    return unsubscribe;
};

export const getTutorialBySlug = async (slug: string): Promise<Tutorial | null> => {
    const db = getFirebaseFirestore();

    const q = query(collection(db, "tutorials"), where("slug", "==", slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    }

    const tutorialDoc = querySnapshot.docs[0];
    const tutorialData = tutorialDoc.data() as Omit<Tutorial, 'id' | 'lessons'>;

    const lessonsCol = collection(db, 'tutorials', tutorialDoc.id, 'lessons');
    const lessonSnapshot = await getDocs(lessonsCol);
    const lessons = lessonSnapshot.docs.map(lessonDoc => ({...lessonDoc.data(), id: lessonDoc.id}));

    return {
        ...tutorialData,
        id: tutorialDoc.id,
        lessons: lessons as any,
    };
};

export const getLessonBySlug = async (slug: string): Promise<{ lesson: Lesson | null, tutorialSlug: string | null }> => {
    const db = getFirebaseFirestore();

    const q = query(collection(db, "tutorials"));
    const querySnapshot = await getDocs(q);

    for (const tutorialDoc of querySnapshot.docs) {
        const lessonsCol = collection(db, 'tutorials', tutorialDoc.id, 'lessons');
        const lessonsQuery = query(lessonsCol, where("slug", "==", slug));
        const lessonSnapshot = await getDocs(lessonsQuery);

        if (!lessonSnapshot.empty) {
            const lessonDoc = lessonSnapshot.docs[0];
            const lesson = { id: lessonDoc.id, ...lessonDoc.data() } as Lesson;
            const tutorial = tutorialDoc.data() as Tutorial;
            return { lesson, tutorialSlug: tutorial.slug };
        }
    }

    return { lesson: null, tutorialSlug: null };
}

export const getTutorials = async (): Promise<Tutorial[]> => {
    const db = getFirebaseFirestore();
    const tutorialsCol = collection(db, 'tutorials');
    const tutorialSnapshot = await getDocs(tutorialsCol);
    const tutorials: Tutorial[] = [];
    
    for(const tutorialDoc of tutorialSnapshot.docs) {
        const tutorialData = tutorialDoc.data() as Omit<Tutorial, 'id' | 'lessons'>;
        
        const lessonsCol = collection(db, 'tutorials', tutorialDoc.id, 'lessons');
        const lessonSnapshot = await getDocs(lessonsCol);
        const lessons = lessonSnapshot.docs.map(lessonDoc => {
            const data = lessonDoc.data();
            return {
                id: lessonDoc.id,
                slug: data.slug,
                title: data.title,
                content: data.content,
                videoUrl: data.videoUrl,
                quiz: data.quiz || [],
            };
        });

        tutorials.push({
            id: tutorialDoc.id,
            slug: tutorialData.slug,
            title: tutorialData.title,
            description: tutorialData.description,
            category: tutorialData.category,
            imageUrl: tutorialData.imageUrl,
            lessons: lessons,
        });
    }
    return tutorials;
};
