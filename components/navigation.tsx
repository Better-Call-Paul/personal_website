"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function Navigation() {
  const pathname = usePathname()

  return (
    <header className="border-b border-gray-200">
      <nav className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-8">
        <Link
          href="/"
          className={`font-serif text-sm tracking-wider ${
            pathname === "/" || pathname.startsWith("/articles")
              ? "text-red-600 hover:text-red-700"
              : "text-gray-900 hover:text-red-600"
          }`}
        >
          BLOG
        </Link>
        <Link
          href="/about"
          className={`font-serif text-sm tracking-wider ${
            pathname === "/about" ? "text-red-600 hover:text-red-700" : "text-gray-900 hover:text-red-600"
          }`}
        >
          ABOUT
        </Link>
        <Link
          href="/code"
          className={`font-serif text-sm tracking-wider ${
            pathname === "/code" ? "text-red-600 hover:text-red-700" : "text-gray-900 hover:text-red-600"
          }`}
        >
          WORK
        </Link>
      </nav>
    </header>
  )
}
