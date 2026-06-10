import { groq } from "next-sanity";

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]`;

export const servicesQuery = groq`
  *[_type == "service"] | order(order asc) {
    _id, title, "slug": slug.current, icon, summary
  }
`;

export const featuredProjectsQuery = groq`
  *[_type == "project" && featured == true] | order(publishedAt desc) {
    _id, title, "slug": slug.current, client, category, coverImage, excerpt, year
  }
`;

export const projectsQuery = groq`
  *[_type == "project"] | order(publishedAt desc) {
    _id, title, "slug": slug.current, client, category, coverImage, excerpt, year
  }
`;

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id, title, client, category, coverImage, gallery, excerpt, body, services, year, url
  }
`;

export const teamQuery = groq`
  *[_type == "teamMember"] | order(order asc) {
    _id, name, role, photo, bio, socials
  }
`;

export const testimonialsQuery = groq`
  *[_type == "testimonial"] | order(featured desc) {
    _id, quote, author, role, company, avatar
  }
`;
