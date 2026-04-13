"use client";

import { ToastViewport } from "@/app/components/toast/toast.client";
import { Toast } from "@base-ui/react/toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <Toast.Provider>
          {children}
          <ToastViewport />
        </Toast.Provider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
