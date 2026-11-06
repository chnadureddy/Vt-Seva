import { Mark } from "./Mark";

const links = [
  { href: "#gap", label: "The gap" },
  { href: "#deck", label: "The deck" },
  { href: "#perspectives", label: "Perspectives" },
  { href: "#survey", label: "Survey" },
  { href: "#admin", label: "Admin" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="flex h-20 items-center justify-between gap-3">
          <a
            href="#top"
            aria-label="VT Seva home"
            className="flex min-h-11 items-center rounded-xl no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <Mark alt="" className="h-16 w-auto" />
          </a>

          <nav className="hidden items-center gap-6 md:flex" aria-label="Pages">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-link text-sm no-underline hover:underline"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a className="btn btn-accent" href="#survey">
            Be heard
          </a>
        </div>
      </div>
    </header>
  );
}
