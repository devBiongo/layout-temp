import { normalizeAppPath } from "../utils/app-paths";

const pageModules = import.meta.glob<
  true,
  string,
  () => Promise<{ default: React.ComponentType; meta?: { title: string } }>
>("../app/**/page.tsx");

type MenuItem = {
  title: string;
  path: string;
  children?: MenuItem[];
};

const buildFlatMenuItems = async () => {
  const items: { path: string; title: string }[] = [];

  for (const [filePath, loader] of Object.entries(pageModules)) {
    const path = normalizeAppPath(filePath.replace(/^\..\/app/, ""));
    const mod = await loader();
    const title = mod.meta?.title;
    if (title) {
      items.push({ path, title });
    }
  }

  return items;
};

const buildMenuTree = (
  flatItems: { path: string; title: string }[]
): MenuItem[] => {
  const root: MenuItem[] = [];

  for (const item of flatItems) {
    if (item.path === "/") {
      root.push({ path: "/", title: item.title });
      continue;
    }

    const segments = item.path.split("/").filter(Boolean);
    let current = root;

    for (let i = 0; i < segments.length; i++) {
      const segmentPath = "/" + segments.slice(0, i + 1).join("/");
      let existing = current.find((node) => node.path === segmentPath);
      if (!existing) {
        existing = {
          title: i === segments.length - 1 ? item.title : segments[i],
          path: segmentPath,
          children: [],
        };
        current.push(existing);
      } else if (i === segments.length - 1) {
        // 如果是最后一级，更新 title（真实页面 title 优先）
        existing.title = item.title;
      }

      if (i === segments.length - 1) break;
      if (!existing.children) existing.children = [];
      current = existing.children;
    }
  }

  return root;
};

export const menuTreePromise = (async () => {
  const flat = await buildFlatMenuItems();
  console.log(flat);
  return buildMenuTree(flat);
})();