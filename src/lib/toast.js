"use client";

// Tiny dependency-free toast store. A singleton pub/sub so any client component
// can fire a toast without prop-drilling or a context wrapper:
//
//   import { toast } from "@/lib/toast";
//   toast.success("Registered — under review");
//   const id = toast.loading("Verifying…");  toast.dismiss(id);
//
// <Toaster /> (mounted once in the root layout) subscribes and renders them.

let toasts = [];
const listeners = new Set();
let counter = 0;

function emit() {
  for (const l of listeners) l(toasts);
}

export function subscribe(fn) {
  listeners.add(fn);
  fn(toasts);
  return () => listeners.delete(fn);
}

export function dismiss(id) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

export function toast(message, { type = "info", duration = 3500 } = {}) {
  const id = ++counter;
  toasts = [...toasts, { id, message, type }];
  emit();
  if (duration > 0 && typeof window !== "undefined") {
    setTimeout(() => dismiss(id), duration);
  }
  return id;
}

toast.success = (m, o) => toast(m, { ...o, type: "success" });
toast.error = (m, o) => toast(m, { ...o, type: "error", duration: 5000, ...o });
toast.info = (m, o) => toast(m, { ...o, type: "info", ...o });
// Loading toasts persist until you dismiss() them with the returned id.
toast.loading = (m, o) => toast(m, { ...o, type: "loading", duration: 0 });
toast.dismiss = dismiss;
