interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;

  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-24">
      <h1 className="text-3xl font-bold">Project Detail</h1>
      <p className="text-neutral-400">Project: {id}</p>
      <p className="text-sm text-neutral-500">Coming Soon</p>
    </div>
  );
}
