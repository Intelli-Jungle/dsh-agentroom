import { mkdir, readFile, rename, writeFile, open, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { initialState, stateSchema, type State } from './model.ts';

/** One writer per directory, serialized atomic snapshots; invalid data is never reset. */
export class Store {
  state: State = initialState();
  private queue = Promise.resolve();
  private lockPath: string;
  private owned = false;
  constructor(readonly dir: string) { this.lockPath = join(dir, 'writer.lock'); }
  async load(): Promise<this> {
    await mkdir(this.dir, { recursive: true, mode: 0o700 });
    try {
      const lock = await open(this.lockPath, 'wx', 0o600);
      this.owned = true; await lock.writeFile(String(process.pid)); await lock.close();
    } catch (error: any) {
      if (error.code !== 'EEXIST') throw error;
      const pid = Number(await readFile(this.lockPath, 'utf8'));
      let live = true;
      try { process.kill(pid, 0); } catch (e: any) { if (e.code === 'ESRCH') live = false; }
      if (!Number.isSafeInteger(pid) || pid <= 0 || live) throw new Error('Agentroom data is already in use; choose another dataDir.');
      await unlink(this.lockPath); return this.load();
    }
    try {
      this.state = stateSchema.parse(JSON.parse(await readFile(join(this.dir, 'state.json'), 'utf8')));
    } catch (error: any) {
      if (error.code !== 'ENOENT') { await this.close(); throw new Error('Cannot read Agentroom state; preserve the file and restore a backup.', { cause: error }); }
    }
    return this;
  }
  save(): Promise<void> {
    const snapshot = JSON.stringify(this.state);
    const next = this.queue.then(async () => {
      const tmp = join(this.dir, 'state.json.tmp');
      await writeFile(tmp, snapshot, { mode: 0o600 }); await rename(tmp, join(this.dir, 'state.json'));
    });
    this.queue = next.catch(() => {}); return next;
  }
  async close() {
    await this.queue;
    if (this.owned) { this.owned = false; await unlink(this.lockPath); }
  }
}
