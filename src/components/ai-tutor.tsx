
'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import type { Lesson } from '@/lib/types';
import type { ChatMessage } from '@/ai/flows/tutor-flow';
import { tutor } from '@/ai/flows/tutor-flow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Loader2, SendHorizonal, User, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';
import { getUserProgress, getLessonChatHistory, saveLessonChatMessage } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface AiTutorProps {
  lesson: Lesson;
}

export function AiTutor({ lesson }: AiTutorProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadHistory = async () => {
      if (!user) return;
      setIsHistoryLoading(true);
      try {
        const history = await getLessonChatHistory(user.uid, lesson.slug);
        setMessages(history);
      } catch (error) {
        console.error('Failed to load chat history:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load chat history.',
        });
      } finally {
        setIsHistoryLoading(false);
      }
    };
    loadHistory();
  }, [user, lesson.slug, toast]);


  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      await saveLessonChatMessage(user.uid, lesson.slug, userMessage);
      
      const progress = await getUserProgress(user.uid);
      const progressSummary = progress?.quizzes ? 
        `Completed quizzes for: ${progress.quizzes.map((q: any) => q.lessonSlug).join(', ')}` 
        : 'No quizzes completed yet.';

      const response = await tutor({
        lessonTitle: lesson.title,
        lessonContent: lesson.content,
        userProfile: {
          displayName: user.displayName || 'student',
          interests: 'farming', 
        },
        learningProgress: progressSummary,
        chatHistory: newMessages.slice(0, -1),
        userMessage: input,
      });

      const modelMessage: ChatMessage = { role: 'model', content: response.tutorResponse };
      setMessages(prev => [...prev, modelMessage]);
      await saveLessonChatMessage(user.uid, lesson.slug, modelMessage);

    } catch (error) {
      console.error('Tutor API call failed:', error);
      const errorMessage: ChatMessage = { role: 'model', content: 'Sorry, I ran into an error. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
      toast({
        variant: 'destructive',
        title: 'AI Tutor Error',
        description: 'There was a problem communicating with the AI. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-primary" />
          <div>
            <CardTitle>AI Tutor</CardTitle>
            <CardDescription>Ask questions about this lesson.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80 w-full pr-4" ref={scrollAreaRef}>
          {isHistoryLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-start gap-3',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'model' && (
                    <Avatar className="h-8 w-8 border">
                      <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-xs rounded-lg p-3 text-sm',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    <p>{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                     <Avatar className="h-8 w-8 border">
                      <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
               {isLoading && (
                <div className="flex items-start gap-3 justify-start">
                    <Avatar className="h-8 w-8 border">
                      <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-3">
                        <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question here..."
            disabled={isLoading || isHistoryLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || isHistoryLoading || !input.trim()}>
            <SendHorizonal className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
