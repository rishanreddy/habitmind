"use client";

import { Toaster } from "sonner";
import { ReactNode, useState } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors />
      <NuqsAdapter>{children}</NuqsAdapter>
    </QueryClientProvider>
  );
}
