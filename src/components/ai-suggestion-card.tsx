'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wand2, Loader2, Bot, Sparkles } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { getTutorials } from '@/lib/db';
import type { Tutorial } from '@/lib/types';


export function AiSuggestionCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SuggestLearningModulesOutput | null>(null);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const fetchedTutorials = await getTutorials();
        setTutorials(fetchedTutorials);
      } catch (error) {
        console.error("Failed to fetch tutorials for AI suggestion", error);
      }
    };
    fetchTutorials();
  }, []);

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
      <Card className="shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-primary/20 via-primary/5 to-transparent">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">AI Recommendations</CardTitle>
          <Wand2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-4">
            Get personalized lesson suggestions from our AI assistant.
          </p>
          <Button onClick={handleGetSuggestion} disabled={isLoading || tutorials.length === 0} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Thinking...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Suggest Next Lesson
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isResultOpen} onOpenChange={setIsResultOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="text-primary"/>
              Your Personalised Learning Path
            </DialogTitle>
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
                  <p className="font-semibold">{result.suggestedModules}</p>
                </AlertDescription>
              </Alert>
               <Alert variant="default" className="bg-secondary/50">
                 <AlertTitle>Reasoning</AlertTitle>
                <AlertDescription>
                 <p>{result.reasoning}</p>
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
