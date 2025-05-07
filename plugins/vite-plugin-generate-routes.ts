import { Plugin } from 'vite';
import fg from 'fast-glob';
import path from 'path';
import fs from 'fs/promises';

const virtualModuleId = 'virtual:generated-routes';
const resolvedVirtualModuleId = '\0' + virtualModuleId;

export function vitePluginGenerateRoutes(): Plugin {
  return {
    name: 'vite-plugin-generate-routes',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    async load(id) {
      if (id !== resolvedVirtualModuleId) return;

      const files = await fg(['app/**/page.tsx'], {
        ignore: ['**/node_modules/**'],
      });

      const imports: string[] = [];
      const metaItems: string[] = [];

      files.forEach((file, index) => {
        const importVar = `mod${index}`;
        const fullPath = path.resolve(process.cwd(), file);
        imports.push(`import * as ${importVar} from '/${file}';`);
        metaItems.push(`{ path: '/${file.replace(/^app/, '').replace(/\/page\.tsx$/, '') || ''}', title: ${importVar}.meta?.title || '${path.basename(file)}' }`);
      });

      return `
        ${imports.join('\n')}
        export const routes = [${metaItems.join(',\n')}];
      `;
    },
  };
}
