import { tutorials } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, BookOpen, Video, ListChecks } from 'lucide-react';
import Link from 'next/link';
import { AiTutor } from '@/components/ai-tutor';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Sparkles } from 'lucide-react';


export async function generateStaticParams() {
  const params: { slug: string }[] = [];
  tutorials.forEach(tutorial => {
      params.push({ slug: tutorial.slug });
  });
  return params;
}

function getTutorialBySlug(slug: string) {
  return tutorials.find((tutorial) => tutorial.slug === slug);
}


export default function LearnPage({ params }: { params: { slug: string } }) {
  const tutorial = getTutorialBySlug(params.slug);

  if (!tutorial) {
    notFound();
  }

  // For this example, we'll display the first lesson.
  // A more complex app would have routing for each lesson, e.g., /learn/[slug]/[lesson-slug]
  const lesson = tutorial.lessons[0];
  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <p className="text-2xl font-semibold">No lessons available for this tutorial yet.</p>
        <p className="text-muted-foreground mt-2">Please check back later.</p>
         <Button asChild className="mt-4">
          <Link href="/dashboard">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
       <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link href="/dashboard">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to All Tutorials
          </Link>
        </Button>
      </div>

      <h1 className="text-4xl font-bold mb-2">{lesson.title}</h1>
      <p className="text-lg text-muted-foreground mb-8">
        From the module: <span className="font-semibold text-primary">{tutorial.title}</span>
      </p>
      
      {lesson.videoUrl && (
        <Card className="mb-8 overflow-hidden">
            <div className="aspect-video">
                <iframe 
                    width="100%" 
                    height="100%" 
                    src={lesson.videoUrl} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                ></iframe>
            </div>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              <CardTitle>Video Guide</CardTitle>
            </div>
          </CardHeader>
        </Card>
      )}

      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle>Lesson Guide</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none text-base">
            <p>{lesson.content}</p>
          </div>
        </CardContent>
      </Card>

      <div className="mb-8">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <div className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-primary" />
                Need help? Talk to the AI Tutor
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <AiTutor lesson={lesson} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      
      <Card className="bg-primary/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-primary" />
            <CardTitle>Check Your Understanding</CardTitle>
          </div>
          <CardDescription>
            Ready to test your knowledge? Take a short quiz to see what you've learned.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button size="lg" className="w-full" asChild>
            <Link href={`/quiz/${lesson.slug}`}>
              Take the Quiz <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

    </div>
  );
}
