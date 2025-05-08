import { Plugin } from "vite";

export function extractMetaPlugin(): Plugin {
  return {
    name: "extract-meta",
    async transform(code, id) {
      console.log({ id });
      if (id.endsWith("page.tsx")) {

        const metaMatch = code.match(/export\s+const\s+meta\s*=\s*({[\s\S]*?})/);
        if (metaMatch) {
          console.log(123123123, metaMatch);
          return;

        }
      }
    },
  };
}