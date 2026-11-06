import { build } from 'esbuild';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
const { version } = JSON.parse(await readFile('package.json', 'utf8'));
await mkdir('dist', { recursive: true });
await build({ entryPoints: ['src/index.ts'], outfile: 'dist/index.mjs', bundle: true, platform: 'node', format: 'esm', target: 'node22', external: ['@deepseek-ai/*', 'zod'], sourcemap: true });
const css = await readFile('src/client/style.css', 'utf8');
const client = await build({ entryPoints: ['src/client/index.tsx'], bundle: true, platform: 'browser', format: 'cjs', target: 'es2023', jsx: 'automatic', external: ['react', 'react/jsx-runtime', 'react-dom', 'react-dom/client'], write: false, sourcemap: 'external', outfile: 'dist/client.js', define: { __AGENTROOM_CSS__: JSON.stringify(css), __AGENTROOM_VERSION__: JSON.stringify(version) } });
for (const file of client.outputFiles) {
  const text = file.path.endsWith('.js') ? `window.__ModuleLoader__.load({id:"dsh-agentroom",factory(require){var module={exports:{}};var exports=module.exports;\n${file.text}\nreturn module.exports;}});\n` : file.text;
  await writeFile(file.path, text);
}
console.log('Built DSH host and native client; React comes from the host.');
