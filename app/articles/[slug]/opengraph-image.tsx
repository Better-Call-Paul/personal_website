import { ImageResponse } from "next/og"
import { articles } from "@/lib/articles"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }))
}

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = articles.find((a) => a.slug === slug)
  const title = article?.title ?? "Article"

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: "#999",
            marginBottom: 24,
          }}
        >
          Paul Chan
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#111",
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>
      </div>
    ),
    { ...size }
  )
}
