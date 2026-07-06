"use client";

import { GoBackButton } from '@/components/shared/go-back-button';

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg-base text-text-primary p-4 font-sans">
      <div className="flex flex-col max-w-md w-full bg-bg-surface border border-border p-6 rounded-none">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-6 bg-status-warning shrink-0" />
          <h1 className="text-xl font-bold tracking-tight">403 - Unauthorized</h1>
        </div>

        <p className="text-sm text-text-secondary mb-6 leading-relaxed">
          You do not have the required permissions to access this page or perform this action.
          Please contact an administrator if you believe this is an error.
        </p>

        <GoBackButton />
      </div>
    </div>
  );
}
