import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { SURVEY_URL } from "../data/site";

export function Survey() {
  return (
    <section id="survey" className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <p className="text-sm font-semibold tracking-[0.14em] text-primary uppercase">
          For youth
        </p>
        <h2 className="mt-3 text-4xl font-semibold">Be heard. Be part of the change.</h2>
        <p className="mt-4 text-base leading-relaxed text-ink">
          The deck is the shared table. This survey is a private place for
          youth to say more. It collects no personal information.
        </p>
        <ul className="mt-6 grid gap-3">
          <li className="flex items-start gap-3 text-ink">
            <ShieldCheck className="mt-1 shrink-0 text-primary" aria-hidden="true" />
            <span>Anonymous. No name, and no personal information.</span>
          </li>
          <li className="flex items-start gap-3 text-ink">
            <ShieldCheck className="mt-1 shrink-0 text-primary" aria-hidden="true" />
            <span>Your thoughts, experiences, and ideas — so support can get better.</span>
          </li>
        </ul>
      </div>

      <article className="rounded-2xl border border-border bg-card p-6 shadow-[0_24px_40px_-32px_rgba(76,29,149,0.65)] md:p-8 lg:col-span-7">
        <div className="space-y-4 text-lg leading-relaxed text-ink">
          <p>Dear Youth,</p>
          <p>
            Be heard. Be part of the change. This anonymous survey protects
            your privacy and collects no personal information.
          </p>
          <p>
            We want to hear your thoughts, experiences, and ideas so we can
            better support youth, create positive change, and help build a
            healthier, stronger community.
          </p>
          <p>Thank you very much for participating.</p>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            className="btn btn-accent"
            href={SURVEY_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open the youth survey
            <ArrowUpRight aria-hidden="true" size={18} />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <p className="text-sm text-muted-foreground break-all">{SURVEY_URL}</p>
        </div>
      </article>
    </section>
  );
}
