'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wand2, Loader2, Bot } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { suggestLearningModules } from '@/ai/flows/suggest-learning-modules';
import type { SuggestLearningModulesOutput } from '@/ai/flows/suggest-learning-modules';
import { tutorials } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

export function AiSuggestionCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SuggestLearningModulesOutput | null>(null);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const { toast } = useToast();

  const handleGetSuggestion = async () => {
    setIsLoading(true);
    setResult(null);

    const userProfile = 'A beginner farmer in a tropical climate interested in sustainable crop production.';
    const learningProgress = "Completed 'Introduction to Soil Health'.";
    const availableModules = tutorials.map(t => t.title).join(', ');

    try {
      const suggestion = await suggestLearningModules({
        userProfile,
        learningProgress,
        availableModules,
      });
      setResult(suggestion);
      setIsResultOpen(true);
    } catch (error) {
      console.error('AI suggestion failed:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with the AI suggestion. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Card className="bg-primary/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-4">
             <div className="bg-primary/20 p-3 rounded-full">
                <Wand2 className="h-6 w-6 text-primary" />
             </div>
            <div>
                <CardTitle>AI Recommended Lessons</CardTitle>
                <CardDescription>Get personalized lesson suggestions from our AI assistant.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGetSuggestion} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting Suggestion...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Suggest My Next Lesson
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isResultOpen} onOpenChange={setIsResultOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Your Personalised Learning Path</DialogTitle>
            <DialogDescription>
              Here are the modules our AI assistant recommends for you next.
            </DialogDescription>
          </DialogHeader>
          {result && (
            <div className="grid gap-4 py-4">
               <Alert>
                 <Bot className="h-4 w-4" />
                <AlertTitle>Suggested Modules</AlertTitle>
                <AlertDescription>
                  {result.suggestedModules}
                </AlertDescription>
              </Alert>
               <Alert variant="default">
                 <AlertTitle>Reasoning</AlertTitle>
                <AlertDescription>
                 {result.reasoning}
                </AlertDescription>
              </Alert>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsResultOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
