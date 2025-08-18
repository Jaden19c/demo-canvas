import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 60,
      gcTime: 1000 * 60 * 60 * 2,
    },
    mutations: {
      retry: 0,
    },
  },
});
createRoot(document.getElementById("root")!).render(
  <>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </>
);
