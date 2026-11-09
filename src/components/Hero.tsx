import { ArrowRight } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { faces, girlFaces } from "../face/cast";
import { FaceCanvas, type Mood } from "../face/FaceCanvas";

const DISC = "#7C3AED";

const startMood = (): Mood => ({ face: "base", patience: 100, pulls: 0 });

export function Hero() {
  const boyStage = useRef<HTMLDivElement>(null);
  const girlStage = useRef<HTMLDivElement>(null);
  const [boyMood, setBoyMood] = useState<Mood>(startMood);
  const [girlMood, setGirlMood] = useState<Mood>(startMood);
  const onBoyMood = useCallback((next: Mood) => setBoyMood(next), []);
  const onGirlMood = useCallback((next: Mood) => setGirlMood(next), []);
  const pulled = boyMood.pulls + girlMood.pulls > 0;

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
              same moment, and two different faces. Pull either one and see how
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

          <div className="order-1 mt-4 md:order-2 md:mt-2">
            <p
              className={`hint pointer-events-none mb-1 text-center font-serif text-[clamp(18px,1.6vw,22px)] text-ink ${
                pulled ? "translate-y-2 opacity-0" : ""
              }`}
            >
              pull a face
            </p>
            <div className="mx-auto flex items-end justify-center gap-3 sm:gap-6">
              <figure className="grid justify-items-center gap-2">
                <div ref={boyStage} className="relative aspect-square w-[min(38vw,200px)] md:w-[210px]" />
                <figcaption className="text-sm font-semibold text-foreground">Boy</figcaption>
              </figure>
              <figure className="grid justify-items-center gap-2">
                <div ref={girlStage} className="relative aspect-square w-[min(38vw,200px)] md:w-[210px]" />
                <figcaption className="text-sm font-semibold text-foreground">Girl</figcaption>
              </figure>
            </div>
          </div>

          <div className="relative z-10 order-3 md:pb-6 md:text-right">
            <div className="ml-auto w-full max-w-sm space-y-4" aria-live="polite">
              <MoodRow title="Boy" mood={boyMood} label={faces[boyMood.face].mood} />
              <MoodRow title="Girl" mood={girlMood} label={girlFaces[girlMood.face].mood} />
              <p className="text-sm leading-relaxed text-muted-foreground">
                Hair says ow. Cheeks pinch. Hold a stretch and patience runs out.
              </p>
            </div>
          </div>
        </div>
      </div>

      <FaceCanvas
        stageRef={boyStage}
        discColor={DISC}
        onMood={onBoyMood}
        label="A boy's face you can grab and stretch. Pull the hair, a cheek, or the chin."
      />
      <FaceCanvas
        stageRef={girlStage}
        discColor={DISC}
        catalog={girlFaces}
        onMood={onGirlMood}
        label="A girl's face you can grab and stretch. Pull the hair, a cheek, or the chin."
      />
    </section>
  );
}

function MoodRow({ title, mood, label }: { title: string; mood: Mood; label: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 text-sm">
        <span className="font-semibold text-muted-foreground">{title}</span>
        <span className="font-display text-lg font-semibold text-foreground">{label}</span>
      </div>
      <div className="mt-1.5">
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
    </div>
  );
}
