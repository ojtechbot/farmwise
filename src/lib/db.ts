import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from './firebase';

export const saveQuizResult = async (userId: string, lessonSlug: string, score: number, totalQuestions: number) => {
  const progressRef = doc(db, 'progress', userId);
  const progressDoc = await getDoc(progressRef);

  if (progressDoc.exists()) {
    await updateDoc(progressRef, {
      quizzes: arrayUnion({
        lessonSlug,
        score,
        totalQuestions,
        completedAt: new Date(),
      }),
    });
  } else {
    await setDoc(progressRef, {
      userId,
      quizzes: [
        {
          lessonSlug,
          score,
          totalQuestions,
          completedAt: new Date(),
        },
      ],
    });
  }
};

export const getUserProgress = async (userId: string) => {
    const progressRef = doc(db, 'progress', userId);
    const progressDoc = await getDoc(progressRef);
    if (progressDoc.exists