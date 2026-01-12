"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
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
  const [busy, setBusy] = useState(false);
  const shareSupported = useMemo(() => canShareFiles(), []);
  const copySupported = useMemo(() => canCopyImageToClipboard(), []);

  async function buildBlob() {
    const node = exportRef?.current;
    if (!node) throw new Error("Export card not found");
    return await nodeToPngBlob(node);
  }

  async function handleSave() {
    try {
      setBusy(true);
      const blob = await buildBlob();
      downloadBlob(blob, fileName);
    } catch (e) {
      console.error("[share] Save failed:", e);
      alert("Could not generate image. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleShare() {
    try {
      setBusy(true);
      const blob = await buildBlob();

      await shareBlobAsFile({
        blob,
        fileName,
        title: "Spin My Roster",
        text: shareUrl ? `Try it here: ${shareUrl}` : "Spin My Roster",
      });
    } catch (e) {
      console.error("[share] Share failed:", e);
      // Friendly fallback
      alert("Sharing isn’t supported here. Use Save Image instead.");
    } finally {
      setBusy(false);
    }
  }

  async function handleCopy() {
    try {
      setBusy(true);
      const blob = await buildBlob();
      await copyBlobToClipboard(blob);
      alert("Copied to clipboard ✅");
    } catch (e) {
      console.error("[share] Copy failed:", e);
      alert("Copy isn’t supported here. Use Save Image instead.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-sm flex gap-2">
      <Button
        type="button"
        onClick={handleSave}
        disabled={busy}
        className={cn("flex-1 bg-zinc-800 hover:bg-zinc-700 text-white")}
      >
        {busy ? "Generating..." : "Save Image"}
      </Button>

      <Button
        type="button"
        onClick={handleCopy}
        disabled={busy}
        className={cn("bg-zinc-800 hover:bg-zinc-700 text-white")}
        title={
          !copySupported ? "Copy not supported in this browser." : undefined
        }
      >
        {busy ? "Generating..." : "Copy"}
      </Button>

      <Button
        type="button"
        onClick={handleShare}
        disabled={busy || !shareSupported}
        className={cn("flex-1 bg-emerald-600 hover:bg-emerald-500 text-white")}
        title={
          !shareSupported
            ? "Sharing not supported in this browser. Use Save Image."
            : undefined
        }
      >
        {busy ? "Generating..." : "Share"}
      </Button>
    </div>
  );
}
