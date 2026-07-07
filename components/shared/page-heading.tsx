"use client";

import type { ReactNode } from "react";

import { SidebarTrigger } from "./sidebar-trigger"
import { cn } from "@/lib/utils";

type PageHeadingProps = {
  title: string;
  className?: string;
  children?: ReactNode;
};

export function PageHeading({ title, className, children }: PageHeadingProps) {
  return (
    <header
      className={cn(
        "flex h-14 items-center gap-3 border-b border-border bg-bg-base px-4",
        className
      )}
    >
      <SidebarTrigger />
      <h1 className="min-w-0 truncate text-sm font-semibold tracking-wide text-text-primary sm:text-base">
        {title}
      </h1>
      {children ? <div className="ml-auto flex items-center gap-2">{children}</div> : null}
    </header>
  );
}
