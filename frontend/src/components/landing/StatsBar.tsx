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
    { label: 'Total Committed', value: totalCommitted },
    { label: 'Projects Launched', value: projectCount },
    { label: 'Investors', value: investorCount.toLocaleString() },
    { label: 'Milestones Verified', value: milestonesVerified.toLocaleString() },
  ]

  return (
    <div className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-6 rounded-xl border border-white/10 bg-black/10 px-6 py-6 backdrop-blur-sm shadow-[0_10px_40px_rgba(0,0,0,0.6)] lg:grid-cols-4 lg:gap-8">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col items-center gap-1 text-center">
          <span className="text-2xl font-extrabold text-white lg:text-3xl">{stat.value}</span>
          <span className="text-xs text-white/50">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}
