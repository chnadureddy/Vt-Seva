import { useEffect, useState } from "react";
import { House, Layers, MessagesSquare, ClipboardList } from "lucide-react";

const tabs = [
  { href: "#top", label: "Home", icon: House },
  { href: "#deck", label: "Deck", icon: Layers },
  { href: "#perspectives", label: "Views", icon: MessagesSquare },
  { href: "#survey", label: "Survey", icon: ClipboardList },
];

function useHash() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  return hash;
}

function activeHref(hash: string) {
  if (hash === "#deck") return "#deck";
  if (hash === "#perspectives") return "#perspectives";
  if (hash === "#survey") return "#survey";
  if (hash === "#admin") return "";
  return "#top";
}

export function AppTabBar() {
  const current = activeHref(useHash());

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="App"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const selected = current === tab.href;
          return (
            <li key={tab.href}>
              <a
                href={tab.href}
                aria-current={selected ? "page" : undefined}
                className={`flex min-h-14 flex-col items-center justify-center gap-1 text-xs font-semibold no-underline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary ${
                  selected ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon aria-hidden="true" size={22} strokeWidth={selected ? 2.4 : 2} />
                {tab.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
