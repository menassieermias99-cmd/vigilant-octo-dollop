"use client";

import { useState } from "react";
import { FormField } from "@/types/form";
import { submitFormResponseAction } from "@/app/actions";
import { CheckCircle2, LayoutGrid, Star, ArrowLeft } from "lucide-react";
import { Span } from "next/dist/trace";
import Link from "next/link";

interface PublicFormProps {
  form: {
    id: string;
    title: string;
    description: string | null;
    published: boolean;
    fields: FormField[];
  };

  isAuthenticated?: boolean;
}

export default function PublicForm({ form, isAuthenticated }: PublicFormProps) {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!form.published) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
          <h2 className="text-xl font-bold text-slate-200">Form Unavailable</h2>
          <p className="text-sm text-slate-400">
            This form is currently in draft mode and is not accepting reponses.
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitFormResponseAction(form.id, answers);
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert("Failed to submit form please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  // success state
  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
          <h2 className="text-2xl font-bold">Response submitted!</h2>
          <p className="text-sm text-slate-400">
            Thank you for completing {form.title}. Your answers have been
            recorded.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
          {/* Show return to studio link if user is logged in  */}
          {isAuthenticated && (
            <Link
              href="/"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 px-4"
            >
              <LayoutGrid className="w-4 h-4" /> Return to Studio Dashboard
            </Link>
          )}

          <button
            onClick={() => {
              setAnswers({});
              setSubmitted(false);
            }}
            className="w-full py-2.5 bg-slate-500 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 px-4"
          >
            <ArrowLeft className="w-4 h-4" /> Submit Another Response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-6 flex justify-center">
      <div className="max-w-xl w-full space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-2">
          <h1 className="text-2xl font-bold">{form.title}</h1>
          {form.description && (
            <p className="text-sm text-slate-400">{form.description}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {form.fields.map((field) => (
            <div
              key={field.id}
              className="bg-slate-900 border boreder-slate-800 rounded-2xl p-6 shadow-xl space-y-3"
            >
              <label
                htmlFor="field"
                className="block text-sm font-semibold text-slate-200"
              >
                {field.label}
                {field.required && (
                  <span className="text-rose-500 ml-1">*</span>
                )}
              </label>

              {field.type === "text" && (
                <input
                  type="text"
                  required={field.required}
                  placeholder={field.placeholder || ""}
                  onChange={(e) =>
                    setAnswers({ ...answers, [field.label]: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline:none focus:border-blue-500"
                />
              )}

              {field.type === "textarea" && (
                <textarea
                  required={field.required}
                  rows={3}
                  placeholder={field.placeholder || ""}
                  onChange={(e) =>
                    setAnswers({ ...answers, [field.label]: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500 resize-none"
                ></textarea>
              )}

              {field.type === "number" && (
                <input
                  type="number"
                  required={field.required}
                  placeholder={field.placeholder || "0"}
                  onChange={(e) =>
                    setAnswers({ ...answers, [field.label]: e.target.value })
                  }
                  className="w-full bg-slate-950 border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500 "
                />
              )}

              {field.type === "select" && (
                <select
                  required={field.required}
                  onChange={(e) =>
                    setAnswers({ ...answers, [field.label]: e.target.value })
                  }
                  className="w-full bg-slate-950 border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select an option ... </option>
                  {field.options?.map((opt, i) => (
                    <option key={i} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}

              {field.type === "checkbox" && (
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required={field.required}
                    onChange={(e) =>
                      setAnswers({
                        ...answers,
                        [field.label]: e.target.checked,
                      })
                    }
                    className="w-5 h-5 accent-blue-600 rounded"
                  />

                  <span className="text-sm text-slate-300">Yes / Agree</span>
                </label>
              )}

              {field.type === "rating" && (
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() =>
                        setAnswers({ ...answers, [field.label]: val })
                      }
                      className={`p-3 rounded-xl border transition flex items-center justify-center
                                            ${
                                              answers[field.label] === val
                                                ? "bg-amber-500/20 border-amber-500 text-amber-400"
                                                : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700"
                                            }
                                        `}
                    >
                      <Star className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition shadow-lg shadow-blue-600/30 disabled:opacity-50"
          >
            {isSubmitting ? "Submitting ... " : "Submit Form"}
          </button>
        </form>
      </div>
    </div>
  );
}
