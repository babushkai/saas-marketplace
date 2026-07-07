"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How are sellers verified?",
    answer:
      "Every seller goes through a manual review before their first listing goes live, confirming company identity and product legitimacy.",
  },
  {
    question: "Does Marketspace take a cut of sales?",
    answer:
      "Marketspace charges sellers a monthly listing fee, not a percentage of sales — pricing between buyers and sellers stays direct.",
  },
  {
    question: "Can I message a seller before buying?",
    answer:
      "Yes. Every listing has an inquiry form that goes straight to the seller's dashboard, and you can track replies from your own dashboard.",
  },
  {
    question: "Is there a free plan?",
    answer:
      "Yes, the Free plan lets you browse all listings and send up to three inquiries a month at no cost.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Frequently asked questions
        </h2>
      </div>

      <Accordion type="single" collapsible className="mt-12">
        {faqs.map((faq, i) => (
          <AccordionItem key={faq.question} value={`item-${i}`}>
            <AccordionTrigger className="text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
