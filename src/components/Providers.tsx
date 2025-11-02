"use client";

import { SessionProvider } from "next-auth/react";
import { OrderModalProvider } from "@/contexts/OrderModalContext";
import { OrderModal } from "@/components/OrderModal";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <OrderModalProvider>
        {children}
        <OrderModal />
      </OrderModalProvider>
    </SessionProvider>
  );
}
