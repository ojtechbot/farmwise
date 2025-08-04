import { Leaf } from 'lucide-react';

export function Preloader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-6 w-full max-w-xs px-4">
        <div className="relative flex items-center justify-center">
            <div className="absolute h-24 w-24 animate-ping rounded-full bg-primary/30"></div>
            <div className="relative flex items-center justify-center rounded-full bg-primary/20 h-20 w-20">
                <Leaf className="h-10 w-10 text-primary" />
            </div>
        </div>
        <div className="flex items-center gap-2 text-3xl font-semibold">
          <span>FarmWise</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-indeterminate-progress"></div>
        </div>
        <p className="text-muted-foreground text-sm">Cultivating your learning experience...</p>
      </div>
      <style jsx>{`
        @keyframes indeterminate-progress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(250%);
          }
        }
        .animate-indeterminate-progress {
          animation: indeterminate-progress 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
