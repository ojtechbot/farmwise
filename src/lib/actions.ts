'use server';

import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';
import type { Tutorial, User } from './types';

const usersFilePath = path.join(process.cwd(), 'src', 'lib', 'users.json');
const tutorialsFilePath = path.join(process.cwd(), 'src', 'lib', 'tutorials.json');

async function readUsers(): Promise<User[]> {
  try {
    await fs.access(usersFilePath);
    const data = await fs.readFile(usersFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist or other errors occur, return an empty array
    return [];
  }
}

async function writeUsers(users: User[]): Promise<void> {
  await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await readUsers();
  return users.find((user) => user.email === email) || null;
}

const CreateUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export async function createUser(data: unknown) {
  const validation = CreateUserSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: validation.error.errors.map(e => e.message).join(', ') };
  }

  const { firstName, lastName, email, password } = validation.data;
  
  const users = await readUsers();
  if (users.find(user => user.email === email)) {
    return { success: false, message: 'User with this email already exists.' };
  }

  const newUser: User = {
    id: String(Date.now()),
    firstName,
    lastName,
    displayName: `${firstName} ${lastName}`,
    email,
    password, // In a real app, hash and salt this password!
    photoURL: `https://i.pravatar.cc/150?u=${email}`,
    progress: { quizzes: [] },
  };

  users.push(newUser);
  await writeUsers(users);

  const { password: _, ...userWithoutPassword } = newUser;
  return { success: true, user: userWithoutPassword };
}


export async function authenticateUser(email: string, password: string): Promise<{ success: boolean, message?: string, user?: Omit<User, 'password'> }> {
    const users = await readUsers();
    const user = users.find((user) => user.email === email);

    if (!user || user.password !== password) { // In a real app, compare hashed passwords
        return { success: false, message: 'Invalid email or password.' };
    }

    const { password: _, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
}

async function readTutorials(): Promise<Tutorial[]> {
  try {
    await fs.access(tutorialsFilePath);
    const data = await fs.readFile(tutorialsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
     // If the file doesn't exist or other errors occur, return an empty array
    return [];
  }
}

export async function getTutorials(): Promise<Tutorial[]> {
  const tutorials = await readTutorials();
  return tutorials;
}

export async function getTutorialBySlug(slug: string): Promise<Tutorial | null> {
    const tutorials = await readTutorials();
    return tutorials.find(t => t.slug === slug) || null;
}

export async function getLessonBySlug(slug: string): Promise<{ lesson: any | null, tutorialSlug: string | null }> {
    const tutorials = await readTutorials();
    for (const tutorial of tutorials) {
        const lesson = tutorial.lessons.find(l => l.slug === slug);
        if (lesson) {
            return { lesson, tutorialSlug: tutorial.slug };
        }
    }
    return { lesson: null, tutorialSlug: null };
}

export async function getUserProgress(userId: string) {
    const users = await readUsers();
    const user = users.find(u => u.id === userId);
    return user?.progress || { quizzes: [] };
}

export async function saveQuizResult(userId: string, lessonSlug: string, score: number, totalQuestions: number) {
    const users = await readUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        throw new Error('User not found');
    }

    const newQuizData = {
        lessonSlug,
        score,
        totalQuestions,
        completedAt: new Date().toISOString(),
    };

    const existingQuizzes = users[userIndex].progress.quizzes || [];
    const existingQuizIndex = existingQuizzes.findIndex((q: any) => q.lessonSlug === lessonSlug);

    if (existingQuizIndex > -1) {
        users[userIndex].progress.quizzes[existingQuizIndex] = newQuizData;
    } else {
        users[userIndex].progress.quizzes.push(newQuizData);
    }
    
    await writeUsers(users);
    return { success: true };
}
