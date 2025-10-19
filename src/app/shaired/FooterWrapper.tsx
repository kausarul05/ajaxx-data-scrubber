"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import Footer from "./Footer";

export default function FooterWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideFooter = pathname.startsWith("/dashboard");

  return (
    <>
      {children}
      {!hideFooter && <Footer />}
    </>
  );
}
