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
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          How It Works
        </p>
        <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
          From Launch to Delivery
        </h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          A transparent, step-by-step process that protects both builders and investors.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => (
          <div
            key={step.number}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6"
          >
            <span className="text-sm font-bold text-primary">[{step.number}]</span>
            <h3 className="text-lg font-semibold">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
