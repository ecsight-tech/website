import { defineField, defineType } from "sanity";

export const partner = defineType({
  name: "partner",
  title: "Partner",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({ name: "industry", type: "localeString" }),
    defineField({ name: "description", type: "localeText" }),
    defineField({ name: "logo", type: "image", options: { hotspot: true } }),
    defineField({ name: "order", type: "number" }),
  ],
  orderings: [
    { title: "Manual order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "name", subtitle: "industry.en", media: "logo" } },
});
