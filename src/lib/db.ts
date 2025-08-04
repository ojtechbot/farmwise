
import { doc, setDoc, getDoc, updateDoc, arrayUnion, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import type { ChatMessage } from '@/ai/flows/tutor-flow';
import type { Tutorial, Lesson } from './types';

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
            lessons: lessons as any,
        });
    }
    return tutorials;
};

export const getTutorialBySlug = async (slug: string): Promise<Tutorial | null> => {
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
    const tutorials = await getTutorials();
    for (const tutorial of tutorials) {
        const lesson = tutorial.lessons.find(l => l.slug === slug);
        if (lesson) {
            return { lesson, tutorialSlug: tutorial.slug };
        }
    }
    return { lesson: null, tutorialSlug: null };
}


// Helper function to upload initial data to Firestore.
// You can call this from a script or a secure admin page.
export const uploadInitialData = async () => {
    const { tutorials: initialTutorials } = await import('./data');

    for (const tutorial of initialTutorials) {
        const { lessons, ...tutorialData } = tutorial;
        // Use slug as the document ID for tutorials for easier lookup
        const tutorialRef = doc(db, 'tutorials', tutorialData.slug);
        await setDoc(tutorialRef, tutorialData);

        for (const lesson of lessons) {
             // Use slug as the document ID for lessons for easier lookup
            const lessonRef = doc(db, 'tutorials', tutorialData.slug, 'lessons', lesson.slug);
            await setDoc(lessonRef, lesson);
        }
    }
    console.log('Initial data uploaded successfully!');
}
