import { ArrowLeft, ArrowRight, Trash2 } from "lucide-react";
import { useEffect, useId, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { deck } from "../data/deck";
import type { DeckCard, Voice } from "../data/deck";
import { deleteResponse, publishResponse } from "../lib/api";
import { loadResponses, saveResponses } from "../lib/storage";
import type { SavedResponse } from "../lib/storage";

const MAX_LENGTH = 600;

export function CardDeck() {
  const [index, setIndex] = useState(0);
  const [saved, setSaved] = useState<SavedResponse[]>(() => loadResponses());
  const [voice, setVoice] = useState<Voice | "">("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [storageNote, setStorageNote] = useState("");
  const takeId = useId();
  const errorId = useId();
  const helpId = useId();
  const card = deck[index];

  useEffect(() => {
    for (const item of loadResponses()) {
      void publishResponse(item).catch(() => undefined);
    }
  }, []);

  function persist(next: SavedResponse[]) {
    setSaved(next);
    try {
      saveResponses(next);
      setStorageNote("");
    } catch {
      setStorageNote(
        "This browser blocked saving. Your words are on the card for now, and a refresh may clear them.",
      );
    }
  }

  function showCard(nextIndex: number) {
    const wrapped = (nextIndex + deck.length) % deck.length;
    setIndex(wrapped);
    setError("");
    setStatus("");
  }

  function onDeckKeyDown(event: KeyboardEvent<HTMLElement>) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const tag = target.tagName;
    if (tag === "TEXTAREA" || tag === "INPUT" || tag === "SELECT") return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      showCard(index + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showCard(index - 1);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const opinion = text.trim();
    if (!voice) {
      setError("Choose who is speaking: youth, or a parent or adult.");
      setStatus("");
      return;
    }
    if (opinion.length < 12) {
      setError("Write at least a sentence so the other side has something to read.");
      setStatus("");
      return;
    }
    const entry: SavedResponse = {
      id: crypto.randomUUID(),
      cardId: card.id,
      voice,
      text: opinion,
      createdAt: new Date().toISOString(),
    };
    persist([entry, ...saved]);
    setText("");
    setError("");
    void publishResponse(entry)
      .then(() => {
        setStatus(
          voice === "youth"
            ? "Added to the youth side. An admin can place it in Perspectives."
            : "Added to the parent side. An admin can place it in Perspectives.",
        );
      })
      .catch(() => {
        setStatus("");
        setStorageNote(
          "Your answer is on this card, but it could not reach the admin board. Keep this page open and try adding it again.",
        );
      });
  }

  function remove(id: string) {
    persist(saved.filter((item) => item.id !== id));
    void deleteResponse(id).catch(() => {
      setStorageNote("Removed here, but the admin board may still have a copy. Try again in a moment.");
    });
    setStatus("Removed your answer from this card.");
    setError("");
  }

  return (
    <section
      id="deck"
      className="border-y border-border bg-white/60"
      onKeyDown={onDeckKeyDown}
    >
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <p className="text-sm font-semibold tracking-[0.14em] text-primary uppercase">
          The deck
        </p>
        <h2 className="mt-3 max-w-3xl text-4xl font-semibold">
          One question. Youth on one side. Adults on the other.
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink">
          Sample voices show the gap. Add your own with no name. VT Seva keeps
          it for an admin, who can choose answers for Perspectives so the other
          side can read them.
        </p>
        <p className="mt-3 text-sm font-semibold text-foreground">
          Voices saved on this device: {saved.length}
        </p>

        <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Choose a card">
          {deck.map((item, itemIndex) => (
            <button
              key={item.id}
              type="button"
              className="chip"
              aria-pressed={itemIndex === index}
              onClick={() => showCard(itemIndex)}
            >
              {item.title}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <button type="button" className="btn btn-ghost" onClick={() => showCard(index - 1)}>
            <ArrowLeft aria-hidden="true" size={18} />
            Previous
          </button>
          <p className="text-sm font-semibold text-muted-foreground">
            Card {index + 1} of {deck.length}
          </p>
          <button type="button" className="btn btn-ghost" onClick={() => showCard(index + 1)}>
            Next
            <ArrowRight aria-hidden="true" size={18} />
          </button>
        </div>
        <p className="sr-only" aria-live="polite">
          Card {index + 1} of {deck.length}. {card.title}.
        </p>

        <article
          key={card.id}
          className="rise mt-4 rounded-2xl border border-border bg-card p-5 shadow-[0_24px_48px_-32px_rgba(76,29,149,0.55)] md:p-8"
          aria-labelledby={`${card.id}-question`}
        >
          <p className="text-sm font-semibold text-primary">Same question</p>
          <h3 id={`${card.id}-question`} className="mt-2 max-w-3xl text-3xl font-semibold">
            {card.question}
          </h3>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <VoiceColumn
              title="Youth"
              detail="Students"
              tone="youth"
              card={card}
              voice="youth"
              saved={saved}
              onRemove={remove}
            />
            <VoiceColumn
              title="Parents & adults"
              detail="The view from home"
              tone="adult"
              card={card}
              voice="adult"
              saved={saved}
              onRemove={remove}
            />
          </div>

          <form className="mt-8 border-t border-border pt-6" onSubmit={onSubmit} noValidate>
            <p className="font-display text-2xl font-semibold text-foreground">
              Add your side
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              This answer is added to “{card.title}”.
            </p>

            <fieldset className="mt-4">
              <legend className="text-sm font-semibold text-ink">Who is speaking?</legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-2xl border border-border bg-youth-soft px-4 py-3 has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-on-primary has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary">
                  <input
                    type="radio"
                    name="voice"
                    value="youth"
                    checked={voice === "youth"}
                    onChange={() => {
                      setVoice("youth");
                      setError("");
                    }}
                  />
                  Youth
                </label>
                <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-2xl border border-border bg-adult-soft px-4 py-3 has-[:checked]:border-accent has-[:checked]:bg-accent has-[:checked]:text-on-accent has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary">
                  <input
                    type="radio"
                    name="voice"
                    value="adult"
                    checked={voice === "adult"}
                    onChange={() => {
                      setVoice("adult");
                      setError("");
                    }}
                  />
                  Parent or adult
                </label>
              </div>
            </fieldset>

            <div className="mt-4">
              <label htmlFor={takeId} className="text-sm font-semibold text-ink">
                Your opinion
              </label>
              <textarea
                id={takeId}
                name="opinion"
                value={text}
                maxLength={MAX_LENGTH}
                rows={4}
                placeholder="Say it the way you would say it at home."
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${helpId} ${errorId}` : helpId}
                onChange={(event) => {
                  setText(event.target.value);
                  setError("");
                  setStatus("");
                }}
                className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-base leading-relaxed text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              />
              <div className="mt-2 flex flex-wrap items-start justify-between gap-2">
                <p id={helpId} className="max-w-xl text-sm text-muted-foreground">
                  Anonymous. No name is asked. Saved for the admin board.
                  Arrow keys move the deck when you are not typing.
                </p>
                <p className="text-sm text-muted-foreground">
                  {text.length} / {MAX_LENGTH}
                </p>
              </div>
              {error ? (
                <p id={errorId} role="alert" className="mt-2 text-sm font-semibold text-danger">
                  {error}
                </p>
              ) : null}
              {status ? (
                <p className="mt-2 text-sm font-semibold text-foreground" role="status">
                  {status}
                </p>
              ) : null}
              {storageNote ? (
                <p className="mt-2 text-sm font-semibold text-danger" role="alert">
                  {storageNote}
                </p>
              ) : null}
            </div>

            <button type="submit" className="btn btn-primary mt-4">
              Add to this card
            </button>
          </form>
        </article>
      </div>
    </section>
  );
}

function VoiceColumn({
  title,
  detail,
  tone,
  card,
  voice,
  saved,
  onRemove,
}: {
  title: string;
  detail: string;
  tone: Voice;
  card: DeckCard;
  voice: Voice;
  saved: SavedResponse[];
  onRemove: (id: string) => void;
}) {
  const mine = saved.filter((item) => item.cardId === card.id && item.voice === voice);
  const samples = card.samples.filter((item) => item.voice === voice);

  return (
    <div
      className={`rounded-2xl p-4 md:p-5 ${tone === "youth" ? "bg-youth-soft" : "bg-adult-soft"}`}
    >
      <h4 className="text-xl font-semibold">{title}</h4>
      <p className="text-sm text-muted-foreground">{detail}</p>
      <ul className="mt-4 grid gap-4">
        {mine.map((item) => (
          <li key={item.id} className="rounded-xl bg-card p-4">
            <p className="text-sm font-semibold text-primary">Yours</p>
            <p className="mt-2 text-base leading-relaxed text-ink">{item.text}</p>
            <button
              type="button"
              className="btn btn-ghost mt-3 px-3"
              onClick={() => onRemove(item.id)}
            >
              <Trash2 aria-hidden="true" size={16} />
              Remove
            </button>
          </li>
        ))}
        {samples.map((item) => (
          <li key={item.id}>
            <p className="text-sm font-semibold text-muted-foreground">Sample</p>
            <p className="mt-2 text-lg leading-relaxed text-ink">{item.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
