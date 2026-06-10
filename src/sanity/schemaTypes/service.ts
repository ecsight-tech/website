import { defineField, defineType } from "sanity";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "icon", type: "string", description: "Icon name (lucide)" }),
    defineField({ name: "summary", type: "text", rows: 3 }),
    defineField({ name: "body", type: "blockContent" }),
    defineField({
      name: "order",
      type: "number",
      description: "Sort order on listings",
    }),
  ],
  orderings: [
    { title: "Manual order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "title", subtitle: "summary" } },
});
