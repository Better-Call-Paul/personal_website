"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { collections, labels, type CollectionItem } from "@/lib/collections"
import { Bookmark } from "lucide-react"

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace("www.", "")
  } catch {
    return url
  }
}

export default function CollectionsPage() {
  const [activeLabel, setActiveLabel] = useState<string | null>(null)
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set())

  const filtered = activeLabel
    ? collections.filter((item) => item.labels.includes(activeLabel))
    : collections

  const toggleSave = (url: string) => {
    setSavedItems((prev) => {
      const next = new Set(prev)
      if (next.has(url)) next.delete(url)
      else next.add(url)
      return next
    })
  }

  const labelCounts = labels.map((label) => ({
    ...label,
    count: collections.filter((item) => item.labels.includes(label.name)).length,
  }))

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="font-serif text-4xl text-gray-900 mb-8">Collections</h1>

        {/* ── Label filters ── */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActiveLabel(null)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              activeLabel === null
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Bookmark className="w-3 h-3" />
            all
            <span className="ml-0.5 text-[10px] opacity-70">{collections.length}</span>
          </button>
          {labelCounts.map((label) => (
            <button
              key={label.name}
              onClick={() =>
                setActiveLabel(activeLabel === label.name ? null : label.name)
              }
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeLabel === label.name
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span>{label.emoji}</span>
              {label.name}
              <span className="ml-0.5 text-[10px] opacity-70">{label.count}</span>
            </button>
          ))}
        </div>

        {/* ── Card grid ── */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-lg">No items yet.</p>
            <p className="text-sm mt-2">
              Add items in <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">lib/collections.ts</code>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((item) => (
              <CollectionCard
                key={item.url}
                item={item}
                isSaved={savedItems.has(item.url)}
                onToggleSave={() => toggleSave(item.url)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function CollectionCard({
  item,
  isSaved,
  onToggleSave,
}: {
  item: CollectionItem
  isSaved: boolean
  onToggleSave: () => void
}) {
  const labelDef = labels.find((l) => item.labels.includes(l.name))

  return (
    <div className="group rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-md transition-shadow">
      {/* Thumbnail — uses manual image if provided, otherwise auto-generates from URL */}
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="block">
        <div className="relative aspect-[16/10] bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              item.thumbnail ||
              `https://api.microlink.io/?url=${encodeURIComponent(item.url)}&screenshot=true&meta=false&embed=screenshot.url`
            }
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </a>

      {/* Info */}
      <div className="p-3.5">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <h3 className="font-serif text-sm font-semibold text-gray-900 leading-snug mb-1 group-hover:text-red-600 transition-colors">
            {item.title}
          </h3>
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            {getDomain(item.url)}
          </p>
        </a>

        {/* Footer: bookmark + label */}
        <div className="flex items-center justify-between mt-3">
          <button
            onClick={onToggleSave}
            className="text-gray-300 hover:text-gray-600 transition-colors"
            aria-label={isSaved ? "Unsave" : "Save"}
          >
            <Bookmark
              className="w-4 h-4"
              fill={isSaved ? "currentColor" : "none"}
            />
          </button>
          {labelDef && (
            <span
              className={`inline-flex items-center gap-1 text-[11px] ${labelDef.color} bg-gray-50 rounded-full px-2 py-0.5`}
            >
              <span>{labelDef.emoji}</span>
              {labelDef.name}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
