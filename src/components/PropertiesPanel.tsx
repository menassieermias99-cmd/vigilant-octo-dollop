"use client";

import { FormField } from "@/types/form";
import { Settings, Plus, Trash2, CheckSquare } from "lucide-react";

interface PropertiesPanelProps {
  field: FormField | null;
  onUpdateField: (updatedField: FormField) => void;
}

export default function PropertiesPanel({
  field,
  onUpdateField,
}: PropertiesPanelProps) {
  if (!field) {
    return (
      <div className="w-80 bg-slate-900 border-l border-slate-800 p-6 flex flex-col items-center justify-center text-center text-slate-500">
        <Settings className="w-10 h-10 mb-2 opacity-40" />
        <p className="text-sm font-medium">
          Select a field on the canvas to edit its properties
        </p>
      </div>
    );
  }

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...(field.options || [])];
    updatedOptions[index] = value;
    onUpdateField({ ...field, options: updatedOptions });
  };

  const handleAddOption = () => {
    const updatedOptions = [
      ...(field.options || []),
      `Option ${field.options?.length || 0 + 1}`,
    ];
    onUpdateField({ ...field, options: updatedOptions });
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = (field.options || []).filter((_, i) => i !== index);
    onUpdateField({ ...field, options: updatedOptions });
  };

  return (
    <div className="w-80 bg-slate-900 border border-slate-800 p-6 space-y-6 overflow-y-auto">
      <div className="border-b border-slate-800 pb-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Settings className="w-4 h-4 text-blue-400" />
          Field Settings
        </h3>
        <span className="text-xs text-slate-500 font-mono mt-1 block">
          Type: {field.type}
        </span>
      </div>

      {/* Label Edit */}

      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400">
          Field Label
        </label>
        <input
          type="text"
          value={field.label}
          onChange={(e) => onUpdateField({ ...field, label: e.target.value })}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
        />

        {field.type !== "checkbox" && field.type !== "rating" && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">
              Placeholder Text
            </label>
            <input
              type="text"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              value={field.placeholder || ""}
              onChange={(e) =>
                onUpdateField({ ...field, placeholder: e.target.value })
              }
            />
          </div>
        )}
      </div>

      {/* Options editor for select dropdowns */}
      {field.type === "select" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label
              htmlFor="dropdown-options"
              className="text-xs font-semibold text-slate-400"
            >
              Drop-Down Options
            </label>
            <button
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
              onClick={handleAddOption}
            >
              <Plus className="w-3.5 h-3.5" />
              Add Option
            </button>
          </div>
          <div className="space-y-2">
            {(field.options || []).map((option, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => handleRemoveOption(idx)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {/* Required Toggle */}

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <label
                htmlFor=""
                className="text-xs font-semibold text-slate-400 flex items-center gap-2"
              >
                <CheckSquare className="w-4 h-4 text-slate-500" /> Required
                Field
              </label>
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) =>
                  onUpdateField({ ...field, required: e.target.checked })
                }
                className="w-4 h-4 cursor-pointer accent-blue-600 rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
