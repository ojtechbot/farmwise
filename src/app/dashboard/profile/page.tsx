'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { updateUser as updateUserAction } from '@/lib/actions';
import { Loader2, Sparkles, Upload } from 'lucide-react';
import type { User } from '@/lib/types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { generateAvatar } from '@/ai/flows/generate-avatar-flow';

export default function ProfilePage() {
  const { user, updateUser, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAvatar, setGeneratedAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setPhotoURL(user.photoURL || null);
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoURL(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateAvatar = async () => {
      if (!aiPrompt.trim()) {
        toast({ variant: 'destructive', title: 'Prompt is empty', description: 'Please enter a prompt to generate an avatar.' });
        return;
      }
      setIsGenerating(true);
      setGeneratedAvatar(null);
      try {
        const result = await generateAvatar({ prompt: aiPrompt });
        setGeneratedAvatar(result.photoDataUri);
      } catch (error) {
        console.error('AI Avatar generation failed:', error);
        toast({ variant: 'destructive', title: 'Generation Failed', description: 'Could not generate avatar. Please try again.' });
      } finally {
        setIsGenerating(false);
      }
  };

  const handleUseGeneratedAvatar = () => {
    if(generatedAvatar) {
        setPhotoURL(generatedAvatar);
    }
    setIsAiDialogOpen(false);
    setAiPrompt('');
    setGeneratedAvatar(null);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    const updatedUserData = { 
        ...user, 
        firstName, 
        lastName, 
        displayName: `${firstName} ${lastName}`.trim(),
        photoURL: photoURL || user.photoURL,
    };
    
    const result = await updateUserAction(updatedUserData as User);
    
    if (result.success && result.user) {
      updateUser(result.user);
      toast({
        title: 'Profile Updated',
        description: 'Your information has been successfully updated.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: result.message || 'An unexpected error occurred.',
      });
    }
    setIsLoading(false);
  };

  if (authLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }
  
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Your Profile</h1>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details and profile picture here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={photoURL || undefined} alt={user.displayName || 'User'} />
                <AvatarFallback className="text-3xl">
                  {user.displayName?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2">
                 <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                   <Upload className="mr-2 h-4 w-4" /> Upload Picture
                 </Button>
                 <Input 
                   type="file" 
                   ref={fileInputRef} 
                   className="hidden" 
                   onChange={handleFileChange}
                   accept="image/png, image/jpeg"
                 />
                <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
                  <DialogTrigger asChild>
                     <Button type="button" variant="outline">
                        <Sparkles className="mr-2 h-4 w-4" /> AI Generate
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Generate Avatar with AI</DialogTitle>
                      <DialogDescription>
                        Describe the avatar you want to create.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input 
                            placeholder="e.g., A happy robot farmer"
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                        />
                        {isGenerating && (
                            <div className="flex justify-center items-center h-48 bg-muted rounded-md">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        )}
                        {generatedAvatar && (
                            <img src={generatedAvatar} alt="Generated Avatar" className="w-48 h-48 mx-auto rounded-md object-cover" />
                        )}
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAiDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleGenerateAvatar} disabled={isGenerating}>
                        {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Generate
                      </Button>
                       <Button onClick={handleUseGeneratedAvatar} disabled={!generatedAvatar}>
                        Use this Avatar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={user.email || ''}
                disabled
                className="bg-muted/50"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
