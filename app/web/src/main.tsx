import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import ContentPage from "./pages/content.tsx"
import MainPage from "./pages/main.tsx"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { StorageProvider } from "./components/providers/storageContext.tsx"

const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/content/:url",
    element: <ContentPage />,
  },
])

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StorageProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={routes} />
      </QueryClientProvider>
    </StorageProvider>
  </React.StrictMode>,
)
