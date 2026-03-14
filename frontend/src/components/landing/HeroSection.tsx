import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { LiveLaunchCard } from './LiveLaunchCard'
import { StatsBar } from './StatsBar'
import type { IProjectListItem } from '@/types/project'

interface HeroSectionProps {
  featuredProject: IProjectListItem | null
  isLoading?: boolean
  stats: {
    projectCount: number
    totalCommitted: string
    investorCount: number
    milestonesVerified: number
  }
}

export function HeroSection({ featuredProject, isLoading, stats }: HeroSectionProps) {
  return (
    <section className="relative isolate -mt-14 flex min-h-screen flex-col justify-between">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/hero-bg.webp"
          alt=""
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#070b14]" />
      </div>

      {/* Main content */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-start justify-center gap-10 px-6 pt-[100px] pb-10 lg:flex-row lg:items-center lg:gap-12 lg:pt-[120px]">
        {/* Left: Headline */}
        <div className="flex max-w-xl flex-1 flex-col gap-6">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
            EASY TO LAUNCH.
            <br />
            <span className="bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">
              HARD TO RUG.
            </span>
          </h1>

          <p className="text-lg leading-relaxed text-white/70">
            Launch tokens on Avalanche with built-in milestone-based funding.
            Investors stay protected. Builders stay accountable.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button asChild size="lg" variant="gradient">
              <Link href="/launch">Launch Project</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Link href="/explore">Explore Projects</Link>
            </Button>
          </div>
        </div>

        {/* Right: Live Launch Card */}
        {isLoading ? (
          <div className="w-full lg:w-[420px] rounded-2xl border border-white/10 bg-black/10 backdrop-blur-sm p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="size-12 rounded-xl" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between"><Skeleton className="h-4 w-20" /><Skeleton className="h-4 w-10" /></div>
              <div className="flex justify-between"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-10" /></div>
              <div className="flex justify-between"><Skeleton className="h-4 w-14" /><Skeleton className="h-4 w-28" /></div>
            </div>
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ) : featuredProject ? (
          <LiveLaunchCard project={featuredProject} />
        ) : null}
      </div>

      {/* Bottom: Stats Bar */}
      <div className="px-6 pb-8">
        <StatsBar {...stats} />
      </div>
    </section>
  )
}
