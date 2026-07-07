"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
      <div className="pointer-events-none absolute left-1/2 top-[-10rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-brand-from/30 to-brand-to/20 blur-3xl" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pb-20 pt-20 text-center sm:px-6 sm:pb-28 sm:pt-28 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge
            variant="secondary"
            className="gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
          >
            <Sparkles className="size-3.5 text-primary" />
            The marketplace for vetted SaaS tools
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-6 max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl"
        >
          Find the SaaS your team needs,{" "}
          <span className="bg-gradient-to-br from-brand-from to-brand-to bg-clip-text text-transparent">
            without the guesswork
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 max-w-xl text-balance text-lg text-muted-foreground"
        >
          Marketspace connects buyers with independent SaaS sellers —
          transparent pricing, verified reviews, and a single dashboard to
          track every inquiry.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <Button size="lg" asChild className="gap-2">
            <Link href="/sign-up">
              Start browsing
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/sign-up">List your product</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="relative mt-16 w-full max-w-4xl"
        >
          <div className="rounded-2xl border border-border/60 bg-card/60 p-2 shadow-2xl shadow-primary/10 backdrop-blur">
            <div className="flex items-center gap-1.5 border-b border-border/60 px-3 py-2.5">
              <span className="size-2.5 rounded-full bg-destructive/60" />
              <span className="size-2.5 rounded-full bg-yellow-500/60" />
              <span className="size-2.5 rounded-full bg-emerald-500/60" />
            </div>
            <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-3">
              {["Analytics Suite", "CRM Pro", "DevOps Toolkit"].map(
                (name, i) => (
                  <div
                    key={name}
                    className="rounded-xl border border-border/60 bg-background p-4 text-left"
                  >
                    <div className="mb-3 h-8 w-8 rounded-lg bg-gradient-to-br from-brand-from to-brand-to" />
                    <p className="text-sm font-medium">{name}</p>
                    <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="size-3 fill-yellow-500 text-yellow-500" />
                      4.{8 - i}
                      <span className="mx-1">&middot;</span>
                      Verified seller
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
