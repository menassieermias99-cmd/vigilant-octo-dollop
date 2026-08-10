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
      <div className="flex">
        <div className="relative">
          <Search className="w-4" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full "
            type="text"
            placeholder="Search responses ... "
          />
        </div>
        <span className="text-xs">
          Showing {filteredResponses.length} of {responses.length} responses
        </span>
      </div>

      {/* Response Table */}
      <div className="bg-slate-900">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-4">Date Submitted</th>
              {fields.map((f) => (
                <th key={f.id} className="p-4">
                  {f.label}
                </th>
              ))}
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredResponses.map((res) => (
              <tr key={res.id} className="hover:bg-slate-800/30">
                <td className="p-4">
                  <Calendar className="w-3.5" />
                  {new Date(res.createdAt).toLocaleDateString()}
                  {new Date(res.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>

                {fields.map((f) => {
                  const val = res.answers[f.label];
                  return (
                    <td key={f.id} className="p-4">
                      {val === undefined || val === null || val === "" ? (
                        <span className="text-slate-600">-</span>
                      ) : typeof val == "boolean" ? (
                        <span
                          className={`px-2 ${val ? "bg-emerald-500/10" : "bg-slate-800"}`}
                        >
                          {val ? "YES" : "NO"}
                        </span>
                      ) : (
                        String(val)
                      )}
                    </td>
                  );
                })}

                <td className="p-4">
                  <button
                    onClick={() => handleDelete(res.id)}
                    className="p-1.5"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-4 h-4" />
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
