import { getFormAction } from "@/app/actions";
import PublicForm from "@/components/PublicForm";
import { notFound } from "next/navigation";

interface SubmitPageProps {
  params: Promise<{ id: string }>;
}

export default async function SubmitPage({ params }: SubmitPageProps) {
  const { id } = await params;
  const form = await getFormAction(id);

  if (!form) notFound();
  return <PublicForm form={form} />;
}
