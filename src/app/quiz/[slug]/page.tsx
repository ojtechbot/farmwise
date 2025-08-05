
'use client';

import { useEffect, useState } from 'react';
import { getLessonBySlug } from '@/lib/actions';
import { notFound, useParams } from 'next/navigation';
import { QuizForm } from '@/components/quiz-form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import type { Lesson } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function QuizPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [tutorialSlug, setTutorialSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchLesson = async () => {
      setLoading(true);
      try {
        const result = await getLessonBySlug(slug);
        if (result.lesson && result.tutorialSlug) {
          setLesson(result.lesson);
          setTutorialSlug(result.tutorialSlug);
        } else {
          setLesson(null);
          setTutorialSlug(null);
        }
      } catch (error) {
        console.error("Failed to fetch lesson", error);
        setLesson(null);
        setTutorialSlug(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-8">
        <Skeleton className="h-8 w-1/4" />
        <div className="text-center">
            <Skeleton className="h-10 w-3/4 mx-auto" />
            <Skeleton className="h-6 w-1/2 mx-auto mt-2" />
        </div>
        <div className="space-y-8">
            <Card>
                <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
             <Card>
                <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        </div>

      </div>
    )
  }

  if (!lesson || !tutorialSlug) {
    notFound();
    return null;
  }
  
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link href={`/learn/${tutorialSlug}`}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Lesson
          </Link>
        </Button>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Quiz: {lesson.title}</h1>
        <p className="text-lg text-muted-foreground mt-2">
            Test your knowledge from the lesson. Good luck!
        </p>
      </div>
      
      <QuizForm questions={lesson.quiz} tutorialSlug={tutorialSlug} lessonSlug={lesson.slug} />
    </div>
  );
}
