'use client';

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

const SprintCreationForm = dynamic(
  () => import('./sprintcreationform'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }
)

interface SprintFormWrapperProps {
  projectId: string;
  projectTitle: string;
  projectKey: string;
  sprintKey: number;
}

export default function SprintFormWrapper(props: SprintFormWrapperProps) {
  return <SprintCreationForm {...props} />;
} 