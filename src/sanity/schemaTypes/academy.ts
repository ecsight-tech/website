import { defineField, defineType } from "sanity";

export const academy = defineType({
  name: "academy",
  title: "Academy",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "localeString",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title.en" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
    }),
    defineField({
      name: "category",
      title: "Course Category",
      type: "string",
      options: {
        list: [
          { title: "Workshop", value: "workshop" },
          { title: "Bootcamp", value: "bootcamp" },
          { title: "Certification", value: "certification" },
          { title: "Online Course", value: "online" },
          { title: "Seminar", value: "seminar" },
        ],
        layout: "dropdown",
      },
    }),
    defineField({ name: "summary", type: "localeText" }),
    defineField({
      name: "targetAudience",
      title: "Target Audience",
      type: "array",
      of: [{ type: "localeString" }],
      description: "Who this academy program is for",
    }),
    defineField({ name: "body", type: "localeBlockContent" }),
    defineField({
      name: "order",
      type: "number",
      description: "Sort order on listings",
    }),
  ],
  orderings: [
    { title: "Manual order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "title.en", subtitle: "summary.en" } },
});
