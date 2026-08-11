import { getFormAction, verifyAuth } from "@/app/actions";
import FormBuilder from "@/components/FormBuilder";
import { redirect, notFound } from "next/navigation";

interface BuidlerPageProps {
  params: Promise<{ id: string }>;
}

export default async function BuilderPage({ params }: BuidlerPageProps) {
  4;
  const isAuthenticated = await verifyAuth();
  if (!isAuthenticated) redirect("/login");

  const { id } = await params;
  const form = await getFormAction(id);

  if (!form) notFound();

  return <FormBuilder initialForm={form} />;
}
