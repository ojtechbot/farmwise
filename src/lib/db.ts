
import { doc, setDoc, getDoc, updateDoc, arrayUnion, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import type { ChatMessage } from '@/ai/flows/tutor-flow';
import type { Tutorial, Lesson } from './types';

// Each function now checks if 'db' is initialized before proceeding.
// This is an extra safeguard to prevent server-side execution.

export const saveQuizResult = async (userId: string, lessonSlug: string, score: number, totalQuestions: number) => {
  if (!db) {
    console.warn("Firestore is not initialized. Skipping saveQuizResult.");
    return;
  }
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
    if (!db) return null;
    const progressRef = doc(db, 'progress', userId);
    const progressDoc = await getDoc(progressRef);
    if (progressDoc.exists()) {
        return progressDoc.data();
    }
    return null;
}

export const getLessonChatHistory = async (userId: string, lessonSlug: string): Promise<ChatMessage[]> => {
    if (!db) return [];
    const chatHistoryRef = doc(db, 'progress', userId, 'chatHistory', lessonSlug);
    const chatHistoryDoc = await getDoc(chatHistoryRef);
    if(chatHistoryDoc.exists()) {
        return chatHistoryDoc.data().messages as ChatMessage[];
    }
    return [];
}

export const saveLessonChatMessage = async (userId: string, lessonSlug: string, message: ChatMessage) => {
    if (!db) return;
    const chatHistoryRef = doc(db, 'progress', userId, 'chatHistory', lessonSlug);
    const chatHistoryDoc = await getDoc(chatHistoryDoc);

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

export const getTutorials = async (): Promise<Tutorial[]> => {
    if (!db) return [];
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

export const getTutorialBySlug = async (slug: string): Promise<Tutorial | null> => {
    if (!db) return null;
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
    if (!db) return { lesson: null, tutorialSlug: null };
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
