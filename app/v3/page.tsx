import { Playground } from "@/app/components/playground"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Midnight Indexer V3",
}

export default function V3Page() {
  return <Playground version="v3" />
}
