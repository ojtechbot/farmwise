
'use client';

import { Leaf } from 'lucide-react';

export function Preloader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-primary">
      <div className="relative flex items-center justify-center mb-4">
        <div className="absolute w-24 h-24 bg-primary/10 rounded-full animate-ping"></div>
        <Leaf className="w-16 h-16 animate-pulse" />
      </div>
      <h1 className="text-2xl font-bold tracking-wider animate-pulse">FarmWise</h1>
      <p className="text-sm text-muted-foreground mt-2">Cultivating knowledge...</p>
    </div>
  );
}
