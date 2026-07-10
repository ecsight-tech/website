import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
      S.listItem()
        .title("Privacy Policy")
        .child(
          S.document().schemaType("privacyPolicy").documentId("privacyPolicy"),
        ),
      S.divider(),
      S.documentTypeListItem("project").title("Projects"),
      S.documentTypeListItem("service").title("Services"),
      S.documentTypeListItem("partner").title("Partners"),
      S.documentTypeListItem("showcase").title("Content Showcase"),
      S.documentTypeListItem("academy").title("Academy"),
      S.documentTypeListItem("mediaEvent").title("Media Events"),
      S.documentTypeListItem("teamMember").title("Team"),
      S.documentTypeListItem("testimonial").title("Testimonials"),
    ]);
