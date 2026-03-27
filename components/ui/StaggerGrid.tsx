"use client";

import React from "react";

interface StaggerGridProps {
  children: React.ReactNode;
  className?: string;
  /** Base delay before first item animates (ms) */
  baseDelay?: number;
  /** Delay step between each item (ms) */
  stepMs?: number;
}

const MAX_STAGGER_INDEX = 11;

export function StaggerGrid({
  children,
  className,
  baseDelay = 50,
  stepMs = 60,
}: StaggerGridProps) {
  const items = React.Children.toArray(children);

  return (
    <div className={className}>
      {items.map((child, index) => {
        const delay = baseDelay + Math.min(index, MAX_STAGGER_INDEX) * stepMs;
        const childKey = React.isValidElement(child) ? child.key : null;
        return (
          <div
            key={childKey ?? index}
            className="animate-fade-up"
            style={{ animationDelay: `${delay}ms` }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}
