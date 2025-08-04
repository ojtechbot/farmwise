import { Leaf } from 'lucide-react';

export function Preloader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-bounce">
          <Leaf className="h-16 w-16 text-primary" />
        </div>
        <div className="flex items-center gap-2 text-2xl font-semibold">
          <span>FarmWise</span>
        </div>
        <p className="text-muted-foreground">Loading your farm...</p>
      </div>
    </div>
  );
}