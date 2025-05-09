
// Dynamically import all .tsx files under /app
const allModules = import.meta.glob<
  true,
  string,
  () => Promise<{ default: React.ComponentType; meta?: { title: string } }>
>("../app/**/*.tsx");

type TreeNode = {
  path: string;
  children?: TreeNode[];
  loader?: () => Promise<{ default: React.ComponentType; meta?: { title: string } }>;
};


function buildModuleTree(
  modules: Record<string, () => Promise<{ default: React.ComponentType; meta?: { title: string } }>>,
  prefix = "../app/"
): TreeNode {
  const root: TreeNode = { path: "", children: [] };

  Object.entries(modules).forEach(([fullPath, loader]) => {
    const relativePath = fullPath.slice(prefix.length);
    const parts = relativePath.split("/");

    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const isFile = i === parts.length - 1;
      const rawName = parts[i];
      const path = isFile ? rawName.replace(/\.tsx$/, "") : rawName;

      if (!current.children) current.children = [];

      let next = current.children.find((n) => n.path === path);
      if (!next) {
        next = isFile
          ? { path, loader: loader }
          : { path, children: [] };
        current.children.push(next);
      }

      current = next;
    }
  });

  return root;
}



export const tree = buildModuleTree(allModules);


export type Loader = () => Promise<{
  default: React.ComponentType;
  META?: {
    title: string;
  };
}>;


export type FileNode = {
  path: string;
  children?: FileNode[];
  loader?: Loader;
};


