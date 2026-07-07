import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote:
      "We shortlisted three analytics tools in an afternoon instead of a week of vendor calls. The pricing transparency alone was worth switching for.",
    name: "Priya Nair",
    role: "Head of Ops, sample company",
    initials: "PN",
  },
  {
    quote:
      "As a seller, the built-in inquiry inbox replaced four different tools we were using to track leads. Setup took less than an hour.",
    name: "Marcus Webb",
    role: "Founder, sample seller",
    initials: "MW",
  },
  {
    quote:
      "Verified reviews meant our team could trust a small vendor we'd never heard of. That trust is usually the hardest part of procurement.",
    name: "Elena Torres",
    role: "IT Manager, sample company",
    initials: "ET",
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Loved by buyers and sellers alike
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Illustrative feedback from the kind of teams Marketspace is built
          for.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <Card key={t.name}>
            <CardContent className="flex h-full flex-col gap-4 pt-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-4 fill-yellow-500 text-yellow-500"
                  />
                ))}
              </div>
              <p className="flex-1 text-sm text-muted-foreground">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{t.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
