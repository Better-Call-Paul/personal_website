import Image from "next/image"
import { notFound } from "next/navigation"
import { articles } from "@/lib/articles"
import { Navigation } from "@/components/navigation"
import { TableOfContents } from "@/components/table-of-contents"
import { WarpSpecializationDiagram } from "@/components/warp-specialization-diagram"
import { SMArchitectureDiagram } from "@/components/sm-architecture-diagram"

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

export function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = articles.find((a) => a.slug === slug)

  if (!article) {
    notFound()
  }

  const tocItems = article.content
    .filter((s) => s.type === "heading" && s.text)
    .map((s) => ({ id: slugify(s.text!), text: s.text! }))

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="max-w-7xl mx-auto px-6 py-16 flex gap-12">
        <main className="max-w-4xl flex-1 min-w-0">
          <article>
            {article.heroImage && (
              <div className="mb-8">
                <Image
                  src={article.heroImage}
                  alt={article.title}
                  width={1200}
                  height={800}
                  className="w-full h-auto rounded-sm"
                  priority
                />
              </div>
            )}
            <h1 className="font-serif text-4xl mb-3 text-gray-900 leading-tight">{article.title}</h1>
            {article.date && (
              <p className="font-serif text-gray-400 italic mb-8">{article.date}</p>
            )}

            <div className="prose prose-lg max-w-none text-gray-900 leading-relaxed space-y-6 text-justify">
              {article.content.map((section, i) => (
                <div key={i}>
                  {section.type === "paragraph" && <p>{section.text}</p>}
                  {section.type === "heading" && (
                    <h2 id={slugify(section.text || "")} className="font-serif text-2xl mt-12 mb-4 text-gray-900 scroll-mt-24">{section.text}</h2>
                  )}
                  {section.type === "code" && (
                    <pre className="bg-gray-50 border border-gray-200 rounded p-4 overflow-x-auto">
                      <code className="text-sm font-mono text-gray-900">{section.text}</code>
                    </pre>
                  )}
                  {section.type === "image" && section.src && (
                    <div className="my-8">
                      <Image
                        src={section.src || "/placeholder.svg"}
                        alt={section.alt || "Article image"}
                        width={1200}
                        height={800}
                        className={section.width ? "h-auto rounded mx-auto" : "w-full h-auto rounded"}
                        style={section.width ? { width: `${section.width}px` } : undefined}
                      />
                    </div>
                  )}
                  {section.type === "component" && section.componentId === "warp-specialization" && (
                    <div className="my-8">
                      <WarpSpecializationDiagram />
                    </div>
                  )}
                  {section.type === "component" && section.componentId === "sm-architecture" && (
                    <div className="my-8">
                      <SMArchitectureDiagram />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </article>
          <div className="h-[17vh]" />
        </main>

        <aside className="w-48 flex-shrink-0 self-start sticky top-24 hidden xl:block">
          <TableOfContents items={tocItems} />
        </aside>
      </div>
    </div>
  )
}
