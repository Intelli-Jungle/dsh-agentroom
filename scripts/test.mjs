import { build } from 'esbuild';
import { readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
const files = (await readdir('tests')).filter(f => f.endsWith('.test.ts'));
await build({ entryPoints: files.map(f => 'tests/' + f), outdir: 'work/test', outExtension: { '.js': '.mjs' }, bundle: true, platform: 'node', format: 'esm', packages: 'external', target: 'node22' });
execFileSync(process.execPath, ['--test', ...files.map(f => 'work/test/' + f.replace('.ts', '.mjs'))], { stdio: 'inherit' });
