import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Work } from "@/components/sections/work";
import { Testimonials } from "@/components/sections/testimonials";
import { CTA } from "@/components/sections/cta";
import { sanityFetch } from "@/sanity/lib/live";
import {
  servicesQuery,
  featuredProjectsQuery,
  testimonialsQuery,
  siteSettingsQuery,
} from "@/sanity/lib/queries";

type SiteSettings = { email?: string; title?: string } | null;

export default async function Home() {
  const [services, projects, testimonials, settings] = await Promise.all([
    sanityFetch({ query: servicesQuery }),
    sanityFetch({ query: featuredProjectsQuery }),
    sanityFetch({ query: testimonialsQuery }),
    sanityFetch({ query: siteSettingsQuery }),
  ]);

  const email = (settings.data as SiteSettings)?.email;

  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Services services={services.data as React.ComponentProps<typeof Services>["services"]} />
        <Work projects={projects.data as React.ComponentProps<typeof Work>["projects"]} />
        <Testimonials items={testimonials.data as React.ComponentProps<typeof Testimonials>["items"]} />
        <CTA email={email} />
      </main>
      <SiteFooter email={email} />
    </>
  );
}
