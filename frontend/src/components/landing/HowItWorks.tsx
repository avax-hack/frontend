const steps = [
  {
    number: '01',
    title: 'Define Milestones',
    description:
      'Builders set clear deliverables and funding targets for each milestone before launch.',
  },
  {
    number: '02',
    title: 'Community Funds',
    description:
      'Investors commit funds knowing exactly how and when capital will be released.',
  },
  {
    number: '03',
    title: 'Trade Instantly',
    description:
      'Tokens are tradable on Uniswap V4 right after the IDO — no lockups, no waiting.',
  },
  {
    number: '04',
    title: 'Build & Get Paid',
    description:
      'Builders hit milestones, funds unlock. Deliver results, collect rewards.',
  },
]

export function HowItWorks() {
  return (
    <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 md:px-6 lg:py-20">
      <div className="flex flex-col gap-3 text-center">
        <span className="text-sm font-semibold uppercase tracking-widest text-red-500">
          How It Works
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-white lg:text-4xl">
          From Launch to Delivery
        </h2>
        <p className="mx-auto max-w-2xl text-white/60">
          A transparent, step-by-step process that protects both builders and investors.
        </p>
      </div>

      <div className="relative grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-0">
        {/* Desktop connector line */}
        <div className="absolute top-7 right-[12.5%] left-[12.5%] hidden h-px bg-white/20 lg:block" />

        {steps.map((step) => (
          <div
            key={step.number}
            className="relative flex flex-col items-center gap-4 text-center lg:px-4"
          >
            <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white text-lg font-bold text-red-500 shadow-md">
              {step.number}
            </div>
            <h3 className="text-lg font-semibold text-white">{step.title}</h3>
            <p className="text-sm text-white/60">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
