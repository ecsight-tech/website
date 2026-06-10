import { defineField, defineType } from "sanity";

const localeFields = [
  defineField({ name: "en", title: "English", type: "string" }),
  defineField({ name: "th", title: "Thai", type: "string" }),
];

export const localeString = defineType({
  name: "localeString",
  title: "Localized string",
  type: "object",
  fields: localeFields,
});

export const localeText = defineType({
  name: "localeText",
  title: "Localized text",
  type: "object",
  fields: [
    defineField({ name: "en", title: "English", type: "text", rows: 3 }),
    defineField({ name: "th", title: "Thai", type: "text", rows: 3 }),
  ],
});

export const localeBlockContent = defineType({
  name: "localeBlockContent",
  title: "Localized block content",
  type: "object",
  fields: [
    defineField({ name: "en", title: "English", type: "blockContent" }),
    defineField({ name: "th", title: "Thai", type: "blockContent" }),
  ],
});
