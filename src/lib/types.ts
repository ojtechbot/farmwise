export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  content: string;
  videoUrl?: string;
  quiz: QuizQuestion[];
}

export interface Tutorial {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: 'Crop Production' | 'Fish Farming' | 'Pest Control' | 'General';
  imageUrl: string;
  lessons: Lesson[];
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    displayName: string;
    email: string;
    password?: string; // Should be hashed in a real app
    photoURL?: string;
    progress: {
        quizzes: {
            lessonSlug: string;
            score: number;
            totalQuestions: number;
            completedAt: string;
        }[];
    };
}
