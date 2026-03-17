import { Playground } from "@/app/components/playground"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Midnight Indexer V4",
}

export default function V4Page() {
  return <Playground version="v4" />
}
