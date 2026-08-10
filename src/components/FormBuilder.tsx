"use client";

import { useEffect, useState } from "react";
import { FormField, FieldType } from "@/types/form";
import { saveFormSchemaAction } from "@/app/actions";
import SortableField from "./SortableField";
import PropertiesPanel from "./PropertiesPanel";
import { v4 as uuidV4 } from "uuid";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import {
  Type,
  AlignLeft,
  Hash,
  ListFilter,
  CheckSquare,
  Star,
  Save,
  Eye,
  Globe,
  Plus,
} from "lucide-react";

interface FormBuilderProps {
  initialForm: {
    id: string;
    title: string;
    description: string | null;
    published: boolean;
    fields: FormField[];
  };
}

const FIELD_BLOCKS: { type: FieldType; label: string; icon: any }[] = [
  { type: "text", label: "Short Text", icon: Type },
  { type: "textarea", label: "Long Text", icon: AlignLeft },
  { type: "number", label: "Number", icon: Hash },
  { type: "select", label: "Dropdown Select", icon: ListFilter },
  { type: "checkbox", label: "Checkbox", icon: CheckSquare },
  { type: "rating", label: "Star Rating", icon: Star },
];

export default function FormBuilder({ initialForm }: FormBuilderProps) {
  const [title, setTitle] = useState(initialForm.title);
  const [description, setDescription] = useState(initialForm.description || "");
  const [published, setPusblished] = useState(initialForm.published);
  const [fields, setFields] = useState<FormField[]>(initialForm.fields);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  //dnd-kit sensors setup
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddField = (type: FieldType) => {
    const newField: FormField = {
      id: uuidV4(),
      type,
      label: `Untitled ${type} field`,
      placeholder: "",
      required: false,
      options: type === "select" ? ["Option 1", "Option 2"] : undefined,
    };

    setFields((prev) => [...prev, newField]);
    setSelectedFieldId(newField.id);
  };

  const handleUpdateField = (updatedField: FormField) => {
    setFields((prev) =>
      prev.map((f) => (f.id == updatedField.id ? updatedField : f)),
    );
  };

  const handleDeleteField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
    if (selectedFieldId === id) setSelectedFieldId(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await saveFormSchemaAction(
      initialForm.id,
      title,
      description,
      fields,
      published,
    );
    setIsSaving(false);
  };

  const selectedField = fields.find((f) => f.id === selectedFieldId) || null;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // return a skeleton layout while rehydrating on the client
    return (
      <div className="h-screen w-screen flex bg-slate-950 text-slate-100 items-center justify-center">
        <p className="text-sm text-slate-500 font-mono">
          Loading Builder Canvas ...
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden ">
      {/* Top header bar  */}
      <header className="h-16 border-b border-slate-800 bg-slate-900 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-bold bg-transparent border-b border-trasnparent hover:border-slate-700 focus:border-blue-500 focus:outline-none px-1 py-0.5 text-slate-100"
          />
          <button
            onClick={() => setPusblished(!published)}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
              published
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            {published ? "Published" : "Draft"}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <a
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center gap-2"
            target="_blank"
            rel="noreferrer"
            href={`/submit/${initialForm.id}`}
          >
            <Eye className="w-4 h-4" /> Live Preview
          </a>

          <button
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition flex items-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-50 "
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving ..." : "Save Form"}
          </button>
        </div>
      </header>

      {/* Studio workspace area */}

      <div className="flex flex-1 overflow-hidden">
        {/* Left bar : field pallete */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Add Field Blocks
          </h3>

          <div className="space-y-2">
            {FIELD_BLOCKS.map((block) => {
              const Icon = block.icon;
              return (
                <button
                  key={block.type}
                  onClick={() => handleAddField(block.type)}
                  className="w-full flex items-center gap-3 p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-medium text-slate-300 transition group text-left"
                >
                  <Icon className="w-4 h-4 text-blue-400 group-hover:scale-110 transition" />
                  {block.label}
                  <Plus className="w-3.5 h-3.5 text-slate-600 ml-auto" />
                </button>
              );
            })}
          </div>
        </aside>
        {/* Center Canvas: Drag and Drop Area */}
        <main className="flex-1 p-8 overflow-y-auto bg-slate-950 flex flex-col items-center">
          <div className="max-w-xl w-full space-y-6">
            {/* Form title card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Form Title"
                className="text-2xl font-extrabold bg-transparent w-full focus:outline-none text-slate-100"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Form description or instructions ..."
                rows={2}
                className="w-full bg-transparent text-sm text-slate-400 focus:outline-none resize-none"
              ></textarea>
            </div>
            {/* Sortable field canvas */}

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={fields.map((f) => f.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {fields.map((field) => (
                    <SortableField
                      key={field.id}
                      field={field}
                      isSelected={field.id === selectedFieldId}
                      onSelect={() => setSelectedFieldId(field.id)}
                      onDelete={() => handleDeleteField(field.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {fields.length == 0 && (
              <div className="border-2 border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-500 ">
                <p className="text-sm">Your canvas is empty.</p>
                <p className="text-xs">
                  Click field blocks on the left sidebar to start building.
                </p>
              </div>
            )}
          </div>
        </main>
        {/* Right sidebar: Properties Inspector */}

        <PropertiesPanel
          field={selectedField}
          onUpdateField={handleUpdateField}
        />
      </div>
    </div>
  );
}
