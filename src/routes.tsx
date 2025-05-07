import React, { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import { normalizeAppPath } from "./utils/app-paths";

// Dynamically import all .tsx files under /app
const allModules = import.meta.glob<
  true,
  string,
  () => Promise<{ default: React.ComponentType; meta?: { title: string } }>
>("./app/**/*.tsx");

// Filter for all page.tsx files
const pageModules = Object.entries(allModules).filter(([path]) =>
  /\/page\.tsx$/.test(path)
);

// Filter for all layout.tsx files
const layoutModules = Object.entries(allModules).filter(([path]) =>
  /\/layout\.tsx$/.test(path)
);

// Build a map of routePrefix -> lazy layout component
const layoutMap = layoutModules.map(([path, loader]) => {
  const routePrefix =
    path.replace(/^\.\/app/, "").replace(/\/layout\.tsx$/, "") || "/";
  return {
    routePrefix,
    loader: lazy(loader),
  };
});

// Construct the route configuration for each page
export const routes: RouteObject[] = pageModules.map(([filePath, loader]) => {
  // Normalize the path string to use as the route path
  const path = normalizeAppPath(filePath.replace(/^\.\/app/, ""));

  const Page = lazy(loader);

  // Match all layouts that are parent paths of this page, sorted by depth
  const matchedLayouts = layoutMap
    .filter(({ routePrefix }) => filePath.startsWith(`./app${routePrefix}`))
    .sort((a, b) => b.routePrefix.length - a.routePrefix.length);

  // Wrap the Page with matched layouts from innermost to outermost
  let element = React.createElement(Page);
  for (const layout of matchedLayouts) {
    element = React.createElement(layout.loader, null, element);
  }

  // Return the route object with Suspense fallback
  return {
    path,
    element: React.createElement(
      Suspense,
      { fallback: <div>Loading...</div> },
      element
    ),
  };
});
