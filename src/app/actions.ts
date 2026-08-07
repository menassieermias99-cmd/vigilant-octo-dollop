"use server";

import { db } from "@/lib/db";
import { FormField } from "@/types/form";
import { revalidatePath } from "next/cache";

export async function createFormAction(title: string = "Untitled Form") {
  const form = await db.form.create({
    data: {
      title,
      description: "Click to add a description ...",
      fieldsJson: JSON.stringify([
        {
          id: "field-1",
          type: "text",
          label: "Full Name",
          placeholder: "Jane Doe",
          required: true,
        },
      ]),
    },
  });

  return form;
}

export async function getFormAction(id: string) {
  const form = await db.form.findUnique({
    where: { id },
  });
  if (!form) return null;

  return {
    ...form,
    fields: JSON.parse(form.fieldsJson) as FormField[],
  };
}

export async function saveFormSchemaAction(
  id: string,
  title: string,
  description: string,
  fields: FormField[],
  published: boolean,
) {
  await db.form.update({
    where: { id },
    data: {
      title,
      description,
      published,
      fieldsJson: JSON.stringify(fields),
    },
  });

  revalidatePath(`/builder/${id}`);
  revalidatePath(`/submit/${id}`);
}

export async function submitFormResponseAction(
  formId: string,
  answers: Record<string, any>,
) {
  const response = await db.formResponse.create({
    data: {
      formId,
      answersJson: JSON.stringify(answers),
    },
  });

  return response;
}

export async function getFormResponseAction(formId: string) {
  const responses = await db.formResponse.findMany({
    where: { formId },
    orderBy: { createdAt: "desc" },
  });

  return responses.map((r) => ({
    ...r,
    answers: JSON.parse(r.answersJson) as Record<string, any>,
  }));
}

export async function deleteFormAction(id: string) {
  await db.form.delete({ where: { id } });
  revalidatePath("/");
}
