import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-from to-brand-to px-6 py-16 text-center sm:px-16">
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />
          <div className="relative">
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Ready to find your next tool?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-balance text-white/85">
              Join buyers and sellers already using Marketspace to skip the
              procurement guesswork.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button size="lg" variant="secondary" asChild className="gap-2">
                <Link href="/sign-up">
                  Get started free
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/contact">Talk to us</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
