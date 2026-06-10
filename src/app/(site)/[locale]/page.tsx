import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Work } from "@/components/sections/work";
import { Partners } from "@/components/sections/partners";
import { Testimonials } from "@/components/sections/testimonials";
import { CTA } from "@/components/sections/cta";
import { sanityFetch } from "@/sanity/lib/live";
import {
  servicesQuery,
  featuredProjectsQuery,
  testimonialsQuery,
  partnersQuery,
  siteSettingsQuery,
} from "@/sanity/lib/queries";

import type { HeaderSettings } from "@/components/site/site-header";

type SiteSettings = (HeaderSettings & { email?: string }) | null;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const queryParams = { locale };

  const [services, projects, testimonials, partners, settings] =
    await Promise.all([
      sanityFetch({ query: servicesQuery, params: queryParams }),
      sanityFetch({ query: featuredProjectsQuery, params: queryParams }),
      sanityFetch({ query: testimonialsQuery, params: queryParams }),
      sanityFetch({ query: partnersQuery, params: queryParams }),
      sanityFetch({ query: siteSettingsQuery, params: queryParams }),
    ]);

  const site = settings.data as SiteSettings;
  const email = site?.email;

  return (
    <>
      <SiteHeader settings={site ?? undefined} />
      <main>
        <Hero />
        <Services services={services.data as React.ComponentProps<typeof Services>["services"]} />
        <Work projects={projects.data as React.ComponentProps<typeof Work>["projects"]} />
        <Partners partners={partners.data as React.ComponentProps<typeof Partners>["partners"]} />
        <Testimonials items={testimonials.data as React.ComponentProps<typeof Testimonials>["items"]} />
        <CTA email={email} />
      </main>
      <SiteFooter email={email} />
    </>
  );
}
