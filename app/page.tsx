import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { articles } from "@/lib/articles"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-8 w-full h-32 relative overflow-hidden">
          <Image
            src="/images/design-mode/home-header.png"
            alt="Performance visualization"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        <h1 className="font-serif text-4xl mb-4 text-gray-900">Paul Chan</h1>

        <div className="mb-8 font-serif text-2xl leading-relaxed">
          <span className="text-gray-900">is a </span>
          <span className="text-red-600">writer, engineer,</span>
          <span className="text-gray-900"> and </span>
          <span className="text-red-600">researcher</span>
          <span className="text-gray-900">.</span>
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-gray-900 leading-relaxed mb-4">
            Hi, I'm Paul. I like high-performance computing and machine learning, mostly the interplay between how
            machine learning and hardware architectures influence each other.
          </p>
        </div>

        <div className="space-y-12">
          {articles.map((article) => (
            <article key={article.slug}>
              <h2 className="mb-4">
                <Link
                  href={`/articles/${article.slug}`}
                  className="text-red-600 hover:text-red-700 font-serif text-xl leading-tight"
                >
                  {article.title}
                </Link>
              </h2>

              <div className="text-gray-900 leading-relaxed space-y-4 text-justify">
                {article.excerpt.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}
