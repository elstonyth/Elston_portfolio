import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div
    className={cn(
      'animate-pulse rounded-lg bg-white/5',
      className
    )}
  />
);

export const ProjectCardSkeleton: React.FC = () => (
  <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden mb-24">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-[480px]">
      <div className="p-12 flex flex-col justify-between">
        <div>
          <Skeleton className="h-4 w-24 mb-4" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-20 w-full mb-6" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>
      <Skeleton className="h-full" />
    </div>
  </div>
);

export const FeaturesSkeleton: React.FC = () => (
  <div className="py-24 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <Skeleton className="h-4 w-32 mx-auto mb-4" />
        <Skeleton className="h-12 w-64 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-8 rounded-2xl border border-white/10 bg-white/5">
            <Skeleton className="h-12 w-12 rounded-xl mb-6" />
            <Skeleton className="h-6 w-32 mb-3" />
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const TechStackSkeleton: React.FC = () => (
  <div className="py-16 px-6">
    <div className="max-w-7xl mx-auto text-center">
      <Skeleton className="h-4 w-24 mx-auto mb-8" />
      <div className="flex flex-wrap justify-center gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-full" />
        ))}
      </div>
    </div>
  </div>
);
