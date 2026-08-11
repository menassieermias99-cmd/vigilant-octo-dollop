"use client";

import { useState } from "react";
import { FormField } from "@/types/form";
import { deleteResponseAction } from "@/app/actions";
import { Trash2, Inbox, Calendar, Search } from "lucide-react";

interface ResponseItem {
  id: string;
  createdAt: Date;
  answers: Record<string, any>;
}

interface ResponseTableProps {
  formId: string;
  fields: FormField[];
  responses: ResponseItem[];
}

export default function ResponsesTable({
  formId,
  fields,
  responses,
}: ResponseTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredResponses = responses.filter((r) =>
    JSON.stringify(r.answers).toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this submission?")) {
      await deleteResponseAction(id, formId);
    }
  };

  if (responses.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-16 text-center text-slate-500 space-y-3">
        <Inbox className="w-12 h-12 mx-auto opacity-40 text-blue-400" />
        <h3 className="text-base font-semibold text-slate-300">
          No responses yet.
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Share your form's live link to get user submissions.
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {/* search input  */}
      <div className="flex items-center justify-betweeen gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            type="text"
            placeholder="Search responses ... "
          />
        </div>
        <span className="text-xs text-slate-500">
          Showing {filteredResponses.length} of {responses.length} responses
        </span>
      </div>

      {/* Response Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-x-auto shadow-2xl">
        <table className="w-full text-left text-xs text-slate-300 border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 uppercase font-mono tracking-wider">
              <th className="p-4 pl-6 min-w-[140px]">Date Submitted</th>
              {fields.map((f) => (
                <th key={f.id} className="p-4 min-w-[160px]">
                  {f.label}
                </th>
              ))}
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredResponses.map((res) => (
              <tr key={res.id} className="hover:bg-slate-800/30 transition ">
                <td className="p-4 pl-6 font-mono text-slate-400 whitespace-nowrap flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-600" />
                  {new Date(res.createdAt).toLocaleDateString()}
                  {new Date(res.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>

                {fields.map((f) => {
                  const val = res.answers[f.label];
                  return (
                    <td
                      key={f.id}
                      className="p-4 max-w-xs truncate font-medium text-slate-200"
                    >
                      {val === undefined || val === null || val === "" ? (
                        <span className="text-slate-600 italic">-</span>
                      ) : typeof val == "boolean" ? (
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${val ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-400"}`}
                        >
                          {val ? "YES" : "NO"}
                        </span>
                      ) : (
                        String(val)
                      )}
                    </td>
                  );
                })}

                <td className="p-4 pr-6 text-right">
                  <button
                    onClick={() => handleDelete(res.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-4 h-4 " />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
