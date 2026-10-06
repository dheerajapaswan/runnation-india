"use client";

import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export function LogoutButton({ kind }: { kind: "admin" | "participant" }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await api(`/api/${kind}/logout`, { method: "POST" });
        router.replace(kind === "admin" ? "/admin/login" : "/dashboard/login");
        router.refresh();
      }}
      className="min-h-11 border border-white/20 px-5 text-sm font-semibold hover:border-bone"
    >
      Sign out
    </button>
  );
}
