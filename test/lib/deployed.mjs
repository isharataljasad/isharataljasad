/* Which repository files does a deployment upload? .vercelignore uses gitignore
 * syntax (an allow-list here), so evaluate it with git itself in a scratch
 * repository containing empty copies of every file path. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

export function deployedFiles(root) {
  const git = (args, cwd) => execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 64 << 20 });
  const files = git(['ls-files', '-co', '--exclude-standard'], root).split('\n').filter((f) => f && fs.existsSync(path.join(root, f)));
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'deploy-'));
  try {
    git(['init', '-q'], tmp);
    for (const f of files) {
      fs.mkdirSync(path.dirname(path.join(tmp, f)), { recursive: true });
      fs.writeFileSync(path.join(tmp, f), '');
    }
    // Last, so the repository's own (empty-copied) .gitignore cannot replace it.
    fs.copyFileSync(path.join(root, '.vercelignore'), path.join(tmp, '.gitignore'));
    git(['add', '-A'], tmp);
    return new Set(git(['ls-files'], tmp).split('\n').filter((f) => f && f !== '.gitignore'));
  } finally {
    const resolved=path.resolve(tmp), base=path.resolve(os.tmpdir());
    if(path.dirname(resolved)!==base || !path.basename(resolved).startsWith('deploy-'))throw new Error('Unsafe scratch-directory cleanup target');
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}
