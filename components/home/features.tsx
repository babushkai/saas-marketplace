"use client";

import { motion } from "motion/react";
import {
  BadgeCheck,
  BarChart3,
  MessageSquare,
  Search,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: Search,
    title: "Powerful discovery",
    description:
      "Filter by category, pricing model, and integrations to find the exact tool your stack is missing.",
  },
  {
    icon: BadgeCheck,
    title: "Verified sellers",
    description:
      "Every seller is reviewed before listing, so you're buying from real, accountable teams.",
  },
  {
    icon: MessageSquare,
    title: "Direct inquiries",
    description:
      "Message sellers directly and track every conversation from a single inbox.",
  },
  {
    icon: BarChart3,
    title: "Seller analytics",
    description:
      "Sellers get real-time views, inquiry, and conversion analytics on every listing.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent pricing",
    description:
      "No hidden fees or gated quotes — every listing shows real pricing up front.",
  },
  {
    icon: Zap,
    title: "Fast onboarding",
    description:
      "Go from browsing to a signed deal in days, not procurement cycles.",
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Everything you need to buy and sell SaaS
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Marketspace handles discovery, trust, and communication so both
          sides can focus on the deal.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ y: -4 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="size-5 text-primary" />
                </div>
                <CardTitle className="mt-4">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
