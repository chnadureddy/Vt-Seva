import { ArrowRight } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { faces } from "../face/cast";
import { FaceCanvas, type Mood } from "../face/FaceCanvas";

const DISC = "#7C3AED";

export function Hero() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [mood, setMood] = useState<Mood>({ face: "base", patience: 100, pulls: 0 });
  const onMood = useCallback((next: Mood) => setMood(next), []);

  return (
    <section id="top" className="relative isolate px-5 pt-10 pb-12 md:px-8 md:pt-14 md:pb-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-sm font-semibold tracking-[0.14em] text-primary uppercase">
          Youth and adults
        </p>
        <h1 className="face-headline mt-3 text-center text-[clamp(3.25rem,12vw,7.5rem)] text-foreground">
          Bridging the <span className="marker">gap.</span>
        </h1>

        <div className="relative grid items-end gap-8 md:grid-cols-[1fr_auto_1fr] md:gap-6">
          <div className="relative z-10 order-2 max-w-md md:order-1 md:pb-6">
            <p className="text-lg leading-relaxed text-ink">
              Parents have an opinion. Students have an opinion. It is often the
              same moment, and two different faces. Pull this one and see how
              the expression changes with where you grab.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a className="btn btn-accent" href="#deck">
                Open the deck
                <ArrowRight aria-hidden="true" size={18} />
              </a>
              <a className="btn btn-ghost" href="#survey">
                Take the youth survey
              </a>
            </div>
            <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-5">
              <div>
                <dt className="font-display text-2xl font-semibold text-foreground">01</dt>
                <dd className="mt-1 text-sm text-muted-foreground">One question</dd>
              </div>
              <div>
                <dt className="font-display text-2xl font-semibold text-foreground">02</dt>
                <dd className="mt-1 text-sm text-muted-foreground">Two sides</dd>
              </div>
              <div>
                <dt className="font-display text-2xl font-semibold text-foreground">03</dt>
                <dd className="mt-1 text-sm text-muted-foreground">No names</dd>
              </div>
            </dl>
          </div>

          <div
            ref={stageRef}
            className="stage relative order-1 mx-auto aspect-square w-[min(92vw,440px)] md:order-2 md:w-[min(40vw,500px)]"
          >
            <p
              className={`hint pointer-events-none absolute top-[18%] right-0 font-serif text-[clamp(18px,1.6vw,22px)] text-ink md:right-[-6%] ${
                mood.pulls ? "translate-y-2 opacity-0" : ""
              }`}
            >
              pull a face
              <svg viewBox="0 0 60 40" className="ml-5 block h-8 w-12 -scale-x-100" fill="none" aria-hidden="true">
                <path d="M4 4c18 2 34 12 44 30" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M40 31l8 4 1-9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </p>
          </div>

          <div className="relative z-10 order-3 md:pb-6 md:text-right">
            <div className="ml-auto w-full max-w-sm space-y-3" aria-live="polite">
              <div className="flex items-baseline justify-between gap-4 text-sm">
                <span className="font-semibold text-muted-foreground">Current mood</span>
                <span className="font-display text-lg font-semibold text-foreground">{faces[mood.face].mood}</span>
              </div>
              <div>
                <div className="mb-1.5 flex justify-between text-sm text-muted-foreground">
                  <span>Patience</span>
                  <span className="tabular-nums">{mood.patience}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full transition-[width] duration-150"
                    style={{
                      width: `${mood.patience}%`,
                      background: `color-mix(in oklab, var(--color-primary) ${mood.patience}%, #e8412c)`,
                    }}
                  />
                </div>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Hair says ow. Cheeks pinch. Hold a stretch and patience runs out.
              </p>
            </div>
          </div>
        </div>
      </div>

      <FaceCanvas stageRef={stageRef} discColor={DISC} onMood={onMood} />
    </section>
  );
}
