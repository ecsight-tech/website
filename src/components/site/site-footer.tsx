export function SiteFooter({
  brand = "ecsight",
  email,
}: {
  brand?: string;
  email?: string;
}) {
  return (
    <footer className="border-t border-white/10 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
        <div className="text-lg font-semibold tracking-tight">
          {brand}
          <span className="text-primary">.</span>
        </div>
        <p className="text-sm text-foreground/60">
          &copy; {new Date().getFullYear()} {brand}. All rights reserved.
        </p>
        {email ? (
          <a
            href={`mailto:${email}`}
            className="text-sm text-foreground/70 hover:text-foreground"
          >
            {email}
          </a>
        ) : null}
      </div>
    </footer>
  );
}
