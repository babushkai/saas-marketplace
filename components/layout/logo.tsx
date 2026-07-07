import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 text-lg font-semibold tracking-tight",
        className,
      )}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-from to-brand-to text-sm font-bold text-white">
        M
      </span>
      <span>Marketspace</span>
    </Link>
  );
}
