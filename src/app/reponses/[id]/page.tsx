"use client";

import {
  getFormAction,
  getFormResponseAction,
  verifyAuth,
} from "@/app/actions";
import { redirect, notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import ResponsesTable from "@/components/ResponsesTable";

interface ResponsesPageProps {
  params: Promise<{ id: string }>;
}

export default async function ResponsesPage({ params }: ResponsesPageProps) {
  const isAuthenticated = await verifyAuth();
  if (!isAuthenticated) redirect("/login");

  const { id } = await params;
  const form = await getFormAction(id);
  if (!form) notFound();

  const responses = await getFormResponseAction(id);

  return (
    <div className="min-h-screen">
      <Navbar
        formId={form.id}
        formTitle={form.title}
        published={form.published}
      />

      <main className="flex-1">
        <div className="flex">
          <div>
            <h1 className="text-2xl">{form.title}</h1>
            <p className="text-xs">
              Collected submission analytics and field responses.
            </p>
          </div>

          <div className="flex">
            <div className="bg-slate-900">
              <span className="text-xs">Total Submissions</span>
              <span className="text-lg">{responses.length}</span>
            </div>
          </div>
        </div>

        <ResponsesTable
          formId={form.id}
          fields={form.fields}
          responses={responses}
        />
      </main>
    </div>
  );
}
