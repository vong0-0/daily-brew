"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg-base text-text-primary p-4 font-sans">
      <div className="flex flex-col max-w-md w-full bg-bg-surface border border-border p-6 rounded-none">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-6 bg-status-warning shrink-0" />
          <h1 className="text-xl font-bold tracking-tight">404 - Not Found</h1>
        </div>

        <p className="text-sm text-text-secondary mb-6 leading-relaxed">
          The requested resource or page could not be located in the system.
          Please verify the URL or return to the previous page.
        </p>

        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="w-full justify-center bg-bg-surface-hover border-border hover:bg-bg-surface hover:text-text-primary rounded-sm h-8 font-mono text-xs"
        >
          [ GO BACK ]
        </Button>
      </div>
    </div>
  );
}
