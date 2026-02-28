import Image from "next/image"
import { notFound } from "next/navigation"
import { articles } from "@/lib/articles"
import { Navigation } from "@/components/navigation"

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

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="max-w-4xl mx-auto px-6 py-16">
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
          <h1 className="font-serif text-4xl mb-8 text-gray-900 leading-tight">{article.title}</h1>

          <div className="prose prose-lg max-w-none text-gray-900 leading-relaxed space-y-6 text-justify">
            {article.content.map((section, i) => (
              <div key={i}>
                {section.type === "paragraph" && <p>{section.text}</p>}
                {section.type === "heading" && (
                  <h2 className="font-serif text-2xl mt-12 mb-4 text-gray-900">{section.text}</h2>
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
              </div>
            ))}
          </div>
        </article>
      </main>
    </div>
  )
}
