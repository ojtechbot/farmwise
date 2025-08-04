import { tutorials } from '@/lib/data';
import { notFound } from 'next/navigation';
import { QuizForm } from '@/components/quiz-form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import type { Lesson } from '@/lib/types';

export async function generateStaticParams() {
  const params: { slug: string }[] = [];
  tutorials.forEach(tutorial => {
    tutorial.lessons.forEach(lesson => {
      params.push({ slug: lesson.slug });
    });
  });
  return params;
}

function getLessonBySlug(slug: string): { lesson: Lesson | undefined, tutorialSlug: string | undefined } {
    for (const tutorial of tutorials) {
        const lesson = tutorial.lessons.find(l => l.slug === slug);
        if (lesson) {
            return { lesson, tutorialSlug: tutorial.slug };
        }
    }
    return { lesson: undefined, tutorialSlug: undefined };
}

export default function QuizPage({ params }: { params: { slug:string } }) {
  const { lesson, tutorialSlug } = getLessonBySlug(params.slug);

  if (!lesson || !tutorialSlug) {
    notFound();
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