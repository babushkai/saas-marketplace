const steps = [
  {
    number: "01",
    title: "Browse & compare",
    description:
      "Search vetted SaaS listings by category, price, and integrations to shortlist your options.",
  },
  {
    number: "02",
    title: "Talk to sellers",
    description:
      "Send an inquiry directly from a listing and get answers from the team behind the product.",
  },
  {
    number: "03",
    title: "Buy with confidence",
    description:
      "Close the deal knowing pricing was transparent and the seller was verified from day one.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-t border-border/60 bg-muted/30"
    >
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            How Marketspace works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Three steps from browsing to a signed deal.
          </p>
        </div>

        <div className="relative mt-16 grid grid-cols-1 gap-10 md:grid-cols-3">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-border md:block" />
          {steps.map((step) => (
            <div key={step.number} className="relative flex flex-col items-center text-center">
              <div className="relative z-10 flex size-12 items-center justify-center rounded-full border border-border bg-background text-sm font-semibold text-primary">
                {step.number}
              </div>
              <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
