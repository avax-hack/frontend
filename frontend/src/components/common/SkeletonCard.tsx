import { cn } from '@/lib/utils'

interface SkeletonCardProps {
  className?: string
}

function Pulse({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-white/[0.06]', className)} />
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div className={cn('flex flex-col gap-4 rounded-xl border border-white/[0.06] bg-white/[0.03] p-5', className)}>
      <div className="flex items-center gap-3">
        <Pulse className="size-10 rounded-full" />
        <div className="flex flex-col gap-2">
          <Pulse className="h-4 w-28" />
          <Pulse className="h-3 w-16" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Pulse className="h-4 w-32" />
        <Pulse className="h-4 w-10" />
      </div>
      <Pulse className="h-1 w-full rounded-full" />
      <div className="flex items-center justify-between">
        <Pulse className="h-3 w-20" />
        <Pulse className="h-3 w-24" />
      </div>
      <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
        <Pulse className="h-3 w-16" />
        <Pulse className="h-7 w-24 rounded-lg" />
      </div>
    </div>
  )
}
