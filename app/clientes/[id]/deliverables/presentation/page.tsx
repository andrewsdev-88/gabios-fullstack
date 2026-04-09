interface PresentationPageProps {
  params: Promise<{
    folderId: string;
  }>;
}

export default async function PresentationPage({ params }: PresentationPageProps) {
  const { folderId } = await params;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold">Apresentação Comercial</h1>
      <p>Folder: {folderId}</p>
      {/* Scaffold: apresentação renderizada virá aqui */}
    </div>
  );
}
