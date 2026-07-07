const companies = [
  "Northwind",
  "Initech",
  "Globex",
  "Umbrella",
  "Soylent",
  "Hooli",
];

export function LogoCloud() {
  return (
    <section className="border-y border-border/60 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Sample customers browsing Marketspace today
        </p>
        <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-6">
          {companies.map((name) => (
            <div
              key={name}
              className="flex items-center justify-center text-sm font-semibold text-muted-foreground/60 grayscale transition-colors hover:text-muted-foreground"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
