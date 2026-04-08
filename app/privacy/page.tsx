import fs from "fs/promises";
import path from "path";
import { MarkdownPage } from "@/components/MarkdownPage";

export const metadata = {
  title: "Privacy Policy | cssvg-icon",
  description: "Privacy policy and data handling for cssvg-icon.",
  alternates: {
    canonical: "/privacy",
  },
};

export default async function PrivacyPage() {
  const filePath = path.join(process.cwd(), "PRIVACY.md");
  const content = await fs.readFile(filePath, "utf-8");

  return <MarkdownPage content={content} title="Privacy Policy" />;
}
