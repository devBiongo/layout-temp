import { lazy } from "react";
import { Outlet, RouteObject } from "react-router-dom";
import { FileNode, tree } from "./utils/build";
import React from "react";
import { isDynamicRoute, isGroupSegment } from "./utils/app-paths";
import { partition } from "./utils/array";

console.log(tree);

function createRoute(node: FileNode): RouteObject {
  // If this node has a loader, treat it as a page or not-found component
  if (node.loader) {
    const element = React.createElement(lazy(node.loader)); // Lazy load the component

    if (node.path === "page") {
      return { index: true, element }; // Index route
    }

    if (node.path === "not-found") {
      return { path: "*", element }; // 404 route
    }

    return { path: resolvePath(node.path), element }; // Regular route
  }

  // Partition children into layout node and content nodes
  const [[layoutNode], contentNodes] = partition(
    node.children!,
    (n) => n.path === "layout"
  );

  const layoutLoader = layoutNode?.loader ? lazy(layoutNode.loader) : null; // Lazy load layout if available

  const children = contentNodes.map(createRoute); // Recursively build child routes

  const path = resolvePath(node.path); // Resolve current path

  if (children.length === 1) {
    const [child] = children;

    // Utility to wrap with layout if it exists
    const wrap = (el: React.ReactNode) =>
      layoutLoader ? React.createElement(layoutLoader, null, el) : el;

    if (child.path) {
      return {
        path,
        element: wrap(null), // Layout wraps <Outlet> by default
        children,
      };
    }

    return {
      path: child.path!,
      element: wrap(child.element), // Wrap single element
    };
  }

  // Return route with multiple children
  return {
    path,
    element: layoutLoader
      ? React.createElement(layoutLoader, null, React.createElement(Outlet)) // Layout wraps outlet
      : undefined,
    children,
  };
}

function resolvePath(p: string) {
  return isGroupSegment(p)
    ? ""
    : isDynamicRoute(p)
    ? p.replace(/\[(\w+)\]/g, ":$1")
    : p;
}

const result = createRoute(tree);
console.log("----------------------------------------------------");
console.log(result);

export const routes = [result];
