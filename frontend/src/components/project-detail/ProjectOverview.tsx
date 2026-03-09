import Markdown from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'

interface ProjectOverviewProps {
  description: string
}

export function ProjectOverview({ description }: ProjectOverviewProps) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">About</h2>
      <div className="prose prose-sm prose-invert max-w-none text-sm leading-[1.2] text-white/70 [&_a]:text-red-400 [&_a]:underline [&_h1]:text-lg [&_h1]:font-bold [&_h1]:text-white [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-white [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-white [&_li]:py-0.5 [&_p]:leading-[1.2] [&_strong]:text-white [&_ul]:list-disc [&_ul]:pl-4">
        <Markdown rehypePlugins={[rehypeSanitize]}>
          {description}
        </Markdown>
      </div>
    </section>
  )
}
