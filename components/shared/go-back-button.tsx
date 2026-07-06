"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function GoBackButton() {
  const router = useRouter();

  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleGoBack}
      className="w-full justify-center bg-bg-surface-hover border-border hover:bg-bg-surface hover:text-text-primary rounded-sm h-8 font-mono text-xs"
    >
      [ GO BACK ]
    </Button>
  );
}
