// src/lib/rosterShare.js
import { toPng } from "html-to-image";

export async function nodeToPngBlob(node) {
  if (!node) throw new Error("Missing node to export");

  // `toPng` returns a dataURL. Convert to Blob.
  const dataUrl = await toPng(node, {
    cacheBust: true,
    pixelRatio: 2, // crisper image
  });

  const res = await fetch(dataUrl);
  return await res.blob();
}

export function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function canShareFiles() {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function" &&
    typeof File !== "undefined"
  );
}

export async function shareBlobAsFile({ blob, fileName, title, text }) {
  const file = new File([blob], fileName, { type: blob.type || "image/png" });

  // Some browsers require canShare() for files
  if (navigator.canShare && !navigator.canShare({ files: [file] })) {
    throw new Error("File sharing not supported");
  }

  await navigator.share({
    title,
    text,
    files: [file],
  });
}

export function canCopyImageToClipboard() {
  return (
    typeof navigator !== "undefined" &&
    navigator.clipboard &&
    typeof window !== "undefined" &&
    typeof window.ClipboardItem !== "undefined"
  );
}

export async function copyBlobToClipboard(blob) {
  // ClipboardItem expects a map of MIME -> Blob
  const item = new window.ClipboardItem({ [blob.type || "image/png"]: blob });
  await navigator.clipboard.write([item]);
}
