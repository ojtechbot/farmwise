import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Tutorial } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

interface TutorialCardProps {
  tutorial: Tutorial;
}

export function TutorialCard({ tutorial }: TutorialCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-xl shadow-md rounded-xl">
      <CardHeader className="p-0">
        <Image
          src={tutorial.imageUrl}
          data-ai-hint={`${tutorial.category.toLowerCase().replace(' ', '')}`}
          alt={tutorial.title}
          width={600}
          height={400}
          className="object-cover w-full h-48"
        />
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <Badge variant="secondary" className="mb-2">{tutorial.category}</Badge>
        <CardTitle className="mb-2 text-xl tracking-tight">{tutorial.title}</CardTitle>
        <CardDescription>{tutorial.description}</CardDescription>
      </CardContent>
      <CardFooter className="p-6 pt-0 bg-secondary/20">
        <Button asChild className="w-full">
          <Link href={`/learn/${tutorial.slug}`}>
            Start Learning <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
