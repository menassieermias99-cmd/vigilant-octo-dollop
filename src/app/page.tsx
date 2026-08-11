import { createFormAction, verifyAuth, deleteFormAction } from "./actions";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  Plus,
  LayoutGrid,
  Hammer,
  ArrowRight,
  BarChart3,
  ExternalLink,
  Trash2,
} from "lucide-react";

export default async function HomePage() {
  const isAuthenticated = await verifyAuth();
  if (!isAuthenticated) redirect("/login");

  async function handleCreate() {
    "use server";
    const form = await createFormAction("Untitled Form");
    redirect(`/builder/${form.id}`);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex-flex col">
      <Navbar />

      <main className="flex-1 p-8 md:p-12 max-w-6xl mx-auto w-full space-y-8">
        <header className="flex items-center justify-between border-b border-slate-800 pb-6">
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
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition shadow-lg shadow-blue-600/20 flex items-centerg gap-2 text-xs"
            >
              <Plus className="w-4 h-4" /> Create New Form
            </button>
          </form>
        </header>
        <FormGrid />
      </main>
    </div>
  );
}

async function FormGrid() {
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {forms.map((form) => (
        <div
          key={form.id}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 transition flex flex-col justify-between gap-6 shadow-xl group"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-bold text-slate-100 text-lg group-hover:text-blue-400 transition">
                {form.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-1">
                {form.description || "No Description."}
              </p>
            </div>

            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider  ${form.published ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}`}
            >
              {form.published ? "Published" : "Draft"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-blue-500" />
              {form._count.responses} submissions
            </span>

            <div className="flex items-center gap-2">
              <a
                href={`/builder/${form.id}`}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
              >
                <Hammer className="w-3.5 h-3.5" /> Edit
              </a>

              <a
                href={`/responses/${form.id}`}
                className="px-3 py-1/5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
              >
                <BarChart3 className="w-3.5 h-3.5" /> Responses
              </a>

              <a
                href={`/submit/${form.id}`}
                className="p-2 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded transition"
                title="Open Live Link"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
