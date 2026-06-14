import { memo } from "react";
import Link from "next/link";

function Header() {
  return (
    <header className="relative mx-auto flex w-full shrink-0 items-center justify-center px-4 py-6">
      <Link
        href="/"
        className="group inline-flex items-center gap-3 rounded-full border border-gray-200 bg-white/80 px-3.5 py-2 shadow-sm backdrop-blur transition hover:border-gray-300 hover:bg-white"
        aria-label="HyperSpeed home"
      >
        <img
          src="/hyperspeed-mark.svg"
          alt=""
          className="size-7 object-contain"
        />
        <span className="text-sm font-semibold tracking-[0.08em] text-gray-900">
          HyperSpeed
        </span>
      </Link>
    </header>
  );
}

export default memo(Header);
