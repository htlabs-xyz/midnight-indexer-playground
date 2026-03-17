import Link from "next/link"
import type { SchemaVersion } from "@/lib/config"

const versions: { version: SchemaVersion; label: string; color: string; hoverBorder: string }[] = [
  { version: "v1", label: "Indexer V1", color: "bg-[#1f6feb]", hoverBorder: "hover:border-[#1f6feb]" },
  { version: "v3", label: "Indexer V3", color: "bg-[#238636]", hoverBorder: "hover:border-[#238636]" },
  { version: "v4", label: "Indexer V4", color: "bg-[#a371f7]", hoverBorder: "hover:border-[#a371f7]" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Midnight Indexer Playground
        </h1>
        <p className="text-[#8b949e] mb-8">
          Select a schema version to get started
        </p>
        <div className="flex gap-6 justify-center flex-wrap">
          {versions.map(({ version, label, color, hoverBorder }) => (
            <Link
              key={version}
              href={`/${version}`}
              className={`block p-8 bg-[#161b22] border border-[#30363d] rounded-xl no-underline text-inherit w-[200px] transition-all duration-200 hover:-translate-y-0.5 ${hoverBorder}`}
            >
              <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-semibold text-white mb-4 ${color}`}>
                {version.toUpperCase()}
              </span>
              <h2 className="text-xl font-semibold text-white m-0">
                {label}
              </h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
