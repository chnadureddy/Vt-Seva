const points = [
  {
    number: "01",
    title: "Same moment, two stories",
    text: "A student describes the problem from the inside. A parent describes it from care, fear, and what they can see from the doorway. The deck holds both, on purpose.",
  },
  {
    number: "02",
    title: "Parents are missing the real problem",
    text: "Students keep saying the same thing: home does not understand what they are actually dealing with. Advice shows up before anyone has finished listening.",
  },
  {
    number: "03",
    title: "Both answers stay on the card",
    text: "You pick a side, you say it plainly, and the app keeps it next to the question. No name. No profile. Just the opinion the other side rarely gets to read.",
  },
];

export function Gap() {
  return (
    <section id="gap" className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <p className="text-sm font-semibold tracking-[0.14em] text-primary uppercase">
          The gap
        </p>
        <h2 className="mt-3 text-4xl font-semibold">
          Students and parents are talking about the same thing.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-ink">
          They are not having the same conversation. VT Seva is the table
          where those two opinions can sit together.
        </p>
      </div>

      <ol className="lg:col-span-8">
        {points.map((point) => (
          <li key={point.number} className="border-t border-border py-6">
            <div className="grid gap-3 sm:grid-cols-[4.5rem_1fr] sm:gap-6">
              <p className="font-display text-2xl font-semibold text-primary">
                {point.number}
              </p>
              <div>
                <h3 className="text-2xl font-semibold">{point.title}</h3>
                <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink">
                  {point.text}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
