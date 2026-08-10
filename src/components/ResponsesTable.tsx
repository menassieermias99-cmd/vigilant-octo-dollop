"use client";

import { useState } from "react";
import { FormField } from "@/types/form";
import { deleteFormAction } from "@/app/actions";
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
  return <div></div>;
}
