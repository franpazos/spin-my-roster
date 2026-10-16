"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Copy, Download, Loader2, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  nodeToPngBlob,
  downloadBlob,
  canShareFiles,
  shareBlobAsFile,
  canCopyImageToClipboard,
  copyBlobToClipboard,
} from "@/lib/rosterShare";

export function RosterShareBar({
  exportRef,
  fileName = "spin-my-roster.png",
  shareUrl,
}) {
  // Which action is generating an image: "save" | "copy" | "share" | null.
  const [busy, setBusy] = useState(null);
  // Feature checks run after mount so server and client markup match.
  const [support, setSupport] = useState({ share: false, copy: false });

  useEffect(() => {
    setSupport({ share: canShareFiles(), copy: canCopyImageToClipboard() });
  }, []);

  async function buildBlob() {
    const node = exportRef?.current;
    if (!node) throw new Error("Export card not found");
    return await nodeToPngBlob(node);
  }

  async function run(action, task) {
    if (busy) return;
    setBusy(action);
    try {
      await task();
    } finally {
      setBusy(null);
    }
  }

  function handleSave() {
    return run("save", async () => {
      try {
        const blob = await buildBlob();
        downloadBlob(blob, fileName);
        toast.success("Lineup image saved");
      } catch (e) {
        console.error("[share] Save failed:", e);
        toast.error("Could not generate the image. Try again.");
      }
    });
  }

  function handleShare() {
    return run("share", async () => {
      try {
        const blob = await buildBlob();
        await shareBlobAsFile({
          blob,
          fileName,
          title: "Spin My Roster",
          text: shareUrl ? `Try it here: ${shareUrl}` : "Spin My Roster",
        });
      } catch (e) {
        // The user closed the share sheet: not an error.
        if (e?.name === "AbortError") return;
        console.error("[share] Share failed:", e);
        toast.error("Sharing isn’t supported here. Use Save image instead.");
      }
    });
  }

  function handleCopy() {
    return run("copy", async () => {
      try {
        const blob = await buildBlob();
        await copyBlobToClipboard(blob);
        toast.success("Lineup image copied");
      } catch (e) {
        console.error("[share] Copy failed:", e);
        toast.error("Copy isn’t supported here. Use Save image instead.");
      }
    });
  }

  const secondary =
    "inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-line-strong bg-surface-3 px-3 text-sm font-semibold text-ink transition-colors hover:bg-surface-4 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className="w-full space-y-2" aria-busy={Boolean(busy) || undefined}>
      <button
        type="button"
        onClick={handleShare}
        disabled={Boolean(busy) || !support.share}
        title={!support.share ? "Sharing not supported in this browser. Use Save image." : undefined}
        className={cn(
          "inline-flex min-h-14 w-full items-center justify-center gap-2.5 rounded-xl font-display text-xl font-extrabold uppercase tracking-[0.08em] transition-[transform,background-color] duration-150",
          "bg-lime text-lime-ink shadow-accent hover:-translate-y-0.5 hover:bg-lime-strong active:translate-y-px",
          "disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-surface-3 disabled:text-ink-muted disabled:shadow-none",
        )}
      >
        <ActionIcon busy={busy === "share"} icon={Share2} />
        {busy === "share" ? "Preparing…" : "Share lineup"}
      </button>
      {!support.share && (
        <p className="text-center text-xs text-ink-muted">Sharing isn’t available in this browser — save or copy the image.</p>
      )}

      <div className="flex gap-2">
        <button type="button" onClick={handleSave} disabled={Boolean(busy)} className={secondary}>
          <ActionIcon busy={busy === "save"} icon={Download} />
          {busy === "save" ? "Generating…" : "Save image"}
        </button>
        <button
          type="button"
          onClick={handleCopy}
          disabled={Boolean(busy)}
          title={!support.copy ? "Copy not supported in this browser." : undefined}
          className={secondary}
        >
          <ActionIcon busy={busy === "copy"} icon={Copy} />
          {busy === "copy" ? "Generating…" : "Copy"}
        </button>
      </div>
    </div>
  );
}

function ActionIcon({ busy, icon: Icon }) {
  const Component = busy ? Loader2 : Icon;
  return <Component className={cn("h-4 w-4 shrink-0", busy && "animate-spin")} aria-hidden="true" />;
}
