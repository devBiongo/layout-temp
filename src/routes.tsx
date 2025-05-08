import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import { tree } from "./utils/build";
import React from "react";
import { isDynamicRoute, isGroupSegment } from "./utils/app-paths";

type TreeNode = {
  path: string;
  children?: TreeNode[];
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

function transformToRoutes(
  treeNodes: TreeNode[],
  prevLayoutLoaders: Loader[] = []
): RouteObject[] {
  const allLayoutLoaders = [...prevLayoutLoaders];
  const [currLayoutNodes, restTreeNodes] = splitArray(
    treeNodes,
    (treeNode) => treeNode.path === "layout"
  );
  if (currLayoutNodes.length > 0) {
    const [{ loader }] = currLayoutNodes;
    if (loader) {
      allLayoutLoaders.push(loader);
    }
  }
  const [groupNodetrees, noGroupNodetrees] = splitArray(
    restTreeNodes,
    (treeNode) => isGroupSegment(treeNode.path)
  );

  let returnArr = noGroupNodetrees.map((node) => {
    if (node.loader) {
      const Page = lazy(node.loader);
      // Wrap the Page with matched layouts from innermost to outermost
      let element = React.createElement(Page);
      for (const layoutLoader of allLayoutLoaders) {
        element = React.createElement(lazy(layoutLoader), null, element);
      }
      // Return the route object with Suspense fallback
      return {
        index: true,
        element: React.createElement(
          Suspense,
          { fallback: <div style={{ background: "pink" }}>Loading...</div> },
          element
        ),
      };
    }

    if (isDynamicRoute(node.path)) {
      return {
        path: node.path.replace(/\[(\w+)\]/g, ":$1"),
        children: transformToRoutes(node.children!, allLayoutLoaders),
      };
    }
    return {
      path: node.path,
      children: transformToRoutes(node.children!, allLayoutLoaders),
    };
  });

  if (groupNodetrees.length > 0) {
    groupNodetrees.forEach((groupNode) => {
      if (groupNode.children) {
        returnArr = [
          ...returnArr,
          ...transformToRoutes(groupNode.children, allLayoutLoaders),
        ];
      }
    });
  }
  return returnArr;
}

export const routes = transformToRoutes(tree!);
console.log(routes);

// const path = normalizeAppPath(filePath.replace(/^\.\/app/, ""));
