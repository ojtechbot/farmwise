import { Button } from '@/components/ui/button';
import { Leaf, Droplets } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <Leaf className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-bold">FarmWise</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/login"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Login
          </Link>
          <Button asChild>
            <Link href="/register">Sign Up</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Grow Your Knowledge, Cultivate Success
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    FarmWise provides practical, easy-to-understand tutorials for farmers, students, and fishers. Start learning today.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link href="/dashboard" prefetch={false}>
                      Start Learning
                    </Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://placehold.co/600x400.png"
                data-ai-hint="farming agriculture"
                width="600"
                height="400"
                alt="Hero"
                className="mx-auto aspect-[3/2] overflow-hidden rounded-xl object-cover sm:w-full"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What We Offer</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform is tailored to the needs of modern agriculture and aquaculture.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:gap-16 mt-12">
              <div className="grid gap-1 text-center">
                <Leaf className="h-8 w-8 mx-auto text-primary" />
                <h3 className="text-lg font-bold">Crop Production</h3>
                <p className="text-sm text-muted-foreground">
                  Learn about soil preparation, pest control, and harvesting methods.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <Droplets className="h-8 w-8 mx-auto text-primary" />
                <h3 className="text-lg font-bold">Fish Farming</h3>
                <p className="text-sm text-muted-foreground">
                  Master the essentials of pond setup, fish care, and sustainable aquaculture.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 mx-auto text-primary"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <h3 className="text-lg font-bold">Assessments</h3>
                <p className="text-sm text-muted-foreground">
                  Test your knowledge with quizzes and track your learning progress.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
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
