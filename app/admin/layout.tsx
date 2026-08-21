"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // /admin giriş sayfası herkese açık kalmalı
    if (pathname === "/admin") {
      setChecking(false);
      return;
    }

    async function checkSession() {
      const {
        data: { session },
      } = await supabase().auth.getSession();

      if (!session) {
        router.replace("/admin");
        return;
      }

      setChecking(false);
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase().auth.onAuthStateChange((_event, session) => {
      if (!session && pathname !== "/admin") {
        router.replace("/admin");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (checking) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        Giriş kontrol ediliyor...
      </div>
    );
  }

  return <>{children}</>;
}