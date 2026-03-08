interface StatsBarProps {
  projectCount: number
  totalCommitted: string
  investorCount: number
  milestonesVerified: number
}

export function StatsBar({
  projectCount,
  totalCommitted,
  investorCount,
  milestonesVerified,
}: StatsBarProps) {
  const stats = [
    { label: 'Projects Launched', value: projectCount },
    { label: 'Total Committed', value: totalCommitted },
    { label: 'Investors', value: investorCount },
    { label: 'Milestones Verified', value: milestonesVerified },
  ]

  return (
    <section className="border-y border-border bg-secondary/30">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 lg:grid-cols-4 lg:gap-8 md:px-6">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-1 text-center">
            <span className="text-3xl font-extrabold lg:text-4xl">{stat.value}</span>
            <span className="text-sm text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
