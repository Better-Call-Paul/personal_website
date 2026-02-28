import Image from "next/image"
import { Navigation } from "@/components/navigation"

export default function Code() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="relative w-full h-32 mb-8 overflow-hidden rounded-sm">
          <Image
            src="/images/design-mode/code-header.png"
            alt="Performance visualization"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        <h1 className="font-serif text-4xl mb-12 text-gray-900">Work</h1>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="text-gray-600 font-serif text-sm whitespace-nowrap pt-1">2022 - Present</div>
            <div className="flex-1 border-t border-dotted border-gray-300 mt-3"></div>
            <div className="text-gray-900 font-serif w-48">
              <div className="font-semibold">New York University</div>
              <div className="text-sm text-gray-600">Computer Science Student</div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="text-gray-600 font-serif text-sm whitespace-nowrap pt-1">Summer 2025</div>
            <div className="flex-1 border-t border-dotted border-gray-300 mt-3"></div>
            <div className="text-gray-900 font-serif w-48">
              <div className="font-semibold">AppLovin</div>
              <div className="text-sm text-gray-600">Software Engineering Intern</div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="text-gray-600 font-serif text-sm whitespace-nowrap pt-1">Summer 2024</div>
            <div className="flex-1 border-t border-dotted border-gray-300 mt-3"></div>
            <div className="text-gray-900 font-serif w-48">
              <div className="font-semibold">Nodexus</div>
              <div className="text-sm text-gray-600">Software Engineering Intern</div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="text-gray-600 font-serif text-sm whitespace-nowrap pt-1">Summer 2023</div>
            <div className="flex-1 border-t border-dotted border-gray-300 mt-3"></div>
            <div className="text-gray-900 font-serif w-48">
              <div className="font-semibold">Nodexus</div>
              <div className="text-sm text-gray-600">Software Engineering Intern</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
