import fs from "fs/promises";
import path from "path";
import { MarkdownPage } from "@/components/MarkdownPage";

export const metadata = {
  title: "License | cssvg-icon",
  description: "MIT License for the cssvg-icon library.",
  alternates: {
    canonical: "/license",
  },
};

export default async function LicensePage() {
  const filePath = path.join(process.cwd(), "LICENSE");
  const rawContent = await fs.readFile(filePath, "utf-8");
  
  // Wrap in markdown to render as code block in MarkdownPage
  const content = `# License\n\n\`\`\`\n${rawContent}\n\`\`\``;

  return <MarkdownPage content={content} title="License" />;
}
