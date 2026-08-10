import { createFormAction } from "./actions";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Plus, LayoutGrid, ArrowRight } from "lucide-react";

export default function HomePage() {
  async function handleCreate() {
    "use server";
    const form = await createFormAction("Untitled Form");
    redirect(`/builder/${form.id}`);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8 md:p-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              FormFlow Studio
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Visual drag-and-drop form builder with live response collection.
            </p>
          </div>
          <form action={handleCreate}>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition shadow-lg shadow-blue-600/20 flex items-centerg gap-2 text-sm"
            >
              <Plus className="w-4 h-4" /> Create New Form
            </button>
          </form>
        </header>
        <FormList />
      </div>
    </main>
  );
}

async function FormList() {
  const forms = await db.form.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { responses: true } } },
  });

  if (forms.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 space-y-3">
        <LayoutGrid className="w-12 h-12 mx-auto opacity-40" />
        <p className="text-sm">
          No forms creatd yet. Click above to build your first form.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {forms.map((form) => (
        <a
          key={form.id}
          href={`/builder/${form.id}`}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition flex items-center justify-between group shadow-xl"
        >
          <div>
            <h3 className="font-bold text-slate-200">{form.title}</h3>
            <p className="text-xs text-slate-500 mt-1">
              {form._count.responses} reponses collected.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition" />
        </a>
      ))}
    </div>
  );
}
