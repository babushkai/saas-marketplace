import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
      <span className="text-xs font-medium uppercase tracking-wider text-primary">
        Coming soon
      </span>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">{description}</p>
      <Button asChild className="mt-8">
        <Link href="/">Back to home</Link>
      </Button>
    </section>
  );
}
