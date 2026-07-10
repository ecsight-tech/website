import { defineField, defineType } from "sanity";

export const contactSubmission = defineType({
  name: "contactSubmission",
  title: "Contact Submission",
  type: "document",
  // Submissions are written by the /api/contact endpoint; read-only in Studio.
  readOnly: true,
  fields: [
    defineField({ name: "firstName", type: "string" }),
    defineField({ name: "lastName", type: "string" }),
    defineField({ name: "email", type: "string" }),
    defineField({ name: "phone", type: "string" }),
    defineField({ name: "company", type: "string" }),
    defineField({ name: "message", type: "text" }),
    defineField({
      name: "submittedAt",
      title: "Submitted at",
      type: "datetime",
    }),
    defineField({
      name: "clickupTaskId",
      title: "ClickUp task ID",
      type: "string",
    }),
  ],
  preview: {
    select: {
      first: "firstName",
      last: "lastName",
      company: "company",
      submittedAt: "submittedAt",
    },
    prepare: ({ first, last, company, submittedAt }) => ({
      title: [first, last].filter(Boolean).join(" ") || "Unknown",
      subtitle: [company, submittedAt].filter(Boolean).join(" · "),
    }),
  },
});
