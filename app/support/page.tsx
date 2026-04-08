import fs from "fs/promises";
import path from "path";
import { MarkdownPage } from "@/components/MarkdownPage";

export const metadata = {
  title: "Support | cssvg-icon",
  description: "Get help and support for the cssvg-icon library.",
};

export default async function SupportPage() {
  const filePath = path.join(process.cwd(), "SUPPORT.md");
  const content = await fs.readFile(filePath, "utf-8");

  return <MarkdownPage content={content} title="Support" />;
}
