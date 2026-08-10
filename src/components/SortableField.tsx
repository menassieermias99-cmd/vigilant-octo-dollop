"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FormField } from "@/types/form";
import { GripVertical, Trash2, Asterisk } from "lucide-react";

interface SortableFieldProps {
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export default function SortableField({
  field,
  isSelected,
  onSelect,
  onDelete,
}: SortableFieldProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`group relative bg-slate-900 border rounded-xl p-4 transition cursor-pointer ${
        isSelected
          ? "border-blue-500 ring-2 ring-blue-500/20 shadow-lg"
          : "border-slate-800 hover:border-slate-700"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Drag handle */}
          <button
            {...attributes}
            {...listeners}
            className="p-1 text-slate-600 hover:text-slate-300 cursor-grab active:cursor-grabbing rounded"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="w-5 h-5" />
          </button>

          <label>
            {field.label}
            {field.required && (
              <Asterisk className="w-3.5 h-3.5 inline text-rose-500" />
            )}
          </label>
        </div>
        {/* delete field */}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Input Field Visual Preview */}

      <div className="mt-3 pl-8 pointer-events-none">
        {field.type === "text" && (
          <input
            type="text"
            readOnly
            placeholder={field.placeholder || "Short text answer ..."}
            className="w-full bg-slate-950 border border-slate-800  rounded-lg px-3 py-2 text-sm text-slate-400"
          />
        )}

        {field.type === "textarea" && (
          <textarea
            name="input-textarea"
            id="input-textarea"
            readOnly
            rows={2}
            placeholder={field.placeholder || "Longer text answer ..."}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-400"
          ></textarea>
        )}

        {field.type === "number" && (
          <input
            type="number"
            name="input-number"
            id="input-number"
            readOnly
            placeholder={field.placeholder || "0"}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-400"
          />
        )}

        {field.type === "select" && (
          <select
            disabled
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-400"
          >
            <option value="">
              {field.placeholder || "Select an option ..."}
            </option>
            {field.options?.map((opt, i) => (
              <option key={i}>{opt}</option>
            ))}
          </select>
        )}

        {field.type === "rating" && (
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500"
              >
                {star}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
