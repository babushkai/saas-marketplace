import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Free",
    price: "$0",
    description: "Browse listings and message up to 3 sellers per month.",
    features: ["Unlimited browsing", "3 seller inquiries / mo", "Basic search filters"],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    description: "For teams actively evaluating and buying SaaS tools.",
    features: [
      "Unlimited inquiries",
      "Saved searches & alerts",
      "Priority seller responses",
      "Team seats (up to 5)",
    ],
    highlighted: true,
  },
  {
    name: "Seller",
    price: "$99",
    description: "List and sell your product on Marketspace.",
    features: [
      "Unlimited listings",
      "Inquiry inbox & analytics",
      "Verified seller badge",
      "Featured placement credits",
    ],
    highlighted: false,
  },
];

export function PricingTeaser() {
  return (
    <section id="pricing" className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free. Upgrade when you&apos;re ready to move faster.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={cn(
                "relative",
                tier.highlighted && "ring-2 ring-primary",
              )}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Most popular
                </div>
              )}
              <CardHeader>
                <h3 className="text-lg font-semibold">{tier.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-semibold">{tier.price}</span>
                  <span className="text-sm text-muted-foreground">/mo</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {tier.description}
                </p>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <ul className="flex flex-col gap-2.5">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  variant={tier.highlighted ? "default" : "outline"}
                  className="mt-2"
                >
                  <Link href="/pricing">
                    {tier.name === "Free" ? "Get started" : "View plan"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
