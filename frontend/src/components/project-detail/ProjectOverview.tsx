import Markdown from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'

interface ProjectOverviewProps {
  description: string
}

export function ProjectOverview({ description }: ProjectOverviewProps) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">About</h2>
      <div className="prose prose-sm max-w-none text-sm leading-[1.2] text-muted-foreground [&_a]:text-primary [&_a]:underline [&_h1]:text-lg [&_h1]:font-bold [&_h1]:text-foreground [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-foreground [&_li]:my-1 [&_p]:leading-[1.2] [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-4">
        <Markdown rehypePlugins={[rehypeSanitize]}>
          {description}
        </Markdown>
      </div>
    </section>
  )
}
