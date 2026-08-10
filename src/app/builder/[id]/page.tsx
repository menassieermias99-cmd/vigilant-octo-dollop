import { getFormAction } from "@/app/actions";
import FormBuilder from "@/components/FormBuilder";
import { notFound } from "next/navigation";

interface BuidlerPageProps {
  params: Promise<{ id: string }>;
}

export default async function BuilderPage({ params }: BuidlerPageProps) {
  const { id } = await params;
  const form = await getFormAction(id);

  if (!form) notFound();

  return <FormBuilder initialForm={form} />;
}
