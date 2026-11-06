import { useEffect, useState } from "react";
import { deck } from "../data/deck";
import type { Voice } from "../data/deck";
import { fetchPerspectives } from "../lib/api";
import type { SavedResponse } from "../lib/storage";

export function Perspectives() {
  const [items, setItems] = useState<SavedResponse[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    fetchPerspectives()
      .then((responses) => {
        if (active) setItems(responses);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const chosen = items ?? [];
  const cards = deck
    .map((card) => ({
      card,
      youth: chosen.filter((item) => item.cardId === card.id && item.voice === "youth"),
      adult: chosen.filter((item) => item.cardId === card.id && item.voice === "adult"),
    }))
    .filter((group) => group.youth.length > 0 || group.adult.length > 0);

  return (
    <section id="perspectives" className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <p className="text-sm font-semibold tracking-[0.14em] text-primary uppercase">
        Perspectives
      </p>
      <h2 className="mt-3 max-w-3xl text-4xl font-semibold">
        Read what the other side is thinking.
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink">
        These are answers VT Seva chose from students and from parents. Students
        can read the parent side. Parents can read the youth side. Same
        question, the other perspective.
      </p>

      {failed ? (
        <p className="mt-8 text-base font-semibold text-danger" role="alert">
          Perspectives could not be loaded. Refresh the page and try again.
        </p>
      ) : null}

      {items === null && !failed ? (
        <p className="mt-8 text-base text-muted-foreground">Loading perspectives.</p>
      ) : null}

      {items && cards.length === 0 && !failed ? (
        <p className="mt-8 max-w-2xl rounded-2xl border border-border bg-card p-6 text-base leading-relaxed text-ink">
          Chosen answers will appear here after an admin picks them from the
          student and parent responses.
        </p>
      ) : null}

      <div className="mt-10 grid gap-8">
        {cards.map((group) => (
          <article key={group.card.id} className="rounded-2xl border border-border bg-card p-5 md:p-8">
            <p className="text-sm font-semibold text-primary">{group.card.title}</p>
            <h3 className="mt-2 text-2xl font-semibold">{group.card.question}</h3>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <PerspectiveColumn title="What youth are thinking" tone="youth" items={group.youth} />
              <PerspectiveColumn title="What parents are thinking" tone="adult" items={group.adult} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function PerspectiveColumn({
  title,
  tone,
  items,
}: {
  title: string;
  tone: Voice;
  items: SavedResponse[];
}) {
  return (
    <div className={`rounded-2xl p-4 md:p-5 ${tone === "youth" ? "bg-youth-soft" : "bg-adult-soft"}`}>
      <h4 className="text-xl font-semibold">{title}</h4>
      {items.length === 0 ? (
        <p className="mt-3 text-base text-muted-foreground">Nothing chosen from this side yet.</p>
      ) : (
        <ul className="mt-4 grid gap-4">
          {items.map((item) => (
            <li key={item.id} className="text-base leading-relaxed text-ink">
              {item.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
