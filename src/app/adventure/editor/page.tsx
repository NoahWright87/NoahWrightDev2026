import type { Metadata } from "next";
import EditorClient from "@/components/adventure/editor/EditorClient";

export const metadata: Metadata = {
  title: "Adventure editor",
  description:
    "The editor behind the site's text adventure: a grid of rooms, items, characters and rules. Build your own in the browser.",
};

export default function AdventureEditorPage() {
  return <EditorClient />;
}
