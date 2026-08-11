import { getFormAction, verifyAuth } from "@/app/actions";
import PublicForm from "@/components/PublicForm";
import { notFound } from "next/navigation";

interface SubmitPageProps {
  params: Promise<{ id: string }>;
}

export default async function SubmitPage({ params }: SubmitPageProps) {
  const { id } = await params;
  const form = await getFormAction(id);
  const isAuthenticated = await verifyAuth();

  if (!form) notFound();

  if (!form.published && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto">
            🔒
          </div>
          <h1 className="text-xl font-bold">Form Not Published</h1>
          <p className="text-xs text-slate-400">
            This form is currently in draft mode and is not accepting responses.
          </p>
        </div>
      </div>
    );
  }

  return <PublicForm form={form} isAuthenticated={isAuthenticated} />;
}
