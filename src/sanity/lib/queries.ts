import groq from "groq";

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    title, email, phone, socials,
    "description": coalesce(description[$locale], description.en, description),
    "address": coalesce(address[$locale], address.en, address)
  }
`;

export const servicesQuery = groq`
  *[_type == "service"] | order(order asc) {
    _id,
    "slug": slug.current,
    icon,
    image,
    "title": coalesce(title.en, title),
    "summary": coalesce(summary[$locale], summary.en, summary)
  }
`;

export const featuredProjectsQuery = groq`
  *[_type == "project" && featured == true] | order(publishedAt desc) {
    _id,
    "slug": slug.current,
    client, category, coverImage, year,
    "title": coalesce(title.en, title),
    "subtitle": coalesce(subtitle[$locale], subtitle.en, subtitle),
    "excerpt": coalesce(excerpt[$locale], excerpt.en, excerpt)
  }
`;

export const projectsQuery = groq`
  *[_type == "project"] | order(publishedAt desc) {
    _id,
    "slug": slug.current,
    client, category, coverImage, year,
    "title": coalesce(title.en, title),
    "excerpt": coalesce(excerpt[$locale], excerpt.en, excerpt)
  }
`;

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id, client, category, coverImage, gallery, services, year, url,
    "title": coalesce(title.en, title),
    "excerpt": coalesce(excerpt[$locale], excerpt.en, excerpt),
    "body": coalesce(body[$locale], body.en, body)
  }
`;

export const teamQuery = groq`
  *[_type == "teamMember"] | order(order asc) {
    _id, name, photo, socials,
    "role": coalesce(role[$locale], role.en, role),
    "bio": coalesce(bio[$locale], bio.en, bio)
  }
`;

export const testimonialsQuery = groq`
  *[_type == "testimonial"] | order(featured desc) {
    _id, author, company, avatar,
    "quote": coalesce(quote[$locale], quote.en, quote),
    "role": coalesce(role[$locale], role.en, role)
  }
`;

export const partnersQuery = groq`
  *[_type == "partner"] | order(order asc) {
    _id, name, logo,
    "industry": coalesce(industry[$locale], industry.en, industry),
    "description": coalesce(description[$locale], description.en, description)
  }
`;

export const showcaseQuery = groq`
  *[_type == "showcase"] | order(order asc) {
    _id, title, url, poster,
    "videoUrl": video.asset->url
  }
`;
