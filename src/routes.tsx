import { createBrowserRouter } from "react-router"
import { RootLayout } from "./layouts/RootLayout"

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        lazy: async () => {
          const { HomePage } = await import("./pages/HomePage")
          return { Component: HomePage }
        },
      },
      {
        path: "work/:slug",
        lazy: async () => {
          const { ProjectPage } = await import("./pages/ProjectPage")
          return { Component: ProjectPage }
        },
      },
      {
        path: "*",
        lazy: async () => {
          const { NotFoundPage } = await import("./pages/ProjectPage")
          return { Component: NotFoundPage }
        },
      },
    ],
  },
])
