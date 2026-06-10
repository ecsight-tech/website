import { defineField, defineType } from "sanity";

export const showcase = defineType({
  name: "showcase",
  title: "Content Showcase",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "video",
      title: "Short video",
      type: "file",
      options: { accept: "video/*" },
    }),
    defineField({
      name: "poster",
      title: "Poster image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "url", title: "Link", type: "url" }),
    defineField({ name: "order", type: "number" }),
  ],
  orderings: [
    { title: "Manual order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "title", media: "poster" } },
});
