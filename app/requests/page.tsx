import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowUpRight } from "lucide-react";
import IconRequestForm from "@/components/IconRequestForm";

export const metadata = {
  title: "Icon Requests & Registry | cssvg-icons",
  description: "Request a new animated SVG icon or browse all available icons in the cssvg-icons open-source library.",
  alternates: { canonical: "https://icon.cssvg.com/requests" },
};

interface GitHubIssue {
  number: number;
  title: string;
  html_url: string;
  state: "open" | "closed";
  created_at: string;
  labels: { name: string; color: string }[];
  user: { login: string; html_url: string };
}

async function getIconRequests(): Promise<GitHubIssue[]> {
  try {
    const res = await fetch(
      "https://api.github.com/repos/Harijohnson/cssvg-icon/issues?labels=icon-request&state=all&per_page=50&sort=created&direction=desc",
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 300 }, // revalidate every 5 minutes
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function RequestsPage() {
  const issues = await getIconRequests();

  const open = issues.filter((i) => i.state === "open");
  const closed = issues.filter((i) => i.state === "closed");

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-14 lg:py-20 space-y-16">

        {/* Hero */}
        <div className="space-y-2 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter">Icon Requests</h1>
          <p className="text-zinc-500 text-sm leading-relaxed max-w-lg mx-auto">
            Don&apos;t see the icon you need? Fill in the form below and we&apos;ll add it to the queue.
          </p>
        </div>

        {/* Request form */}
        <IconRequestForm />

        {/* How it works */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                step: "01",
                title: "Submit a request",
                desc: "Fill in the form above with the icon name, a short description, and a reference link. It opens a pre-filled GitHub issue.",
              },
              {
                step: "02",
                title: "We design & animate",
                desc: "We build the icon in the CSSVG Editor — 40×40 canvas, SMIL animations, customisable color, size, and stroke.",
              },
              {
                step: "03",
                title: "Published to npm",
                desc: "Once merged, the icon is automatically published to the cssvg-icons npm package and appears in the explorer.",
              },
            ].map((item) => (
              <div key={item.step} className="rounded-xl border border-zinc-900 bg-zinc-950 p-5 space-y-2">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{item.step}</span>
                <h3 className="text-sm font-bold text-white">{item.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Requests table */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Icon Request Queue</h2>
              <p className="text-xs text-zinc-600">
                {open.length} open · {closed.length} completed
              </p>
            </div>
            <a
              href="https://github.com/Harijohnson/cssvg-icon/issues?q=label%3Aicon-request"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-zinc-500 hover:text-white transition-colors"
            >
              View on GitHub <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {issues.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-800 py-12 text-center">
              <p className="text-zinc-600 text-sm">No icon requests yet.</p>
              <p className="text-zinc-700 text-xs mt-1">Be the first to submit one above.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-900 overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_auto_auto] text-[10px] font-bold uppercase tracking-widest text-zinc-600 px-4 py-2.5 border-b border-zinc-900 bg-zinc-950">
                <span>Icon request</span>
                <span className="text-center px-4">Status</span>
                <span className="text-right">Link</span>
              </div>

              {/* Open issues first */}
              {open.length > 0 && (
                <>
                  <div className="px-4 py-1.5 bg-zinc-950/50 border-b border-zinc-900">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">Open</span>
                  </div>
                  {open.map((issue, i) => (
                    <IssueRow key={issue.number} issue={issue} alt={i % 2 === 0} />
                  ))}
                </>
              )}

              {/* Completed issues */}
              {closed.length > 0 && (
                <>
                  <div className="px-4 py-1.5 bg-zinc-950/50 border-y border-zinc-900">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">Completed</span>
                  </div>
                  {closed.map((issue, i) => (
                    <IssueRow key={issue.number} issue={issue} alt={i % 2 === 0} />
                  ))}
                </>
              )}
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}

function IssueRow({ issue, alt }: { issue: GitHubIssue; alt: boolean }) {
  const iconName = issue.title.replace(/^icon request:\s*/i, "").trim();
  const date = new Date(issue.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className={`grid grid-cols-[1fr_auto_auto] items-center px-4 py-3 gap-4 ${
        alt ? "bg-black" : "bg-zinc-950/30"
      }`}
    >
      <div className="flex flex-col min-w-0">
        <span className="text-white font-medium text-xs truncate">{iconName}</span>
        <span className="text-zinc-600 text-[10px]">
          #{issue.number} · {date} · by{" "}
          <a
            href={issue.user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-400 transition-colors"
          >
            {issue.user.login}
          </a>
        </span>
      </div>

      <div className="flex items-center justify-center px-4">
        {issue.state === "open" ? (
          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
            <span className="w-1 h-1 rounded-full bg-emerald-400 inline-block" />
            Open
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-purple-950 text-purple-400 border border-purple-800">
            <span className="w-1 h-1 rounded-full bg-purple-400 inline-block" />
            Done
          </span>
        )}
      </div>

      <a
        href={issue.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-white transition-colors whitespace-nowrap"
      >
        View <ArrowUpRight className="w-3 h-3" />
      </a>
    </div>
  );
}
