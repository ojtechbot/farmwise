'use client';
import { Button } from '@/components/ui/button';
import { Leaf, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { TutorialCard } from '@/components/tutorial-card';
import { useEffect, useState } from 'react';
import { getTutorials } from '@/lib/actions';
import type { Tutorial } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

export default function Home() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const fetchedTutorials = await getTutorials();
        setTutorials(fetchedTutorials);
      } catch (error) {
        console.error("Failed to fetch tutorials", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTutorials();
  }, []);


  return (
    <div className="flex flex-col min-h-screen bg-secondary/40">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
          <Leaf className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-bold">FarmWise</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link
            href="/login"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Login
          </Link>
          <Button asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40 bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Grow Your Knowledge, Cultivate Success
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    FarmWise provides practical, hands-on tutorials for farmers, students, and enthusiasts. Start your learning journey today.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Expert-led video and text lessons.</span>
                    </li>
                     <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Interactive quizzes to test your knowledge.</span>
                    </li>
                     <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Learn at your own pace, anytime.</span>
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link href="/dashboard" prefetch={false}>
                      Start Learning Now
                    </Link>
                  </Button>
                </div>
              </div>
              <Image
                src="data:image/jpeg;base64,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"
                data-ai-hint="farming agriculture"
                width="600"
                height="400"
                alt="A beautiful and modern farm"
                className="mx-auto aspect-[3/2] overflow-hidden rounded-xl object-cover sm:w-full"
              />
            </div>
          </div>
        </section>
        
        <section id="courses" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm font-medium">Our Courses</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Explore Our Learning Modules</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform is tailored to the needs of modern agriculture and aquaculture. Jump into a lesson and start your journey.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:gap-16 mt-12">
              {loading ? (
                 Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex flex-col gap-4">
                    <Skeleton className="h-48 w-full rounded-xl" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))
              ) : tutorials.length > 0 ? (
                tutorials.map((tutorial) => (
                  <TutorialCard key={tutorial.id} tutorial={tutorial} />
                ))
              ) : (
                 <div className="col-span-full text-center text-muted-foreground bg-card p-8 rounded-lg">
                    <p>No courses available at the moment. Please check back later.</p>
                 </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-background">
        <p className="text-xs text-muted-foreground">&copy; 2024 FarmWise. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
