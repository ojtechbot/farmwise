'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { QuizQuestion } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { saveQuizResult } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';


interface QuizFormProps {
  questions: QuizQuestion[];
  tutorialSlug: string;
  lessonSlug: string;
}

export function QuizForm({ questions, tutorialSlug, lessonSlug }: QuizFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const schemaObject = questions.reduce((acc, question, index) => {
    acc[`question_${index}`] = z.string({
      required_error: 'Please select an answer.',
    });
    return acc;
  }, {} as Record<string, z.ZodString>);

  const formSchema = z.object(schemaObject);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    let currentScore = 0;
    const answeredQuestions = { ...data };
    questions.forEach((q, index) => {
      if (data[`question_${index}`] === q.correctAnswer) {
        currentScore++;
      }
    });
    setScore(currentScore);
    setUserAnswers(answeredQuestions);
    
    if(user) {
        try {
            await saveQuizResult(user.id, lessonSlug, currentScore, questions.length);
             toast({
                title: "Progress Saved!",
                description: "Your quiz result has been saved successfully.",
            });
        } catch(error) {
             toast({
                variant: "destructive",
                title: "Error saving progress",
                description: "Could not save your quiz result. Please try again.",
            });
        }
    }

    setSubmitted(true);
    setIsSubmitting(false);
  }

  const getLabelClass = (questionIndex: number, option: string) => {
    if (!submitted) return '';
    const question = questions[questionIndex];
    const userAnswer = userAnswers[`question_${questionIndex}`];
    
    if (option === question.correctAnswer) {
      return 'bg-green-100 dark:bg-green-900/30 border-green-400 text-green-800 dark:text-green-300';
    }
    if (option === userAnswer && option !== question.correctAnswer) {
      return 'bg-red-100 dark:bg-red-900/30 border-red-400 text-red-800 dark:text-red-300';
    }
    return '';
  };


  return (
    <FormProvider {...form}>
      {!submitted ? (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {questions.map((q, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{index + 1}. {q.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name={`question_${index}`}
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2"
                          disabled={submitted || isSubmitting}
                        >
                          {q.options.map((option, optionIndex) => (
                            <FormItem
                              key={optionIndex}
                              className={cn("flex items-center space-x-3 space-y-0 p-4 rounded-lg border transition-colors", getLabelClass(index, option))}
                            >
                              <FormControl>
                                <RadioGroupItem value={option} id={`${index}-${optionIndex}`} />
                              </FormControl>
                              <FormLabel htmlFor={`${index}-${optionIndex}`} className="font-normal cursor-pointer w-full">
                                {option}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          ))}
          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
             {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Answers
          </Button>
        </form>
      ) : (
        <Card className="text-center">
            <CardHeader>
                <CardTitle className="text-3xl">Quiz Completed!</CardTitle>
                <CardDescription>Here's how you did.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-primary/10">
                    <span className="text-4xl font-bold text-primary">{score}/{questions.length}</span>
                </div>
                 <div className="space-y-4">
                    {questions.map((q, index) => (
                        <div key={index} className="text-left p-4 rounded-lg border bg-secondary/50">
                            <p className="font-semibold">{index + 1}. {q.question}</p>
                            <div className="mt-2 flex items-center">
                                {userAnswers[`question_${index}`] === q.correctAnswer ? 
                                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" /> :
                                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                                }
                                <p className={userAnswers[`question_${index}`] === q.correctAnswer ? 'text-green-600' : 'text-red-600'}>
                                  Your answer: {userAnswers[`question_${index}`]}
                                </p>
                            </div>
                             {userAnswers[`question_${index}`] !== q.correctAnswer && (
                                <div className="mt-1 flex items-center text-sm text-green-600">
                                  Correct answer: {q.correctAnswer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex-col sm:flex-row gap-4">
                <Button variant="outline" onClick={() => {
                    setSubmitted(false);
                    setScore(0);
                    setUserAnswers({});
                    form.reset();
                }} className="w-full sm:w-auto">
                    Try Again
                </Button>
                <Button asChild className="w-full sm:w-auto">
                    <Link href={`/learn/${tutorialSlug}`}>
                        Back to Lesson <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
      )}
    </FormProvider>
  );
}
