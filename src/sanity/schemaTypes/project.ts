import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
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
    defineField({ name: "subtitle", type: "localeText" }),
    defineField({ name: "client", type: "string" }),
    defineField({
      name: "category",
      type: "string",
      options: {
        list: ["Branding", "Web", "Product", "Marketing", "Strategy"],
      },
    }),
    defineField({
      name: "coverImage",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
    }),
    defineField({
      name: "gallery",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({ name: "excerpt", type: "localeText" }),
    defineField({ name: "body", type: "localeBlockContent" }),
    defineField({ name: "services", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "year", type: "number" }),
    defineField({ name: "url", type: "url", title: "Live URL" }),
    defineField({ name: "featured", type: "boolean", initialValue: false }),
    defineField({
      name: "publishedAt",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  orderings: [
    { title: "Newest", name: "pubDesc", by: [{ field: "publishedAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title.en", subtitle: "client", media: "coverImage" },
  },
});
