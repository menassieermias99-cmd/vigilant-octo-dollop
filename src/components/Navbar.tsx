"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions";
import {
  LayoutGrid,
  Hammer,
  BarChart3,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { FreshnessPolicy } from "next/dist/client/components/router-reducer/ppr-navigations";

interface NavbarProps {
  formId?: string;
  formTitle?: string;
  published?: boolean;
}

export default function Navbar({ formId, formTitle }: NavbarProps) {
  const pathName = usePathname();

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900 px-6 flex items-center justify-between sticky top-0 z-50">
      {/* Brand & Context Link */}
      <div className="flex items-center gap-6">
        <Link
          href={"/"}
          className="flex items-center gap-2 text-sm font-extrabold text-slate-100 hover:text-blue-400 transition"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
            VOP
          </div>
          <span>Vigilant Octo Dollop</span>
        </Link>
        {formTitle && (
          <span className="text-xs text-slate-500 font-medium border-l border-slate-800 pl-4 py-1 truncate max-w-[200px]">
            {formTitle}
          </span>
        )}
      </div>
      {/* Tab navigation (when inside a form context) */}
      {formId && (
        <nav className="flex items-center gap-1 bg-slate-950 p-1 border border-slate-800 rounded-2xl">
          <Link
            href={`/builder/${formId}`}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              pathName.startsWith("builder")
                ? "bg-slate-800 text-blue-400 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Hammer className="w-3.5" /> Builder
          </Link>
          <Link
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              pathName.startsWith("/resposnses")
                ? "bg-slate-800 text-blue-400 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            href={`/responses/${formId}`}
          >
            <BarChart3 className="w-3.5 h-3.5 " /> Responses
          </Link>
        </nav>
      )}

      {/* Action Controls */}
      <div className="flex items-center gap-3">
        {formId && (
          <Link
            target="_blank"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
            href={`/submit/${formId}`}
          >
            <ExternalLink className="w-3.5" /> Live Form
          </Link>
        )}

        <button className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
