import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-8 w-full h-32 relative overflow-hidden">
          <Image
            src="/images/design-mode/about-header.png"
            alt="Performance visualization"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        <h1 className="font-serif text-4xl mb-8 text-gray-900">About</h1>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Text content on left */}
          <div className="flex-1 prose prose-lg max-w-none text-gray-900 leading-relaxed space-y-4 text-justify">
            <p>
              I'm studying Computer Science at New York University, where I spend way too much time trying to understand
              how to maximize CUDA kernel FLOPs.
            </p>

            <p>
              I've worked on low-latency C++ systems at AppLovin, built CUDA primitives for the Llama 3 architecture,
              including attention and communication kernels.
            </p>

            <p>
              These days I'm exploring how future GPU architectures might shift the balance between compute and
              communication, half research, half educated guessing, and occasionally just me staring at PTX documentation until it
              makes sense. I think that I've always been a performance engineer, as nothing is ever too early to optimize, and that also drew me to software as its leverage makes any efficiency increases maximally impactful. 
              This site is where I write about what I learn from working on GPU performance, inference
              engines, and try to understand, predict, and hopefully be apart of creating architectural shifts.
            </p>

            <p>
              You can reach me at{" "}
              <a href="mailto:pwc2029@nyu.edu" className="text-red-600 hover:text-red-700 underline">
                pwc2029@nyu.edu
              </a>{" "}
              or find me on{" "}
              <Link href="https://github.com/Better-Call-Paul" className="text-red-600 hover:text-red-700 underline">
                GitHub
              </Link>
              .
            </p>
          </div>

          {/* Portrait image on right */}
          <div className="md:w-80 flex-shrink-0">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden">
              <Image src="/images/paul-portrait.jpg" alt="Paul Chan" fill className="object-cover" priority />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
