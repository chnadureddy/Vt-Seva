import { useEffect, useId, useState } from "react";
import type { FormEvent } from "react";
import { deck } from "../data/deck";
import type { Voice } from "../data/deck";
import { fetchAdminBoard, publishFeatured } from "../lib/api";
import type { SavedResponse } from "../lib/storage";

const SESSION = "vt-seva.admin";
const SAMPLE_USER = "admin";
const SAMPLE_PASSWORD = "seva-bridge";

type Session = { username: string; password: string };

function readSession(): Session | null {
  try {
    const raw = sessionStorage.getItem(SESSION);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const record = parsed as Partial<Session>;
    if (typeof record.username === "string" && typeof record.password === "string") {
      return { username: record.username, password: record.password };
    }
  } catch {
    sessionStorage.removeItem(SESSION);
  }
  return null;
}

export function AdminBoard() {
  const usernameId = useId();
  const passwordId = useId();
  const errorId = useId();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [responses, setResponses] = useState<SavedResponse[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function openBoard(nextUsername: string, nextPassword: string) {
    setLoading(true);
    setError("");
    setStatus("");
    try {
      const board = await fetchAdminBoard(nextUsername, nextPassword);
      const next = { username: nextUsername, password: nextPassword };
      setResponses(board.responses);
      setSelected(new Set(board.featuredIds));
      setSession(next);
      sessionStorage.setItem(SESSION, JSON.stringify(next));
    } catch (caught) {
      setSession(null);
      sessionStorage.removeItem(SESSION);
      setError(
        caught instanceof Error && caught.message === "unauthorized"
          ? "That username or password did not work."
          : "The admin board could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const saved = readSession();
    if (saved) void openBoard(saved.username, saved.password);
  }, []);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextUser = username.trim();
    const nextPassword = password;
    if (!nextUser || !nextPassword) {
      setError("Enter the username and password.");
      return;
    }
    void openBoard(nextUser, nextPassword);
  }

  function useSample() {
    setUsername(SAMPLE_USER);
    setPassword(SAMPLE_PASSWORD);
    setError("");
    void openBoard(SAMPLE_USER, SAMPLE_PASSWORD);
  }

  function toggle(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setStatus("");
  }

  async function publish() {
    if (!session) return;
    setLoading(true);
    setError("");
    setStatus("");
    try {
      await publishFeatured(session.username, session.password, [...selected]);
      setStatus(
        selected.size === 0
          ? "Perspectives is clear. Nothing is published right now."
          : `Published ${selected.size} ${selected.size === 1 ? "answer" : "answers"} to Perspectives.`,
      );
    } catch (caught) {
      setError(
        caught instanceof Error && caught.message === "unauthorized"
          ? "The admin session expired. Sign in again."
          : "The selection could not be published.",
      );
      if (caught instanceof Error && caught.message === "unauthorized") {
        setSession(null);
        sessionStorage.removeItem(SESSION);
      }
    } finally {
      setLoading(false);
    }
  }

  function signOut() {
    sessionStorage.removeItem(SESSION);
    setSession(null);
    setUsername("");
    setPassword("");
    setResponses([]);
    setSelected(new Set());
    setStatus("");
  }

  if (!session) {
    return (
      <section className="mx-auto max-w-xl px-5 py-16 md:px-8 md:py-24">
        <p className="text-sm font-semibold tracking-[0.14em] text-primary uppercase">Admin login</p>
        <h1 className="mt-3 text-4xl font-semibold">See every answer.</h1>
        <p className="mt-4 text-base leading-relaxed text-ink">
          Sign in to read every student and parent answer, then choose which
          ones appear in Perspectives.
        </p>
        <form className="mt-8 grid gap-4" onSubmit={onSubmit} noValidate>
          <div>
            <label htmlFor={usernameId} className="text-sm font-semibold text-ink">
              Username
            </label>
            <input
              id={usernameId}
              name="username"
              type="text"
              autoComplete="username"
              value={username}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
              onChange={(event) => {
                setUsername(event.target.value);
                setError("");
              }}
              className="mt-2 w-full rounded-2xl border border-border bg-card px-4 py-3 text-base text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            />
          </div>
          <div>
            <label htmlFor={passwordId} className="text-sm font-semibold text-ink">
              Password
            </label>
            <input
              id={passwordId}
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              className="mt-2 w-full rounded-2xl border border-border bg-card px-4 py-3 text-base text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            />
          </div>
          {error ? (
            <p id={errorId} role="alert" className="text-sm font-semibold text-danger">
              {error}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
            <button type="button" className="btn btn-ghost" onClick={useSample} disabled={loading}>
              Use sample login
            </button>
          </div>
        </form>
        <dl className="mt-8 rounded-2xl border border-border bg-card p-5 text-base">
          <dt className="text-sm font-semibold text-muted-foreground">Sample account</dt>
          <dd className="mt-2 text-ink">
            Username <span className="font-semibold text-foreground">{SAMPLE_USER}</span>
          </dd>
          <dd className="text-ink">
            Password <span className="font-semibold text-foreground">{SAMPLE_PASSWORD}</span>
          </dd>
        </dl>
      </section>
    );
  }

  const total = responses.length;

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold tracking-[0.14em] text-primary uppercase">Admin</p>
          <h1 className="mt-3 text-4xl font-semibold">All answers</h1>
          <p className="mt-2 text-sm font-semibold text-muted-foreground">Signed in as {session.username}</p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink">
            {total === 0
              ? "No student or parent answers yet. They show up here after someone adds a side on the deck."
              : `${total} ${total === 1 ? "answer" : "answers"} from students and parents. Check the ones that should appear in Perspectives.`}
          </p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={signOut}>
          Sign out
        </button>
      </div>

      <PublishBar
        count={selected.size}
        loading={loading}
        status={status}
        error={error}
        onPublish={() => void publish()}
      />

      <div className="mt-10 grid gap-8">
        {deck.map((card) => {
          const youth = responses.filter((item) => item.cardId === card.id && item.voice === "youth");
          const adult = responses.filter((item) => item.cardId === card.id && item.voice === "adult");
          return (
            <article key={card.id} className="rounded-2xl border border-border bg-card p-5 md:p-8">
              <p className="text-sm font-semibold text-primary">{card.title}</p>
              <h2 className="mt-2 text-2xl font-semibold">{card.question}</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <AnswerList
                  title="Youth"
                  tone="youth"
                  items={youth}
                  selected={selected}
                  onToggle={toggle}
                />
                <AnswerList
                  title="Parents & adults"
                  tone="adult"
                  items={adult}
                  selected={selected}
                  onToggle={toggle}
                />
              </div>
            </article>
          );
        })}
      </div>

      <PublishBar
        count={selected.size}
        loading={loading}
        status={status}
        error={error}
        onPublish={() => void publish()}
      />
    </section>
  );
}

function PublishBar({
  count,
  loading,
  status,
  error,
  onPublish,
}: {
  count: number;
  loading: boolean;
  status: string;
  error: string;
  onPublish: () => void;
}) {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4">
      <button type="button" className="btn btn-accent" onClick={onPublish} disabled={loading}>
        {loading ? "Publishing…" : `Publish ${count} to Perspectives`}
      </button>
      <a className="btn btn-ghost" href="#perspectives">
        View Perspectives
      </a>
      {status ? (
        <p className="text-sm font-semibold text-foreground" role="status">
          {status}
        </p>
      ) : null}
      {error ? (
        <p className="text-sm font-semibold text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function AnswerList({
  title,
  tone,
  items,
  selected,
  onToggle,
}: {
  title: string;
  tone: Voice;
  items: SavedResponse[];
  selected: Set<string>;
  onToggle: (id: string) => void;
}) {
  return (
    <div className={`rounded-2xl p-4 ${tone === "youth" ? "bg-youth-soft" : "bg-adult-soft"}`}>
      <h3 className="text-xl font-semibold">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-3 text-base text-muted-foreground">No answers from this side yet.</p>
      ) : (
        <ul className="mt-4 grid gap-3">
          {items.map((item) => {
            const checked = selected.has(item.id);
            return (
              <li key={item.id}>
                <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-xl bg-card p-4 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary">
                  <input
                    type="checkbox"
                    className="mt-1 size-5"
                    checked={checked}
                    onChange={() => onToggle(item.id)}
                  />
                  <span>
                    <span className="block text-sm font-semibold text-primary">
                      {checked ? "Shown in Perspectives" : "Show in Perspectives"}
                    </span>
                    <span className="mt-1 block text-base leading-relaxed text-ink">{item.text}</span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
