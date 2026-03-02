"use client"

import { useEffect, useState } from "react"

interface TocItem {
  id: string
  text: string
}

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    function onScroll() {
      const nearBottom = (window.innerHeight + window.scrollY) >= (document.body.scrollHeight - 100)
      if (nearBottom && items.length > 0) {
        setActiveId(items[items.length - 1].id)
        return
      }
      let current = ""
      for (const item of items) {
        const el = document.getElementById(item.id)
        if (el && el.getBoundingClientRect().top <= 150) {
          current = item.id
        }
      }
      setActiveId(current)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [items])

  if (items.length === 0) return null

  return (
    <nav>
      <p className="font-serif text-sm font-semibold text-gray-900 mb-3">Contents</p>
      <ul className="space-y-2 border-l border-gray-200">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`block pl-4 text-sm leading-snug transition-colors ${
                activeId === item.id
                  ? "text-gray-900 border-l-2 border-gray-900 -ml-px"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
