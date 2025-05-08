import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import { tree } from "./utils/build";
import React from "react";
import { isDynamicRoute, isGroupSegment } from "./utils/app-paths";
console.table(tree);
type FileNode = {
  path: string;
  children?: FileNode[];
  loader?: () => Promise<{
    default: React.ComponentType;
    META?: { title: string };
  }>;
};

type Loader = () => Promise<{
  default: React.ComponentType;
  META?: {
    title: string;
  };
}>;

function splitArray<T>(arr: T[], predicate: (item: T) => boolean): [T[], T[]] {
  return arr.reduce<[T[], T[]]>(
    ([pass, fail], item) => {
      return predicate(item)
        ? [[...pass, item], fail]
        : [pass, [...fail, item]];
    },
    [[], []]
  );
}

function buildRoutes(
  fileNodes: FileNode[],
  parentLayouts: Loader[] = []
): RouteObject[] {
  // Inherit and copy layout loaders from the parent route level
  const layouts = [...parentLayouts];

  // Separate the layout node from the rest
  const [layoutNodes, contentNodes] = splitArray(
    fileNodes,
    (fileNode) => fileNode.path === "layout"
  );
  if (layoutNodes.length > 0) {
    const [{ loader }] = layoutNodes;
    if (loader) layouts.push(loader);
  }

  // Group nodes that are group segments (e.g., (group)) and regular route nodes
  const [groupNodes, routeNodes] = splitArray(contentNodes, (node) =>
    isGroupSegment(node.path)
  );

  // Build route objects from regular nodes
  const routes: RouteObject[] = routeNodes.map((node) => {
    if (node.loader) {
      // Lazy load the page component
      const PageComponent = lazy(node.loader);

      // Wrap with all layout components from innermost to outermost
      let element = React.createElement(PageComponent);
      for (let i = layouts.length - 1; i >= 0; i--) {
        const LayoutComponent = lazy(layouts[i]);
        element = React.createElement(LayoutComponent, null, element);
      }

      // Wrap in a suspense fallback for lazy loading
      const wrappedElement = React.createElement(
        Suspense,
        { fallback: <div style={{ background: "pink" }}>Loading...</div> },
        element
      );

      // If the path is "page", mark it as an index route
      return node.path === "page"
        ? { index: true, element: wrappedElement }
        : { path: resolvePath(node.path), element: wrappedElement };
    }

    // If the node has no loader, it must be a parent route and have children
    if (!node.children) {
      throw new Error("Missing children for non-loader node.");
    }

    const children = buildRoutes(node.children, layouts);
    const path = resolvePath(node.path);
    const [only] = children;

    if (children.length === 1 && only.index) {
      return { path, element: only.element };
    }

    return { path, children };
  });

  // Flatten and transform all group segment children recursively
  const groupRoutes = groupNodes.flatMap((node) =>
    node.children ? buildRoutes(node.children, layouts) : []
  );

  // Check if the main route list already includes an index route
  const hasIndex = routes.some((route) => route.index);

  // If an index route already exists, remove any index routes from groupRoutes
  const filteredGroupRoutes = hasIndex
    ? groupRoutes.filter((route) => !route.index)
    : groupRoutes;

  // Return the combined list of routes, ensuring only one index route exists
  return [...routes, ...filteredGroupRoutes];
}

function resolvePath(path: string) {
  if (!isDynamicRoute(path)) {
    return path;
  }
  // const regex = /\[\.\.\.(.*?)\]/;

  // Handle dynamic route segments like [id] → :id
  return path.replace(/\[(\w+)\]/g, ":$1");
}

export const routes = buildRoutes(tree!);
console.log(routes);

// const path = normalizeAppPath(filePath.replace(/^\.\/app/, ""));
