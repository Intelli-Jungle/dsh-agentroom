import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const pkg = JSON.parse(await readFile('package.json', 'utf8'));
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const commit = process.argv[2] || git('rev-parse', `v${pkg.version}^{commit}`);
if (!/^[0-9a-f]{40}$/.test(commit)) throw new Error('Expected a full 40-character release commit');
const released = JSON.parse(git('show', `${commit}:package.json`));
if (released.name !== pkg.name || released.version !== pkg.version) throw new Error('Release commit package version does not match');
git('cat-file', '-e', `${commit}:dist/index.mjs`);
git('cat-file', '-e', `${commit}:dist/client.js`);
const index = {
  format: 1,
  title: { en: 'Intelli-Jungle plugins', zh: 'Intelli-Jungle 插件' },
  description: { en: 'DSH plugins maintained by Intelli-Jungle.', zh: '由 Intelli-Jungle 维护的 DSH 插件。' },
  metadata: { categories: { workflow: { title: { en: 'Agent collaboration', zh: 'Agent 协作' } } } },
  plugins: [{
    name: pkg.name,
    title: { en: 'DSH Agentroom', zh: 'DSH Agentroom · 多 Agent 协作' },
    description: { en: 'A Slack-style shared room with independent native DSH sessions, parallel @ mentions and bounded agent handoffs.', zh: 'Slack 风格共享聊天室：独立 DSH 原生会话、并行 @ 提及与有次数限制的 Agent 接力。' },
    icon: '../assets/icon.svg',
    author: 'Intelli-Jungle',
    homepage: pkg.homepage,
    repository: { url: pkg.homepage },
    metadata: { category: 'workflow', keywords: ['agent', 'teamroom', 'multi-agent', '协作'] },
    versions: [{ version: pkg.version, publishTimestamp: Number(git('show', '-s', '--format=%ct', commit)), source: { type: 'git', url: pkg.homepage, commit }, engines: { dsh: released.engines.dsh } }],
  }],
};
await mkdir('market', { recursive: true });
await writeFile('market/index.json', JSON.stringify(index, null, 2) + '\n');
console.log(`Generated DSH format 1 index for ${pkg.name}@${pkg.version}, pinned to ${commit}`);
