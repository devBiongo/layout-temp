
// Dynamically import all .tsx files under /app
const allModules = import.meta.glob<
  true,
  string,
  () => Promise<{ default: React.ComponentType; meta?: { title: string } }>
>("../app/**/*.tsx");

// Filter for all page.tsx files
export const pageModules = Object.entries(allModules).filter(([path]) =>
  /\/page\.tsx$/.test(path)
).map(([path, loader]) => ({ path: path.replace(/^(\.\.\/)?app/, ''), loader }))



// Filter for all layout.tsx files
export const layoutModules = Object.entries(allModules).filter(([path]) =>
  /\/layout\.tsx$/.test(path)
).map(([path, loader]) => ({ path: path.replace(/^(\.\.\/)?app/, ''), loader }))

console.log(pageModules, layoutModules);