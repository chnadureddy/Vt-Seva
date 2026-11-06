import { SURVEY_URL } from "../data/site";
import { Mark } from "./Mark";

export function SiteFooter() {
  return (
    <footer className="border-t border-border pb-24 md:pb-0">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-end md:justify-between md:px-8">
        <div className="flex flex-col items-start gap-3">
          <Mark className="h-16 w-auto" />
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Seva means selfless service. This space is for a healthier
            conversation between youth and the adults who care about them.
          </p>
        </div>
        <div className="grid gap-2 text-sm">
          <a className="text-link" href="https://www.vtsworld.org/" target="_blank" rel="noopener noreferrer">
            vtsworld.org
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <a className="text-link" href="#perspectives">
            Perspectives
          </a>
          <a className="text-link" href="#admin">
            Admin login
          </a>
          <a className="text-link" href={SURVEY_URL} target="_blank" rel="noopener noreferrer">
            Youth survey
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <p className="max-w-xs text-muted-foreground">
            If you are in crisis in the US, call or text 988.
          </p>
        </div>
      </div>
    </footer>
  );
}
