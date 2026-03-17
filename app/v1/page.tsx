import { Playground } from "@/app/components/playground"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Midnight Indexer V1",
}

export default function V1Page() {
  return <Playground version="v1" />
}
