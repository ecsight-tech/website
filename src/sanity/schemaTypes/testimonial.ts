import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      type: "localeText",
      validation: (r) => r.required(),
    }),
    defineField({ name: "author", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", type: "localeString" }),
    defineField({ name: "company", type: "string" }),
    defineField({ name: "avatar", type: "image", options: { hotspot: true } }),
    defineField({ name: "featured", type: "boolean", initialValue: false }),
  ],
  preview: { select: { title: "author", subtitle: "company", media: "avatar" } },
});
